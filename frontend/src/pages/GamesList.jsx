import { useEffect, useState } from "react";
import api from "../api";
import { GameCard } from "../components/GameCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useDebounce } from "../hooks/useDebounce";

export const Games = () => {
  const [gamesList, setGamesList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [ordering, setOrdering] = useState("");

  // Use debounced search
  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    getGamesList();
  }, [debouncedSearch, genre, ordering]);

  const getGamesList = async () => {
    try {
      // Set loading only if list is empty
      if (gamesList.length === 0) setLoading(true);

      const res = await api.get("api/games/", {
        params: {
          search: debouncedSearch || undefined,
          genre__icontains: genre || undefined,
          ordering: ordering || undefined,
          _: Date.now(), // cache-buster
        },
      });

      if (res.status === 200) {
        setGamesList(res.data.results || []);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/*PAGE TITLE*/}
        <h1 className="text-4xl font-extrabold text-purple-400 mb-10 text-center tracking-wide">
          Explore Games
        </h1>

        {/*SEARCH & FILTERS*/}
        <div className="flex flex-col md:flex-row gap-4 mb-10">

          {/* Search */}
          <input
            type="text"
            placeholder="Search games..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-200 focus:ring-2 focus:ring-purple-500"
          />

          {/* Genre filter */}
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-200"
          >
            <option value="">All Genres</option>
            <option value="Action">Action</option>
            <option value="Shooter">Shooter</option>
            <option value="RPG">RPG</option>
            <option value="Adventure">Adventure</option>
            <option value="Survival">Survival</option>
          </select>

          {/* Ordering */}
          <select
            value={ordering}
            onChange={(e) => setOrdering(e.target.value)}
            className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-200"
          >
            <option value="-created_at">Sort By</option>
            <option value="-release_date">Newest</option>
            <option value="release_date">Oldest</option>
            <option value="-avg_rating">Highest Rating</option>
            <option value="-all_ratings">Most Reviewed</option>
            <option value= "all_ratings">Least Reviewed</option>
          </select>
        </div>

        {/*GAMES LIST*/}
        {loading && gamesList.length === 0 ? (
          <LoadingSpinner />
        ) : gamesList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {gamesList.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 mt-10 text-xl">
            No games found.
          </p>
        )}
      </div>
    </div>
  );
};
