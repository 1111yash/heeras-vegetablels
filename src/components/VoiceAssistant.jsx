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

  // =====================================================
  // LOAD PRODUCTS FROM FIREBASE
  // =====================================================
  useEffect(() => {
    const productRef = ref(db, "products");

    const unsubscribe = onValue(productRef, (snapshot) => {
      if (!snapshot.exists()) {
        setProducts([]);
        console.log("No products found in Firebase");
        return;
      }

      const data = snapshot.val();

      const list = Object.entries(data).map(([id, item]) => ({
        id,
        ...item,
      }));

      setProducts(list);

      console.log("Products Loaded From Firebase:", list);
    });

    // Important:
    // Listener cleanup
    return () => unsubscribe();
  }, []);

  // =====================================================
  // SPEAK
  // =====================================================
  const speak = (text) => {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);

    speech.lang = "en-IN";
    speech.rate = 1;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
  };

  // =====================================================
  // START LISTENING
  // =====================================================
  const startListening = () => {
    resetTranscript();

    setIsAwake(false);

    SpeechRecognition.startListening({
      continuous: true,
      interimResults: false,
      language: "en-IN",
    });

    toast.success("Voice Assistant Started");

    speak("Say hello to start.");
  };

  // =====================================================
  // STOP LISTENING
  // =====================================================
  const stopListening = () => {
    SpeechRecognition.stopListening();

    setIsAwake(false);

    toast("Voice Assistant Stopped");

    speak("Voice assistant stopped");

    resetTranscript();
  };

  // =====================================================
  // PRODUCT ALIASES
  // =====================================================
  const productAliases = {
    tomato: [
      "tomato",
      "tamatar",
      "tamater",
    ],

    potato: [
      "potato",
      "aloo",
      "aalu",
      "alu",
    ],

    onion: [
      "onion",
      "pyaz",
      "pyaaz",
      "piaz",
      "kanda",
    ],

    brinjal: [
      "brinjal",
      "baingan",
      "baigan",
      "eggplant",
      "bringal",
    ],

    cabbage: [
      "cabbage",
      "patta gobi",
      "patta gobhi",
      "cabbage",
    ],

    cauliflower: [
      "cauliflower",
      "phool gobi",
      "phool gobhi",
      "ful gobi",
    ],

    carrot: [
      "carrot",
      "gajar",
      "gazar",
    ],

    cucumber: [
      "cucumber",
      "kheera",
      "khira",
      "kakdi",
    ],

    "lady finger": [
      "lady finger",
      "ladyfinger",
      "bhindi",
      "bhendi",
      "okra",
    ],

    spinach: [
      "spinach",
      "palak",
    ],

    capsicum: [
      "capsicum",
      "shimla mirch",
    ],

    "round gourd(tinda)": [
      "round gourd",
      "tinda",
      "tinde",
    ],

    "green chilli": [
      "green chilli",
      "green chili",
      "chilli",
      "chili",
      "mirchi",
      "hari mirch",
    ],

    garlic: [
      "garlic",
      "lahsun",
      "lehsun",
    ],

    ginger: [
      "ginger",
      "adrak",
      "adrakh",
    ],

    "ivy guard": [
      "ivy guard",
      "ivy gourd",
      "tondli",
      "tendli",
      "tindora",
    ],

    "cluster beans (gavar)": [
      "cluster beans",
      "cluster bean",
      "gavar",
      "gawar",
      "guvar",
    ],

    coriander: [
      "coriander",
      "dhaniya",
      "dhania",
    ],

    "buffalo a2 milk (maroti dairy)": [
      "milk",
      "doodh",
      "buffalo milk",
      "a2 milk",
      "maroti milk",
    ],

    "farm fresh white eggs": [
      "egg",
      "eggs",
      "anda",
      "ande",
      "white eggs",
      "farm fresh eggs",
    ],

    "free range country eggs (देशी अंडे)": [
      "country egg",
      "country eggs",
      "desi egg",
      "desi eggs",
      "देशी अंडे",
    ],

    "orange juice": [
      "orange juice",
      "orange",
      "juice",
      "santra juice",
    ],
  };

  // =====================================================
  // FIND PRODUCT KEY FROM VOICE
  // =====================================================
  const findProductKey = (text) => {
    const command = text.toLowerCase().trim();

    for (const [key, aliases] of Object.entries(productAliases)) {
      const matched = aliases.some((alias) =>
        command.includes(alias.toLowerCase())
      );

      if (matched) {
        return key;
      }
    }

    return null;
  };

  // =====================================================
  // FIND ACTUAL FIREBASE PRODUCT
  // =====================================================
  const findFirebaseProduct = (text) => {
    const command = text.toLowerCase().trim();

    const matchedProductKey = findProductKey(command);

    console.log("Matched Product Key:", matchedProductKey);

    if (!matchedProductKey) {
      return null;
    }

    const product = products.find((item) => {
      const productName = String(item.name || "")
        .toLowerCase()
        .trim();

      // Exact product name
      if (productName === matchedProductKey) {
        return true;
      }

      // Product name contains key
      if (productName.includes(matchedProductKey)) {
        return true;
      }

      // Alias match
      const aliases = productAliases[matchedProductKey];

      if (!aliases) {
        return false;
      }

      return aliases.some((alias) =>
        productName.includes(alias.toLowerCase())
      );
    });

    return product || null;
  };

  // =====================================================
  // PROCESS VOICE COMMAND
  // =====================================================
  useEffect(() => {
    if (!finalTranscript) return;

    const text = finalTranscript.toLowerCase().trim();

    console.log("=================================");
    console.log("VOICE COMMAND:", text);
    console.log("Products Available:", products.length);
    console.log("=================================");

    // ===================================================
    // STOP VOICE ASSISTANT
    // ===================================================
    if (
      text.includes("stop voice assistant") ||
      text.includes("stop assistant") ||
      text.includes("voice assistant stop") ||
      text.includes("stop listening")
    ) {
      SpeechRecognition.stopListening();

      setIsAwake(false);

      toast.success("Voice Assistant Stopped");

      speak("Voice assistant stopped");

      resetTranscript();

      return;
    }

    // ===================================================
    // WAKE WORD
    // ===================================================
    if (!isAwake) {
      if (text.includes("hello")) {
        setIsAwake(true);

        toast.success("I'm Listening");

        speak("Yes. How can I help you?");

        resetTranscript();
      }

      return;
    }

    // ===================================================
    // CART
    // ===================================================
    if (
      text.includes("cart") ||
      text.includes("basket")
    ) {
      navigate("/cart");

      speak("Opening cart");

      toast.success("Opening cart");

      resetTranscript();

      return;
    }

    // ===================================================
    // SCROLL DOWN
    // ===================================================
    if (
      text.includes("scroll down") ||
      text.includes("scrolling down") ||
      text === "down" ||
      text === "next"
    ) {
      window.scrollBy({
        top: 600,
        left: 0,
        behavior: "smooth",
      });

      speak("Scrolling down");

      resetTranscript();

      return;
    }

    // ===================================================
    // SCROLL UP
    // ===================================================
    if (
      text.includes("scroll up") ||
      text.includes("scrolling up") ||
      text === "up" ||
      text === "back"
    ) {
      window.scrollBy({
        top: -600,
        left: 0,
        behavior: "smooth",
      });

      speak("Scrolling up");

      resetTranscript();

      return;
    }

    // ===================================================
    // GO TOP
    // ===================================================
    if (
      text === "top" ||
      text.includes("go to top")
    ) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });

      speak("Going to top");

      resetTranscript();

      return;
    }

    // ===================================================
    // GO BOTTOM
    // ===================================================
    if (
      text === "bottom" ||
      text.includes("go to bottom")
    ) {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        left: 0,
        behavior: "smooth",
      });

      speak("Going to bottom");

      resetTranscript();

      return;
    }

    // ===================================================
    // CHECKOUT
    // ===================================================
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

    // ===================================================
    // HOME
    // ===================================================
    if (
      text === "home" ||
      text.includes("go home") ||
      text.includes("go to home")
    ) {
      navigate("/");

      speak("Going home");

      toast.success("Home");

      resetTranscript();

      return;
    }

    // ===================================================
    // PRODUCTS PAGE
    // ===================================================
    if (
      text === "products" ||
      text === "product" ||
      text === "shop" ||
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

    // ===================================================
    // CLEAR ALL CHECKOUT DETAILS
    // ===================================================
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

    // ===================================================
    // CLEAR NAME
    // ===================================================
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

    // ===================================================
    // CLEAR PHONE
    // ===================================================
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

    // ===================================================
    // CLEAR ADDRESS
    // ===================================================
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

    // ===================================================
    // CLEAR LANDMARK
    // ===================================================
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

    // ===================================================
    // CLEAR PINCODE
    // ===================================================
    if (
      text.includes("clear pincode") ||
      text.includes("delete pincode") ||
      text.includes("remove pincode") ||
      text.includes("clear pin code")
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

    // ===================================================
    // CHECKOUT VOICE FILL
    // ===================================================
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

    // ===================================================
    // CASH ON DELIVERY
    // ===================================================
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

      resetTranscript();

      return;
    }

    // ===================================================
    // UPI
    // ===================================================
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

      resetTranscript();

      return;
    }

    // ===================================================
    // PLACE ORDER
    // ===================================================
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

    // ===================================================
    // PRODUCT COMMAND
    // ===================================================
    console.log("Searching local Firebase products...");

    const product = findFirebaseProduct(text);

    console.log("Matched Firebase Product:", product);

    // ===================================================
    // PRODUCT NOT FOUND
    // ===================================================
    if (!product) {
      toast.error("Product not found");

      speak("Sorry, product not found");

      resetTranscript();

      return;
    }

    // ===================================================
    // OUT OF STOCK
    // ===================================================
    if (product.inStock === false) {
      toast.error(
        `${product.name} is out of stock`
      );

      speak(
        `${product.name} is currently out of stock`
      );

      resetTranscript();

      return;
    }

    // ===================================================
    // QUANTITY
    // ===================================================
    let quantity = 1000;
    let unitLabel = "1 kg";

    // 2 KG
    if (
      text.includes("2 kg") ||
      text.includes("2 kilo") ||
      text.includes("two kg") ||
      text.includes("two kilo")
    ) {
      quantity = 2000;
      unitLabel = "2 kg";
    }

    // 500 GRAM
    else if (
      text.includes("500 gram") ||
      text.includes("500 grams") ||
      text.includes("half kilo") ||
      text.includes("half kg")
    ) {
      quantity = 500;
      unitLabel = "500 g";
    }

    // 250 GRAM
    else if (
      text.includes("250 gram") ||
      text.includes("250 grams") ||
      text.includes("quarter kilo") ||
      text.includes("quarter kg")
    ) {
      quantity = 250;
      unitLabel = "250 g";
    }

    // ===================================================
    // PRODUCT UNIT TYPE
    // ===================================================

    if (product.unitType === "pieces") {
      quantity = 1;
      unitLabel = "1 piece";
    }

    // ===================================================
    // PRICE
    // ===================================================
    let finalPrice = Number(product.price);

    if (product.unitType === "weight") {
      finalPrice = Math.round(
        (Number(product.price) / 1000) *
          quantity
      );
    }

    // ===================================================
    // ADD TO CART
    // ===================================================
    addToCart({
      ...product,
      quantity,
      unitLabel,
      price: finalPrice,
    });

    // ===================================================
    // SUCCESS
    // ===================================================
    toast.success(
      `${product.name} Added`
    );

    speak(
      `${unitLabel} ${product.name} added to cart`
    );

    resetTranscript();

  }, [
    finalTranscript,
    isAwake,
    products,
    addToCart,
    navigate,
  ]);

  // =====================================================
  // BROWSER SUPPORT CHECK
  // =====================================================
  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-red-100 px-4 py-3 text-sm text-red-700 shadow-lg">
        Browser does not support Voice Recognition
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================
  return (
    <div className="fixed bottom-6 right-6 z-50">

      {/* VOICE BUTTON */}
      <button
        onClick={
          listening
            ? stopListening
            : startListening
        }
        aria-label={
          listening
            ? "Stop Voice Assistant"
            : "Start Voice Assistant"
        }
        className={`
          relative
          w-16 h-16
          rounded-full
          flex items-center justify-center
          bg-gradient-to-br
          from-violet-500
          via-purple-600
          to-indigo-700
          shadow-[0_0_25px_rgba(168,85,247,0.8)]
          transition-all
          duration-300
          hover:scale-110
          ${listening ? "animate-pulse" : ""}
        `}
      >

        {/* Glow Ring */}
        <span
          className="
            absolute
            w-14
            h-14
            rounded-full
            border
            border-white/30
          "
        />

        {/* Inner Glow */}
        <span
          className="
            absolute
            w-10
            h-10
            rounded-full
            bg-white/20
            blur-md
          "
        />

        {/* Icon */}
        <span className="relative z-10">
          {listening ? (
            <MicOff
              size={28}
              color="white"
            />
          ) : (
            <Mic
              size={28}
              color="white"
            />
          )}
        </span>
      </button>

      {/* TRANSCRIPT BOX */}
      {transcript && (
        <div
          className="
            absolute
            bottom-20
            right-0
            w-80
            max-w-[90vw]
            rounded-xl
            bg-white
            p-4
            shadow-xl
            border
            border-gray-100
          "
        >

          <p className="text-xs text-gray-500">
            {listening
              ? "Listening..."
              : "You Said"}
          </p>

          <p
            className="
              mt-1
              break-words
              text-sm
              font-medium
              text-gray-800
            "
          >
            {transcript}
          </p>

          {isAwake && (
            <p
              className="
                mt-2
                text-xs
                font-semibold
                text-green-600
              "
            >
              ● Assistant Active
            </p>
          )}

        </div>
      )}

    </div>
  );
}

export default VoiceAssistant;