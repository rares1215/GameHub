import {Link} from 'react-router-dom'

export const GameCard = ({ game }) => {
  const date = new Date(game.release_date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link to={`/games/${game.id}/`}><div
      className="relative rounded-2xl overflow-hidden shadow-lg border border-gray-700
                 hover:scale-[1.02] hover:border-purple-500 hover:shadow-purple-800/50
                 transition-all duration-300 cursor-pointer group"
      style={{
        backgroundImage: `url(${game.image || "https://via.placeholder.com/600x400?text=No+Image"})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "350px",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-all duration-300 group-hover:from-black/60"></div>

      {/* Text content */}
      <div className="absolute bottom-0 p-6 text-white z-10">
        <h2 className="text-2xl font-bold text-purple-400 mb-2 tracking-wide drop-shadow-lg">
          {game.title}
        </h2>

        <p className="text-sm text-gray-300 mb-1">
          <span className="font-medium text-gray-200">Genre:</span> {game.genre}
        </p>

        <p className="text-sm text-gray-300 mb-1">
          <span className="font-medium text-gray-200">Release:</span> {date}
        </p>

        <p className="text-sm text-gray-300">
          <span className="font-medium text-gray-200">Total Ratings:</span>{" "}
          {game.total_ratings ?? 0}
        </p>
      </div>
    </div></Link>
  );
};
