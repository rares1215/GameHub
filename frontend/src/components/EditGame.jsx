import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import api from "../api";
import { SmallSpinner } from "../components/LoadingSpinner";

export const EditGame = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [genre, setGenre] = useState("");
  const [developer, setDeveloper] = useState("");
  const [image, setImage] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadGame();
  }, []);

  const loadGame = async () => {
    try {
      const res = await api.get(`api/games/${id}/`);
      const g = res.data;

      setTitle(g.title);
      setDescription(g.description);
      setReleaseDate(g.release_date);
      setGenre(g.genre);
      setDeveloper(g.developer);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("release_date", releaseDate);
      formData.append("genre", genre);
      formData.append("developer", developer);
      if (image) formData.append("image", image);

      await api.put(`api/games/${id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/admin-pannel/");
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white px-6">
      <div className="bg-gray-800 p-8 rounded-xl w-full max-w-xl shadow-xl">

        <h1 className="text-3xl font-bold text-purple-400 mb-6 text-center">
          Edit Game
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            className="w-full p-2 bg-gray-900 border border-gray-700 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="w-full p-2 bg-gray-900 border border-gray-700 rounded h-28"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            type="date"
            className="w-full p-2 bg-gray-900 border border-gray-700 rounded"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
          />

          <input
            className="w-full p-2 bg-gray-900 border border-gray-700 rounded"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          />

          <input
            className="w-full p-2 bg-gray-900 border border-gray-700 rounded"
            value={developer}
            onChange={(e) => setDeveloper(e.target.value)}
          />

          <input
            type="file"
            accept="image/*"
            className="w-full text-gray-300"
            onChange={(e) => setImage(e.target.files[0])}
          />

          <button
            type="submit"
            className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded font-semibold"
          >
            {isLoading ? <SmallSpinner /> : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};
