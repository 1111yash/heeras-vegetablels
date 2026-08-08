
import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";
import { db, auth } from "../src/firebase";
import { useNavigate } from "react-router-dom";
import { ref, get, set } from "firebase/database";
import { useUserLocation } from "../context/LocationContext";

function Checkout() {
  const { location } = useUserLocation();
  const { cart, totalPrice } = useCart();
  const navigate = useNavigate();

  // =============================
  // Customer Details
  // =============================
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    landmark: "",
    pincode: "",
  });

  // =============================
  // Payment
  // =============================
  const [paymentMethod, setPaymentMethod] = useState("cod");

  // =============================
  // Order State
  // =============================
  const [isOrdered, setIsOrdered] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);

  // =============================
  // Login Check
  // =============================
  useEffect(() => {
    if (!auth.currentUser) {
      alert("Please Login First");
      navigate("/login");
    }
  }, [navigate]);

  // =============================
  // Load User Name + Location
  // =============================
  useEffect(() => {
    if (!auth.currentUser) return;

    setCustomer((prev) => ({
      ...prev,
      name: auth.currentUser.displayName || prev.name,
    }));
  }, []);

  // =============================
  // Auto Fill Address From Location
  // =============================
  useEffect(() => {
    if (!location) return;

    setCustomer((prev) => ({
      ...prev,

      address:
        prev.address ||
        location.address ||
        "",

      pincode:
        prev.pincode ||
        location.pincode ||
        "",
    }));
  }, [location]);

  // =============================
  // Bill Calculation
  // =============================
  const subtotal = Number(totalPrice || 0);

  const deliveryCharge = subtotal >= 199 ? 0 : 20;

  const platformFee = 3;

  const grandTotal =
    subtotal +
    deliveryCharge +
    platformFee;

  // =============================
  // Handle Input
  // =============================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =============================
// VOICE CLEAR CHECKOUT FIELD
// =============================

