<x-mail::message>
    <h1 style="text-align:center; font-size:24px;">
        Payment Was Completed Successfully
    </h1>

    @foreach ($orders as $order)
        <x-mail::table>
            <table>
                <tbody>
                    <tr>
                        <td>
                            Seller
                        </td>
                        <td>
                            <a href="{{ url('/') }}"></a>
                            {{ $order->vendorUser->vendor->store_name }}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Order #
                        </td>
                        <td>
                            #{{ $order->id }}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Items
                        </td>
                        <td>
                            {{ $order->orderItems->count() }}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Total Price
                        </td>
                        <td>
                            {{ \Illuminate\Support\Number::currency($order->total_price) }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </x-mail::table>

        <x-mail::table>
            <table>
                <thead>
                    <tr>
                        <th>
                            Item
                        </th>
                        <th>
                            Quantity
                        </th>
                        <th>
                            Price
                        </th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($order->orderItems as $orderItem)
                        <tr>
                            <td>
                                <table>
                                    <tbody>
                                        <tr>
                                            <td padding='5' style="padding: 5px;">
                                                <img style="width: 60px"
                                                    src="{{ $orderItem->product->getImageForOptions($orderItem->variation_type_option_ids) }}"
                                                    alt="{{ $orderItem->product->title }}">
                                            </td>
                                            <td style="font-size: 13px; padding:5px;">
                                                {{ $orderItem->product->title }}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                            <td>
                                {{ $orderItem->quantity }}
                            </td>
                            <td>
                                {{ \Illuminate\Support\Number::currency($orderItem->price) }}
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </x-mail::table>

        <x-mail::button :url="$order->id">
            View Order Details
        </x-mail::button>
    @endforeach

    <x-mail::subcopy>
        <p>
            If you have any questions, feel free to contact our customer support team at <a
                href="mailto:support@tenten.com">support@tenten.com</a>.
        </p>
    </x-mail::subcopy>

    <x-mail::panel>
        <p>
            Tenten is Lorem, ipsum dolor sit amet consectetur adipisicing elit. Qui commodi earum consequatur.
        </p>
    </x-mail::panel>

    Thanks,
    {{ config('app.name') }}
</x-mail::message>
