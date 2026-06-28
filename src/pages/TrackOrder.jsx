import { useCart } from "../context/CartContext";
import { useState } from "react";
import { ref, set } from "firebase/database";
import { db } from "../src/firebase";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";

function Checkout() {
  const { cart, totalPrice } = useCart();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState({ name: "", phone: "", address: "", landmark: "", pincode: "" });
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const deliveryCharge = totalPrice >= 399 ? 0 : 30;
  const finalTotal = totalPrice + deliveryCharge;

  const placeOrder = async () => {
    // Basic Validation
    if (!customer.name || !customer.phone || !customer.address) {
      alert("Please fill in all mandatory delivery details.");
      return;
    }

    // Final Confirmation Popup
    const isConfirmed = window.confirm(
      `Confirm your order:\nName: ${customer.name}\nTotal: ₹${finalTotal}\n\nClick OK to place your order.`
    );

    if (!isConfirmed) return;

    const autoOrderId = "HV-" + Math.floor(10000 + Math.random() * 90000);
    const itemsList = cart.map((i) => `• ${i.name} (${i.unitLabel}) x ${i.quantity}`).join("\n");

    try {
      await set(ref(db, `orders/${autoOrderId}`), {
        orderId: autoOrderId,
        status: 1,
        paymentMethod,
        customerName: customer.name,
        phone: customer.phone,
        address: `${customer.address}, ${customer.landmark}`,
        total: finalTotal,
        timestamp: Date.now(),
      });

      alert("🎉 Order Placed Successfully!");
      navigate(`/track-order?id=${autoOrderId}`);
    } catch (error) {
      alert("Failed to place order.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* ... (Keep your existing UI elements here) */}
      <button onClick={placeOrder} className="w-full bg-green-600 text-white py-4 rounded-xl">
        Place Order
      </button>
    </div>
  );
}
export default Checkout;