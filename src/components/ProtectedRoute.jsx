import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from  "../src/firebase";
import { onAuthStateChanged } from "firebase/auth";

function ProtectedRoute({ children }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return unsubscribe;
  }, []);

  // Auth check hone tak wait
  if (user === undefined) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  // Login nahi hai
  if (!user) {
    return <Navigate to="/heera-admin-login" replace />;
  }

  // Sirf tumhara Gmail allow
  if (user.email !== "yashwanjari550@gmail.com") {
    auth.signOut();
    return <Navigate to="/heera-admin-login" replace />;
  }

  return children;
}

export default ProtectedRoute;