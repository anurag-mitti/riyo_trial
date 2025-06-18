import React, { useEffect, useState } from 'react';
import { supabase } from '../../src/supabaseClient';
import { motion } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import toast from 'react-hot-toast';
import { FaMapMarkerAlt } from 'react-icons/fa';

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndBookings = async () => {
      try {
        // Get current user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!user) throw new Error('User not found');

        setUser(user);

        // Fetch bookings with related data
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select(`
            booking_id,
            total_price,
            created_at,
            salons (
              id,
              name,
              address
            ),
            barbers (
              id,
              name
            ),
            time_slots (
              start_time,
              end_time
            ),
            booking_services (
              quantity,
              services (
                id,
                name
              )
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (bookingsError) throw bookingsError;

        setBookings(bookingsData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndBookings();
  }, []);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const formatTime = (dateString) =>
    new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

  const isPastBooking = (booking) => {
    if (!booking.time_slots?.start_time) return false;
    const bookingTime = new Date(booking.time_slots.start_time);
    return bookingTime < new Date();
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
              My Bookings
            </h1>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
              </div>
            ) : bookings.length > 0 ? (
              <div className="space-y-6">
                {bookings.map((booking) => (
                  <motion.div
                    key={booking.booking_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-dark-800 rounded-xl p-6 border border-white/10"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white">
                          Booking #{booking.booking_id.slice(0, 8)}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {booking.time_slots?.start_time
                            ? formatDate(booking.time_slots.start_time)
                            : 'Date not available'}
                        </p>
                      </div>
                      <div className="mt-2 md:mt-0">
                        <span className="text-primary-400 font-medium">
                          ₹{booking.total_price || 0}
                        </span>
                      </div>
                    </div>

                    {/* Salon Info */}
                    <div className="bg-dark-700/50 rounded-lg p-4 mb-4">
                      <h4 className="text-white font-medium mb-2">Salon</h4>
                      <div className="flex items-center justify-between">
                        <p className="text-gray-300">
                          {booking.salons?.name || 'Salon not available'}
                        </p>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            booking.salons?.address || booking.salons?.name || ''
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-2"
                        >
                          <FaMapMarkerAlt className="text-lg" />
                          <span className="text-sm">View Location</span>
                        </a>
                      </div>
                    </div>

                    {/* Barber Info */}
                    <div className="bg-dark-700/50 rounded-lg p-4 mb-4">
                      <h4 className="text-white font-medium mb-1">Barber</h4>
                      <p className="text-gray-300">
                        {booking.barbers?.name || 'Barber not available'}
                      </p>
                    </div>

                    {/* Time Slot */}
                    <div className="bg-dark-700/50 rounded-lg p-4 mb-4">
                      <h4 className="text-white font-medium mb-1">
                        Appointment Time
                      </h4>
                      <p className="text-gray-300">
                        {booking.time_slots?.start_time &&
                        booking.time_slots?.end_time ? (
                          `${formatTime(booking.time_slots.start_time)} - ${formatTime(
                            booking.time_slots.end_time
                          )}`
                        ) : (
                          'Time slot not available'
                        )}
                      </p>
                    </div>

                    {/* Services */}
                    <div className="bg-dark-700/50 rounded-lg p-4">
                      <h4 className="text-white font-medium mb-2">Services</h4>
                      <div className="space-y-2">
                        {Array.isArray(booking.booking_services) &&
                        booking.booking_services.length > 0 ? (
                          booking.booking_services.map((bs, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center text-sm"
                            >
                              <div>
                                <span className="text-white">
                                  {bs.services?.name || 'Service not available'}
                                </span>
                                <span className="text-gray-400 text-xs block">
                                  Quantity: {bs.quantity || 0}
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-400">No services found</p>
                        )}
                      </div>
                    </div>

                    {/* Booking Status */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <span className="text-sm text-gray-400">
                        Booked on{' '}
                        {booking.created_at
                          ? formatDate(booking.created_at)
                          : 'Date not available'}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          isPastBooking(booking)
                            ? 'bg-gray-500/20 text-gray-400'
                            : 'bg-green-500/20 text-green-400'
                        }`}
                      >
                        {isPastBooking(booking) ? 'Previous' : 'Confirmed'}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400">No bookings found</p>
              </div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default UserDashboard;
