/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import api from "../api";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { Star, Calendar, Code2, Gamepad2, Gauge, Users } from "lucide-react";
import { AddReview } from "./AddReview";
import { ReviewItem } from "../components/ReviewItem";
import { jwtDecode } from "jwt-decode";
import { ACCESS_TOKEN } from "../constants";

export const SingleGame = () => {
  const { id } = useParams();
  const [game, setGame] = useState({});
  const [error, setError] = useState({});
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    getGame();

    // Decoded token to find out the current user
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      const decoded = jwtDecode(token);
      setCurrentUser(decoded.username || decoded.user || decoded.sub);
    }
  }, [id]);

  const getGame = async () => {
    setError("");

    try {
      const res = await api.get(`api/games/${id}/?_=${Date.now()}`);
      if (res.status === 200) {
        setGame(res.data);
      }
    } catch (err) {
      if (err.response && err.response.data) {
        console.log(err.response.data);
        setError("Failed to load game details");
      }
    }
  };

  if (!game.title) {
    return <LoadingSpinner />;
  }

  const previewReview = game.reviews?.[0];
  const hasReviewed = game.reviews?.some((rev) => rev.user === currentUser);

  // Reload the page after adding or deleting a review
  const handleAddReview = async () => {
    await getGame();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-purple-950 text-white">
        {/*HERO IMAGE*/}
        <div className="relative w-full h-[90vh] flex items-center justify-center overflow-hidden bg-black">
          <img
            src={
              game.image
                ? game.image
                : "https://images.unsplash.com/photo-1605902711622-cfb43c4437d1?auto=format&fit=crop&w=1600&q=80"
            }
            alt={game.title}
            className="absolute inset-0 w-full h-full object-cover opacity-90"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
        </div>

      {/*DESCRIPTION*/}
      <div className="max-w-5xl mx-auto px-6 py-10">
        <p className="text-gray-300 leading-relaxed text-lg border-l-4 border-purple-500 pl-5 mb-10">
          {game.description}
        </p>

        {/*GAME DETAILS*/}
        <div className="bg-gray-900/80 border border-gray-800 rounded-2xl shadow-2xl p-8 backdrop-blur-md">
          <h2 className="text-2xl font-bold text-purple-400 mb-6 tracking-wide">
            Game Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-gray-300">
            <div className="flex items-center gap-3 bg-gray-800/50 rounded-xl px-4 py-3">
              <Gamepad2 className="text-purple-400" size={22} />
              <div>
                <p className="text-sm text-gray-400">Genre</p>
                <p className="font-semibold">{game.genre}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-gray-800/50 rounded-xl px-4 py-3">
              <Code2 className="text-purple-400" size={22} />
              <div>
                <p className="text-sm text-gray-400">Developer</p>
                <p className="font-semibold">{game.developer}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-gray-800/50 rounded-xl px-4 py-3">
              <Calendar className="text-purple-400" size={22} />
              <div>
                <p className="text-sm text-gray-400">Release Date</p>
                <p className="font-semibold">
                  {new Date(game.release_date).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-gray-800/50 rounded-xl px-4 py-3">
              <Gauge className="text-purple-400" size={22} />
              <div>
                <p className="text-sm text-gray-400">Average Rating</p>
                <p className="font-semibold text-yellow-400">
                  {game.average_rating ? game.average_rating.toFixed(1) : "—"} / 5
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-gray-800/50 rounded-xl px-4 py-3">
              <Users className="text-purple-400" size={22} />
              <div>
                <p className="text-sm text-gray-400">Total Reviews</p>
                <p className="font-semibold">{game.total_ratings}</p>
              </div>
            </div>
          </div>
        </div>

        {/*REVIEWS*/}
        <div className="mt-14">
          <h3 className="text-2xl font-bold text-purple-300 mb-6 flex items-center gap-2">
            <Gamepad2 size={22} /> Reviews
          </h3>

          <div className="space-y-6">
            {!showAllReviews && previewReview ? (
              <ReviewItem
                key={previewReview.id}
                review={previewReview}
                gameId={game.id}
                currentUser={currentUser}
                onReviewUpdated={handleAddReview}
              />
            ) : (
              game.reviews?.map((rev) => (
                <ReviewItem
                  key={rev.id}
                  review={rev}
                  gameId={game.id}
                  currentUser={currentUser}
                  onReviewUpdated={handleAddReview}
                />
              ))
            )}
          </div>

          {game.reviews?.length > 1 && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setShowAllReviews(!showAllReviews)}
                className="bg-purple-600 hover:bg-purple-700 transition-all duration-200 px-6 py-2 rounded-lg font-semibold text-white shadow-md"
              >
                {showAllReviews ? "Hide Reviews" : "Show All Reviews"}
              </button>
            </div>
          )}

          {/*ADD REVIEW*/}
          <div className="mt-16 border-t border-gray-800 pt-10">
            {!hasReviewed ? (
              <AddReview gameId={game.id} onReviewAdded={handleAddReview} />
            ) : (
              <p className="text-center text-gray-400 text-sm italic mt-4">
                You’ve already left a review for this game.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
