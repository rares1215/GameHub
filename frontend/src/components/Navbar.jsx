import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Star,
  User,
  LogOut,
  Gamepad2,
  Menu,
  X,
  LogIn,
  UserPlus,
  PanelTopBottomDashed,
} from "lucide-react";
import { ACCESS_TOKEN } from "../constants";
import { jwtDecode } from "jwt-decode";
import { LoadingSpinner } from "./LoadingSpinner";

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [location]);

  const checkAuth = () => {
    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (!token) {
        setIsAuth(false);
        setIsAdmin(false);
        return;
      }

      const decoded = jwtDecode(token);
      setIsAuth(true);
      setIsAdmin(decoded.is_staff || decoded.is_superuser);
    } catch (error) {
      console.error("Error decoding token:", error);
      setIsAuth(false);
      setIsAdmin(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login/");
  };

  const navItems = isAuth
    ? [
        { label: "Home", icon: <Home size={22} />, path: "/" },
        { label: "Games", icon: <Gamepad2 size={22} />, path: "/games/" },
        { label: "Favorites", icon: <Star size={22} />, path: "/games/favorites/" },
        ...(isAdmin
          ? [
              {
                label: "Admin Panel",
                icon: <PanelTopBottomDashed size={22} />,
                path: "/admin-pannel/",
              },
            ]
          : []),
      ]
    : [
        { label: "Home", icon: <Home size={22} />, path: "/" },
        { label: "Login", icon: <LogIn size={22} />, path: "/login/" },
        { label: "Register", icon: <UserPlus size={22} />, path: "/register/" },
      ];

  return (
    <>
      {/* Sidebar Large Screens */}
      <div className="hidden md:flex fixed left-0 top-0 h-screen w-60 bg-gradient-to-b from-black via-gray-900 to-purple-900 border-r border-gray-800 shadow-lg flex-col justify-between py-8 px-4 z-40">
        {/* Logo */}
        <div className="flex items-center justify-center mb-10">
          <h1
            onClick={() => navigate("/")}
            className="text-2xl font-extrabold text-purple-400 tracking-wider hover:text-purple-300 transition cursor-pointer"
          >
            GameHub
          </h1>
        </div>

        {/* Links */}
        <nav className="flex flex-col space-y-3">
          {navItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className="flex items-center gap-3 text-gray-300 hover:text-purple-400 hover:bg-gray-800/60 px-4 py-2 rounded-lg transition-all duration-200"
            >
              {item.icon}
              <span className="font-medium text-sm tracking-wide">
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        {/* Logout */}

          <div className="mt-auto">
            {isAuth && (
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 text-gray-400 hover:text-red-400 hover:bg-gray-800/60 px-4 py-2 rounded-lg w-full transition-all duration-200"
            >
              <LogOut size={20} />
              <span className="font-medium text-sm">Logout</span>
            </button>)}
          </div>
      </div>

      {/* Mobile Navbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-black/90 border-b border-gray-800 flex items-center justify-between px-5 py-3 z-50">
        <h1
          onClick={() => navigate("/")}
          className="text-xl font-bold text-purple-400 tracking-wide cursor-pointer"
        >
          GameHub
        </h1>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-300 hover:text-purple-400 transition"
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu Slide-out */}
      {isOpen && (
        <div className="md:hidden fixed top-14 left-0 right-0 bg-gray-900 border-t border-gray-800 shadow-lg flex flex-col space-y-3 p-4 z-40 animate-slideDown">
          {navItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                navigate(item.path);
                setIsOpen(false);
              }}
              className="flex items-center gap-3 text-gray-300 hover:text-purple-400 hover:bg-gray-800/70 px-4 py-2 rounded-lg transition-all"
            >
              {item.icon}
              <span className="font-medium text-sm tracking-wide">
                {item.label}
              </span>
            </button>
          ))}

          {isAuth && (
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="flex items-center justify-center gap-2 text-gray-400 hover:text-red-400 hover:bg-gray-800/60 px-4 py-2 rounded-lg transition-all duration-200"
            >
              <LogOut size={20} />
              <span className="font-medium text-sm">Logout</span>
            </button>
          )}
        </div>
      )}
    </>
  );
};
