import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../../src/supabaseClient';
import { motion } from 'framer-motion';

const BookingPage = () => {
  const { salonId } = useParams();
  const [salonName, setSalonName] = useState('');
  const [barbers, setBarbers] = useState([]);
  const [selectedBarberId, setSelectedBarberId] = useState(null);
  const [slotsByDate, setSlotsByDate] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);

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
      alert('Please login to book.');
      return;
    }

    const { error } = await supabase
      .from('bookings')
      .insert({
        user_id: user.id,
        time_slot_id: slotId,
      });

    if (error) {
      alert('Booking failed: Slot might already be booked.');
      console.error(error);
    } else {
      alert('Booking confirmed!');
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

  return (
    <div className="min-h-screen bg-dark-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-white mb-8">
            {salonName || 'Loading salon...'}
          </h2>

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

            {loading ? (
              <div className="flex justify-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
              </div>
            ) : (
              <section className="space-y-6">
                <h3 className="text-xl font-semibold text-white">Select a Date</h3>
                <div className="flex flex-wrap gap-3">
                  {Object.keys(slotsByDate).map(date => (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className={`px-4 py-2 rounded-lg border transition-colors duration-200
                        ${selectedDate === date 
                          ? 'bg-primary-500 text-white border-primary-600' 
                          : 'bg-dark-800 text-gray-300 border-dark-700 hover:border-primary-500'}`}
                    >
                      {date}
                    </button>
                  ))}
                </div>

                {selectedDate && slotsByDate[selectedDate]?.length > 0 ? (
                  <div className="mt-8">
                    <h4 className="text-lg font-medium text-white mb-4">
                      Available Times on {selectedDate}
                    </h4>
                    <div className="grid gap-3">
                      {slotsByDate[selectedDate].map(slot => (
                        <div 
                          key={slot.id}
                          className="flex items-center justify-between p-4 bg-dark-800 rounded-lg border border-dark-700"
                        >
                          <span className="text-gray-300">
                            {new Date(slot.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                            {new Date(slot.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <button
                            onClick={() => handleBooking(slot.id)}
                            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors duration-200"
                          >
                            Book Now
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : selectedDate ? (
                  <p className="text-gray-400 text-center py-8">No available time slots on this date.</p>
                ) : (
                  <p className="text-gray-400 text-center py-8">Please select a date to view available time slots.</p>
                )}
              </section>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BookingPage;
