import { auth } from "../src/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Profile() {
  const navigate = useNavigate();

  const user = auth.currentUser;

  const handleLogout = async () => {
    await signOut(auth);
    toast.success("Logged Out Successfully");
    navigate("/");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-red-500">
          Please Login First
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 py-10 px-5">

      <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl p-8">

        <div className="text-center">

          <img
            src={user.photoURL}
            alt="Profile"
            className="w-32 h-32 rounded-full mx-auto border-4 border-green-500"
          />

          <h1 className="text-3xl font-bold text-green-700 mt-5">
            {user.displayName}
          </h1>

          <p className="text-gray-500 mt-2">
            {user.email}
          </p>

        </div>

        <div className="mt-8 space-y-4">

          <div className="bg-green-100 rounded-xl p-4">
            <p className="text-gray-600">Name</p>
            <h2 className="font-bold text-lg">
              {user.displayName}
            </h2>
          </div>

          <div className="bg-green-100 rounded-xl p-4">
            <p className="text-gray-600">Email</p>
            <h2 className="font-bold text-lg">
              {user.email}
            </h2>
          </div>

        </div>

        <button
          onClick={handleLogout}
          className="mt-8 w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-bold"
        >
          Logout
        </button>

      </div>

    </div>
  );
}