import { useCart } from "../context/CartContext";
import { useState } from "react";
import { ref, set } from "firebase/database";
import { db } from "../src/firebase";
import { useNavigate } from "react-router-dom";
import emailjs from '@emailjs/browser'; 

function Checkout() {
    const { cart, totalPrice } = useCart();
    const navigate = useNavigate();

    const [customer, setCustomer] = useState({
        name: "", phone: "", address: "", landmark: "", pincode: "",
    });

    const deliveryCharge = totalPrice >= 399 ? 0 : 30;
    const finalTotal = totalPrice + deliveryCharge;

    const currentHour = new Date().getHours();
    const isShopOpen = currentHour >= 10 && currentHour < 22;

    const handleChange = (e) => {
        setCustomer({ ...customer, [e.target.name]: e.target.value });
    };

    const placeOrder = async () => {
        if (!isShopOpen) {
            alert("माफ़ कीजिए, हमारी दुकान अभी बंद है। हम सुबह 10:00 से रात 10:00 बजे तक खुले रहते हैं।");
            return;
        }
        if (!customer.name || !customer.phone) {
            alert("कृपया नाम और मोबाइल नंबर भरें!");
            return;
        }

        const autoOrderId = "HV-" + Math.floor(10000 + Math.random() * 90000);
        const itemsList = cart.map(i => `${i.name} (${i.quantity})`).join(", ");

        try {
            // 1. Firebase Save
          await set(ref(db, `orders/${autoOrderId}`), {
  status: 1,
  customerName: customer.name,
  phone: customer.phone,

  // 👇 Complete cart save hoga
  items: cart,

  total: finalTotal,
  timestamp: Date.now(),
});

            // 2. EmailJS - ईमेल भेजना
            const templateParams = {
                title: "New Order",
                name: customer.name,
                order_id: autoOrderId,
                from_name: customer.name,
                phone: customer.phone,
                address: `${customer.address}, ${customer.landmark}`,
                message: itemsList,
                total: "₹" + finalTotal,
            };

            emailjs.send('service_zxgku3f', 'template_foc6ana', templateParams, 'b8Qb45wp8S4PC1Mi8')
                .catch(err => console.log("Email error: ", err));

            // 3. WhatsApp Redirect (Optional)
            const wantsWhatsApp = window.confirm("क्या आप ऑर्डर की डिटेल्स WhatsApp पर देखना चाहते हैं?");
            if (wantsWhatsApp) {
                const waMessage = `🥬 *New Order Received!* \n📦 *ID: ${autoOrderId}* \n👤 *Name:* ${customer.name} \n📞 *Phone:* ${customer.phone} \n🏠 *Address:* ${customer.address} \n💰 *Total:* ₹${finalTotal}`;
                window.open(`https://wa.me/919022271773?text=${encodeURIComponent(waMessage)}`, "_blank");
            }

            setCustomer({ name: "", phone: "", address: "", landmark: "", pincode: "" });
            alert("ऑर्डर कन्फर्म हो गया!");
            navigate(`/track-order?id=${autoOrderId}`);

        } catch (error) {
            alert("ऑर्डर प्लेस करने में समस्या आई।");
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 text-black">
            <h1 className="text-3xl font-bold mb-6">Checkout</h1>
            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <input name="name" value={customer.name} placeholder="Full Name" onChange={handleChange} className="border p-3 rounded w-full" />
                    <input name="phone" value={customer.phone} placeholder="Mobile Number" onChange={handleChange} className="border p-3 rounded w-full" />
                    <textarea name="address" value={customer.address} placeholder="Full Address" onChange={handleChange} className="border p-3 rounded w-full" />
                    <input name="landmark" value={customer.landmark} placeholder="Landmark" onChange={handleChange} className="border p-3 rounded w-full" />
                    <input name="pincode" value={customer.pincode} placeholder="Pincode" onChange={handleChange} className="border p-3 rounded w-full" />
                </div>

                <div className="bg-gray-100 rounded-xl p-5">
                    <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
                    <div className="text-xl font-bold mt-4">Total: ₹{finalTotal}</div>
                    
                    {isShopOpen ? (
                        <button onClick={placeOrder} className="mt-6 w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 shadow-lg">
                            Confirm Order
                        </button>
                    ) : (
                        <div className="mt-6 w-full bg-red-600 text-white py-4 rounded-xl font-bold text-center">
                            🚫 दुकान अभी बंद है (सुबह 10 से रात 10)
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Checkout;