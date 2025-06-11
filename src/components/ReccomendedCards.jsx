export function RecommendedCards({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-16 text-center text-gray-400">
        No results available
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((salon) => (
          <div 
            key={salon.id}
            className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl border border-purple-100 dark:border-purple-800/50 shadow-lg shadow-purple-400/10 overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="relative h-48 w-full">
              <img
                src={salon.image}
                alt={salon.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{salon.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                {salon.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-yellow-400">★★★★★</span>
                  <span className="text-sm text-gray-500 ml-2">{salon.rating}</span>
                </div>
                <button className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-full text-sm transition-colors duration-200">
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}