import { useState } from "react"
import api from "../api";
import { useNavigate } from "react-router";
import { SmallSpinner } from "./LoadingSpinner";



export const AddGame = () =>{
    const [title,setTitle] = useState('');
    const [description,setDescription] = useState('');
    const [release_date,setReleaseDate] = useState('');
    const [genre,setGenre] = useState('');
    const [developer,setDeveloper] = useState('');
    const [image, setImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate();



    

    const CreateGame = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("release_date", release_date);
        formData.append("genre", genre);
        formData.append("developer", developer);
        if (image) formData.append("image", image);

        const res = await api.post("api/games/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        });

        if (res.status === 201) {
        navigate("/admin-pannel/");
        setTitle("");
        setDescription("");
        setReleaseDate("");
        setGenre("");
        setDeveloper("");
        setImage(null);
        }
    } catch (err) {
        if (err.response && err.response.data) {
        const data = err.response.data;
        console.log("Validation error:", data);
        } 
    } finally {
        setIsLoading(false);
    }
    };



  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 px-6">
      <div className="bg-gray-800/90 backdrop-blur-md border border-gray-700 shadow-2xl rounded-2xl p-10 w-full max-w-2xl">
        <h1 className="text-3xl font-extrabold text-center text-purple-400 mb-8">
          Create New Game
        </h1>

        <form
          onSubmit={CreateGame}
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
              placeholder="Enter game title"
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
              placeholder="Write a short description..."
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
              value={release_date}
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
              placeholder="Enter genre"
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
              placeholder="Enter developer name"
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
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 transition-all duration-200 text-white py-2.5 rounded-lg font-semibold tracking-wide"
          >
            Create Game
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

}