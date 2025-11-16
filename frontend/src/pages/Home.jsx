import { useNavigate } from "react-router";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-purple-950 text-white">

      {/* ================= HERO SECTION ================= */}
      <div
        className="
          relative h-[70vh] w-full bg-cover bg-center flex items-center
        "
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1605902711622-cfb43c4437d1?auto=format&fit=crop&w=2000&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

        <div
          className="
            relative z-10 max-w-4xl px-8
            text-left
            md:ml-[260px]  /* OFFSET IN DESKTOP FOR SIDEBAR */
            ml-0
          "
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Explore the <span className="text-purple-400">World of Games</span>
          </h1>

          <p className="text-gray-300 text-base sm:text-lg md:text-xl max-w-2xl">
            Discover the best titles, read authentic player reviews, and keep
            track of your favorites — all in one place.
          </p>

          {/* BUTTONS */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 sm:gap-6">
            <button
              onClick={() => navigate("/games")}
              className="
                px-8 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 font-semibold
                shadow-lg transition text-center
              "
            >
              🎮 Browse Games
            </button>

            <button
              onClick={() => navigate("/favorites")}
              className="
                px-8 py-3 rounded-lg bg-gray-800 border border-gray-700
                hover:bg-gray-700 font-semibold transition text-center
              "
            >
              ⭐ My Favorites
            </button>
          </div>
        </div>
      </div>

      {/* ================= FEATURE SECTIONS ================= */}
      <div className="max-w-6xl mx-auto px-8 md:ml-[260px] py-20 space-y-20">

        {/* Why GameHub */}
        <section className="text-center md:text-left">
          <h2 className="text-3xl font-bold text-purple-400 mb-6">
            Why Choose GameHub?
          </h2>

          <p className="text-gray-300 max-w-2xl leading-relaxed">
            GameHub brings together gamers from all around the world.
            Whether you’re exploring new titles or diving deep into community
            opinions, GameHub is the perfect place to discover your next
            favorite game.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">

            <FeatureCard
              title="Discover New Games"
              text="Browse a constantly growing collection of titles from every genre."
            />

            <FeatureCard
              title="Real Player Reviews"
              text="Read honest opinions from real gamers, not sponsored content."
            />

            <FeatureCard
              title="Save Your Favorites"
              text="Easily bookmark the games you love and find them anytime."
            />

          </div>
        </section>

        {/* Trending Section Placeholder */}
        <section className="text-center md:text-left">
          <h2 className="text-3xl font-bold text-purple-400 mb-6">
            Trending Now
          </h2>
          <p className="text-gray-400 italic">
            (Coming soon: A curated list of trending games powered by real user activity.)
          </p>
        </section>

      </div>

      {/* ================= FOOTER ================= */}
      <footer className="py-10 text-center text-gray-500 md:ml-[260px]">
        © {new Date().getFullYear()} Mini GameHub — All Rights Reserved
      </footer>
    </div>
  );
}

export default Home;

/* ------------------------------------------- */
/* Small Feature Card Component                */
/* ------------------------------------------- */

function FeatureCard({ title, text }) {
  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 shadow-lg hover:shadow-purple-900/30 transition">
      <h3 className="text-xl font-semibold text-purple-300 mb-3">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{text}</p>
    </div>
  );
}
