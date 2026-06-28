import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-7xl font-bold text-green-700">404</h1>

      <h2 className="text-3xl font-semibold mt-4">
        Oops! Page Not Found
      </h2>

      <p className="text-gray-600 mt-2">
        The page you are looking for doesn't exist.
      </p>

      <Link
        to="/"
        className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
      >
        🏠 Back to Home
      </Link>
    </div>
  );
}

export default NotFound;