import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../../src/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../Header';
import Footer from '../Footer';
import { FaArrowLeft, FaArrowRight, FaTimes } from "react-icons/fa";
import toast from 'react-hot-toast';
import logo_dark from '../images/2017_07_13_29754_1499943181._large.jpg';
import logo_dark1 from '../images/download.jpg';
import logo_dark2 from '../images/istockphoto-134052142-612x612.jpg';

const BookingPage = () => {
  const { salonId } = useParams();
  const [salonName, setSalonName] = useState('');
  const [barbers, setBarbers] = useState([]);
  const [selectedBarberId, setSelectedBarberId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [slotsByDate, setSlotsByDate] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState(null);

  const salonImages = [
    logo_dark,
    logo_dark1,
    logo_dark2,
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

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

  // Fetch salon name
  useEffect(() => {
    const fetchSalon = async () => {
      const { data, error } = await supabase
        .from('salons')
        .select('name')
        .eq('id', salonId)
        .single();

      if (!error && data) {
        setSalonName(data.name);
      }
    };

    fetchSalon();
  }, [salonId]);

  // Fetch barbers for this salon
  useEffect(() => {
    const fetchBarbers = async () => {
      const { data, error } = await supabase
        .from('barbers')
        .select('id, name, photo_url, bio')
        .eq('salon_id', salonId);

      if (!error && data.length > 0) {
        setBarbers(data);
        setSelectedBarberId(data[0].id);
      }
    };

    fetchBarbers();
  }, [salonId]);

  // Fetch slots for selected barber
  useEffect(() => {
    if (!selectedBarberId) return;

    const fetchSlots = async () => {
      setLoading(true);
      const { data: timeSlots, error } = await supabase
        .from('time_slots')
        .select('id, start_time, end_time')
        .eq('barber_id', selectedBarberId)
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true });

      if (error) {
        console.error('Error fetching time slots:', error);
        setSlotsByDate({});
        setLoading(false);
        return;
      }

      // Remove booked slots
      const { data: bookings } = await supabase
        .from('bookings')
        .select('time_slot_id');

      const bookedSlotIds = bookings?.map(b => b.time_slot_id) || [];

      const available = timeSlots.filter(slot => !bookedSlotIds.includes(slot.id));

      // Group by date
      const grouped = available.reduce((acc, slot) => {
        const dateKey = new Date(slot.start_time).toLocaleDateString();
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(slot);
        return acc;
      }, {});

      setSlotsByDate(grouped);
      setSelectedDate(null); // reset selected date when barber changes
      setLoading(false);
    };

    fetchSlots();
  }, [selectedBarberId]);

  // Handle booking
  const handleBooking = async (slotId) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error('Please login to book an appointment');
      return;
    }

    const { error } = await supabase
      .from('bookings')
      .insert({
        user_id: user.id,
        time_slot_id: slotId,
      });

    if (error) {
      toast.error('Booking failed: Slot might already be booked');
      console.error(error);
    } else {
      toast.success('Booking confirmed!');
      setSlotsByDate(prev => {
        const newSlots = { ...prev };
        const dateKey = Object.keys(newSlots).find(key =>
          newSlots[key].some(slot => slot.id === slotId)
        );
        newSlots[dateKey] = newSlots[dateKey].filter(slot => slot.id !== slotId);
        return newSlots;
      });
    }
  };

  const fetchAvailableSlots = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: slots, error: slotsError } = await supabase
        .from('available_slots')
        .select('*')
        .eq('salon_id', salonId)
        .gte('start_time', new Date().toISOString())
        .order('start_time');

      if (slotsError) throw slotsError;

      // Group slots by date
      const groupedSlots = slots.reduce((acc, slot) => {
        const date = new Date(slot.start_time).toLocaleDateString();
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(slot);
        return acc;
      }, {});

      setSlotsByDate(groupedSlots);
      
      // Set initial selected date if not already set
      if (!selectedDate && Object.keys(groupedSlots).length > 0) {
        setSelectedDate(Object.keys(groupedSlots)[0]);
      }
    } catch (err) {
      console.error('Error fetching slots:', err);
      setError('Failed to load available slots. Please try again.');
      toast.error('Failed to load available slots. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (date) => {
    try {
      setSelectedDate(date);
      setSelectedTime(null); // Reset selected time when date changes
    } catch (err) {
      console.error('Error selecting date:', err);
      setError('Failed to select date. Please try again.');
    }
  };

  const handleTimeSelect = (time) => {
    try {
      setSelectedTime(time);
    } catch (err) {
      console.error('Error selecting time:', err);
      setError('Failed to select time. Please try again.');
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-white mb-8 text-center">
              {salonName || 'Loading salon...'}
            </h1>

            {/* Image Gallery */}
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

            {/* Image Modal */}
            {showModal && (
              <div 
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
              </div>
            )}

            <div className="space-y-8">
              <section>
                <h3 className="text-xl font-semibold text-white mb-4">Select a Barber</h3>
                <div className="flex flex-wrap gap-4">
                  {barbers.map(barber => (
                    <button
                      key={barber.id}
                      onClick={() => setSelectedBarberId(barber.id)}
                      className={`px-6 py-3 rounded-lg border transition-colors duration-200
                        ${selectedBarberId === barber.id 
                          ? 'bg-primary-500 text-white border-primary-600' 
                          : 'bg-dark-800 text-gray-300 border-dark-700 hover:border-primary-500'}`}
                    >
                      {barber.name}
                    </button>
                  ))}
                </div>
              </section>

              {/* Date Selection */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-white">Select Date</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {Object.keys(slotsByDate).map((date) => (
                    <button
                      key={date}
                      onClick={() => handleDateSelect(date)}
                      className={`p-3 rounded-lg transition-all duration-300 ${
                        selectedDate === date
                          ? "bg-blue-500/20 border-2 border-blue-500"
                          : "bg-white/5 border border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <span className={`text-lg font-medium ${
                          selectedDate === date ? "text-blue-400" : "text-white"
                        }`}>
                          {new Date(date).toLocaleDateString(undefined, { weekday: 'short' })}
                        </span>
                        <span className={`text-sm ${
                          selectedDate === date ? "text-blue-300" : "text-white/60"
                        }`}>
                          {new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              {selectedDate && slotsByDate[selectedDate] && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4 text-white">Select Available Time</h3>
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-white/70">Selected Date:</span>
                        <span className="text-sm font-medium text-white">{selectedDate}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-xs text-green-400">Available Slots</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {slotsByDate[selectedDate].map((slot) => (
                        <button
                          key={slot.id}
                          onClick={() => handleTimeSelect(slot)}
                          className={`relative group p-3 rounded-lg transition-all duration-300 ${
                            selectedTime?.id === slot.id
                              ? "bg-blue-500/20 border-2 border-blue-500"
                              : "bg-white/5 border border-white/10 hover:bg-white/10"
                          }`}
                        >
                          <div className="flex flex-col items-center">
                            <span className={`text-lg font-medium ${
                              selectedTime?.id === slot.id ? "text-blue-400" : "text-white"
                            }`}>
                              {new Date(slot.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className={`text-xs ${
                              selectedTime?.id === slot.id ? "text-blue-300" : "text-white/60"
                            }`}>
                              {new Date(slot.start_time).getHours() < 12 ? "Morning" : 
                               new Date(slot.start_time).getHours() < 17 ? "Afternoon" : "Evening"}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>

                    {selectedTime && (
                      <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-lg font-medium text-white">Booking Summary</h4>
                          <button
                            onClick={() => setSelectedTime(null)}
                            className="text-white/70 hover:text-white transition-colors text-sm"
                          >
                            Change
                          </button>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-white/70">Salon</span>
                            <span className="text-sm font-medium text-white">{salonName}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-white/70">Date</span>
                            <span className="text-sm font-medium text-white">{selectedDate}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-white/70">Time</span>
                            <span className="text-sm font-medium text-white">
                              {new Date(selectedTime.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-white/70">Barber</span>
                            <span className="text-sm font-medium text-white">
                              {barbers.find(b => b.id === selectedBarberId)?.name || 'Not selected'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Time Selection Tips */}
                    <div className="mt-4 text-sm text-white/60 space-y-1">
                      <p>• Click on a time slot to select your preferred booking time</p>
                      <p>• Available times are shown in white</p>
                      <p>• Selected time will be highlighted in blue</p>
                    </div>

                    {/* Book Now Button */}
                    {selectedTime && (
                      <div className="mt-6 flex justify-center">
                        <button
                          onClick={() => handleBooking(selectedTime.id)}
                          className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25 flex items-center space-x-2"
                        >
                          <span className="font-medium">Book Now</span>
                          <svg 
                            className="w-5 h-5" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M13 7l5 5m0 0l-5 5m5-5H6" 
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default BookingPage;
