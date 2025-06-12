import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient.js';
import { motion } from 'framer-motion';

const UserDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bookings');

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error('Failed to get user:', userError);
        return;
      }

      setUserInfo(user);

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          created_at,
          time_slots (
            id,
            start_time,
            end_time,
            barbers (
              name,
              salons (
                name,
                address
              )
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bookings:', error);
      } else {
        setBookings(data);
      }

      setLoading(false);
    };

    fetchUserData();
  }, []);

  const now = new Date();

  const upcoming = bookings.filter(
    b => new Date(b.time_slots?.start_time) > now
  );
  const past = bookings.filter(
    b => new Date(b.time_slots?.start_time) <= now
  );

  return (
    <>
      <main className="min-h-screen bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-4 gap-8"
          >
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-dark-800 rounded-xl p-6 shadow-xl border border-white/10">
                <h2 className="text-xl font-bold text-white mb-6">Dashboard</h2>
                <div className="space-y-4">
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      activeTab === 'bookings'
                        ? 'bg-primary-500/20 text-primary-400 border border-primary-500/50'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Bookings
                  </button>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      activeTab === 'profile'
                        ? 'bg-primary-500/20 text-primary-400 border border-primary-500/50'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Profile
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-dark-800 rounded-xl p-6 shadow-xl border border-white/10">
                {/* Bookings Tab */}
                {activeTab === 'bookings' && (
                  <>
                    <h2 className="text-2xl font-bold text-white mb-6">Your Bookings</h2>
                    {loading ? (
                      <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Upcoming Bookings */}
                        <section>
                          <h3 className="text-xl font-semibold text-white mb-4">Upcoming Bookings</h3>
                          {upcoming.length ? (
                            upcoming.map(b => (
                              <div
                                key={b.id}
                                className="bg-dark-700 p-4 rounded-lg border border-white/10 hover:border-primary-500/50 transition-colors mb-4"
                              >
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-primary-400 font-medium">{b.time_slots?.barbers?.salons?.name}</span>
                                    <span className="text-white/40">•</span>
                                    <span className="text-white/60">{b.time_slots?.barbers?.salons?.address}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <span className="text-white/80">Barber: {b.time_slots?.barbers?.name}</span>
                                    <span className="text-white/40">•</span>
                                    <span className="text-white/60">
                                      {new Date(b.time_slots?.start_time).toLocaleDateString()} at{' '}
                                      {new Date(b.time_slots?.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-white/60">No upcoming bookings.</p>
                          )}
                        </section>

                        {/* Past Bookings */}
                        <section>
                          <h3 className="text-xl font-semibold text-white mb-4">Past Bookings</h3>
                          {past.length ? (
                            past.map(b => (
                              <div
                                key={b.id}
                                className="bg-dark-700 p-4 rounded-lg border border-white/10 hover:border-primary-500/50 transition-colors mb-4"
                              >
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-primary-400 font-medium">{b.time_slots?.barbers?.salons?.name}</span>
                                    <span className="text-white/40">•</span>
                                    <span className="text-white/60">{b.time_slots?.barbers?.salons?.address}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <span className="text-white/80">Barber: {b.time_slots?.barbers?.name}</span>
                                    <span className="text-white/40">•</span>
                                    <span className="text-white/60">
                                      {new Date(b.time_slots?.start_time).toLocaleDateString()} at{' '}
                                      {new Date(b.time_slots?.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-white/60">No past bookings.</p>
                          )}
                        </section>
                      </div>
                    )}
                  </>
                )}

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <section>
                    <h2 className="text-2xl font-bold text-white mb-6">Your Profile</h2>
                    {userInfo ? (
                      <div className="bg-dark-700 p-6 rounded-lg border border-white/10">
                        <div className="space-y-4">
                          <div>
                            <span className="text-white/60">Email</span>
                            <p className="text-white font-medium">{userInfo.email}</p>
                          </div>
                          {userInfo.user_metadata?.full_name && (
                            <div>
                              <span className="text-white/60">Full Name</span>
                              <p className="text-white font-medium">{userInfo.user_metadata.full_name}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-white/60">User info not available.</p>
                    )}
                  </section>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
};

export default UserDashboard;