useEffect(() => {
  const handleClearField = (event) => {
    const field = event.detail?.field;

    if (field === "all") {
      setCustomer({
        name: "",
        phone: "",
        address: "",
        landmark: "",
        pincode: "",
      });

      return;
    }

    if (!field) return;

    setCustomer((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  window.addEventListener(
    "clearCheckoutField",
    handleClearField
  );

  return () => {
    window.removeEventListener(
      "clearCheckoutField",
      handleClearField
    );
  };
}, []);

  // =============================
// VOICE PAYMENT METHOD
// =============================

useEffect(() => {
  const handleVoicePayment = (event) => {
    const method = event.detail.method;

    setPaymentMethod(method);
  };

  window.addEventListener(
    "voicePaymentMethod",
    handleVoicePayment
  );

  return () => {
    window.removeEventListener(
      "voicePaymentMethod",
      handleVoicePayment
    );
  };
}, []);

// =============================
// VOICE PLACE ORDER
// =============================

useEffect(() => {
  const handleVoicePlaceOrder = () => {
    placeOrder();
  };

  window.addEventListener(
    "voicePlaceOrder",
    handleVoicePlaceOrder
  );

  return () => {
    window.removeEventListener(
      "voicePlaceOrder",
      handleVoicePlaceOrder
    );
  };
}, []);
  

// =============================
// VOICE CHECKOUT FILL
// =============================
useEffect(() => {
  const handleVoiceCheckoutFill = (event) => {
    const text = event.detail?.text?.toLowerCase() || "";

    setCustomer((prev) => {
      const updated = { ...prev };

      // =============================
      // PHONE / MOBILE
      // =============================

      const phoneMatch = text.match(
        /(?:phone|mobile|number)[^\d]*(\d[\d\s-]{9,})/
      );

      if (phoneMatch) {
        const phone = phoneMatch[1]
          .replace(/\D/g, "")
          .slice(-10);

        if (phone.length === 10) {
          updated.phone = phone;
        }
      }

      // =============================
      // PINCODE
      // =============================

      const pincodeMatch = text.match(
        /(?:pincode|pin code)[^\d]*(\d[\d\s-]{5,})/
      );

      if (pincodeMatch) {
        const pincode = pincodeMatch[1]
          .replace(/\D/g, "")
          .slice(0, 6);

        if (pincode.length === 6) {
          updated.pincode = pincode;
        }
      }

      // =============================
      // NAME
      // =============================

      if (
        text.includes("my name is") ||
        text.includes("name is")
      ) {
        const name = text
          .split("name is")[1]
          ?.split("phone")[0]
          ?.split("mobile")[0]
          ?.split("address")[0]
          ?.trim();

        if (name) {
          updated.name = name;
        }
      }

      // =============================
      // ADDRESS
      // =============================

      if (text.includes("address")) {
        const address = text
          .split("address")[1]
          ?.split("landmark")[0]
          ?.split("pincode")[0]
          ?.split("pin code")[0]
          ?.trim();

        if (address) {
          updated.address = address;
        }
      }

      // =============================
      // LANDMARK
      // =============================

      if (text.includes("landmark")) {
        const landmark = text
          .split("landmark")[1]
          ?.split("pincode")[0]
          ?.split("pin code")[0]
          ?.trim();

        if (landmark) {
          updated.landmark = landmark;
        }
      }

      return updated;
    });
  };

  window.addEventListener(
    "voiceCheckoutFill",
    handleVoiceCheckoutFill
  );

  return () => {
    window.removeEventListener(
      "voiceCheckoutFill",
      handleVoiceCheckoutFill
    );
  };
}, []);
  // =============================
  // Place Order
  // =============================
  const placeOrder = async () => {
    // Prevent double click
    if (placingOrder) return;

    // =============================
    // Login Check
    // =============================
    if (!auth.currentUser) {
      alert("Please Login First");
      navigate("/login");
      return;
    }

    // =============================
    // Cart Check
    // =============================
    if (!cart || cart.length === 0) {
      alert("Your cart is empty!");
      navigate("/cart");
      return;
    }

    // =============================
    // Name Validation
    // =============================
    if (!customer.name.trim()) {
      alert("Please enter your name.");
      return;
    }

    // =============================
    // Phone Validation
    // =============================
    const phone = customer.phone.replace(/\D/g, "");

    if (phone.length !== 10) {
      alert("Please enter a valid 10 digit mobile number.");
      return;
    }

    // =============================
    // Address Validation
    // =============================
    if (!customer.address.trim()) {
      alert("Please enter your complete delivery address.");
      return;
    }

    // =============================
    // Pincode Validation
    // =============================
    if (customer.pincode && customer.pincode.length !== 6) {
      alert("Please enter a valid 6 digit pincode.");
      return;
    }



    try {
      setPlacingOrder(true);

      // =============================
      // Check Shop Status
      // =============================
      const shopStatus = await get(
        ref(db, "shopSettings/isOpen")
      );

      if (
        shopStatus.exists() &&
        shopStatus.val() === false
      ) {
        alert(
          "🚫 Shop is temporarily closed. We are not accepting orders."
        );

        setPlacingOrder(false);
        return;
      }

      // =============================
      // Generate Order ID
      // =============================
      const autoOrderId =
        "HV-" +
        Date.now().toString().slice(-8);

      // =============================
      // Full Address
      // =============================
      const fullAddress = [
        customer.address.trim(),
        customer.landmark.trim(),
        customer.pincode.trim(),
      ]
        .filter(Boolean)
        .join(", ");

      // =============================
      // Prepare Order Items
      // =============================
      const orderItems = cart.map((item) => ({
        id: item.id,
        name: item.name,
        image: item.image || "",
        price: Number(item.price || 0),
        quantity: item.quantity,
        unitLabel: item.unitLabel || "",
      }));

      // =============================
      // Order Object
      // =============================
      const orderData = {
        orderId: autoOrderId,

        uid: auth.currentUser.uid,

        userName:
          auth.currentUser.displayName ||
          customer.name,

        email:
          auth.currentUser.email || "",

        photo:
          auth.currentUser.photoURL || "",

        // 1 = Order Confirmed
        status: 1,

        paymentMethod,

        paymentStatus:
          paymentMethod === "upi"
            ? "Pending Verification"
            : "Cash On Delivery",

        customerName:
          customer.name.trim(),

        phone,

        address: fullAddress,

        latitude:
          location?.latitude || null,

        longitude:
          location?.longitude || null,

        location: {
          latitude:
            location?.latitude || null,

          longitude:
            location?.longitude || null,

          address:
            location?.address || "",

          city:
            location?.city || "",

          state:
            location?.state || "",

          pincode:
            customer.pincode ||
            location?.pincode ||
            "",

          country:
            location?.country || "India",
        },

        items: orderItems,

        subtotal,

        deliveryCharge,

        platformFee,

        total: grandTotal,

        grandTotal,

        timestamp: Date.now(),
      };

      // =============================
      // SAVE ORDER TO FIREBASE
      // =============================
      await set(
        ref(db, `orders/${autoOrderId}`),
        orderData
      );

      console.log(
        "ORDER SAVED:",
        orderData
      );

      // =============================
      // Success
      // =============================
      setOrderId(autoOrderId);

      setIsOrdered(true);

      // =============================
      // Go To Track Order
      // =============================
      setTimeout(() => {
        navigate(
          `/track-order?id=${autoOrderId}`
        );
      }, 2000);

    } catch (error) {
      console.error(
        "PLACE ORDER ERROR:",
        error
      );

      alert(
        "Failed to place order. Please try again."
      );

      setPlacingOrder(false);
    }
  };

  // =============================
// VOICE PLACE ORDER
// =============================

useEffect(() => {
  const handleVoicePlaceOrder = () => {
    placeOrder();
  };

  window.addEventListener(
    "voicePlaceOrder",
    handleVoicePlaceOrder
  );

  return () => {
    window.removeEventListener(
      "voicePlaceOrder",
      handleVoicePlaceOrder
    );
  };
}, [customer, paymentMethod, cart, totalPrice, location]);

  // =============================
  // Browser Support
  // =============================
  if (!auth.currentUser) {
    return null;
  }

  // =============================
  // Order Success Screen
  // =============================
  if (isOrdered) {
    return (
      <div className="max-w-5xl mx-auto p-6">

        <div className="bg-white rounded-3xl shadow-xl p-10 text-center">

          <div className="text-7xl mb-5">
            🎉
          </div>

          <h1 className="text-4xl font-bold text-green-700">
            Order Placed Successfully
          </h1>

          <p className="mt-4 text-gray-600 text-lg">
            Thank you for shopping with{" "}
            <span className="font-bold text-green-700">
              Heera's Veg Mart
            </span>
          </p>

          <div className="mt-5 bg-green-50 rounded-xl p-4">
            <p className="text-sm text-gray-600">
              Order ID
            </p>

            <p className="text-xl font-bold text-green-700">
              {orderId}
            </p>
          </div>

          <div className="bg-green-50 rounded-2xl p-6 mt-8">

            <div className="flex justify-between mb-3">
              <span>
                Subtotal
              </span>

              <b>
                ₹{subtotal}
              </b>
            </div>

            <div className="flex justify-between mb-3">
              <span>
                Delivery Charge
              </span>

              <b>
                {deliveryCharge === 0
                  ? "FREE"
                  : `₹${deliveryCharge}`}
              </b>
            </div>

            <div className="flex justify-between mb-3">
              <span>
                Platform Fee
              </span>

              <b>
                ₹{platformFee}
              </b>
            </div>

            <hr className="my-4" />

            <div className="flex justify-between text-2xl font-bold text-green-700">
              <span>
                Grand Total
              </span>

              <span>
                ₹{grandTotal}
              </span>
            </div>

          </div>

          <button
            onClick={() =>
              navigate(
                `/track-order?id=${orderId}`
              )
            }
            className="mt-8 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-bold"
          >
            📦 Track My Order
          </button>

        </div>

      </div>
    );
  }

  // =============================
  // Checkout Page
  // =============================
  return (
    <div className="max-w-5xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        Checkout
      </h1>

      {/* =============================
          DELIVERY DETAILS
      ============================= */}

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
            className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-green-500"
          />

          <input
            type="tel"
            name="phone"
            placeholder="Mobile Number"
            value={customer.phone}
            onChange={handleChange}
            maxLength={10}
            className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-green-500"
          />

          <textarea
            rows="3"
            name="address"
            placeholder="Complete Delivery Address"
            value={customer.address}
            onChange={handleChange}
            className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-green-500"
          />

          <input
            type="text"
            name="landmark"
            placeholder="Landmark (Optional)"
            value={customer.landmark}
            onChange={handleChange}
            className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-green-500"
          />

          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            value={customer.pincode}
            onChange={handleChange}
            maxLength={6}
            className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-green-500"
          />

        </div>

        {location?.address && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700">
            📍 Location detected:
            <br />
            {location.address}
          </div>
        )}

      </div>

      {/* =============================
          PAYMENT
      ============================= */}

      <div className="bg-white rounded-2xl shadow p-6 mt-6">

        <h2 className="text-xl font-bold mb-5">
          💳 Payment Method
        </h2>

        <label className="flex items-center gap-3 border rounded-xl p-4 cursor-pointer mb-3">

          <input
            type="radio"
            value="cod"
            checked={
              paymentMethod === "cod"
            }
            onChange={(e) =>
              setPaymentMethod(
                e.target.value
              )
            }
          />

          <span className="font-semibold">
            💵 Cash On Delivery
          </span>

        </label>

        <label className="flex items-center gap-3 border rounded-xl p-4 cursor-pointer">

          <input
            type="radio"
            value="upi"
            checked={
              paymentMethod === "upi"
            }
            onChange={(e) =>
              setPaymentMethod(
                e.target.value
              )
            }
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
              className="block mt-5 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-bold"
            >
              Pay ₹{grandTotal}
            </a>

            <p className="mt-3 text-sm text-gray-600">
              After successful payment click{" "}
              <b>Place Order</b>.
            </p>

          </div>
        )}

      </div>

      {/* =============================
          BILL SUMMARY
      ============================= */}

      <div className="bg-white rounded-2xl shadow p-6 mt-6">

        <h2 className="text-2xl font-bold mb-5">
          🧾 Bill Summary
        </h2>

        <div className="flex justify-between mb-3">
          <span>
            🛒 Subtotal
          </span>

          <span>
            ₹{subtotal}
          </span>
        </div>

        <div className="flex justify-between mb-3">

          <span>
            🚚 Delivery Charge
          </span>

          <span className="font-bold">

            {deliveryCharge === 0 ? (
              <span className="text-green-600">
                FREE
              </span>
            ) : (
              `₹${deliveryCharge}`
            )}

          </span>

        </div>

        <div className="flex justify-between mb-3">

          <span>
            🏪 Platform Fee
          </span>

          <span>
            ₹{platformFee}
          </span>

        </div>

        <hr className="my-4" />

        <div className="flex justify-between text-3xl font-bold text-green-700">

          <span>
            Total Payable
          </span>

          <span>
            ₹{grandTotal}
          </span>

        </div>

      </div>

      {/* =============================
          PLACE ORDER BUTTON
      ============================= */}

      <button
        type="button"
        onClick={placeOrder}
        disabled={placingOrder}
        className={`w-full mt-6 text-white py-4 rounded-2xl text-xl font-bold transition ${placingOrder
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700 cursor-pointer"
          }`}
      >
        {placingOrder
          ? "⏳ Placing Order..."
          : "✅ Place Order"}
      </button>

    </div>
  );
}

export default Checkout;
