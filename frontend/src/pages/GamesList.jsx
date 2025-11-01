import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import api from "../api";
import { GameCard } from "../components/GameCard";

export const Games = () => {
  const [gamesList, setGamesList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getGamesList();
  }, []);

  const getGamesList = async () => {
    try {
      const res = await api.get("api/games/");
      if (res.status === 200) {
        setGamesList(res.data.results || []);
      }
    } catch (err) {
        console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-extrabold text-purple-400 mb-10 text-center tracking-wide">
          Explore Games
        </h1>

        {gamesList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {gamesList.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 text-lg mt-10">
            No games available yet.
          </p>
        )}
      </div>
    </div>
  );
};

