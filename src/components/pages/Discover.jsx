import { useEffect, useState } from 'react';
import Footer from "../Footer";
import Header from "../Header";
import { RecommendedCards } from "../ReccomendedCards";
import Searchbar from "../SearchBar";
import { supabase } from '../../supabaseClient';
import { useNavigate } from 'react-router-dom';

function Discover() {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleBookNow = (salonId) => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    navigate(`/book/salon/${salonId}`);
  };

  useEffect(() => {
    async function fetchSalons() {
      setLoading(true);
      try {
        // Fetch salon data
        const { data: salonData, error: salonError } = await supabase
          .from('salons')
          .select('id, name, description, city')  
          .limit(20); 

        if (salonError) throw salonError;

        // Get images for each salon
        const salonsWithImages = await Promise.all(
          salonData.map(async (salon) => {
            // List files in the salon's folder
            const { data: imageList, error: imageError } = await supabase
              .storage
              .from('salonimages')
              .list(salon.id.toString());

            if (imageError) {
              console.error(`Error fetching images for salon ${salon.id}:`, imageError);
              return {
                ...salon,
                image: 'https://placehold.co/400x200/png', // fallback image
                rating: 4,
              };
            }

            // Get the first image if available
            const firstImage = imageList[0];
            let imageUrl = 'https://placehold.co/400x200/png'; // default fallback

            if (firstImage) {
              const { data: { publicUrl } } = supabase
                .storage
                .from('salonimages')
                .getPublicUrl(`${salon.id}/${firstImage.name}`);
              imageUrl = publicUrl;
            }

            return {
              ...salon,
              image: imageUrl,
              rating: 4,
            };
          })
        );

        setSalons(salonsWithImages);
        setError(null);
      } catch (error) {
        console.error('Error fetching salons:', error);
        setError(error.message);
        setSalons([]);
      } finally {
        setLoading(false);
      }
    }

    fetchSalons();
  }, []);

  return (
    <>
      <div className="mb-20 pb-10">
        <Header />
      </div>
      <Searchbar />
      {loading && <p className="text-center mt-10">Loading salons...</p>}
      {error && <p className="text-center mt-10 text-red-600">{error}</p>}
      {!loading && !error && (
        <>
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 mt-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400 tracking-tight">
              Recommended Salons
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-purple-600 to-purple-400 mx-auto rounded-full opacity-50"></div>
          </div>
          <RecommendedCards data={salons} onBookNow={handleBookNow} />
        </>
      )}
      <Footer />
    </>
  );
}

export default Discover;
