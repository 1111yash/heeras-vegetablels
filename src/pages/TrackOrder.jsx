import { useState } from "react";
import { useLocation } from "react-router-dom"; // 👈 सीक्रेट कोड चेक करने के लिए

function TrackOrder() {
  const location = useLocation();
  
  // 🔐 यह चेक करेगा कि क्या URL में '?admin=yash' लिखा है
  const isAdmin = new URLSearchParams(location.search).get("admin") === "yash";

  const [currentStep, setCurrentStep] = useState(() => {
    return Number(localStorage.getItem("orderStep")) || 1;
  });

  const orderDetails = {
    orderId: "HV-2026-9874",
    date: "June 29, 2026",
    time: "03:53 PM",
    address: "📍 Wardha Road, Nagpur, Maharashtra",
    eta: "30 Minutes (Super Fast Delivery)",
  };

  const steps = [
    { id: 1, title: "Order Confirmed", desc: "Your order has been accepted" },
    { id: 2, title: "Packing", desc: "Items are being packed hygienically" },
    { id: 3, title: "Out for Delivery", desc: "Our rider is on the way 🚚" },
    { id: 4, title: "Delivered", desc: "Parcel handed over successfully 🎉" },
  ];

  const handleStepChange = (stepId) => {
    setCurrentStep(stepId);
    localStorage.setItem("orderStep", stepId);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100">
        
        {/* Header */}
        <div className="border-b pb-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">📦 Track Your Order</h1>
          <p className="text-sm text-gray-500 mt-1">
            Order ID: <span className="font-semibold text-green-700">{orderDetails.orderId}</span>
          </p>
        </div>

        {/* Order Summary Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-green-50 p-4 rounded-xl mb-8 text-sm">
          <div>
            <p className="text-gray-600">📍 <span className="font-medium text-gray-800">Delivery Address:</span> {orderDetails.address}</p>
            <p className="text-gray-600 mt-2">📅 <span className="font-medium text-gray-800">Date & Time:</span> {orderDetails.date} | {orderDetails.time}</p>
          </div>
          <div className="md:border-l md:pl-6 flex flex-col justify-center">
            <p className="text-gray-600 font-medium">Estimated Delivery Time (ETA):</p>
            <p className="text-xl font-bold text-green-700">{orderDetails.eta}</p>
          </div>
        </div>

        {/* Tracker Progress Bar */}
        <div className="mb-10">
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

        {/* Direct Action Footer */}
        <div className="border-t pt-5 flex flex-col sm:flex-row justify-between items-center text-sm gap-4">
          <p className="text-gray-600 text-center sm:text-left">
            Want to contact the delivery executive or request a live location?
          </p>
          <div className="flex gap-3 w-full sm:w-auto">
            <a 
              href="tel:+919022271773" 
              className="flex-1 sm:flex-none text-center bg-green-600 text-white font-semibold py-2 px-4 rounded-xl shadow hover:bg-green-700 transition"
            >
              📞 Call Rider
            </a>
            <a 
              href="https://wa.me/919022271773?text=Hi, can I know my live order location?" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none text-center bg-emerald-500 text-white font-semibold py-2 px-4 rounded-xl shadow hover:bg-emerald-600 transition"
            >
              💬 WhatsApp Location
            </a>
          </div>
        </div>

        {/* 🛠️ Admin Testing Control Panel (कस्टमर से छुपा हुआ) */}
        {isAdmin && (
          <div className="mt-12 p-4 bg-gray-100 rounded-xl border border-dashed border-gray-300 text-center">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              🛠️ Admin Test Panel (Change Status Manually)
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {steps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => handleStepChange(step.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition ${
                    currentStep === step.id
                      ? "bg-green-700 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-200 border"
                  }`}
                >
                  {step.id}. {step.title}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default TrackOrder;