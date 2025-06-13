import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaArrowRight, FaTimes } from "react-icons/fa";
import { supabase } from '../../src/supabaseClient';

const SalonImageGallery = ({ salonId }) => {
  const [salonImages, setSalonImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  // Fetch salon images from storage
  useEffect(() => {
    const fetchSalonImages = async () => {
      try {
        const { data, error } = await supabase
          .storage
          .from('salonimages')
          .list(salonId);

        if (error) {
          console.error('Error fetching salon images:', error);
          return;
        }

        if (data) {
          const imageUrls = await Promise.all(
            data.map(async (file) => {
              const { data: { publicUrl } } = supabase
                .storage
                .from('salonimages')
                .getPublicUrl(`${salonId}/${file.name}`);
              return publicUrl;
            })
          );
          setSalonImages(imageUrls);
        }
      } catch (err) {
        console.error('Error processing salon images:', err);
      }
    };

    fetchSalonImages();
  }, [salonId]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % salonImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + salonImages.length) % salonImages.length);
  };

  const openModal = (index) => {
    setModalImageIndex(index);
    setShowModal(true);
  };

  const nextModalImage = () => {
    setModalImageIndex((prev) => (prev + 1) % salonImages.length);
  };

  const prevModalImage = () => {
    setModalImageIndex((prev) => (prev - 1 + salonImages.length) % salonImages.length);
  };

  return (
    <>
      {/* Image Gallery */}
      {salonImages.length > 0 ? (
        <div className="relative w-full md:max-w-3xl mx-auto h-[300px] md:h-[400px] bg-white/5 rounded-lg overflow-hidden">
          {/* Main Slideshow */}
          <div className="relative w-full h-full">
            <img
              src={salonImages[currentImageIndex]}
              alt={`Salon ${currentImageIndex + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 cursor-pointer select-none"
              onClick={() => openModal(currentImageIndex)}
            />
            
            {/* Navigation Buttons */}
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            >
              <FaArrowLeft />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            >
              <FaArrowRight />
            </button>

            {/* Image Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {salonImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full md:max-w-3xl mx-auto h-[300px] md:h-[400px] bg-white/5 rounded-lg flex items-center justify-center">
          <p className="text-white/60">No images available</p>
        </div>
      )}

      {/* Image Modal */}
      <AnimatePresence>
        {showModal && salonImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
            onClick={() => setShowModal(false)}
          >
            <div className="relative max-w-4xl w-full h-[80vh] mx-4" onClick={e => e.stopPropagation()}>
              <img
                src={salonImages[modalImageIndex]}
                alt={`Salon ${modalImageIndex + 1}`}
                className="w-full h-full object-contain"
              />
              
              {/* Modal Navigation Buttons */}
              <button
                onClick={prevModalImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 text-white p-3 rounded-full hover:bg-white/30 transition-colors"
              >
                <FaArrowLeft />
              </button>
              <button
                onClick={nextModalImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 text-white p-3 rounded-full hover:bg-white/30 transition-colors"
              >
                <FaArrowRight />
              </button>

              {/* Modal Image Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {salonImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setModalImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === modalImageIndex ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 bg-white/20 text-white p-2 rounded-full hover:bg-white/30 transition-colors"
              >
                <FaTimes />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SalonImageGallery; 