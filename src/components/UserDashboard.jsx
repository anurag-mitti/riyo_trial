import React, { useEffect, useState } from 'react';
import { supabase } from '../../src/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Header';
import toast from 'react-hot-toast';
import { FaMapMarkerAlt } from 'react-icons/fa';

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [upcomingLimit, setUpcomingLimit] = useState(3);
  const [previousLimit, setPreviousLimit] = useState(3);
  const [cancelPopup, setCancelPopup] = useState({ open: false, booking: null });
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    const fetchUserAndBookings = async () => {
      try {
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        setUser(user);

        // Fetch bookings with related data
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select(`
            booking_id,
            total_price,
            created_at,
            status,
            salon_id,
            barber_id,
            salons (
              name,
              address
            ),
            time_slots (
              start_time,
              end_time
            ),
            barbers (
              name
            ),
            booking_services!inner (
              quantity,
              booked_service,
              services!inner (
                name
              )
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (bookingsError) throw bookingsError;

        // Fetch barber-specific prices for each booking
        const bookingsWithPrices = await Promise.all(
          bookingsData.map(async (booking) => {
            if (booking.barber_id && booking.booking_services) {
              const serviceIds = booking.booking_services.map(bs => bs.booked_service);
              
              const { data: barberServices, error: barberServicesError } = await supabase
                .from('barber_services')
                .select('service_id, price')
                .eq('barber_id', booking.barber_id)
                .in('service_id', serviceIds);

              if (!barberServicesError && barberServices) {
                // Add prices to booking services
                const updatedBookingServices = booking.booking_services.map(bs => {
                  const barberService = barberServices.find(bs2 => bs2.service_id === bs.booked_service);
                  return {
                    ...bs,
                    price: barberService?.price || 0
                  };
                });

                return {
                  ...booking,
                  booking_services: updatedBookingServices
                };
              }
            }
            return booking;
          })
        );

        setBookings(bookingsWithPrices);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndBookings();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isPastBooking = (booking) => {
    if (!booking.time_slots?.start_time) return false;
    const bookingTime = new Date(booking.time_slots.start_time);
    return bookingTime < new Date();
  };

  // Separate bookings into upcoming and previous
  const upcomingBookings = bookings.filter(booking => !isPastBooking(booking));
  const previousBookings = bookings.filter(booking => isPastBooking(booking));

  // Sort upcoming bookings by date (soonest first)
  const sortedUpcomingBookings = upcomingBookings.sort((a, b) => {
    const dateA = new Date(a.time_slots?.start_time || 0);
    const dateB = new Date(b.time_slots?.start_time || 0);
    return dateA - dateB;
  });

  // Sort previous bookings by date (most recent first)
  const sortedPreviousBookings = previousBookings.sort((a, b) => {
    const dateA = new Date(a.time_slots?.start_time || 0);
    const dateB = new Date(b.time_slots?.start_time || 0);
    return dateB - dateA;
  });

  // Helper: can cancel if more than 3 hours before start and not already cancelled
  const canCancelBooking = (booking) => {
    if (!booking.time_slots?.start_time) return false;
    if (booking.status === 'CANCELLED') return false;
    const bookingTime = new Date(booking.time_slots.start_time);
    const now = new Date();
    const diffMs = bookingTime - now;
    return diffMs > 3 * 60 * 60 * 1000; // 3 hours in ms
  };

  const handleCancelBooking = async (booking) => {
    setIsCancelling(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'CANCELLED' })
        .eq('booking_id', booking.booking_id);
      if (error) throw error;
      setBookings((prev) => prev.map((b) =>
        b.booking_id === booking.booking_id ? { ...b, status: 'CANCELLED' } : b
      ));
      toast.success('Booking cancelled successfully');
    } catch (err) {
      toast.error('Failed to cancel booking');
    } finally {
      setIsCancelling(false);
      setCancelPopup({ open: false, booking: null });
    }
  };

  const BookingCard = ({ booking, isNext = false }) => (
    <motion.div
      key={booking.booking_id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-dark-800 rounded-lg p-4 border ${isNext ? 'border-primary-500/50' : 'border-white/10'}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Booking #{booking.booking_id?.slice(0, 8)}
          </h3>
          <p className="text-gray-400 text-xs">
            {booking.time_slots?.start_time ? formatDate(booking.time_slots.start_time) : 'Date not available'}
          </p>
        </div>
        <div>
          <span className="text-primary-400 font-medium text-sm">
            ₹{booking.total_price || 0}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {/* Salon and Barber Info */}
        <div className="bg-dark-700/50 rounded-md p-3">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-white text-sm font-medium">{booking.salons?.name || 'Salon not available'}</p>
              <p className="text-gray-400 text-xs">{booking.barbers?.name || 'Barber not available'}</p>
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booking.salons?.address || booking.salons?.name || '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1"
            >
              <FaMapMarkerAlt className="text-sm" />
              <span className="text-xs">Map</span>
            </a>
          </div>
          <p className="text-gray-300 text-xs">
            {booking.time_slots?.start_time && booking.time_slots?.end_time ? (
              `${formatTime(booking.time_slots.start_time)} - ${formatTime(booking.time_slots.end_time)}`
            ) : (
              'Time slot not available'
            )}
          </p>
        </div>

        {/* Services Summary */}
        <div className="bg-dark-700/50 rounded-md p-3">
          <h4 className="text-white font-medium text-sm mb-2">Services</h4>
          <div className="space-y-1">
            {Array.isArray(booking.booking_services) && booking.booking_services.length > 0 ? (
              booking.booking_services.slice(0, 2).map((bs, index) => (
                <div key={index} className="flex justify-between items-center text-xs">
                  <span className="text-gray-300">{bs.services?.name || 'Service not available'}</span>
                  <span className="text-primary-400">₹{bs.price || 0}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-xs">No services found</p>
            )}
            {booking.booking_services && booking.booking_services.length > 2 && (
              <p className="text-gray-400 text-xs">+{booking.booking_services.length - 2} more services</p>
            )}
          </div>
        </div>

        {/* Booking Status & Cancel Button */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <span className="text-xs text-gray-400">
            Booked on {booking.created_at ? formatDate(booking.created_at) : 'Date not available'}
          </span>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium
              ${booking.status === 'CANCELLED'
                ? 'bg-red-500/20 text-red-400 border border-red-400/30'
                : isPastBooking(booking)
                  ? 'bg-gray-500/20 text-gray-400'
                  : isNext
                    ? 'bg-primary-500/20 text-primary-400'
                    : 'bg-green-500/20 text-green-400'}
            `}>
              {booking.status === 'CANCELLED'
                ? 'CANCELLED'
                : isPastBooking(booking)
                  ? 'Previous'
                  : isNext
                    ? 'NEXT'
                    : 'Confirmed'}
            </span>
            {/* Cancel Button: only for upcoming, >3h before, not cancelled */}
            {canCancelBooking(booking) && (
              <button
                className="ml-2 px-3 py-1 rounded-lg bg-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-500/40 transition-colors border border-red-400/30 backdrop-blur"
                onClick={() => setCancelPopup({ open: true, booking })}
                disabled={isCancelling}
              >
                Cancel Booking
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <>
      <Header />
      <main className="min-h-screen bg-dark-900">
        <div className="max-w-6xl mx-auto px-4 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-white mb-8 text-center">
              My Bookings
            </h1>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
              </div>
            ) : bookings.length > 0 ? (
              <div className="space-y-8">
                {/* Upcoming Bookings Section */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    Upcoming Bookings ({sortedUpcomingBookings.length})
                  </h2>
                  {sortedUpcomingBookings.length > 0 ? (
                    <div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        {sortedUpcomingBookings.slice(0, upcomingLimit).map((booking, index) => (
                          <BookingCard 
                    key={booking.booking_id}
                            booking={booking} 
                            isNext={index === 0} // Only the first (soonest) booking gets "NEXT" status
                          />
                        ))}
                      </div>
                      {sortedUpcomingBookings.length > upcomingLimit && (
                        <div className="text-center">
                          <button
                            onClick={() => setUpcomingLimit(prev => prev + 3)}
                            className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg transition-colors"
                          >
                            Load More Upcoming
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-dark-800 rounded-xl border border-white/10">
                      <p className="text-gray-400">No upcoming bookings</p>
                      </div>
                  )}
                      </div>

                {/* Previous Bookings Section */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <span className="w-3 h-3 bg-gray-500 rounded-full"></span>
                    Previous Bookings ({sortedPreviousBookings.length})
                  </h2>
                  {sortedPreviousBookings.length > 0 ? (
                    <div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        {sortedPreviousBookings.slice(0, previousLimit).map((booking) => (
                          <BookingCard key={booking.booking_id} booking={booking} />
                        ))}
                      </div>
                      {sortedPreviousBookings.length > previousLimit && (
                        <div className="text-center">
                          <button
                            onClick={() => setPreviousLimit(prev => prev + 3)}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
                          >
                            Load More Previous
                          </button>
                        </div>
                      )}
                      </div>
                  ) : (
                    <div className="text-center py-12 bg-dark-800 rounded-xl border border-white/10">
                      <p className="text-gray-400">No previous bookings</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400">No bookings found</p>
              </div>
            )}
          </motion.div>
        </div>
      </main>
      {/* Cancel Confirmation Popup */}
      <AnimatePresence>
        {cancelPopup.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setCancelPopup({ open: false, booking: null })}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-dark-800/80 border border-white/10 rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center backdrop-blur-xl relative"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Cancel Booking?</h3>
              <p className="text-gray-300 mb-7 text-base leading-relaxed">
                Are you sure you want to cancel this booking? <br />This action cannot be undone.
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  className="px-5 py-2 rounded-lg bg-dark-700/70 text-gray-200 hover:bg-dark-700/90 border border-white/10 transition-colors font-medium shadow-sm"
                  onClick={() => setCancelPopup({ open: false, booking: null })}
                  disabled={isCancelling}
                >
                  No, Go Back
                </button>
                <button
                  className="px-5 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-colors font-semibold shadow-lg border border-primary-400/30"
                  onClick={() => handleCancelBooking(cancelPopup.booking)}
                  disabled={isCancelling}
                >
                  {isCancelling ? 'Cancelling...' : 'Yes, Cancel'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default UserDashboard;
