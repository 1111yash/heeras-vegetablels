import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../src/firebase";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

import { Mic, MicOff } from "lucide-react";

function VoiceAssistant() {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [isAwake, setIsAwake] = useState(false);

  const {
    transcript,
    finalTranscript,
    listening,
    browserSupportsSpeechRecognition,
    resetTranscript,
  } = useSpeechRecognition();

  // =============================
  // Load Products
  // =============================
  useEffect(() => {
    const productRef = ref(db, "products");

    return onValue(productRef, (snapshot) => {
      if (!snapshot.exists()) {
        setProducts([]);
        return;
      }

      const data = snapshot.val();

      const list = Object.entries(data).map(([id, item]) => ({
        id,
        ...item,
      }));

      setProducts(list);

      console.log("Products Loaded:", list);
    });
  }, []);

  // =============================
  // Speak
  // =============================
  const speak = (text) => {
    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);

    speech.lang = "en-IN";
    speech.rate = 1;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
  };

  // =============================
  // Start Listening
  // =============================
  const startListening = () => {
    resetTranscript();

    SpeechRecognition.startListening({
      continuous: true,
      interimResults: false,
      language: "en-IN",
    });

    toast.success("Voice Assistant Started");
    speak("Say hello to start.");
  };

  // =============================
  // Stop Listening
  // =============================
  const stopListening = () => {
    SpeechRecognition.stopListening();

    toast("Voice Assistant Stopped");
    speak("Voice assistant stopped");
  };
  // =============================
  // Process Voice Command
  // =============================
  useEffect(() => {
    if (!finalTranscript) return;

    const text = normalizeCommand(finalTranscript);

    console.log("Voice:", text);

    // =============================
    // Wake Word
    // =============================
    if (!isAwake) {
      if (text.includes("hello")) {
        setIsAwake(true);
        toast.success("I'm Listening");
        speak("Yes. How can I help you?");
        resetTranscript();
      }
      return;
    }

    // =============================
    // Navigation
    // =============================

    if (text.includes("cart") || text.includes("basket")) {
      navigate("/cart");
      speak("Opening cart");
      toast.success("Opening cart");
      resetTranscript();

      return;
    }
    if (
      text.includes("checkout") ||
      text.includes("check out") ||
      text.includes("proceed to payment") ||
      text.includes("proceed payment")
    ) {
      navigate("/checkout");
      speak("Opening checkout");
      toast.success("Proceed to Payment");
      resetTranscript();

      return;
    }

    if (text.includes("home")) {
      navigate("/");
      speak("Going home");
      toast.success("Home");
      resetTranscript();

      return;
    }

    if (
      text.includes("products") ||
      text.includes("product") ||
      text.includes("shop") ||
      text.includes("product page") ||
      text.includes("go to products") ||
      text.includes("go to product page") ||
      text.includes("open products") ||
      text.includes("open product page")
    ) {
      navigate("/products");
      speak("Opening product page");
      toast.success("Opening Product Page");
      resetTranscript();
      return;
    }

    // =============================
// CLEAR CHECKOUT DETAILS
// =============================

if (
  text.includes("clear all details") ||
  text.includes("delete all details") ||
  text.includes("clear checkout") ||
  text.includes("reset checkout")
) {
  window.dispatchEvent(
    new CustomEvent("clearCheckoutField", {
      detail: {
        field: "all",
      },
    })
  );

  toast.success("All checkout details cleared");
  speak("All checkout details cleared");
  resetTranscript();
  return;
}

if (
  text.includes("clear name") ||
  text.includes("delete name") ||
  text.includes("remove name")
) {
  window.dispatchEvent(
    new CustomEvent("clearCheckoutField", {
      detail: {
        field: "name",
      },
    })
  );

  toast.success("Name cleared");
  speak("Name cleared");
  resetTranscript();
  return;
}

if (
  text.includes("clear phone") ||
  text.includes("delete phone") ||
  text.includes("remove phone") ||
  text.includes("clear mobile")
) {
  window.dispatchEvent(
    new CustomEvent("clearCheckoutField", {
      detail: {
        field: "phone",
      },
    })
  );

  toast.success("Phone cleared");
  speak("Phone number cleared");
  resetTranscript();
  return;
}

if (
  text.includes("clear address") ||
  text.includes("delete address") ||
  text.includes("remove address")
) {
  window.dispatchEvent(
    new CustomEvent("clearCheckoutField", {
      detail: {
        field: "address",
      },
    })
  );

  toast.success("Address cleared");
  speak("Address cleared");
  resetTranscript();
  return;
}

if (
  text.includes("clear landmark") ||
  text.includes("delete landmark") ||
  text.includes("remove landmark")
) {
  window.dispatchEvent(
    new CustomEvent("clearCheckoutField", {
      detail: {
        field: "landmark",
      },
    })
  );

  toast.success("Landmark cleared");
  speak("Landmark cleared");
  resetTranscript();
  return;
}

if (
  text.includes("clear pincode") ||
  text.includes("delete pincode") ||
  text.includes("remove pincode")
) {
  window.dispatchEvent(
    new CustomEvent("clearCheckoutField", {
      detail: {
        field: "pincode",
      },
    })
  );

  toast.success("Pincode cleared");
  speak("Pincode cleared");
  resetTranscript();
  return;
}

// =============================
// CHECKOUT VOICE FILL
// =============================

if (
  text.includes("my name is") ||
  text.includes("name is") ||
  text.includes("my phone") ||
  text.includes("phone number") ||
  text.includes("mobile number") ||
  text.includes("my address") ||
  text.includes("address") ||
  text.includes("landmark") ||
  text.includes("pincode") ||
  text.includes("pin code")
) {
  window.dispatchEvent(
    new CustomEvent("voiceCheckoutFill", {
      detail: {
        text,
      },
    })
  );

  toast.success("Checkout details received");

  resetTranscript();

  return;
}
    // =============================
// PAYMENT METHOD
// =============================

if (
  text.includes("cash on delivery") ||
  text.includes("cash payment") ||
  text.includes("pay by cash") ||
  text.includes("cod")
) {
  window.dispatchEvent(
    new CustomEvent("voicePaymentMethod", {
      detail: {
        method: "cod",
      },
    })
  );

  toast.success("Cash on Delivery selected");
  speak("Cash on delivery selected");
  return;
}

if (
  text.includes("upi") ||
  text.includes("upi payment") ||
  text.includes("pay by upi") ||
  text.includes("online payment")
) {
  window.dispatchEvent(
    new CustomEvent("voicePaymentMethod", {
      detail: {
        method: "upi",
      },
    })
  );

  toast.success("UPI Payment selected");
  speak("UPI payment selected");
  return;
}


// =============================
// PLACE ORDER
// =============================

if (
  text.includes("place order") ||
  text.includes("confirm order") ||
  text.includes("order place") ||
  text.includes("place my order") ||
  text.includes("confirm my order")
) {
  window.dispatchEvent(
    new CustomEvent("voicePlaceOrder")
  );

  toast.success("Placing Order");
  speak("Placing your order");
  resetTranscript();

  return;
}

    // =============================
    // Find Product
    // =============================

    console.log("All Products:", products);
    const product = products.find((item) => {
      console.log("Checking:", item.name);
      return text.includes(item.name.toLowerCase());
    });
    if (!product) {
      toast.error("Product not found");
      speak("Sorry, product not found");
      resetTranscript();

      return;
    }

    // =============================
    // Quantity
    // =============================
    let quantity = "1000";
    let unitLabel = "1 kg";

    if (text.includes("2 kg") || text.includes("2 kilo")) {
      quantity = "2000";
      unitLabel = "2 kg";
    } else if (
      text.includes("500 gram") ||
      text.includes("half kilo")
    ) {
      quantity = "500";
      unitLabel = "500 g";
    } else if (
      text.includes("250 gram") ||
      text.includes("quarter kilo")
    ) {
      quantity = "250";
      unitLabel = "250 g";
    }

    // =============================
    // Price
    // =============================
    const finalPrice = Math.round(
      (product.price / 1000) * Number(quantity)
    );

    // =============================
    // Add To Cart
    // =============================
    addToCart({
      ...product,
      quantity,
      unitLabel,
      price: finalPrice,
    });

    toast.success(`${product.name} Added`);
    speak(`${unitLabel} ${product.name} added to cart`);

    resetTranscript();


  }, [finalTranscript, isAwake, products]);

  // =============================
  // Normalize Commands
  // =============================
  const normalizeCommand = (text) => {
    let command = text.toLowerCase();

    const words = {
      tomato: ["tamatar", "tamater"],
      onion: ["pyaz", "pyaaj"],
      potato: ["aloo", "aalu"],
      coriander: ["dhaniya"],
      cabbage: ["patta gobi"],
      cauliflower: ["phool gobi"],
      eggplant: ["baingan", "brinjal"],
      chilli: ["mirchi", "green chilli"],
      ginger: ["adrak"],
      garlic: ["lahsun"],
      egg: ["anda", "ande", "eggs"],
      cart: ["card", "kard", "kaart"],
      checkout: ["check out"],
    };

    Object.entries(words).forEach(([key, list]) => {
      list.forEach((word) => {
        command = command.replaceAll(word, key);
      });
    });

    return command;
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="fixed bottom-6 right-6 bg-red-500 text-white px-4 py-2 rounded-lg">
        Browser does not support Voice Recognition
      </div>
    );
  }
  return (
    <div className="fixed bottom-6 right-6 z-50">

      <button
        onClick={listening ? stopListening : startListening}
        className={`
    fixed bottom-6 right-6 z-50
    relative
    w-16 h-16
    rounded-full
    flex items-center justify-center
    bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-700
    shadow-[0_0_25px_rgba(168,85,247,0.8)]
    transition-all duration-300
    hover:scale-110
    ${listening ? "animate-pulse" : ""}
  `}
      >
        {/* Glow Ring */}
        <span className="absolute inset-0 rounded-full border-2 border-purple-300 opacity-60 animate-ping"></span>

        {/* Inner Glow */}
        <span className="absolute w-10 h-10 rounded-full bg-white/20 blur-md"></span>

        {/* Icon */}
        <span className="relative z-10">
          {listening ? (
            <MicOff size={28} color="white" />
          ) : (
            <Mic size={28} color="white" />
          )}
        </span>
      </button>
      {transcript && (
        <div className="mt-3 w-80 rounded-xl bg-white p-4 shadow-xl">

          <p className="text-xs text-gray-500">
            {listening ? "Listening..." : "You Said"}
          </p>

          <p className="mt-1 break-words text-sm font-medium">
            {transcript}
          </p>

          {isAwake && (
            <p className="mt-2 text-xs font-semibold text-green-600">
              Assistant Active
            </p>
          )}

        </div>
      )}

    </div>
  );
}

export default VoiceAssistant;