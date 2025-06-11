import { useEffect, useState } from 'react';
import Footer from "../Footer";
import Header from "../Header";
import { RecommendedCards } from "../ReccomendedCards";
import Searchbar from "../SearchBar";
import { supabase } from '../../../src/supabaseClient';
import { useNavigate } from 'react-router-dom'; // ⬅️ add this



function Discover() {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    async function fetchSalons() {
      setLoading(true);
      const { data, error } = await supabase
        .from('salons')
        .select('id, name, description')  
        .limit(20); 

      if (error) {
        setError(error.message);
        setSalons([]);
      } else {
        // add dummy images and ratings (since your table doesn't have image or rating)
        const enrichedData = data.map(salon => ({
          ...salon,
          image: 'https://via.placeholder.com/400x200?text=Salon+Image', // placeholder
          rating: (Math.random() * 5).toFixed(1),
        }));

        setSalons(enrichedData);
        setError(null);
      }
      setLoading(false);
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
      {!loading && !error &&<RecommendedCards data={salons} onBookNow={(salonId) => navigate(`/book/salon/${salonId}`)} />
}
      <Footer />
    </>
  );
}

export default Discover;
