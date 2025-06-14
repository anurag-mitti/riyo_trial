import { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../../src/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../Header';
import Footer from '../Footer';
import SalonImageGallery from '../SalonImageGallery';
import { FaTimes } from "react-icons/fa";
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

// Hardcoded services data
const SAMPLE_SERVICES = [
  {
    id: 1,
    name: "Haircut",
    description: "Classic haircut with styling",
    duration_minutes: 30,
    price: 25
  },
  {
    id: 2,
    name: "Beard Trim",
    description: "Professional beard grooming and shaping",
    duration_minutes: 20,
    price: 15
  },
  {
    id: 3,
    name: "Hair Coloring",
    description: "Full hair coloring service",
    duration_minutes: 90,
    price: 60
  },
  {
    id: 4,
    name: "Hair Styling",
    description: "Professional hair styling and finishing",
    duration_minutes: 45,
    price: 35
  },
  {
    id: 5,
    name: "Facial",
    description: "Deep cleansing facial treatment",
    duration_minutes: 60,
    price: 40
  },
  {
    id: 6,
    name: "Hair Treatment",
    description: "Deep conditioning and repair treatment",
    duration_minutes: 45,
    price: 45
  }
];

const BookingPage = () => {
  const { salonId } = useParams();
  const navigate = useNavigate();
  const [salonName, setSalonName] = useState('');
  const [barbers, setBarbers] = useState([]);
  const [selectedBarberId, setSelectedBarberId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [slotsByDate, setSlotsByDate] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [user, setUser] = useState(null);
  const [isBooking, setIsBooking] = useState(false);

  // Memoized calculations
  const calculateTotal = useMemo(() => {
    return selectedServices.reduce((total, service) => total + (service.price || 0), 0);
  }, [selectedServices]);

  const selectedBarber = useMemo(() => {
    return barbers.find(b => b.id === selectedBarberId);
  }, [barbers, selectedBarberId]);

  // Memoized callbacks
  const handleServiceSelection = useCallback((service) => {
    setSelectedServices(prev => {
      const isSelected = prev.some(s => s.id === service.id);
      if (isSelected) {
        return prev.filter(s => s.id !== service.id);
      } else {
        return [...prev, service];
      }
    });
  }, []);

  const handleBarberSelection = useCallback((barberId) => {
    setSelectedBarberId(barberId);
    setSelectedDate(null);
    setSelectedTime(null);
  }, []);

  const handleDateSelection = useCallback((date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  }, []);

  const handleTimeSelection = useCallback((time) => {
    setSelectedTime(time);
  }, []);

  // Fetch current user with cleanup
  useEffect(() => {
    let mounted = true;

    const fetchUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        
        if (mounted) {
          if (!user) {
            toast.error('Please login to book an appointment');
            navigate('/login');
            return;
          }
          setUser(user);
        }
      } catch (error) {
        if (mounted) {
          toast.error('Authentication error. Please try again.');
          navigate('/login');
        }
      }
    };

    fetchUser();
    return () => { mounted = false; };
  }, [navigate]);

  // Fetch salon name with cleanup
  useEffect(() => {
    let mounted = true;

    const fetchSalon = async () => {
      try {
      const { data, error } = await supabase
        .from('salons')
        .select('name')
        .eq('id', salonId)
        .single();

        if (error) throw error;
        if (mounted && data) {
        setSalonName(data.name);
        }
      } catch (error) {
        if (mounted) {
          setError('Failed to load salon information');
          toast.error('Failed to load salon information');
        }
      }
    };

    fetchSalon();
    return () => { mounted = false; };
  }, [salonId]);

  // Fetch barbers with cleanup
  useEffect(() => {
    let mounted = true;

    const fetchBarbers = async () => {
      try {
      const { data, error } = await supabase
        .from('barbers')
        .select('id, name, photo_url, bio')
        .eq('salon_id', salonId);

        if (error) throw error;
        if (mounted && data.length > 0) {
        setBarbers(data);
        setSelectedBarberId(data[0].id);
        }
      } catch (error) {
        if (mounted) {
          setError('Failed to load barbers');
          toast.error('Failed to load barbers');
        }
      }
    };

    fetchBarbers();
    return () => { mounted = false; };
  }, [salonId]);

  // Fetch services with cleanup
  useEffect(() => {
    if (!selectedBarberId) return;

    let mounted = true;

    const fetchBarberServices = async () => {
      setLoading(true);
      try {
        const { data: barberServices, error: barberError } = await supabase
          .from('barber_services')
          .select('service_id')
          .eq('barber_id', selectedBarberId);

        if (barberError) throw barberError;

        const serviceIds = barberServices.map(bs => bs.service_id);
        const { data: servicesData, error: servicesError } = await supabase
          .from('services')
          .select('*')
          .in('id', serviceIds)
          .order('name');

        if (servicesError) throw servicesError;

        if (mounted) {
          setServices(servicesData);
          setSelectedServices([]);
        }
      } catch (error) {
        if (mounted) {
          setError('Failed to load services');
          toast.error('Failed to load services');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchBarberServices();
    return () => { mounted = false; };
  }, [selectedBarberId]);

  // Fetch time slots with cleanup
  useEffect(() => {
    if (!selectedBarberId) return;

    let mounted = true;

    const fetchSlots = async () => {
      setLoading(true);
      try {
      const { data: timeSlots, error } = await supabase
        .from('time_slots')
        .select('id, start_time, end_time')
        .eq('barber_id', selectedBarberId)
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true });

        if (error) throw error;

      const { data: bookings } = await supabase
        .from('bookings')
        .select('time_slot_id');

      const bookedSlotIds = bookings?.map(b => b.time_slot_id) || [];
      const available = timeSlots.filter(slot => !bookedSlotIds.includes(slot.id));

      const grouped = available.reduce((acc, slot) => {
        const dateKey = new Date(slot.start_time).toLocaleDateString();
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(slot);
        return acc;
      }, {});

        if (mounted) {
      setSlotsByDate(grouped);
          setSelectedDate(null);
        }
      } catch (error) {
        if (mounted) {
          setError('Failed to load time slots');
          toast.error('Failed to load time slots');
        }
      } finally {
        if (mounted) {
      setLoading(false);
        }
      }
    };

    fetchSlots();
    return () => { mounted = false; };
  }, [selectedBarberId]);

  // Optimized booking handler
  const handleBooking = useCallback(async () => {
    if (!user) {
      toast.error('Please login to book an appointment');
      navigate('/login');
      return;
    }

    if (selectedServices.length === 0) {
      toast.error('Please select at least one service');
      return;
    }

    if (isBooking) return; // Prevent double booking

    try {
      setIsBooking(true);
      setLoading(true);

      const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!currentUser) throw new Error('User not authenticated');

      const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
          user_id: currentUser.id,
          barber_id: selectedBarberId,
          time_slot_id: selectedTime.id,
          salon_id: salonId,
          total_price: calculateTotal
        })
        .select('booking_id')
        .single();

      if (bookingError) throw bookingError;
      if (!booking) throw new Error('Failed to create booking');

      const bookingServices = selectedServices.map(service => ({
        booking_id: booking.booking_id,
        booked_service: service.id,
        quantity: 1
      }));

      const { error: servicesError } = await supabase
        .from('booking_services')
        .insert(bookingServices);

      if (servicesError) throw servicesError;

      toast.success('Booking confirmed!');
      window.scrollTo(0, 0);
      navigate('/booking-history');
    } catch (error) {
      toast.error(error.message || 'Failed to create booking');
    } finally {
      setLoading(false);
      setIsBooking(false);
    }
  }, [user, selectedServices, selectedBarberId, selectedTime, calculateTotal, navigate]);

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

            {/* Image Gallery Component */}
            <SalonImageGallery salonId={salonId} />

            <div className="space-y-8">
              {/* Services Section */}
              <section>
                <h3 className="text-xl font-semibold text-white mb-4">Select Services</h3>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
                    <p className="text-gray-400 mt-2">Loading services...</p>
                  </div>
                ) : services.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {services.map(service => (
                      <button
                        key={service.id}
                        onClick={() => handleServiceSelection(service)}
                        className={`p-4 rounded-lg border transition-all duration-200 text-left
                          ${selectedServices.some(s => s.id === service.id)
                            ? 'bg-primary-500/20 border-primary-500'
                            : 'bg-dark-800 border-dark-700 hover:border-primary-500'}`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className={`font-medium ${
                              selectedServices.some(s => s.id === service.id)
                                ? 'text-primary-400'
                                : 'text-white'
                            }`}>
                              {service.name}
                            </h4>
                            {service.description && (
                              <p className="text-sm text-gray-400 mt-1">{service.description}</p>
                            )}
                    </div>
                          <div className="text-right">
                            <span className={`font-medium ${
                              selectedServices.some(s => s.id === service.id)
                                ? 'text-primary-400'
                                : 'text-white'
                            }`}>
                              ₹{service.price}
                            </span>
                            {service.duration_minutes && (
                              <p className="text-xs text-gray-400 mt-1">
                                {service.duration_minutes} mins
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No services available for this barber</p>
                  </div>
                )}
              </section>

              {/* Selected Services Summary */}
              {selectedServices.length > 0 && (
                <div className="bg-dark-800 rounded-lg p-4 border border-dark-700">
                  <h4 className="text-lg font-medium text-white mb-3">Selected Services</h4>
                  <div className="space-y-2">
                    {selectedServices.map(service => (
                      <div key={service.id} className="flex justify-between items-center text-sm">
                        <span className="text-gray-300">{service.name}</span>
                        <span className="text-primary-400">₹{service.price}</span>
                      </div>
                    ))}
                    <div className="border-t border-dark-700 mt-2 pt-2">
                      <div className="flex justify-between items-center font-medium">
                        <span className="text-white">Total</span>
                        <span className="text-primary-400">₹{calculateTotal}</span>
                      </div>
                    </div>
              </div>
            </div>
              )}

              <section>
                <h3 className="text-xl font-semibold text-white mb-4">Select a Barber</h3>
                <div className="flex flex-wrap gap-4">
                  {barbers.map(barber => (
                    <button
                      key={barber.id}
                      onClick={() => handleBarberSelection(barber.id)}
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
                        onClick={() => handleDateSelection(date)}
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
                          onClick={() => handleTimeSelection(slot)}
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
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                            <span className="text-xs text-green-400">Slot Available</span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {/* Selected Services */}
                          {selectedServices.length > 0 && (
                            <div className="space-y-2">
                              <h5 className="text-sm font-medium text-white/80">Selected Services</h5>
                              {selectedServices.map(service => (
                                <div key={service.id} className="flex justify-between items-center text-sm bg-white/5 p-2 rounded">
                                  <div>
                                    <span className="text-white">{service.name}</span>
                                    <span className="text-white/60 text-xs block">{service.duration_minutes} mins</span>
                                  </div>
                                  <span className="text-primary-400">₹{service.price}</span>
                                </div>
                              ))}
                              <div className="border-t border-white/10 pt-2">
                                <div className="flex justify-between items-center text-sm">
                                  <span className="text-white/80">Services Total</span>
                                  <span className="text-primary-400">₹{calculateTotal}</span>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Barber Info */}
                          <div className="flex justify-between items-center">
                            <span className="text-white/60">Barber</span>
                            <span className="text-white font-medium">
                              {barbers.find(b => b.id === selectedBarberId)?.name}
                            </span>
                          </div>

                          {/* Date and Time */}
                          <div className="flex justify-between items-center">
                            <span className="text-white/60">Date</span>
                            <span className="text-white font-medium">{selectedDate}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-white/60">Time</span>
                            <span className="text-white font-medium">
                              {new Date(selectedTime.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>

                          {/* Total Amount */}
                          <div className="border-t border-white/10 pt-3">
                            <div className="flex justify-between items-center">
                              <span className="text-white font-medium">Total Amount</span>
                              <span className="text-xl font-bold text-primary-400">
                                ₹{calculateTotal}
                              </span>
                            </div>
                          </div>

                          {/* Book Now Button */}
                            <button
                            onClick={() => setShowReceipt(true)}
                            className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-primary-500/25 flex items-center justify-center space-x-2"
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
                                d="M5 13l4 4L19 7" 
                              />
                            </svg>
                            </button>
                          </div>
                      </div>
                    )}
                      </div>
                    </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>

      {/* Receipt Popup */}
      <AnimatePresence>
        {showReceipt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowReceipt(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-dark-800 rounded-xl p-6 w-full max-w-md border border-white/10 max-h-[90vh] flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-white">Booking Confirmation</h3>
                <button
                  onClick={() => setShowReceipt(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="space-y-4 overflow-y-auto flex-1 pr-2">
                {/* Salon Info */}
                <div className="bg-dark-700/50 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-white mb-2">{salonName}</h4>
                  <p className="text-gray-400 text-sm">Booking Details</p>
                </div>

                {/* Selected Services */}
                <div className="space-y-2">
                  <h4 className="text-white font-medium">Selected Services</h4>
                  <div className="max-h-[200px] overflow-y-auto pr-2">
                    {selectedServices.map(service => (
                      <div key={service.id} className="flex justify-between items-center text-sm bg-dark-700/30 p-2 rounded mb-2">
                        <div>
                          <span className="text-white">{service.name}</span>
                          <span className="text-gray-400 text-xs block">{service.duration_minutes} mins</span>
                        </div>
                        <span className="text-primary-400">₹{service.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Barber Info */}
                <div className="bg-dark-700/30 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-1">Barber</h4>
                  <p className="text-gray-300">
                    {barbers.find(b => b.id === selectedBarberId)?.name}
                  </p>
                </div>

                {/* Date and Time */}
                <div className="bg-dark-700/30 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-1">Appointment Time</h4>
                  <p className="text-gray-300">
                    {selectedDate && new Date(selectedDate).toLocaleDateString(undefined, {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-gray-300">
                    {selectedTime && new Date(selectedTime.start_time).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                {/* Total Amount */}
                <div className="border-t border-white/10 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">Total Amount</span>
                    <span className="text-primary-400 text-xl font-semibold">
                      ₹{calculateTotal}
                    </span>
                  </div>
                </div>
              </div>

              {/* Confirm Button - Fixed at bottom */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <button
                  onClick={() => {
                    handleBooking();
                    setShowReceipt(false);
                  }}
                  className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Confirm Booking
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
};

export default BookingPage;
