import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { HeartOff, Heart } from "lucide-react";
import api from "../api";

export const Favorites = () => {
  const [favGames, setFavGames] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getFavGames();
  }, []);

  const getFavGames = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("api/user/favorites/?_=" + Date.now());
      if (res.status === 200) {
        setFavGames(res.data);
      }
    } catch (err) {
      console.error("Error fetching favorites:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-extrabold text-purple-400 mb-10 text-center tracking-wide">
          Your Favorite Games
        </h1>

        {isLoading ? (
          <div className="w-full">
            <LoadingSpinner />
          </div>
        ) : favGames.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favGames.map((fav) => (
              <Link
                key={fav.game_id}
                to={`/games/${fav.game_id}/`}
                className="relative group bg-gray-900/70 border border-gray-800 hover:border-purple-500 hover:shadow-purple-800/40 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Icon */}
                <div className="absolute top-4 right-4 text-purple-500 group-hover:text-purple-400 transition">
                  <Heart fill="#a855f7" strokeWidth={1.5} />
                </div>

                {/* Content */}
                <div>
                  <h2 className="text-xl font-bold text-purple-300 mb-2 group-hover:text-purple-400 transition">
                    {fav.game_title}
                  </h2>
                </div>

                {/* Footer */}
                <div className="text-gray-400 text-sm mt-4 border-t border-gray-800 pt-3">
                  <p>
                    <span className="font-medium text-gray-300">Added:</span>{" "}
                    {new Date(fav.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <HeartOff size={64} className="text-purple-500 mb-6" />
            <p className="text-lg font-medium">No favorite games yet.</p>
            <p className="text-sm text-gray-500 mt-1">
              Browse the game list and add your favorites!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
