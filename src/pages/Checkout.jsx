import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";

import { db } from "../src/firebase";
import { useNavigate } from "react-router-dom";
import { ref, get, set } from "firebase/database";
import { auth } from "../src/firebase";


function Checkout() {
  const { cart, totalPrice } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
  if (!auth.currentUser) {
    alert("Please Login First");
    navigate("/login");
  }
}, [navigate]);

  

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    landmark: "",
    pincode: "",
  });
  
  useEffect(() => {
  if (auth.currentUser) {
    setCustomer((prev) => ({
      ...prev,
      name: auth.currentUser.displayName || "",
    }));
  }
}, []);

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isOrdered, setIsOrdered] = useState(false);
  const [orderId, setOrderId] = useState("");

  // Bill Calculation
  const subtotal = totalPrice;
  const deliveryCharge = subtotal >= 199 ? 0 : 20;
  const platformFee = 3;
  const grandTotal = subtotal + deliveryCharge + platformFee;

  const handleChange = (e) => {
    setCustomer({
      ...customer,
      [e.target.name]: e.target.value,
    });
  };

  
const placeOrder = async () => {

  // Login Check
  if (!auth.currentUser) {
    alert("Please Login First");
    navigate("/login");
    return;
  }

  // Shop Status Check
  const shopStatus = await get(ref(db, "shopSettings/isOpen"));

  if (!shopStatus.val()) {
    alert("🚫 Shop is temporarily closed. We are not accepting orders.");
    return;
  }

  // Cart Check
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  // Customer Details Check
  if (!customer.name || !customer.phone || !customer.address) {
    alert("Please fill all details!");
    return;
  }

  // Generate Order ID
  const autoOrderId =
    "HV-" + Math.floor(10000 + Math.random() * 90000);

  // यहीं से तुम्हारा पुराना code continue होगा
  try {
    await set(ref(db, `orders/${autoOrderId}`), {
      orderId: autoOrderId,

      uid: auth.currentUser.uid,
userName: auth.currentUser.displayName,
email: auth.currentUser.email,
photo: auth.currentUser.photoURL,

      status: 1,

      paymentMethod,

      paymentStatus:
        paymentMethod === "upi"
          ? "Pending Verification"
          : "Cash On Delivery",

      customerName: customer.name,
      phone: customer.phone,

      address: `${customer.address}, ${customer.landmark}, ${customer.pincode}`,

      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
        unitLabel: item.unitLabel,
      })),

      subtotal,
      deliveryCharge,
      platformFee,
      total: grandTotal,
      grandTotal,

      timestamp: Date.now(),
    });

    setOrderId(autoOrderId);
    setIsOrdered(true);

    setTimeout(() => {
      navigate(`/track-order?id=${autoOrderId}`);
    }, 2500);

  } catch (err) {
    console.error(err);
    alert("Failed to place order.");
  }
};

  

  return (
    <div className="max-w-5xl mx-auto p-6">
      {isOrdered ? (

        <div className="bg-white rounded-3xl shadow-xl p-10 text-center">

          <div className="text-7xl mb-5">🎉</div>

          <h1 className="text-4xl font-bold text-green-700">
            Order Placed Successfully
          </h1>

          <p className="mt-4 text-gray-600 text-lg">
            Thank you for shopping with
            <span className="font-bold text-green-700">
              {" "}Heera's Veg Mart
            </span>
          </p>

          <div className="bg-green-50 rounded-2xl p-6 mt-8">

            <div className="flex justify-between mb-3">
              <span>Subtotal</span>
              <b>₹{subtotal}</b>
            </div>

            <div className="flex justify-between mb-3">
              <span>Delivery Charge</span>
              <b>{deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}</b>
            </div>

            <div className="flex justify-between mb-3">
              <span>Platform Fee</span>
              <b>₹{platformFee}</b>
            </div>

            <hr className="my-4" />

            <div className="flex justify-between text-2xl font-bold text-green-700">
              <span>Grand Total</span>
              <span>₹{grandTotal}</span>
            </div>

          </div>

          <button
            onClick={() => navigate(`/track-order?id=${orderId}`)}
            className="mt-8 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-bold"
          >
            📦 Track My Order
          </button>

        </div>

      ) : (

        <>

          <h1 className="text-3xl font-bold mb-6">
            Checkout
          </h1>

          <div className="bg-white rounded-2xl shadow p-6">

            <h2 className="text-xl font-bold mb-5">
              🚚 Delivery Details
            </h2>

            <div className="space-y-4">

              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={customer.name}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              />

              <input
                type="tel"
                name="phone"
                placeholder="Mobile Number"
                value={customer.phone}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              />

              <textarea
                rows="3"
                name="address"
                placeholder="Complete Address"
                value={customer.address}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              />

              <input
                type="text"
                name="landmark"
                placeholder="Landmark"
                value={customer.landmark}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              />

              <input
                type="text"
                name="pincode"
                placeholder="Pincode"
                value={customer.pincode}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              />

            </div>

          </div>

          <div className="bg-white rounded-2xl shadow p-6 mt-6">

            <h2 className="text-xl font-bold mb-5">
              💳 Payment Method
            </h2>

            <label className="flex items-center gap-3 border rounded-xl p-4 cursor-pointer mb-3">

              <input
                type="radio"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />

              <span className="font-semibold">
                💵 Cash On Delivery
              </span>

            </label>

            <label className="flex items-center gap-3 border rounded-xl p-4 cursor-pointer">

              <input
                type="radio"
                value="upi"
                checked={paymentMethod === "upi"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />

              <span className="font-semibold">
                📱 UPI Payment
              </span>

            </label>

            {paymentMethod === "upi" && (

              <div className="mt-6 bg-purple-50 border rounded-2xl p-6 text-center">

                <img
                  src="/qr-code.jpeg"
                  alt="QR Code"
                  className="w-48 mx-auto rounded-xl"
                />

                <h3 className="font-bold mt-4">
                  Scan QR & Pay
                </h3>

                <a
                  href={`upi://pay?pa=9022271773@ybl&pn=HeeraVegetable&am=${grandTotal}&cu=INR`}
                  className="block mt-5 bg-purple-600 text-white py-3 rounded-xl font-bold"
                >
                  Pay ₹{grandTotal}
                </a>

                <p className="mt-3 text-sm text-gray-600">
                  After successful payment click <b>Place Order</b>.
                </p>

              </div>

            )}

          </div>

          <div className="bg-white rounded-2xl shadow p-6 mt-6">

            <h2 className="text-2xl font-bold mb-5">
              🧾 Bill Summary
            </h2>

            <div className="flex justify-between mb-3">
              <span>🛒 Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="flex justify-between mb-3">
              <span>🚚 Delivery Charge</span>
              <span className="font-bold">
                {deliveryCharge === 0 ? (
                  <span className="text-green-600">FREE</span>
                ) : (
                  `₹${deliveryCharge}`
                )}
              </span>
            </div>

            <div className="flex justify-between mb-3">
              <span>🏪 Platform Fee</span>
              <span>₹{platformFee}</span>
            </div>

            <hr className="my-4" />

            <div className="flex justify-between text-3xl font-bold text-green-700">
              <span>Total Payable</span>
              <span>₹{grandTotal}</span>
            </div>

          </div>

          <button
            onClick={placeOrder}
            className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl text-xl font-bold transition"
          >
            ✅ Place Order
          </button>

        </>
      )}

    </div>
  );
}

export default Checkout;

