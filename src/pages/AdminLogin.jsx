import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../src/firebase";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function AdminLogin() {
  const navigate = useNavigate();

  const handleLogin = async () => {

    const handleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);

    console.log(result.user.email);

    if (result.user.email === "yashwanjari550@gmail.com") {
      console.log("Admin Login Success");

      toast.success("Welcome Admin!");
      navigate("/heera-admin-dashboard");
    } else {
      console.log("Not Admin");

      toast.error("Access Denied!");
      await auth.signOut();
    }
  } catch (error) {
    console.log(error);
    toast.error("Login Failed");
  }
};
    try {
      const result = await signInWithPopup(auth, googleProvider);

      // Sirf tumhara Gmail admin hoga
      if (result.user.email === "yashwanjari550@gmail.com") {
        toast.success("Welcome Admin!");
        navigate("/heera-admin-dashboard");
      } else {
        toast.error("Access Denied!");
        await auth.signOut();
      }
    } catch (error) {
      console.error(error);
      toast.error("Login Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white p-8 rounded-xl shadow-xl w-96 text-center">
        <h1 className="text-3xl font-bold text-green-700 mb-3">
          Heera Admin
        </h1>

        <p className="text-gray-500 mb-6">
          Login with your Admin Google Account
        </p>

        <button
          onClick={handleLogin}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}

export default AdminLogin;