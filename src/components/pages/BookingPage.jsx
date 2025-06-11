import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../../src/supabaseClient';

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
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h2>{salonName || 'Loading salon...'}</h2>
      <h3>Select a Barber</h3>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        {barbers.map(barber => (
          <button
            key={barber.id}
            onClick={() => setSelectedBarberId(barber.id)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: selectedBarberId === barber.id ? '#4CAF50' : '#eee',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {barber.name}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading available slots...</p>
      ) : (
        <>
          <h3>Select a Date</h3>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {Object.keys(slotsByDate).map(date => (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                style={{
                  padding: '0.5rem',
                  backgroundColor: selectedDate === date ? '#2196F3' : '#f0f0f0',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                {date}
              </button>
            ))}
          </div>

          {selectedDate && slotsByDate[selectedDate]?.length > 0 ? (
            <>
              <h4>Available Times on {selectedDate}</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {slotsByDate[selectedDate].map(slot => (
                  <li key={slot.id} style={{ marginBottom: '1rem' }}>
                    {new Date(slot.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                    {new Date(slot.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    <button
                      onClick={() => handleBooking(slot.id)}
                      style={{ marginLeft: '1rem' }}
                    >
                      Book
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : selectedDate ? (
            <p>No available time slots on this date.</p>
          ) : (
            <p>Please select a date to view available time slots.</p>
          )}
        </>
      )}
    </div>
  );
};

export default BookingPage;
