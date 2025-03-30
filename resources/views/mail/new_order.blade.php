<x-mail::message>
    <h1 style="text-align:center; font-size:24px;">
        You have a new order!
    </h1>

    <x-mail::button :url="route('home')">
        View Order Details
    </x-mail::button>

    <h3 style="font-size: 20px; margin-bottom: 15px;">Order Summary</h3>
    <x-mail::table>
        <table>
            <tbody>
                <tr>
                    <td>Order #</td>
                    <td>#{{ $order->id }}</td>
                </tr>
                <tr>
                    <td>Order Date</td>
                    <td>{{ $order->created_at->format('Y-m-d H:i:s') }}</td>
                </tr>
                <tr>
                    <td>Order Total</td>
                    <td>{{ \Illuminate\Support\Number::currency($order->total_price) }}</td>
                </tr>
                <tr>
                    <td>Payment Processing Fee</td>
                    <td>{{ \Illuminate\Support\Number::currency($order->online_payment_commission ?: 0) }}</td>
                </tr>
                <tr>
                    <td>Platform Fee</td>
                    <td>{{ \Illuminate\Support\Number::currency($order->website_commission ?: 0) }}</td>
                </tr>
                <tr>
                    <td>Your Earnings</td>
                    <td>{{ \Illuminate\Support\Number::currency($order->vendor_subtotal ?: 0) }}</td>
                </tr>
            </tbody>
        </table>
    </x-mail::table>

    <hr>

    <x-mail::table>
        <table>
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($order->orderItems as $orderItem)
                    <tr>
                        <td>
                            <table>
                                <tbody>
                                    <tr>
                                        <td style="padding: 5px;">
                                            <img style="width: 60px;"
                                                src="{{ $orderItem->product?->getImageForOptions($orderItem->variation_type_option_ids) ?? asset('img/default-product.png') }}"
                                                alt="Product Image">
                                        </td>
                                        <td style="font-size: 15px; padding: 5px;">
                                            {{ $orderItem->product->title ?? 'N/A' }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                        <td>{{ $orderItem->quantity }}</td>
                        <td>{{ \Illuminate\Support\Number::currency($orderItem->price) }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </x-mail::table>

    <x-mail::panel>
        Thank you for doing business with us!
    </x-mail::panel>

    Thanks,<br>
    {{ config('app.name') }}
</x-mail::message>
