import { useState } from 'react'
import { RecommendedCards } from './ReccomendedCards'

const defaultResults = [
	{
		id: 1,
		name: 'Luxe Beauty Salon',
		description: 'Premium beauty services with expert stylists',
		rating: 4.8,
		image: '/salon1.jpg',
	},
	{
		id: 2,
		name: 'Glamour Studio',
		description: 'Trendsetting styles and superior service',
		rating: 4.6,
		image: '/salon2.jpg',
	},
	{
		id: 3,
		name: 'Elite Hair Spa',
		description: 'Luxurious treatments and professional care',
		rating: 4.7,
		image: '/salon3.jpg',
	},
	{
		id: 1,
		name: 'Luxe Beauty Salon',
		description: 'Premium beauty services with expert stylists',
		rating: 4.8,
		image: '/salon1.jpg',
	},
	{
		id: 2,
		name: 'Glamour Studio',
		description: 'Trendsetting styles and superior service',
		rating: 4.6,
		image: '/salon2.jpg',
	},
	{
		id: 3,
		name: 'Elite Hair Spa',
		description: 'Luxurious treatments and professional care',
		rating: 4.7,
		image: '/salon3.jpg',
	},
]
const Searchbar = () => {
	const [searchQuery, setSearchQuery] = useState('')
	const [searchResults, setSearchResults] = useState(defaultResults)
	const [isSearching, setIsSearching] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	const handleSubmit = async (e) => {
		e.preventDefault()
		console.log('working')
		//         if (!searchQuery.trim()) {
		//             setSearchResults(defaultResults)
		//             setIsSearching(false)
		//             return
		//         }

		//         setIsLoading(true)
		//         setIsSearching(true)
		//         try {
		//           const { data, error } = await supabase
		//   .from('Salons_ranchi')
		//   .select('*')
		//   .or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);

		//             if (error) throw error
		//             setSearchResults(data)
		//         } catch (error) {
		//             console.error('Error searching:', error)
		//         } finally {
		//             setIsLoading(false)
		//         }
	}

	return (
		<div className="max-w-7xl mx-auto px-4">
			<form onSubmit={handleSubmit} className="relative">
				<input
					type="text"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					placeholder="Search for services..."
					className="w-full px-5 py-3 pl-10 text-base rounded-full bg-dark-800 
                             text-white border-2 border-dark-700 
                             focus:border-primary-500 focus:outline-none
                             transition-colors duration-300"
				/>
				<button
					type="submit"
					className="absolute left-3 top-1/2 -translate-y-1/2"
				>
					<svg
						className="w-4 h-4 text-gray-400 hover:text-primary-500 
                                 transition-colors duration-300"
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

			{/* Results Section */}
			{isLoading ? (
				<div className="mt-8 text-center">
					<div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
				</div>
			) : (
				<div className="mt-8">
					<h2 className="text-2xl font-bold mb-6 text-center">
						{isSearching ? 'Search Results' : 'Recommended For You'}
					</h2>
					<RecommendedCards data={searchResults} />
					{isSearching && searchResults.length === 0 && (
						<div className="mt-8 text-center text-gray-400">
							No results found for "{searchQuery}"
						</div>
					)}
				</div>
			)}
		</div>
	)
}

export default Searchbar