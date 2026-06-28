import { useCart } from "../context/CartContext";
import { useState } from "react";
import { ref, set } from "firebase/database";
import { db } from "../src/firebase";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";

function Checkout() {
  const { cart, totalPrice } = useCart();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState({
    name: "", phone: "", address: "", landmark: "", pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");

  const deliveryCharge = totalPrice >= 399 ? 0 : 30;
  const finalTotal = totalPrice + deliveryCharge;

  // Developer mode for testing: isShopOpen = true (Remove this for production)
  const isShopOpen = true;

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const placeOrder = async () => {
    if (!isShopOpen) {
      alert("Shop is currently closed. Open: 10 AM - 10 PM");
      return;
    }
    if (!customer.name || !customer.phone || !customer.address) {
      alert("Please fill in all delivery details!");
      return;
    }

    const autoOrderId = "HV-" + Math.floor(10000 + Math.random() * 90000);

    // Email ke liye string format (Purani functionality chalu rahegi)
    const itemsList = cart.map((i) => `• ${i.name} (${i.unitLabel}) × ${i.quantity} = ₹${i.price * i.quantity}`).join("\n");

    try {
      await set(ref(db, `orders/${autoOrderId}`), {
        orderId: autoOrderId,
        status: 1,
        paymentMethod,
        customerName: customer.name,
        phone: customer.phone,
        address: `${customer.address}, ${customer.landmark}, ${customer.pincode}`,
        total: finalTotal,
        timestamp: Date.now(),
        // YAHAN HAI ASLI CHANGE: Items array ban kar ja raha hai
        items: cart.map((i) => ({
          name: i.name,
          unitLabel: i.unitLabel,
          quantity: i.quantity,
          price: i.price,
          image: i.image || "" // Image URL pass ho raha hai
        })),
      });

      const templateParams = {
        order_id: autoOrderId,
        name: customer.name,
        phone: customer.phone,
        address: `${customer.address}, ${customer.landmark}, ${customer.pincode}`,
        payment_method: paymentMethod === "upi" ? "UPI" : "COD",
        message: itemsList,
        total: "₹" + finalTotal,
      };

      await emailjs.send("service_zxgku3f", "template_foc6ana", templateParams, "b8Qb45wp8S4PC1Mi8");

      const wantsWhatsApp = window.confirm("Send order details on WhatsApp?");
      if (wantsWhatsApp) {
        const waMessage = `🥬 *New Order*\n📦 *ID:* ${autoOrderId}\n👤 *Name:* ${customer.name}\n🏠 *Address:* ${customer.address}\n\n🛒 *Items:*\n${itemsList}\n\n💰 *Total:* ₹${finalTotal}`;
        window.open(`https://wa.me/919022271773?text=${encodeURIComponent(waMessage)}`, "_blank");
      }

      alert("🎉 Order Placed Successfully!");
      navigate(`/track-order?id=${autoOrderId}`);
    } catch (error) {
      console.error(error);
      alert("Error placing order.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <input name="name" value={customer.name} onChange={handleChange} placeholder="Full Name" className="border p-3 rounded-lg w-full" />
          <input name="phone" value={customer.phone} onChange={handleChange} placeholder="Mobile Number" className="border p-3 rounded-lg w-full" />
          <textarea name="address" value={customer.address} onChange={handleChange} placeholder="Full Address" className="border p-3 rounded-lg w-full" />
          <input name="landmark" value={customer.landmark} onChange={handleChange} placeholder="Landmark" className="border p-3 rounded-lg w-full" />
          <input name="pincode" value={customer.pincode} onChange={handleChange} placeholder="Pincode" className="border p-3 rounded-lg w-full" />
        </div>

        <div className="bg-gray-100 rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between py-2 border-b">
              <span>{item.name} x {item.quantity}</span>
              <span className="font-bold">₹{item.price * item.quantity}</span>
            </div>
          ))}
          <div className="mt-4 text-2xl font-bold text-green-700">Total: ₹{finalTotal}</div>

          <button onClick={placeOrder} className="w-full mt-6 bg-green-600 text-white py-4 rounded-xl font-bold text-lg">
            🛒 Place Order
          </button>
        </div>
        {paymentMethod === "upi" && (
          <div className="mt-4 p-4 bg-white rounded-xl text-center border border-purple-200">
            <img src="/qr-code.jpeg" alt="QR" className="w-40 mx-auto" />
            <p className="font-bold text-purple-700 mt-2">9022271773@ybl</p>

            {/* YE NAYA BUTTON HAI */}
            <a
              href={`upi://pay?pa=9022271773@ybl&pn=HeeraVegetables&am=${finalTotal}&cu=INR`}
              className="block mt-3 bg-purple-600 text-white py-2 rounded-lg font-bold"
            >
              Pay ₹{finalTotal} with UPI
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default Checkout;