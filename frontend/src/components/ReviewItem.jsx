import { useState } from "react";
import { Star, Trash2, Edit3, Save, X } from "lucide-react";
import api from "../api";

export const ReviewItem = ({ review, gameId, currentUser, onReviewUpdated }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newComment, setNewComment] = useState(review.comments);
  const [newRating, setNewRating] = useState(review.rating);
  const [isProcessing, setIsProcessing] = useState(false);

  const isOwner = currentUser === review.user;

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      setIsProcessing(true);
      const res = await api.delete(`api/games/${gameId}/reviews/${review.id}/`);
      if (res.status === 204) {
        onReviewUpdated?.();
      }
    } catch (err) {
      console.error("Error deleting review:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setIsProcessing(true);
      const res = await api.put(`api/games/${gameId}/reviews/${review.id}/`, {
        rating: newRating,
        comments: newComment,
      });
      if (res.status === 200) {
        setIsEditing(false);
        onReviewUpdated?.();
      }
    } catch (err) {
      console.error("Error updating review:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-gray-800/80 border border-gray-700 rounded-xl p-5 shadow-md mb-4">
      {!isEditing ? (
        <>
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-lg font-semibold text-purple-300">
              {review.user}
            </h4>
            {isOwner && (
                <span className="ml-2 text-xs text-purple-400 bg-purple-900/40 px-2 py-0.5 rounded-full">
                  Your review
                </span>
              )}
            <div className="flex items-center gap-2">
              <span className="text-yellow-400 flex items-center gap-1">
                <Star size={16} /> {review.rating}
              </span>

              {isOwner && (
                <div className="flex gap-2 ml-3">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-gray-400 hover:text-yellow-400 transition"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isProcessing}
                    className="text-gray-400 hover:text-red-500 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <p className="text-gray-300 italic">{review.comments}</p>
          <p className="text-gray-500 text-xs mt-3">
            {new Date(review.created_at).toLocaleString()}
          </p>
        </>
      ) : (
        <form onSubmit={handleUpdate} className="space-y-4">
          {/* Rating */}
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setNewRating(star)}
                className={`text-2xl ${
                  star <= newRating ? "text-yellow-400" : "text-gray-600"
                } hover:text-yellow-500 transition`}
              >
                ★
              </button>
            ))}
          </div>

          {/* Comment */}
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-950 border border-gray-700 text-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows="3"
            required
          ></textarea>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-1 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm"
            >
              <X size={14} /> Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="flex items-center gap-1 px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm text-white"
            >
              <Save size={14} /> Save
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
