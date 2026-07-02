

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ref, onValue, update } from "firebase/database";
import { db } from "../src/firebase";

function TrackOrder() {
  const [searchParams] = useSearchParams();

  const [orderId, setOrderId] = useState(searchParams.get("id") || "");

  const [loading, setLoading] = useState(false);

  const [order, setOrder] = useState(null);

  const [timeLeft, setTimeLeft] = useState(0);
  const [progress, setProgress] = useState(0);
  const [deliveryMessage, setDeliveryMessage] = useState("");
  const [eta, setEta] = useState("");

  const steps = [
    "Order Confirmed",
    "Packing",
    "Out for Delivery",
    "Delivered",
  ];

  const startTracking = () => {
    if (!orderId) {
      alert("Please enter Order ID");
      return;
    }

    setLoading(true);

    const orderRef = ref(db, `orders/${orderId}`);

    onValue(orderRef, (snapshot) => {
      setLoading(false);

      if (!snapshot.exists()) {
        alert("Order not found");
        setOrder(null);
        return;
      }

      setOrder(snapshot.val());
    });
  };

  useEffect(() => {
    if (!order) return;

    if (order.status !== 3) {
  setTimeLeft(0);
  return;
}

// Agar Firebase me timer save nahi hai to timestamp se 20 min maan lo
const estimated = order.estimatedDelivery
  ? Number(order.estimatedDelivery)
  : Number(order.timestamp) + 20 * 60 * 1000;

    const interval = setInterval(() => {

       if (!estimated || isNaN(estimated)) {
    setEta("--:--");
    setTimeLeft(0);
    return;
  }

      const remaining = estimated - Date.now();

      if (remaining <= 0) {
        setTimeLeft(0);
        setProgress(100);
        setDeliveryMessage(
          "⏳ Delivery is taking a little longer than expected."
        );
      } else {
        setTimeLeft(remaining);

        const elapsed = 20 * 60 * 1000 - remaining;

        const percent = Math.min(
          (elapsed / (20 * 60 * 1000)) * 100,
          100
        );

        setProgress(percent);

        if (percent < 25) {
          setDeliveryMessage("🥬 Fresh vegetables are being packed carefully.");
        } else if (percent < 50) {
          setDeliveryMessage("🚚 Delivery partner has picked up your order.");
        } else if (percent < 75) {
          setDeliveryMessage("📍 Your order is nearby.");
        } else {
          setDeliveryMessage(
            "🏠 Almost there. Please keep your phone available."
          );
        }

        const arrival = new Date(estimated);

        setEta(
          arrival.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [order]);

  const cancelOrder = async () => {
    if (!window.confirm("Cancel this order?")) return;

    try {
      await update(ref(db, `orders/${orderId}`), {
        status: 0,
        cancelledBy: "Customer",
        cancelReason: "Customer Requested",
        refundStatus:
          order.paymentMethod === "upi"
            ? "Refund will be processed within 1 hour"
            : "",
      });

      alert("Order Cancelled");

    } catch (err) {
      alert("Unable to cancel order");
    }
  };
  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);
  const timer = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-2xl font-bold">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-5">

      <h1 className="text-4xl font-bold text-green-700 mb-6">
        📦 Track Your Order
      </h1>

      <div className="flex gap-3 mb-8">

        <input
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="Enter Order ID"
          className="flex-1 border rounded-xl p-4"
        />

        <button
          onClick={startTracking}
          className="bg-green-600 hover:bg-green-700 text-white px-8 rounded-xl font-bold"
        >
          Track
        </button>

      </div>

      {!order ? null : (
        <>
          {/* Customer Details */}

          <div className="bg-white rounded-3xl shadow-lg p-6 border mb-6">

            <div className="flex justify-between items-center mb-5">

              <div>

                <h2 className="text-2xl font-bold">
                  👤 Customer Details
                </h2>

                <p className="text-gray-500">
                  Order ID : {order.orderId}
                </p>

              </div>

              <div className="text-right">

                <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold">

                  {steps[(order.status || 1) - 1] || "Cancelled"}

                </div>

                <p className="text-sm text-gray-500 mt-2">

                  {new Date(order.timestamp).toLocaleString()}

                </p>

              </div>

            </div>

            <div className="grid md:grid-cols-2 gap-5">

              <div className="bg-gray-50 rounded-2xl p-5">

                <p className="font-bold text-lg">
                  {order.customerName}
                </p>

                <p className="mt-2">
                  📞 {order.phone}
                </p>

                <p className="mt-2">
                  📍 {order.address}
                </p>

              </div>

              <div className="bg-gray-50 rounded-2xl p-5">

                <p>

                  💳 Payment :
                  <b> {order.paymentMethod.toUpperCase()}</b>

                </p>

                <p className="mt-3">

                  Status :

                  <span
                    className={`ml-2 px-3 py-1 rounded-full text-sm font-bold ${order.paymentStatus === "Verified"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                      }`}
                  >

                    {order.paymentStatus}

                  </span>

                </p>

              </div>

            </div>

          </div>

          {/* Ordered Items */}

          <div className="bg-white rounded-3xl shadow-lg p-6 border mb-6">

            <h2 className="text-2xl font-bold mb-5">

              🛒 Ordered Items

            </h2>

            {order.items?.map((item, index) => (

              <div
                key={index}
                className="flex items-center gap-4 border-b py-4 last:border-0"
              >

                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-2xl object-cover border"
                />

                <div className="flex-1">

                  <h3 className="font-bold text-lg">

                    {item.name}

                  </h3>

                  <p className="text-gray-500">

                    {item.unitLabel}

                  </p>

                  <p className="mt-2">

                    Qty :
                    <b> {item.quantity}</b>

                  </p>

                </div>

                <div className="text-right">

                  <p className="font-bold text-xl">

                    ₹{item.price * item.quantity}

                  </p>

                  <p className="text-gray-500">

                    ₹{item.price} each

                  </p>

                </div>

              </div>

            ))}

          </div>

          {/* Bill Summary */}

          <div className="bg-white rounded-3xl shadow-lg p-6 border mb-6">

            <h2 className="text-2xl font-bold mb-5">

              🧾 Bill Summary

            </h2>

            <div className="flex justify-between mb-3">

              <span>Subtotal</span>

              <b>₹{order.subtotal}</b>

            </div>

            <div className="flex justify-between mb-3">

              <span>Delivery Charge</span>

              <b>

                {order.deliveryCharge === 0
                  ? "FREE"
                  : `₹${order.deliveryCharge}`}

              </b>

            </div>

            <div className="flex justify-between mb-3">

              <span>Platform Fee</span>

              <b>₹{order.platformFee}</b>

            </div>

            <hr className="my-4" />

            <div className="flex justify-between text-3xl font-bold text-green-700">

              <span>Grand Total</span>

              <span>

                ₹{order.grandTotal || order.total}

              </span>

            </div>

          </div>



          {/* Order Cancelled */}

          {order.status === 0 && (

            <div className="bg-red-50 border-2 border-red-500 rounded-3xl p-8 text-center mb-6">

              <div className="text-6xl mb-4">
                ❌
              </div>

              <h2 className="text-3xl font-bold text-red-700">
                Order Cancelled
              </h2>

              <p className="mt-4 text-lg">
                Cancelled By :
                <b> {order.cancelledBy || "Store"}</b>
              </p>

              <p className="mt-2">
                Reason :
                <b> {order.cancelReason || "Out Of Stock"}</b>
              </p>

              {order.paymentMethod === "upi" && (

                <div className="bg-white rounded-2xl border p-5 mt-6">

                  <h3 className="text-xl font-bold text-green-700">
                    💸 Refund Status
                  </h3>

                  <p className="mt-3 font-semibold">
                    {order.refundStatus ||
                      "Refund will be processed within 1 hour"}
                  </p>

                </div>

              )}

            </div>

          )}



          {/* 👇 DELIVERY TIMER CARD YAHAN PASTE KARO */}
          

          {order.status === 3 && (
            <div className="bg-gradient-to-r from-green-600 via-green-500 to-emerald-600 rounded-3xl p-8 shadow-2xl text-white mb-6">

              <div className="flex flex-col md:flex-row justify-between items-center gap-6">

                <div>
                  <h2 className="text-3xl font-bold">
                    🚚 Your Order is On the Way
                  </h2>

                  <p className="mt-3 text-lg">
                    {deliveryMessage}
                  </p>

                  <p className="mt-4">
                    🕒 ETA : <b>{eta}</b>
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-white text-green-700 rounded-full w-36 h-36 flex items-center justify-center">
                    <div>
                      <h1 className="text-4xl font-bold">
                        {timer}
                      </h1>
                      <p className="text-sm">
                        Remaining
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              <div className="mt-8 w-full bg-white/30 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-white h-4 transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="mt-8">

                <div className="flex justify-between text-3xl">

                  <span>🏪</span>

                  <div
                    className="transition-all duration-1000"
                    style={{
                      transform: `translateX(${progress * 2.2}px)`
                    }}
                  >
                    🚚
                  </div>

                  <span>🏠</span>

                </div>

                <p className="text-center mt-4 text-lg font-semibold">
                  {deliveryMessage}
                </p>

              </div>

            </div>
          )}

          {/* Tracking Timeline */}


          {order.status > 0 && (

            <div className="bg-white rounded-3xl shadow-lg border p-6 mb-6">

              <h2 className="text-2xl font-bold mb-6">
                🚚 Live Order Tracking
              </h2>

              {steps.map((step, index) => (

                <div
                  key={index}
                  className="flex items-center gap-4 mb-6"
                >

                  <div
                    className={`w-8 h-8 rounded-full border-4 flex items-center justify-center ${index + 1 <= order.status
                        ? "bg-green-600 border-green-600"
                        : "bg-white border-gray-300"
                      }`}
                  >
                    {index + 1 <= order.status && "✓"}
                  </div>

                  <div>
                    <h3
                      className={`font-bold text-lg ${index + 1 <= order.status
                          ? "text-green-700"
                          : "text-gray-400"
                        }`}
                    >
                      {step}
                    </h3>

                    {index + 1 === order.status && (

                      <p className="text-sm text-gray-500">
                        Current Status
                      </p>

                    )}

                  </div>

                </div>

              ))}

            </div>

          )}

          {/* Cancel Button */}

          {(order.status === 1) && (

            <button
              onClick={cancelOrder}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl text-xl font-bold mb-6"
            >
              ❌ Cancel Order
            </button>

          )}

          {/* Support */}

          <div className="grid md:grid-cols-2 gap-5 mb-6">

            <a
              href={`tel:+919022271773`}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl p-5 text-center font-bold text-lg"
            >
              📞 Call Support
            </a>

            <a
              href={`https://wa.me/919022271773`}
              target="_blank"
              rel="noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white rounded-2xl p-5 text-center font-bold text-lg"
            >
              💬 WhatsApp Support
            </a>

          </div>

          {/* Delivered */}

          {order.status === 4 && (

            <div className="bg-green-50 border-2 border-green-600 rounded-3xl p-8 text-center">

              <div className="text-7xl mb-4">
                🎉
              </div>

              <h2 className="text-4xl font-bold text-green-700">
                Order Delivered Successfully
              </h2>

              <p className="mt-4 text-lg">
                Thank you for shopping with
                <b> Heera's Vegetables ❤️</b>
              </p>

              <button
                className="mt-6 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl font-bold"
              >
                ⭐ Rate Your Order
              </button>

            </div>

          )}

        </>
      )}

    </div>
  );
}

export default TrackOrder;