import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient.js';

const UserDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' or 'profile'

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
              name
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
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white p-6 shadow-md">
        <h2 className="text-xl font-bold mb-4">Dashboard</h2>
        <ul className="space-y-2">
          <li
            onClick={() => setActiveTab('bookings')}
            className={`cursor-pointer font-medium ${
              activeTab === 'bookings' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            Bookings
          </li>
          <li
            onClick={() => setActiveTab('profile')}
            className={`cursor-pointer font-medium ${
              activeTab === 'profile' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            Profile
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <>
            <h2 className="text-2xl font-semibold mb-6">Your Bookings</h2>
            {loading ? (
              <p className="text-gray-600">Loading...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Upcoming Bookings */}
                <section>
                  <h3 className="text-xl font-medium mb-4">Upcoming Bookings</h3>
                  {upcoming.length ? (
                    upcoming.map(b => (
                      <div
                        key={b.id}
                        className="bg-white p-4 rounded shadow mb-4 border"
                      >
                        <p className="text-gray-800">
                          <span className="font-semibold">Barber:</span>{' '}
                          {b.time_slots?.barbers?.name}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-semibold">Time:</span>{' '}
                          {new Date(b.time_slots?.start_time).toLocaleString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No upcoming bookings.</p>
                  )}
                </section>

                {/* Past Bookings */}
                <section>
                  <h3 className="text-xl font-medium mb-4">Past Bookings</h3>
                  {past.length ? (
                    past.map(b => (
                      <div
                        key={b.id}
                        className="bg-white p-4 rounded shadow mb-4 border"
                      >
                        <p className="text-gray-800">
                          <span className="font-semibold">Barber:</span>{' '}
                          {b.time_slots?.barbers?.name}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-semibold">Time:</span>{' '}
                          {new Date(b.time_slots?.start_time).toLocaleString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No past bookings.</p>
                  )}
                </section>
              </div>
            )}
          </>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <section>
            <h2 className="text-2xl font-semibold mb-6">Your Profile</h2>
            {userInfo ? (
              <div className="bg-white p-6 rounded shadow border w-full max-w-md">
                <p className="text-gray-800 mb-2">
                  <span className="font-semibold">Email:</span> {userInfo.email}
                </p>
                {userInfo.user_metadata?.full_name && (
                  <p className="text-gray-800">
                    <span className="font-semibold">Full Name:</span>{' '}
                    {userInfo.user_metadata.full_name}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-500">User info not available.</p>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;
