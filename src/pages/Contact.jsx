function Contact() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold text-center text-green-700 mb-8">
        📞 Contact Us
      </h1>

      <div className="bg-white shadow-xl rounded-xl p-8">

        <form
          action="https://formsubmit.co/yashwanjari550@gmail.com"
          method="POST"
          className="space-y-5"
        >
          {/* FormSubmit Settings */}
          <input type="hidden" name="_captcha" value="false" />

          <input
            type="hidden"
            name="_next"
            value="https://heeras-vegetablels.vercel.app/"
          />

          <input
            type="hidden"
            name="_subject"
            value="New Contact Form Submission"
          />

          {/* Name */}
          <div>
            <label className="block mb-2 font-semibold">
              👤 Full Name
            </label>

            <input
              type="text"
              name="Name"
              required
              placeholder="Enter your full name"
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          {/* Mobile */}
          <div>
            <label className="block mb-2 font-semibold">
              📱 Mobile Number
            </label>

            <input
              type="tel"
              name="Mobile"
              required
              placeholder="Enter your mobile number"
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 font-semibold">
              📧 Email
            </label>

            <input
              type="email"
              name="Email"
              placeholder="Enter your email (optional)"
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block mb-2 font-semibold">
              ⭐ Rate Our Service
            </label>

            <select
              name="Rating"
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <option value="⭐⭐⭐⭐⭐">⭐⭐⭐⭐⭐ Excellent</option>
              <option value="⭐⭐⭐⭐">⭐⭐⭐⭐ Very Good</option>
              <option value="⭐⭐⭐">⭐⭐⭐ Good</option>
              <option value="⭐⭐">⭐⭐ Average</option>
              <option value="⭐">⭐ Poor</option>
            </select>
          </div>

          {/* Message */}
          <div>
            <label className="block mb-2 font-semibold">
              💬 Feedback / Message
            </label>

            <textarea
              name="Message"
              rows="5"
              required
              placeholder="Write your message..."
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
            ></textarea>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold text-lg transition"
          >
            📩 Send Message
          </button>
        </form>

      </div>
    </div>
  );
}

export default Contact;