function Delivery() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold text-green-700 mb-8 text-center">
        🚚 Delivery Information
      </h1>

      <div className="bg-white shadow-xl rounded-xl p-8 space-y-8">

        {/* Delivery Area */}
        <div>
          <h2 className="text-2xl font-bold text-green-700">
            📍 Delivery Area
          </h2>

          <p className="mt-2 text-gray-700">
            We currently deliver fresh vegetables across
            <strong> Nagpur, Maharashtra.</strong>
          </p>
        </div>

        {/* PIN Code */}
        <div>
          <h2 className="text-2xl font-bold text-green-700">
            📮 Serviceable PIN Codes
          </h2>

          <p className="mt-2 text-gray-700">
            Delivery is available for all serviceable PIN codes in Nagpur.
          </p>

          <p className="text-gray-700">
            PIN Code Range: <strong>440001 – 440037</strong>
          </p>
        </div>

        {/* Delivery Charges */}
        <div>
          <h2 className="text-2xl font-bold text-green-700">
            🚚 Delivery Charges
          </h2>

          <ul className="list-disc pl-6 mt-2 text-gray-700 space-y-2">
            <li>₹20 Delivery Charge on orders below ₹199.</li>
            <li>🎉 FREE Delivery on orders of ₹199 or above.</li>
          </ul>
        </div>

        {/* Delivery Time */}
        <div>
          <h2 className="text-2xl font-bold text-green-700">
            ⏰ Delivery Time
          </h2>

          <ul className="list-disc pl-6 mt-2 text-gray-700 space-y-2">
            <li>Same Day Delivery Available.</li>
            <li>Estimated Delivery Time: 2–4 Hours.</li>
            <li>Delivery Hours: 8:00 AM – 8:00 PM.</li>
          </ul>
        </div>

        {/* Terms */}
        <div>
          <h2 className="text-2xl font-bold text-green-700">
            📦 Delivery Terms
          </h2>

          <ul className="list-disc pl-6 mt-2 text-gray-700 space-y-2">
            <li>Fresh vegetables are packed hygienically.</li>
            <li>Please check your order at the time of delivery.</li>
            <li>Orders are delivered only within Nagpur city limits.</li>
            <li>Delivery time may vary during heavy rain or festivals.</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h2 className="text-2xl font-bold text-green-700">
            📞 Need Help?
          </h2>

          <p className="mt-2 text-gray-700">
            Email: <strong>yashwanjari550@gmail.com</strong>
          </p>

          <p className="text-gray-700">
            For delivery-related queries, please contact us through WhatsApp or Call.
          </p>
        </div>

      </div>
    </div>
  );
}

export default Delivery;