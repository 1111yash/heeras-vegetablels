import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

function Cart() {
    const { cart, increaseQty, decreaseQty, totalPrice } = useCart();

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">🛒 My Cart</h1>

            {cart.length === 0 ? (
                <h2>Your cart is empty.</h2>
            ) : (
                <>
                    {cart.map((item) => (
                        <div
                            key={item.id}
                            className="flex justify-between items-center border-b py-4"
                        >
                            <div>
                                <h2 className="font-bold">{item.name}</h2>
                                <p>₹{item.price} × {item.quantity}</p>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => decreaseQty(item.id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded"
                                >
                                    -
                                </button>

                                <span>{item.quantity}</span>

                                <button
                                    onClick={() => increaseQty(item.id)}
                                    className="bg-green-600 text-white px-3 py-1 rounded"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    ))}

                    <h2 className="text-2xl font-bold mt-6">
                        Total: ₹{totalPrice}
                        <Link to="/checkout">
                            <button className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold">
                                Proceed to Checkout
                            </button>
                        </Link>
                    </h2>
                </>
            )}
        </div>
    );
}

export default Cart;