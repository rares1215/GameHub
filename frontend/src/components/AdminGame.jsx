import { Edit2, Trash2 } from "lucide-react";
import api from "../api";
import { useState } from "react";
import { useNavigate } from "react-router";

export const AdminGame = ({ game }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate()
  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${game.title}"?`)) return;
    setIsDeleting(true);
    try {
      await api.delete(`api/games/${game.id}/`);
      alert("Game deleted successfully!");
      window.location.reload(); // simplu momentan
    } catch (err) {
      console.error("Error deleting game:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-200">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold text-purple-300">{game.title}</h2>
        <div className="flex gap-3">
          <button onClick={() => navigate(`/admin-pannel/edit-game/${game.id}/`)} className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition">
            <Edit2 size={18} />
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-400 mb-1">
        <span className="font-medium text-gray-300">Genre:</span> {game.genre}
      </p>
      <p className="text-sm text-gray-400 mb-1">
        <span className="font-medium text-gray-300">Developer:</span>{" "}
        {game.developer}
      </p>
      <p className="text-sm text-gray-400 mb-1">
        <span className="font-medium text-gray-300">Release:</span>{" "}
        {new Date(game.release_date).toLocaleDateString()}
      </p>
      <p className="text-sm text-gray-400">
        <span className="font-medium text-gray-300">Ratings:</span>{" "}
        {game.total_ratings || 0}
      </p>
    </div>
  );
};
