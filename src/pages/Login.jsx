import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../src/firebase";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";




export default function Login() {

  const navigate = useNavigate();

   const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
  if (loading) return;

  setLoading(true);

  try {
    await signInWithPopup(auth, googleProvider);

    toast.success("Login Successful 🎉");
    navigate("/");
    
  }  finally {
    setLoading(false);
  }
};
  return (<div className="min-h-screen bg-[linear-gradient(135deg,#0b8f3a,#18c74f,#9be215)] flex justify-center items-center px-5">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md border border-green-100">

        <div className="text-center">

          <img
            src="/Logos.png"
            className="w-24 h-24 mx-auto rounded-full shadow-lg"
            alt="logo"
          />

          <h1 className="text-4xl font-extrabold text-green-700 mt-5">
            Welcome
          </h1>

          <p className="text-gray-500 mt-2">
            Login to Hira's Veg Mart
          </p>

        </div>

       <button
  onClick={handleGoogleLogin}
  disabled={loading}
  className="w-full mt-8 flex items-center justify-center gap-3 border border-gray-300 rounded-xl py-3 bg-white hover:bg-gray-50 hover:shadow-md transition"
>
  <FcGoogle size={24} />
  <span className="font-semibold">
    {loading ? "Signing In..." : "Continue with Google"}
  </span>
</button>
        <div className="flex items-center gap-3 my-7">
          <hr className="flex-1" />
          <span className="text-gray-400 text-sm">
            OR
          </span>
          <hr className="flex-1" />
        </div>

        <button
          className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold transition"
        >
          Continue with Email
        </button>

        <p className="text-center text-gray-500 mt-8 text-sm">
          Fresh Vegetables • Fruits • Dairy • Juices • Eggs
        </p>

      </div>

    </div>
  );
}