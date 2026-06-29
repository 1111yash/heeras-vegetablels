import { useState, useEffect } from "react"; 
import { ref, onValue } from "firebase/database";
import { db } from "../src/firebase";

function TrackOrder() {
  const [orderIdInput, setOrderIdInput] = useState(""); 
  const [searchId, setSearchId] = useState(""); 
  const [currentStep, setCurrentStep] = useState(0); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const steps = [
    { id: 1, title: "Order Confirmed", desc: "Your order has been accepted" },
    { id: 2, title: "Packing", desc: "Items are being packed hygienically" },
    { id: 3, title: "Out for Delivery", desc: "Our rider is on the way 🚚" },
    { id: 4, title: "Delivered", desc: "Parcel handed over successfully 🎉" },
  ];

  // फायरबेस से कनेक्ट करने का फंक्शन
  const startTracking = (id) => {
    if (!id.trim()) return;

    setLoading(true);
    setError("");
    setSearchId(id);

    const orderRef = ref(db, `orders/${id.trim()}`);
    
    onValue(orderRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.status) {
        setCurrentStep(Number(data.status));
      } else {
        setCurrentStep(0);
        setError("Order ID या मोबाइल नंबर नहीं मिला! कृपया सही विवरण डालें।");
      }
      setLoading(false);
    });
  };

  const handleTrack = (e) => {
    e.preventDefault();
    startTracking(orderIdInput);
  };

  // ⚡ व्हाट्सएप लिंक से आईडी ऑटोमैटिक उठाने वाला कोड
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const orderIdFromUrl = urlParams.get('id'); // यह लिंक से ?id=9022271773 को पकड़ेगा
    
    if (orderIdFromUrl) {
      setOrderIdInput(orderIdFromUrl); // बॉक्स में नंबर डाल देगा
      startTracking(orderIdFromUrl);   // सीधे ट्रैकिंग चालू कर देगा
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100">
        
        <div className="border-b pb-4 mb-6 text-center sm:text-left">
          <h1 className="text-2xl font-bold text-gray-900">📦 Track Your Order Live</h1>
          <p className="text-sm text-gray-500 mt-1">अपना ऑर्डर स्टेटस लाइव देखने के लिए नीचे अपना मोबाइल नंबर या Order ID डालें</p>
        </div>

        <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            type="text"
            placeholder="Enter Order ID or Mobile Number"
            value={orderIdInput}
            onChange={(e) => setOrderIdInput(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-black outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="bg-green-700 text-white font-bold px-6 py-3 rounded-xl hover:bg-green-800 transition shadow-md"
          >
            {loading ? "Searching..." : "Track Now"}
          </button>
        </form>

        {error && <p className="text-red-500 text-center font-medium mb-6">{error}</p>}

        {currentStep > 0 && (
          <div>
            <div className="bg-green-50 p-4 rounded-xl mb-8 text-sm text-center sm:text-left">
              <p className="text-gray-700 font-medium">Tracking For: <span className="text-green-700 font-bold">#{searchId}</span></p>
              <p className="text-xs text-gray-500 mt-1">Estimated Delivery: Within 30 Minutes</p>
            </div>

            {/* Tracker Progress Bar */}
            <div className="mb-10 mt-6">
              <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center w-full space-y-8 md:space-y-0">
                
                <div className="hidden md:block absolute top-5 left-0 right-0 h-1 bg-gray-200 z-0">
                  <div 
                    className="h-full bg-green-600 transition-all duration-500"
                    style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                  ></div>
                </div>

                {steps.map((step, index) => {
                  const isCompleted = currentStep >= step.id;
                  const isActive = currentStep === step.id;

                  return (
                    <div key={step.id} className="flex md:flex-col items-center z-10 w-full md:w-auto relative">
                      
                      {index !== steps.length - 1 && (
                        <div className={`md:hidden absolute left-5 top-10 w-0.5 h-12 ${
                          currentStep > step.id ? "bg-green-600" : "bg-gray-200"
                        }`}></div>
                      )}

                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all border-2 ${
                        isCompleted 
                          ? "bg-green-600 border-green-600 text-white shadow-md shadow-green-200" 
                          : "bg-white border-gray-300 text-gray-400"
                      } ${isActive ? "ring-4 ring-green-100 animate-pulse" : ""}`}>
                        {isCompleted ? "✓" : step.id}
                      </div>

                      <div className="ml-4 md:ml-0 md:text-center mt-0 md:mt-3">
                        <h4 className={`font-bold text-base ${isCompleted ? "text-green-700" : "text-gray-500"}`}>
                          {step.title}
                        </h4>
                        <p className="text-xs text-gray-400 font-medium mt-0.5">{step.desc}</p>
                      </div>

                    </div>
                  );
                })}

              </div>
            </div>

            <div className="border-t pt-5 flex flex-col sm:flex-row justify-between items-center text-sm gap-4">
              <p className="text-gray-600 text-center sm:text-left">Want to contact the delivery rider?</p>
              <div className="flex gap-3 w-full sm:w-auto">
                <a href="tel:+919022271773" className="flex-1 sm:flex-none text-center bg-green-600 text-white font-semibold py-2 px-4 rounded-xl shadow hover:bg-green-700 transition">📞 Call Rider</a>
                <a href="https://wa.me/919022271773" target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none text-center bg-emerald-500 text-white font-semibold py-2 px-4 rounded-xl shadow hover:bg-emerald-600 transition">💬 WhatsApp</a>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default TrackOrder;