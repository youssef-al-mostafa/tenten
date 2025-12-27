import CartItem from "@/Components/App/CartItem"
import { CurrencyFormatter } from "@/Components/Core/CurrencyFormatter"
import PrimaryButton from "@/Components/Core/PrimaryButton"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { GroupedCartItems, PageProps } from "@/types"
import { CreditCardIcon } from "@heroicons/react/24/outline"
import { Head, Link } from "@inertiajs/react"


export default function Index({
    csrf_token,
    cartItems,
    totalPrice,
    totalQuantity }: PageProps<{ cartItems: Record<number, GroupedCartItems> }>) {
    return (
        <>
            <Head title="Product" />
            <AuthenticatedLayout>
                <div className="container mx-auto p-8 flex flex-col lg:flex-row gap-4">
                    <div className="card flex-1 bg-white order-2 lg:order-1">
                        <div className="card-body">
                            <h2 className="text-lg font-bold">
                                Shopping Cart
                            </h2>
                            <div className="my-4">
                                {Object.keys(cartItems).length === 0 && (
                                    <div className="py-2 text-gray-500 text-center">
                                        You don't have any items yet.
                                    </div>
                                )}
                                {Object.values(cartItems).map(cartItem => (
                                    <div key={cartItem.user.id}>
                                        <div className="flex items-center justify-center pb-4 border-b border-gray-300 mb-4">
                                            <Link href="/" className="">
                                                {cartItem.user.name}
                                            </Link>
                                            <div className="">
                                                <form action={route('cart.checkout')} method="post">
                                                    <input type="hidden" name="_token" value={csrf_token} />
                                                    <input type="hidden" name="vendor_id" value={cartItem.user.id} />
                                                    <button className="btn btn-sm btn-ghost">
                                                        <CreditCardIcon className="size-6" />
                                                        Pay Only for this seller
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                        {cartItem.items.map(item => (
                                            <CartItem item={item} key={item.id} />
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="card bg-white lg:min-w-[260px] order-1 lg:order-2">
                        <div className="card-body">
                            Total ({totalQuantity} items): &nbsp;
                            <CurrencyFormatter amount={totalPrice} />
                            <form action={route('cart.checkout')} method="post">
                                <input type="hidden" name="_token" value={csrf_token} />
                                <PrimaryButton className="rounded-full flex justify-between gap-3">
                                    <CreditCardIcon className="size-6" />
                                    Proceed to checkout
                                </PrimaryButton>
                            </form>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    )
}
