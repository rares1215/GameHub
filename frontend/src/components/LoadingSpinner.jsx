export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-b from-black via-gray-900 to-purple-950">
      <div className="relative">
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-blue-500 opacity-60 blur-xl animate-pulse"></div>

        {/* Main spinner ring */}
        <div className="w-16 h-16 border-4 border-t-transparent border-purple-500 rounded-full animate-spin relative z-10"></div>
      </div>
    </div>
  );
};

export const SmallSpinner = () => {
  return (
    <div className="relative flex items-center justify-center mt-10">
      {/* Halo pulsant */}
      <div className="absolute w-8 h-8 bg-purple-500/30 rounded-full blur-lg animate-pulse"></div>

      {/* Spinner principal */}
      <div className="w-6 h-6 border-3 border-t-transparent border-purple-400 rounded-full animate-spin"></div>
    </div>
  );
};
