import { useState } from "react";
import { useNavigate } from "react-router";
import { SmallSpinner } from "../components/LoadingSpinner";
import api from "../api";

export const AddReview = ({ gameId }) => {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const PostReview = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await api.post(`api/games/${gameId}/reviews/`, {
        rating,
        comments: comment,
      });

      if (res.status === 201) {
        setComment("");
        setRating(0);
        navigate(`/games/${gameId}/`);
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        const data = err.response.data;
        const messages = Object.entries(data)
          .map(([field, msg]) => `${field}: ${msg.join(", ")}`)
          .join("\n");
        setError(messages);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900/90 border border-gray-700 rounded-2xl shadow-lg p-8 mt-10 text-gray-200 max-w-2xl mx-auto backdrop-blur-md">
      <h2 className="text-2xl font-bold text-purple-400 mb-6 text-center">
        Leave a Review
      </h2>

      <form onSubmit={PostReview} className="space-y-6">
        {/* Rating */}
        <div className="flex flex-col items-center">
          <label className="block text-gray-400 mb-2 text-sm font-medium">
            Your Rating
          </label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-3xl ${
                  star <= rating ? "text-yellow-400" : "text-gray-600"
                } hover:text-yellow-500 transition`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-gray-400 mb-2 text-sm font-medium">
            Your Comment
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full h-28 px-4 py-2 rounded-lg bg-gray-950 border border-gray-700 text-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Write your thoughts about this game..."
            required
          ></textarea>
        </div>

        {/* Error message */}
        {error && (
          <p className="text-red-400 text-center text-sm font-medium whitespace-pre-line">
            {error}
          </p>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 transition-all duration-200 text-white py-2.5 rounded-lg font-semibold tracking-wide"
        >
          {isLoading ? "Submitting..." : "Submit Review"}
        </button>

        {isLoading && (
          <div className="flex justify-center mt-4">
            <SmallSpinner />
          </div>
        )}
      </form>
    </div>
  );
};
