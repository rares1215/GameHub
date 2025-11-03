/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useParams } from "react-router"
import api from "../api";
import { Star, Calendar, Code2, Gamepad2, Gauge, Users } from "lucide-react";



export const SingleGame = () =>{
    const {id} = useParams();
    const [game,setGame] = useState({});
    const [error,setError] = useState({});
    const [showAllReviews, setShowAllReviews] = useState(false);

    useEffect(() =>{
        getGame();
    }, [id]);



    const getGame = async () =>{
        setError('')

        try{

            const res = await api.get(`api/games/${id}/`)
            if(res.status===200){
                console.log('Succes on getting the data');
                setGame(res.data);
            }

        }catch(err){
            if(err.response && err.response.data){
                console.log(err.response.data);
                setError('Failed to load game details')
            }
        }
    }
        if (!game.title) {
            return (
            <div className="flex items-center justify-center h-screen text-gray-400 text-lg">
                Loading game details...
            </div>
            );
        }

    const previewReview = game.reviews?.[0];

    return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-purple-950 text-white">
      {/* ======== HERO IMAGE SECTION ======== */}
      <div
        className="relative w-full h-[60vh] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: game.image
            ? `url(${game.image})`
            : "url('https://images.unsplash.com/photo-1605902711622-cfb43c4437d1?auto=format&fit=crop&w=1600&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        <h1 className="relative z-10 text-5xl md:text-6xl font-extrabold text-purple-400 tracking-wide drop-shadow-lg">
          {game.title}
        </h1>
      </div>

      {/* ======== DESCRIPTION SECTION ======== */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        <p className="text-gray-300 leading-relaxed text-lg border-l-4 border-purple-500 pl-5 mb-10">
          {game.description}
        </p>

        {/* ======== GAME STATS CARD ======== */}
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

        {/* ======== REVIEWS SECTION ======== */}
        <div className="mt-14">
          <h3 className="text-2xl font-bold text-purple-300 mb-6 flex items-center gap-2">
            <Gamepad2 size={22} /> Reviews
          </h3>

          <div className="space-y-6">
            {(!showAllReviews && previewReview && (
              <div
                key={previewReview.id}
                className="bg-gray-800/80 border border-gray-700 rounded-xl p-5 shadow-md"
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-lg font-semibold text-purple-300">
                    {previewReview.user}
                  </h4>
                  <span className="text-yellow-400 flex items-center gap-1">
                    <Star size={16} />
                    {previewReview.rating}
                  </span>
                </div>
                <p className="text-gray-300 italic">{previewReview.comments}</p>
                <p className="text-gray-500 text-xs mt-3">
                  {new Date(previewReview.created_at).toLocaleString()}
                </p>
              </div>
            )) ||
              (showAllReviews &&
                game.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-gray-800/80 border border-gray-700 rounded-xl p-5 shadow-md"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-lg font-semibold text-purple-300">
                        {rev.user}
                      </h4>
                      <span className="text-yellow-400 flex items-center gap-1">
                        <Star size={16} />
                        {rev.rating}
                      </span>
                    </div>
                    <p className="text-gray-300 italic">{rev.comments}</p>
                    <p className="text-gray-500 text-xs mt-3">
                      {new Date(rev.created_at).toLocaleString()}
                    </p>
                  </div>
                )))}
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
        </div>
      </div>
    </div>
  );
}