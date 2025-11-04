import { useEffect, useState } from "react";
import { LoadingSpinner } from "../components/LoadingSpinner";
import api from "../api";
import { AdminGame } from "../components/AdminGame";

export const AdminPannel = () => {
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getGames();
  }, []);

  const getGames = async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`api/games/?_=${Date.now()}`);
      if (res.status === 200) {
        setGames(res.data.results);
      }
    } catch (err) {
      console.error("Error fetching games:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-gray-200 p-8 ml-60">
      <h1 className="text-3xl font-bold text-purple-400 mb-8 tracking-wide">
        Admin Panel — Manage Games
      </h1>

      {isLoading ? (
          <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <AdminGame key={game.id} game={game} />
          ))}
        </div>
      )}
    </div>
  );
};
