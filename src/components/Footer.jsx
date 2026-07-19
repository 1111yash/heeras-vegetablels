import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-green-800 text-white mt-16">

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Logo & About */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img
              src="/Logos.png"
              alt="Logo"
              className="w-12 h-12 object-contain"
            />

            <h2 className="text-2xl font-bold">
              Hira's Veg Mart
            </h2>
          </div>

          <p className="text-green-100">
            Fresh vegetables, fruits, dairy products and juices
            delivered directly to your doorstep with quality
            you can trust.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4">
            Quick Links
          </h3>

          <div className="space-y-2">
            <Link to="/">Home</Link><br />
            <Link to="/products">Products</Link><br />
            <Link to="/delivery">Delivery</Link><br />
            <Link to="/track-order">Track Order</Link><br />
            <Link to="/contact">Contact</Link>
          </div>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-xl font-semibold mb-4">
            Customer Support
          </h3>

          <div className="space-y-2">
            <p>Privacy Policy</p>
            <p>Refund Policy</p>
            <p>Terms & Conditions</p>
            <p>FAQs</p>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xl font-semibold mb-4">
            Contact Us
          </h3>

          <div className="space-y-3">

            <div className="flex items-center gap-2">
              <MapPin size={18} />
              Nagpur, Maharashtra
            </div>

            <div className="flex items-center gap-2">
              <Phone size={18} />
              +91 9022271773
            </div>

            <div className="flex items-center gap-2">
              <Mail size={18} />
              support@hirasvegmart.in
            </div>

            <div className="flex gap-4 pt-3">



              <div className="flex gap-4 pt-3">
                <FaFacebook className="text-2xl hover:text-yellow-300 cursor-pointer transition" />
                <FaInstagram className="text-2xl hover:text-yellow-300 cursor-pointer transition" />
                <FaWhatsapp className="text-2xl hover:text-yellow-300 cursor-pointer transition" />
              </div>
            </div>

          </div>
        </div>

      </div>

      <div className="border-t border-green-700 py-5 text-center text-green-100">

        © 2026 Hira's Veg Mart. All Rights Reserved.

      </div>

    </footer>
  );
}
