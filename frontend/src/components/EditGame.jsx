import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { SmallSpinner } from "../components/LoadingSpinner";
import api from "../api";

export const EditGame = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [genre, setGenre] = useState("");
  const [developer, setDeveloper] = useState("");
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getGame();
  }, [id]);

  const getGame = async () => {
    try {
      const res = await api.get(`api/games/${id}/`);
      if (res.status === 200) {
        const game = res.data;
        setTitle(game.title);
        setDescription(game.description);
        setReleaseDate(game.release_date);
        setGenre(game.genre);
        setDeveloper(game.developer);
        if (game.image) setPreview(game.image);
      }
    } catch (err) {
      console.error("Error fetching game:", err);
      setError("Failed to load game data.");
    }
  };

  const UpdateGame = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("release_date", releaseDate);
      formData.append("genre", genre);
      formData.append("developer", developer);
      if (image) formData.append("image", image);

      const res = await api.put(`api/games/${id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 200) {
        navigate("/admin-pannel/");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to update the game. Please check your input.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 px-6">
      <div className="bg-gray-800/90 backdrop-blur-md border border-gray-700 shadow-2xl rounded-2xl p-10 w-full max-w-2xl">
        <h1 className="text-3xl font-extrabold text-center text-purple-400 mb-8">
          Edit Game
        </h1>

        <form
          onSubmit={UpdateGame}
          autoComplete="off"
          className="flex flex-col space-y-6"
        >
          {/* Title */}
          <div>
            <label className="block text-gray-400 mb-2 text-sm font-medium">
              Game Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-400 mb-2 text-sm font-medium">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-32 px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            ></textarea>
          </div>

          {/* Release Date */}
          <div>
            <label className="block text-gray-400 mb-2 text-sm font-medium">
              Release Date
            </label>
            <input
              type="date"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Genre */}
          <div>
            <label className="block text-gray-400 mb-2 text-sm font-medium">
              Genre
            </label>
            <input
              type="text"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Developer */}
          <div>
            <label className="block text-gray-400 mb-2 text-sm font-medium">
              Developer
            </label>
            <input
              type="text"
              value={developer}
              onChange={(e) => setDeveloper(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-gray-400 mb-2 text-sm font-medium">
              Game Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                setImage(e.target.files[0]);
                setPreview(URL.createObjectURL(e.target.files[0]));
              }}
              className="w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
            />
          </div>

          {/* Preview Image */}
          {preview && (
            <div className="flex justify-center mt-4">
              <img
                src={preview}
                alt="Game Preview"
                className="rounded-lg border border-gray-700 w-48 h-48 object-cover shadow-md"
              />
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="text-red-400 text-sm font-medium whitespace-pre-line text-center">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 transition-all duration-200 text-white py-2.5 rounded-lg font-semibold tracking-wide"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>

          {isLoading && (
            <div className="flex justify-center mt-4">
              <SmallSpinner />
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
