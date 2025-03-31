<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatusEnum;
use App\Http\Resources\OrderViewResource;
use App\Mail\CheckoutCompleted;
use App\Mail\NewOrderMail;
use App\Models\CartItem;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Stripe\StripeClient;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

class StripeController extends Controller
{
    public function success(Request $request)
    {
        $user = Auth::user();
        $session_id = $request->get('session_id');
        $orders = Order::where('stripe_session_id', $session_id)->get();

        if ($orders->count() === 0) {
            abort(404);
        }

        foreach ($orders as $order) {
            if ($order->user_id !== $user->id) {
                abort(403);
            }
        }

        session()->flash('success', 'Payment was completed successfully.');

        return Inertia::render('Stripe/Success', [
            'orders' => OrderViewResource::collection($orders)->collection->toArray(),
        ]);
    }

    public function failure() {}

    public function webhook(Request $request)
    {
        $stripe = new StripeClient(config('app.stripe_secret'));

        $endpoint_secret = config('app.stripe_webhook_key');

        $payload = $request->getContent();
        $sig_header = $request->header('Stripe-Signature');

        $event = null;

        try {
            $event = \Stripe\Webhook::constructEvent(
                $payload,
                $sig_header,
                $endpoint_secret
            );
        } catch (\UnexpectedValueException $e) {
            Log::error($e);
            return response('Invalid Payload', 400);
        } catch (\Stripe\Exception\SignatureVerificationException $e) {
            Log::error($e);
            return response('Invalid Signature', 400);
        }

        // Some useful logs
        // Log::info('======================================');
        // Log::info('======================================');
        // Log::info($event->type);
        // Log::info($event);

        switch ($event->type) {
            case 'charge.updated':
                $charge = $event->data->object;
                Log::info('Charge updated: ' . $charge->id);
                $transactionId = $charge['balance_transaction'];
                $paymentIntent = $charge['payment_intent'];
                $balanceTransaction = $stripe->balanceTransactions->retrieve($transactionId);

                $orders = Order::where('payment_intent', $paymentIntent)->get();
                $totalAmount = $balanceTransaction['amount'];
                $stripeFee = 0;

                foreach ($balanceTransaction['fee_details'] as $fee_detail) {
                    if ($fee_detail['type'] == 'stripe_fee') {
                        $stripeFee = $fee_detail['amount'];
                    }
                }

                $platformFreePercent = config('app.platform_fee_pct');

                foreach ($orders as $order) {
                    $vendorShare = $order->total_price / $totalAmount;

                    /** @var Order $order */
                    $order->online_payment_commission = $vendorShare * $stripeFee;
                    $order->website_commision = ($order->total_price - $order->online_payment_commission) / 100 * $platformFreePercent;
                    $order->vendor_subtotal = $order->total_price - $order->online_payment_commission - $order->website_commission;
                    $order->save();

                    # Email - FIX: Get the actual vendor user model
                    $vendorUser = $order->vendorUser()->first();
                    if ($vendorUser) {
                        Mail::to($vendorUser)->send(new NewOrderMail($order));
                    } else {
                        Log::error("Vendor user not found for order: " . $order->id);
                    }
                }

                Mail::to($orders[0]->user()->first())->send(new CheckoutCompleted($orders));

                // Mail::to($orders[0]->user)->send(new CheckoutCompleted($orders));

            case 'checkout.session.completed':
                $session = $event->data->object;
                Log::info('Checkout session completed: ' . $session->id);
                $pi = $session['payment_intent'];

                $orders = Order::query()
                    ->with(['orderItems'])
                    ->where(['stripe_session_id' => $session['id']])
                    ->get();

                $productsToDeletedFromCart = [];

                foreach ($orders as $order) {
                    $order->payment_intent = $pi;
                    $order->status = OrderStatusEnum::Paid;
                    $order->save();

                    $productsToDeletedFromCart = [
                        ...$productsToDeletedFromCart,
                        ...$order->orderItems->map(fn($item) => $item->product_id)->toArray(),
                    ];

                    foreach ($order->orderItems as $orderItem) {
                        /** @var OrderItem $orderItem */
                        $options = $orderItem->variation_type_option_ids;
                        $product = $orderItem->product;

                        if ($options) {
                            sort($options);
                            $variation = $product->variation()
                                ->where('variation_type_option_ids', $options)
                                ->first();
                            if ($variation && $variation->quantity != null) {
                                $variation->quantity -= $orderItem->quantity;
                                $variation->save();
                            }
                        } else if ($product->quantity != null) {
                            $product->quantity -= $orderItem->quantity;
                            $product->save();
                        }
                    }

                    CartItem::query()->where('user_id', $order->user_id)
                        ->whereIn('product_id', $productsToDeletedFromCart)
                        ->where('saved_for_later', false)
                        ->delete();
                }
            default:
                echo 'Received unknown event type ' . $event->type;
        }
        return response('', 200);
    }

    public function connect()
    {

        if (!Auth::user()->getStripeAccountId()) {
            Auth::user()->createStripeAccount(['type' => 'express']);
        }

        if (!Auth::user()->isStripeAccountActive()) {
            return redirect(Auth::user()->getStripeAccountLink());
        }

        return back()->with('success', 'Your account is already connected');
    }
}
