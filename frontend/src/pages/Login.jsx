import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN,REFRESH_TOKEN } from "../constants";
import { SmallSpinner } from "../components/LoadingSpinner";

function Login() {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading,setIsLoading] = useState(false);
  const navigate = useNavigate();

  const loginUser = async (e) => {
    setIsLoading(true)
    e.preventDefault();    
    setError("");

    try {
      const res = await api.post("/api/token/", { username, password });
      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setError("Invalid username or password.");
    } finally{
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900">
      <div className="bg-gray-800 bg-opacity-80 shadow-2xl rounded-2xl p-10 w-[400px] border border-gray-700 backdrop-blur-md">
        <h1 className="text-3xl font-extrabold text-center text-purple-400 mb-6 tracking-wide">
          Mini GameHub
        </h1>
        <h2 className="text-xl font-semibold text-center text-gray-300 mb-8">
          Log In to Your Account
        </h2>

        <form onSubmit={loginUser} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm text-gray-400 mb-2 font-medium"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your username"
              autoComplete="off"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm text-gray-400 mb-2 font-medium"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              autoComplete="off"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-center text-sm font-medium mt-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 transition-all duration-200 text-white py-2.5 rounded-lg font-semibold tracking-wide"
          >
            Log In
          </button>
        </form>
        {isLoading?<SmallSpinner />:""}
        <p className="text-center text-gray-400 text-sm mt-6">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register/")}
            className="text-purple-400 hover:text-purple-300 cursor-pointer font-medium"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
