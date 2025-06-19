import { useState, useEffect } from 'react'
import { RecommendedCards } from './ReccomendedCards'
import { supabase } from '../supabaseClient.js'
import { useNavigate } from 'react-router-dom'

const DEBOUNCE_DELAY = 500 

const Searchbar = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleBookNow = (salonId) => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    navigate(`/book/salon/${salonId}`);
  };

  useEffect(() => {
    // Skip search if query is empty
    if (!searchQuery.trim()) {
      setSearchResults([])
      setIsSearching(false)
      setError(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setIsSearching(true)
    setError(null)

    // Setup debounce timer
    const handler = setTimeout(async () => {
      try {
        const { data, error } = await supabase
          .from('salons')
          .select('id, name, description, city')
          .or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,city.ilike.%${searchQuery}%`)

        if (error) throw error

        // Fetch images for each salon (like Discover page)
        const salonsWithImages = await Promise.all(
          data.map(async (salon) => {
            // List files in the salon's folder
            const { data: imageList, error: imageError } = await supabase
              .storage
              .from('salonimages')
              .list(salon.id.toString());

            let imageUrl = 'https://placehold.co/400x200/png'; // default fallback

            if (!imageError && imageList && imageList.length > 0) {
              const firstImage = imageList[0];
              const { data: { publicUrl } } = supabase
                .storage
                .from('salonimages')
                .getPublicUrl(`${salon.id}/${firstImage.name}`);
              imageUrl = publicUrl;
            }

            return {
              ...salon,
              image: imageUrl,
              rating: (Math.random() * 5).toFixed(1),
            };
          })
        );

        setSearchResults(salonsWithImages);
      } catch (err) {
        console.error('Error searching salons:', err)
        setError('Failed to load search results. Please try again.')
        setSearchResults([])
      } finally {
        setIsLoading(false)
      }
    }, DEBOUNCE_DELAY)

    // Cleanup timeout if user types before delay expires
    return () => clearTimeout(handler)
  }, [searchQuery])

  return (
    <div className="max-w-7xl mx-auto px-4">
      <form
        onSubmit={(e) => e.preventDefault()} // prevent form submit reload
        className="relative"
        role="search"
        aria-label="Search salons"
      >
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for salons..."
          className="w-full px-5 py-3 pl-10 text-base rounded-full bg-dark-800
                     text-white border-2 border-dark-700
                     focus:border-primary-500 focus:outline-none
                     transition-colors duration-300"
          aria-label="Search salons"
          autoComplete="off"
        />
        <button
          type="submit"
          className="absolute left-3 top-1/2 -translate-y-1/2"
          aria-label="Search"
          disabled // disabled because search triggers dynamically now
          tabIndex={-1}
        >
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </form>

      {searchQuery.trim() && (
        <div
          className={`mt-2 transition-opacity duration-500 ${
            isLoading ? 'opacity-50' : 'opacity-100'
          }`}
        >
          {isLoading ? (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-600">{error}</div>
          ) : searchResults.length === 0 && isSearching ? (
            <div className="text-center text-gray-400">
              No results found for "<strong>{searchQuery}</strong>"
            </div>
          ) : (
            <RecommendedCards data={searchResults} onBookNow={handleBookNow} />
          )}
        </div>
      )}
    </div>
  )
}

export default Searchbar
