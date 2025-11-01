import { useState } from "react"
import { useNavigate } from "react-router";
import api from "../api";


export const Register = () =>{
    const [username, setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [email,setEmail] = useState('');

    const navigate = useNavigate()

    const [error,setError] = useState('');



    const registerUser = async(e) =>{
    e.preventDefault();
    setError('');

    try{
        const res = await api.post('api/register/',{email,first_name,last_name,username,password,password2});

        if(res.status === 201){
            navigate('/login/');
            setEmail('');
            setFirstName('');
            setLastName('');
            setUsername('');
            setPassword('');
            setPassword2('');
        }
    }catch (err) {
        if (err.response && err.response.data) {
            // Extragem erorile trimise de backend
            const data = err.response.data;

            // Transformăm obiectul într-un array de stringuri ușor de afișat
            const errorMessages = Object.entries(data)
            .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
            .join("\n");

            setError(errorMessages);
        } else {
            setError("Something went wrong. Try again later.");
        }
        }
    }



 return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900">
      <div className="bg-gray-800 bg-opacity-80 shadow-2xl rounded-2xl p-10 w-[450px] border border-gray-700 backdrop-blur-md">
        <h1 className="text-3xl font-extrabold text-center text-purple-400 mb-4 tracking-wide">
          Mini GameHub
        </h1>
        <h2 className="text-xl font-semibold text-center text-gray-300 mb-8">
          Create Your Account
        </h2>

        <form autoComplete='off' onSubmit={registerUser} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="first_name"
                className="block text-sm text-gray-400 mb-2 font-medium"
              >
                First Name
              </label>
              <input
                type="text"
                id="first_name"
                value={first_name}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="John"
                required
              />
            </div>
            <div>
              <label
                htmlFor="last_name"
                className="block text-sm text-gray-400 mb-2 font-medium"
              >
                Last Name
              </label>
              <input
                type="text"
                id="last_name"
                value={last_name}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Doe"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm text-gray-400 mb-2 font-medium"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="example@email.com"
              required
            />
          </div>

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
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="gamer123"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="••••••••"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password2"
                className="block text-sm text-gray-400 mb-2 font-medium"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="password2"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="••••••••"
                required
              />
            </div>
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
            Register
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login/")}
            className="text-purple-400 hover:text-purple-300 cursor-pointer font-medium"
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );


}