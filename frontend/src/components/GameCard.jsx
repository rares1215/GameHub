import { useState } from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import api from "../api";

export const GameCard = ({ game, onFavoriteChange }) => {
  const [isFavorite, setIsFavorite] = useState(game.is_favorite || false);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setIsLoading(true);
      const res = await api.post(`api/games/${game.id}/favorite/`);
      if (res.status === 200) {
        setIsFavorite(!isFavorite);
        onFavoriteChange?.(); // notifica parintele (Games/Favorites)
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const date = new Date(game.release_date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link to={`/games/${game.id}/`}>
      <div
        className="relative rounded-2xl overflow-hidden shadow-lg border border-gray-700
                   hover:scale-[1.02] hover:border-purple-500 hover:shadow-purple-800/50
                   transition-all duration-300 cursor-pointer group"
        style={{
          backgroundImage: `url(${
            game.image ||
            "https://via.placeholder.com/600x400?text=No+Image"
          })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "350px",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-all duration-300 group-hover:from-black/60"></div>

        {/* ⭐ Favorite button */}
        <button
          onClick={handleToggleFavorite}
          disabled={isLoading}
          className={`absolute top-4 right-4 z-20 text-2xl transition-transform duration-200 ${
            isFavorite
              ? "text-yellow-400 scale-110"
              : "text-gray-500 hover:text-yellow-400"
          }`}
        >
          <Star fill={isFavorite ? "#facc15" : "none"} strokeWidth={1.5} />
        </button>

        {/* Content */}
        <div className="absolute bottom-0 p-6 text-white z-10">
          <h2 className="text-2xl font-bold text-purple-400 mb-2 tracking-wide drop-shadow-lg">
            {game.title}
          </h2>

          <p className="text-sm text-gray-300 mb-1">
            <span className="font-medium text-gray-200">Genre:</span>{" "}
            {game.genre}
          </p>

          <p className="text-sm text-gray-300 mb-1">
            <span className="font-medium text-gray-200">Release:</span> {date}
          </p>

          <p className="text-sm text-gray-300">
            <span className="font-medium text-gray-200">Total Ratings:</span>{" "}
            {game.total_ratings ?? 0}
          </p>
        </div>
      </div>
    </Link>
  );
};
