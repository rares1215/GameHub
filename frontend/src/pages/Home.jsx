import { useNavigate } from "react-router";



function Home(){
    const navigate = useNavigate();

        return (
            <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 flex flex-col items-center justify-center text-center px-6">
            {/* Hero Section */}
            <div className="max-w-3xl">
                <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 drop-shadow-lg">
                Welcome to Mini GameHub
                </h1>
                <p className="text-gray-300 text-lg md:text-xl mt-6 leading-relaxed">
                Discover, review, and discuss your favorite games.  
                Join a growing community of gamers who share the same passion as you.
                </p>

                {/* Call to Action Buttons */}
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                    onClick={() => navigate("/games")}
                    className="px-8 py-3 rounded-lg text-white font-semibold bg-purple-600 hover:bg-purple-700 transition-all duration-200 shadow-lg hover:shadow-purple-600/30"
                >
                    🎮 Explore Games
                </button>

                <button
                    onClick={() => navigate("/register")}
                    className="px-8 py-3 rounded-lg text-purple-400 font-semibold border border-purple-500 hover:bg-purple-800/40 transition-all duration-200 shadow-lg cursor-p"
                >
                    Create Account
                </button>
                </div>
            </div>

            {/* Sub Section */}
            <div className="mt-20 text-gray-400 max-w-2xl">
                <h2 className="text-2xl font-semibold text-purple-400 mb-4">
                Why Mini GameHub?
                </h2>
                <ul className="space-y-3 text-gray-300 text-base">
                <li>⚡ Fast & Secure API powered by Django REST</li>
                <li>🔍 Filter, search and sort games effortlessly</li>
                <li>💬 Share your opinions through reviews</li>
                <li>⭐ Save your favorite games for later</li>
                </ul>
            </div>

            {/* Footer */}
            <footer className="mt-20 text-sm text-gray-500">
                © {new Date().getFullYear()} Mini GameHub. All rights reserved.
            </footer>
            </div>
        );
}


export default Home