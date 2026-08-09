import { useState, useEffect, useRef } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../src/firebase";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

function VoiceAssistant() {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [isAwake, setIsAwake] = useState(false);

  // =====================================================
  // MOBILE VOICE CONTROL REFS
  // =====================================================

  const isSpeakingRef = useRef(false);
  const shouldListenRef = useRef(false);
  const restartTimerRef = useRef(null);

  // =====================================================
  // SPEECH RECOGNITION
  // =====================================================

  const {
    transcript,
    finalTranscript,
    listening,
    browserSupportsSpeechRecognition,
    resetTranscript,
  } = useSpeechRecognition();

  // =====================================================
  // LOAD PRODUCTS
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

      console.log(
        "Products Loaded From Firebase:",
        list
      );
    });

    return () => {
      unsubscribe();

      if (restartTimerRef.current) {
        clearTimeout(restartTimerRef.current);
      }
    };
  }, []);

  // =====================================================
  // STOP MICROPHONE
  // =====================================================

  const stopMicrophone = () => {
    try {
      SpeechRecognition.stopListening();
    } catch (error) {
      console.log(
        "Stop microphone error:",
        error
      );
    }
  };

  // =====================================================
  // START MICROPHONE AFTER TTS
  // =====================================================

  const startMicrophoneAfterSpeech = () => {
    if (!shouldListenRef.current) {
      return;
    }

    if (isSpeakingRef.current) {
      return;
    }

    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current);
    }

    restartTimerRef.current = setTimeout(() => {
      if (
        shouldListenRef.current &&
        !isSpeakingRef.current
      ) {
        try {
          resetTranscript();

          SpeechRecognition.startListening({
            continuous: true,
            interimResults: false,
            language: "en-IN",
          });

          console.log(
            "🎤 Microphone started"
          );
        } catch (error) {
          console.log(
            "Start microphone error:",
            error
          );
        }
      }
    }, 400);
  };

  // =====================================================
  // SPEAK
  // =====================================================

  const speak = (
    text,
    resumeListening = true
  ) => {
    return new Promise((resolve) => {
      shouldListenRef.current =
        resumeListening;

      // IMPORTANT:
      // Stop microphone BEFORE assistant speaks
      stopMicrophone();

      if (!("speechSynthesis" in window)) {
        isSpeakingRef.current = false;

        if (resumeListening) {
          startMicrophoneAfterSpeech();
        }

        resolve();
        return;
      }

      window.speechSynthesis.cancel();

      isSpeakingRef.current = true;

      const speech =
        new SpeechSynthesisUtterance(text);

      speech.lang = "en-IN";
      speech.rate = 1;
      speech.pitch = 1;

      speech.onstart = () => {
        console.log(
          "🔊 Assistant:",
          text
        );
      };

      speech.onend = () => {
        console.log(
          "🔊 Assistant finished"
        );

        isSpeakingRef.current = false;

        if (resumeListening) {
          startMicrophoneAfterSpeech();
        }

        resolve();
      };

      speech.onerror = (error) => {
        console.log(
          "Speech synthesis error:",
          error
        );

        isSpeakingRef.current = false;

        if (resumeListening) {
          startMicrophoneAfterSpeech();
        }

        resolve();
      };

      window.speechSynthesis.speak(
        speech
      );
    });
  };

  // =====================================================
  // START ASSISTANT
  // =====================================================

  const startListening = async () => {
    shouldListenRef.current = true;

    setIsAwake(false);

    resetTranscript();

    stopMicrophone();

    toast.success(
      "Voice Assistant Started"
    );

    // Mic starts ONLY after this speech finishes
    await speak(
      "Say hello to start.",
      true
    );
  };

  // =====================================================
  // STOP ASSISTANT
  // =====================================================

  const stopListening = async () => {
    shouldListenRef.current = false;

    setIsAwake(false);

    stopMicrophone();

    resetTranscript();

    if (restartTimerRef.current) {
      clearTimeout(
        restartTimerRef.current
      );
    }

    toast(
      "Voice Assistant Stopped"
    );

    await speak(
      "Voice assistant stopped.",
      false
    );
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
  // FIND PRODUCT KEY
  // =====================================================

  const findProductKey = (text) => {
    const command =
      text.toLowerCase().trim();

    for (const [key, aliases] of Object.entries(
      productAliases
    )) {
      const matched = aliases.some(
        (alias) =>
          command.includes(
            alias.toLowerCase()
          )
      );

      if (matched) {
        return key;
      }
    }

    return null;
  };

  // =====================================================
  // FIND FIREBASE PRODUCT
  // =====================================================

  const findFirebaseProduct = (text) => {
    const command =
      text.toLowerCase().trim();

    const matchedProductKey =
      findProductKey(command);

    console.log(
      "Matched Product Key:",
      matchedProductKey
    );

    if (!matchedProductKey) {
      return null;
    }

    const product = products.find(
      (item) => {
        const productName = String(
          item.name || ""
        )
          .toLowerCase()
          .trim();

        if (
          productName ===
          matchedProductKey
        ) {
          return true;
        }

        if (
          productName.includes(
            matchedProductKey
          )
        ) {
          return true;
        }

        const aliases =
          productAliases[
            matchedProductKey
          ];

        if (!aliases) {
          return false;
        }

        return aliases.some(
          (alias) =>
            productName.includes(
              alias.toLowerCase()
            )
        );
      }
    );

    return product || null;
  };

  // =====================================================
  // PROCESS COMMAND
  // =====================================================

  useEffect(() => {
    if (!finalTranscript) {
      return;
    }

    // Assistant बोल रहा है तो ignore
    if (isSpeakingRef.current) {
      console.log(
        "Ignoring assistant voice:",
        finalTranscript
      );

      resetTranscript();
      return;
    }

    const text =
      finalTranscript
        .toLowerCase()
        .trim();

    if (!text) {
      return;
    }

    console.log(
      "================================="
    );

    console.log(
      "🎤 VOICE COMMAND:",
      text
    );

    console.log(
      "AWAKE:",
      isAwake
    );

    console.log(
      "PRODUCTS:",
      products.length
    );

    console.log(
      "================================="
    );

    // ===================================================
    // STOP ASSISTANT
    // ===================================================

    if (
      text.includes(
        "stop voice assistant"
      ) ||
      text.includes(
        "stop assistant"
      ) ||
      text.includes(
        "voice assistant stop"
      ) ||
      text.includes(
        "stop listening"
      )
    ) {
      shouldListenRef.current =
        false;

      stopMicrophone();

      setIsAwake(false);

      resetTranscript();

      toast.success(
        "Voice Assistant Stopped"
      );

      speak(
        "Voice assistant stopped.",
        false
      );

      return;
    }

    // ===================================================
    // HELLO / WAKE WORD
    // ===================================================

    if (!isAwake) {
      if (
        text.includes("hello") ||
        text.includes("helo") ||
        text.includes("hallo")
      ) {
        setIsAwake(true);

        toast.success(
          "I'm Listening"
        );

        resetTranscript();

        // VERY IMPORTANT:
        // No processing lock here.
        // After TTS, next command is allowed.

        speak(
          "Yes. How can I help you?",
          true
        );
      } else {
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
      stopMicrophone();

      navigate("/cart");

      toast.success(
        "Opening cart"
      );

      resetTranscript();

      speak(
        "Opening cart.",
        true
      );

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
      stopMicrophone();

      window.scrollBy({
        top: 600,
        left: 0,
        behavior: "smooth",
      });

      toast.success(
        "Scrolling down"
      );

      resetTranscript();

      speak(
        "Scrolling down.",
        true
      );

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
      stopMicrophone();

      window.scrollBy({
        top: -600,
        left: 0,
        behavior: "smooth",
      });

      toast.success(
        "Scrolling up"
      );

      resetTranscript();

      speak(
        "Scrolling up.",
        true
      );

      return;
    }

    // ===================================================
    // TOP
    // ===================================================

    if (
      text === "top" ||
      text.includes("go to top")
    ) {
      stopMicrophone();

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });

      toast.success(
        "Going to top"
      );

      resetTranscript();

      speak(
        "Going to top.",
        true
      );

      return;
    }

    // ===================================================
    // BOTTOM
    // ===================================================

    if (
      text === "bottom" ||
      text.includes("go to bottom")
    ) {
      stopMicrophone();

      window.scrollTo({
        top:
          document.documentElement
            .scrollHeight,
        left: 0,
        behavior: "smooth",
      });

      toast.success(
        "Going to bottom"
      );

      resetTranscript();

      speak(
        "Going to bottom.",
        true
      );

      return;
    }

    // ===================================================
    // CHECKOUT
    // ===================================================

    if (
      text.includes("checkout") ||
      text.includes("check out") ||
      text.includes(
        "proceed to payment"
      ) ||
      text.includes(
        "proceed payment"
      )
    ) {
      stopMicrophone();

      navigate("/checkout");

      toast.success(
        "Proceed to Payment"
      );

      resetTranscript();

      speak(
        "Opening checkout.",
        true
      );

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
      stopMicrophone();

      navigate("/");

      toast.success("Home");

      resetTranscript();

      speak(
        "Going home.",
        true
      );

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
      text.includes(
        "go to product page"
      ) ||
      text.includes(
        "open products"
      ) ||
      text.includes(
        "open product page"
      ) ||
      text.includes(
        "go products"
      )
    ) {
      stopMicrophone();

      navigate("/products");

      toast.success(
        "Opening Product Page"
      );

      resetTranscript();

      speak(
        "Opening product page.",
        true
      );

      return;
    }

    // ===================================================
    // CLEAR ALL CHECKOUT
    // ===================================================

    if (
      text.includes(
        "clear all details"
      ) ||
      text.includes(
        "delete all details"
      ) ||
      text.includes(
        "clear checkout"
      ) ||
      text.includes(
        "reset checkout"
      )
    ) {
      stopMicrophone();

      window.dispatchEvent(
        new CustomEvent(
          "clearCheckoutField",
          {
            detail: {
              field: "all",
            },
          }
        )
      );

      toast.success(
        "All checkout details cleared"
      );

      resetTranscript();

      speak(
        "All checkout details cleared.",
        true
      );

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
      stopMicrophone();

      window.dispatchEvent(
        new CustomEvent(
          "clearCheckoutField",
          {
            detail: {
              field: "name",
            },
          }
        )
      );

      toast.success(
        "Name cleared"
      );

      resetTranscript();

      speak(
        "Name cleared.",
        true
      );

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
      stopMicrophone();

      window.dispatchEvent(
        new CustomEvent(
          "clearCheckoutField",
          {
            detail: {
              field: "phone",
            },
          }
        )
      );

      toast.success(
        "Phone cleared"
      );

      resetTranscript();

      speak(
        "Phone number cleared.",
        true
      );

      return;
    }

    // ===================================================
    // CLEAR ADDRESS
    // ===================================================

    if (
      text.includes(
        "clear address"
      ) ||
      text.includes(
        "delete address"
      ) ||
      text.includes(
        "remove address"
      )
    ) {
      stopMicrophone();

      window.dispatchEvent(
        new CustomEvent(
          "clearCheckoutField",
          {
            detail: {
              field: "address",
            },
          }
        )
      );

      toast.success(
        "Address cleared"
      );

      resetTranscript();

      speak(
        "Address cleared.",
        true
      );

      return;
    }

    // ===================================================
    // CLEAR LANDMARK
    // ===================================================

    if (
      text.includes(
        "clear landmark"
      ) ||
      text.includes(
        "delete landmark"
      ) ||
      text.includes(
        "remove landmark"
      )
    ) {
      stopMicrophone();

      window.dispatchEvent(
        new CustomEvent(
          "clearCheckoutField",
          {
            detail: {
              field: "landmark",
            },
          }
        )
      );

      toast.success(
        "Landmark cleared"
      );

      resetTranscript();

      speak(
        "Landmark cleared.",
        true
      );

      return;
    }

    // ===================================================
    // CLEAR PINCODE
    // ===================================================

    if (
      text.includes(
        "clear pincode"
      ) ||
      text.includes(
        "delete pincode"
      ) ||
      text.includes(
        "remove pincode"
      ) ||
      text.includes(
        "clear pin code"
      )
    ) {
      stopMicrophone();

      window.dispatchEvent(
        new CustomEvent(
          "clearCheckoutField",
          {
            detail: {
              field: "pincode",
            },
          }
        )
      );

      toast.success(
        "Pincode cleared"
      );

      resetTranscript();

      speak(
        "Pincode cleared.",
        true
      );

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
      stopMicrophone();

      window.dispatchEvent(
        new CustomEvent(
          "voiceCheckoutFill",
          {
            detail: {
              text,
            },
          }
        )
      );

      toast.success(
        "Checkout details received"
      );

      resetTranscript();

      startMicrophoneAfterSpeech();

      return;
    }

    // ===================================================
    // CASH ON DELIVERY
    // ===================================================

    if (
      text.includes(
        "cash on delivery"
      ) ||
      text.includes(
        "cash payment"
      ) ||
      text.includes(
        "pay by cash"
      ) ||
      text.includes("cod")
    ) {
      stopMicrophone();

      window.dispatchEvent(
        new CustomEvent(
          "voicePaymentMethod",
          {
            detail: {
              method: "cod",
            },
          }
        )
      );

      toast.success(
        "Cash on Delivery selected"
      );

      resetTranscript();

      speak(
        "Cash on delivery selected.",
        true
      );

      return;
    }

    // ===================================================
    // UPI
    // ===================================================

    if (
      text.includes("upi") ||
      text.includes(
        "upi payment"
      ) ||
      text.includes(
        "pay by upi"
      ) ||
      text.includes(
        "online payment"
      )
    ) {
      stopMicrophone();

      window.dispatchEvent(
        new CustomEvent(
          "voicePaymentMethod",
          {
            detail: {
              method: "upi",
            },
          }
        )
      );

      toast.success(
        "UPI Payment selected"
      );

      resetTranscript();

      speak(
        "UPI payment selected.",
        true
      );

      return;
    }

    // ===================================================
    // PLACE ORDER
    // ===================================================

    if (
      text.includes(
        "place order"
      ) ||
      text.includes(
        "confirm order"
      ) ||
      text.includes(
        "order place"
      ) ||
      text.includes(
        "place my order"
      ) ||
      text.includes(
        "confirm my order"
      )
    ) {
      stopMicrophone();

      window.dispatchEvent(
        new CustomEvent(
          "voicePlaceOrder"
        )
      );

      toast.success(
        "Placing Order"
      );

      resetTranscript();

      speak(
        "Placing your order.",
        true
      );

      return;
    }

    // ===================================================
    // PRODUCT COMMAND
    // ===================================================

    console.log(
      "Searching local Firebase products..."
    );

    const product =
      findFirebaseProduct(text);

    console.log(
      "Matched Firebase Product:",
      product
    );

    // ===================================================
    // PRODUCT NOT FOUND
    // ===================================================

    if (!product) {
      toast.error(
        "Product not found"
      );

      resetTranscript();

      speak(
        "Sorry, product not found.",
        true
      );

      return;
    }

    // ===================================================
    // OUT OF STOCK
    // ===================================================

    if (product.inStock === false) {
      toast.error(
        `${product.name} is out of stock`
      );

      resetTranscript();

      speak(
        `${product.name} is currently out of stock.`,
        true
      );

      return;
    }

    // ===================================================
    // QUANTITY
    // ===================================================

    let quantity = 1000;
    let unitLabel = "1 kg";

    if (
      text.includes("2 kg") ||
      text.includes("2 kilo") ||
      text.includes("two kg") ||
      text.includes("two kilo")
    ) {
      quantity = 2000;
      unitLabel = "2 kg";
    } else if (
      text.includes("500 gram") ||
      text.includes("500 grams") ||
      text.includes("half kilo") ||
      text.includes("half kg")
    ) {
      quantity = 500;
      unitLabel = "500 g";
    } else if (
      text.includes("250 gram") ||
      text.includes("250 grams") ||
      text.includes(
        "quarter kilo"
      ) ||
      text.includes(
        "quarter kg"
      )
    ) {
      quantity = 250;
      unitLabel = "250 g";
    }

    // ===================================================
    // PIECES
    // ===================================================

    if (
      product.unitType ===
      "pieces"
    ) {
      quantity = 1;
      unitLabel = "1 piece";
    }

    // ===================================================
    // PRICE
    // ===================================================

    let finalPrice =
      Number(product.price);

    if (
      product.unitType ===
      "weight"
    ) {
      finalPrice = Math.round(
        (Number(product.price) /
          1000) *
          quantity
      );
    }

    // ===================================================
    // ADD TO CART
    // ===================================================

    stopMicrophone();

    addToCart({
      ...product,
      quantity,
      unitLabel,
      price: finalPrice,
    });

    toast.success(
      `${product.name} Added`
    );

    resetTranscript();

    speak(
      `${unitLabel} ${product.name} added to cart.`,
      true
    );
  }, [
    finalTranscript,
    isAwake,
    products,
    addToCart,
    navigate,
  ]);

  // =====================================================
  // BROWSER SUPPORT
  // =====================================================

  if (!browserSupportsSpeechRecognition) {
    return (
      <div>
        Browser does not support Voice
        Recognition
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
  <>
    {/* =================================================
        FIXED AI VOICE ASSISTANT
        Desktop + Mobile
    ================================================= */}

    <div
      className="
        fixed
        right-4
        bottom-5
        sm:right-6
        sm:bottom-6
        md:right-7
        md:bottom-7
        lg:right-8
        lg:bottom-8
        z-[9999]
      "
    >

      {/* =================================================
          PREMIUM AI BUTTON
      ================================================= */}

      <button
        onClick={
          listening
            ? stopListening
            : startListening
        }
        aria-label={
          listening
            ? "Stop AI Voice Assistant"
            : "Start AI Voice Assistant"
        }
        className={`
          relative
          w-16
          h-16
          sm:w-[68px]
          sm:h-[68px]
          rounded-full
          flex
          items-center
          justify-center
          overflow-visible
          transition-all
          duration-500
          ease-out
          active:scale-90
          hover:scale-105

          ${
            listening
              ? `
                bg-gradient-to-br
                from-red-500
                via-red-600
                to-purple-700
                shadow-[0_0_30px_rgba(239,68,68,0.65),0_0_50px_rgba(124,58,237,0.35)]
              `
              : `
                bg-gradient-to-br
                from-violet-500
                via-purple-600
                to-indigo-700
                shadow-[0_0_25px_rgba(139,92,246,0.60)]
              `
          }
        `}
      >

        {/* OUTER RING */}

        <span
          className={`
            absolute
            -inset-[2px]
            rounded-full
            border
            transition-all
            duration-500

            ${
              listening
                ? "border-red-300/70"
                : "border-violet-300/40"
            }
          `}
        />

        {/* INNER GLASS RING */}

        <span
          className="
            absolute
            inset-[4px]
            rounded-full
            border
            border-white/15
            pointer-events-none
          "
        />

        {/* LIGHT REFLECTION */}

        <span
          className="
            absolute
            top-[7px]
            left-[14px]
            w-7
            h-3
            rounded-full
            bg-white/20
            blur-[5px]
            rotate-[-20deg]
            pointer-events-none
          "
        />

        {/* AI GLOW */}

        <span
          className={`
            absolute
            w-10
            h-10
            rounded-full
            blur-lg
            transition-all
            duration-500

            ${
              listening
                ? "bg-red-300/30"
                : "bg-purple-300/25"
            }
          `}
        />

        {/* AI TEXT */}

        <span
          className="
            relative
            z-10
            select-none
            font-black
            text-[18px]
            sm:text-[19px]
            tracking-[0.12em]
            text-white
            drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]
          "
        >
          AI
        </span>

        {/* STATUS DOT */}

        <span
          className={`
            absolute
            -right-[1px]
            -bottom-[1px]
            w-[17px]
            h-[17px]
            rounded-full
            border-[2px]
            border-white
            shadow-lg
            z-20
            transition-all
            duration-300

            ${
              listening
                ? "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.95)]"
                : "bg-purple-400 shadow-[0_0_8px_rgba(167,139,250,0.8)]"
            }
          `}
        />

        {/* ACTIVE PULSE */}

        {listening && (
          <span
            className="
              absolute
              -inset-2
              rounded-full
              border
              border-red-400/30
              animate-ping
              pointer-events-none
            "
          />
        )}

      </button>

      {/* =================================================
          TRANSCRIPT
      ================================================= */}

      {transcript && (
        <div
          className="
            absolute
            bottom-[76px]
            right-0
            w-[290px]
            max-w-[calc(100vw-32px)]
            rounded-2xl
            bg-white
            p-4
            shadow-2xl
            border
            border-gray-100
            z-[10000]
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
  </>
);
}

export default VoiceAssistant;