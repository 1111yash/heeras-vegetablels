import { useCart } from "../context/CartContext";
import { useState } from "react";

function Checkout() {
    const { cart, totalPrice } = useCart();

    const [customer, setCustomer] = useState({
        name: "",
        phone: "",
        address: "",
        landmark: "",
        pincode: "",
    });

    const deliveryCharge = totalPrice >= 399 ? 0 : 30;
    const finalTotal = totalPrice + deliveryCharge;

    const handleChange = (e) => {
        setCustomer({
            ...customer,
            [e.target.name]: e.target.value,
        });
    };

    const placeOrder = () => {
        const items = cart
            .map(
                (item) =>
                    `• ${item.name} x ${item.quantity} = ₹${item.price * item.quantity}`
            )
            .join("\n");

        const message = `🥬 *Heera's Vegetables Order*

👤 Name: ${customer.name}
📞 Phone: ${customer.phone}

🏠 Address:
${customer.address}

📍 Landmark:
${customer.landmark}

📮 Pincode:
${customer.pincode}

------------------------

${items}

------------------------

Subtotal : ₹${totalPrice}
Delivery : ₹${deliveryCharge}
Grand Total : ₹${finalTotal}

Payment : Cash on Delivery`;

        window.open(
            `https://wa.me/919022271773?text=${encodeURIComponent(message)}`
        );
    };

    return (
        <div className="max-w-4xl mx-auto p-6">

            <h1 className="text-3xl font-bold mb-6">
                Checkout
            </h1>

            <div className="grid md:grid-cols-2 gap-8">

                <div className="space-y-4">

                    <input
                        name="name"
                        placeholder="Full Name"
                        onChange={handleChange}
                        className="border p-3 rounded w-full"
                    />

                    <input
                        name="phone"
                        placeholder="Mobile Number"
                        onChange={handleChange}
                        className="border p-3 rounded w-full"
                    />

                    <textarea
                        name="address"
                        placeholder="Full Address"
                        onChange={handleChange}
                        className="border p-3 rounded w-full"
                    />

                    <input
                        name="landmark"
                        placeholder="Landmark"
                        onChange={handleChange}
                        className="border p-3 rounded w-full"
                    />

                    <input
                        name="pincode"
                        placeholder="Pincode"
                        onChange={handleChange}
                        className="border p-3 rounded w-full"
                    />

                </div>

                <div className="bg-gray-100 rounded-xl p-5">

                    <h2 className="text-2xl font-bold mb-4">
                        Order Summary
                    </h2>

                    {cart.map((item) => (
                        <div
                            key={item.id}
                            className="flex justify-between mb-2"
                        >
                            <span>
                                {item.name} × {item.quantity}
                            </span>

                            <span>
                                ₹{item.price * item.quantity}
                            </span>
                        </div>
                    ))}

                    <hr className="my-4" />

                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>₹{totalPrice}</span>
                    </div>

                    <div className="flex justify-between">
                        <span>Delivery</span>
                        <span>₹{deliveryCharge}</span>
                    </div>

                    <div className="flex justify-between text-xl font-bold mt-4">
                        <span>Total</span>
                        <span>₹{finalTotal}</span>
                    </div>

                    <button
                        onClick={placeOrder}
                        className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
                    >
                        Place Order on WhatsApp
                    </button>

                    <a href="tel:+919022271773">
                        <button className="mt-3 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
                            📞 Call Now
                        </button>
                    </a>

                </div>

            </div>

        </div>
    );
}

export default Checkout;