import { useEffect, useState, useRef } from 'react';

export function RecommendedCards({ data = [], onBookNow }) {
  const [visibleCards, setVisibleCards] = useState({});
  const cardsRef = useRef([]);

  useEffect(() => {
    if (!cardsRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute('data-id');
          if (entry.isIntersecting) {
            setVisibleCards((prev) => ({ ...prev, [id]: true }));
          }
        });
      },
      { threshold: 0.2 }
    );

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => {
      if (cardsRef.current) {
        cardsRef.current.forEach((card) => {
          if (card) observer.unobserve(card);
        });
      }
    };
  }, [data]);

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-16 transition-opacity duration-500 ease-in-out opacity-100">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((salon, index) => {
          const isVisible = visibleCards[salon.id];

          return (
            <div
              key={salon.id}
              data-id={salon.id}
              ref={(el) => (cardsRef.current[index] = el)}
              style={{
                transitionDelay: isVisible ? `${index * 150}ms` : '0ms',
              }}
              className={`bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl border border-purple-100 dark:border-purple-800/50 shadow-lg shadow-purple-400/10 overflow-hidden hover:shadow-xl
                transition-all duration-700 ease-out
                transform
                opacity-0 translate-y-10
                ${isVisible ? 'opacity-100 translate-y-0' : ''}
              `}
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
                  <button
                    onClick={() => onBookNow && onBookNow(salon.id)}
                    className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-full text-sm transition-colors duration-200"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
