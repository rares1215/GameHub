import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { SmallSpinner } from "./LoadingSpinner";

function ProtectedRoute({ children, requireAdmin = false }) {
  const [isAuth, setIsAuth] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    validateAuth().catch(() => setIsAuth(false));
  }, [location]);

  const refreshToken = async () => {
    const refresh = localStorage.getItem(REFRESH_TOKEN);
    try {
      const res = await api.post("api/token/refresh/", { refresh });
      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        const decoded = jwtDecode(res.data.access);
        setIsAdmin(decoded.is_staff || decoded.is_superuser);
        setIsAuth(true);
      } else setIsAuth(false);
    } catch (err) {
      console.error("Refresh token failed:", err);
      setIsAuth(false);
    }
  };

  const validateAuth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setIsAuth(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        await refreshToken();
      } else {
        setIsAdmin(decoded.is_staff || decoded.is_superuser);
        setIsAuth(true);
      }
    } catch (err) {
      console.error("Token validation failed:", err);
      setIsAuth(false);
    }
  };

  if (isAuth === null)
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <SmallSpinner />
      </div>
    );

  if (requireAdmin && !isAdmin) return <Navigate to="/" />;

  return isAuth ? children : <Navigate to="/login/" />;
}

export default ProtectedRoute;
