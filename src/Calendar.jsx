import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Calendar.css';

const localizer = momentLocalizer(moment);

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);

  // Fetch calendar data from the backend
  const fetchCalendarData = async () => {
    try {
      const response = await fetch('/api/calendar');
      const data = await response.json();

      // Map data to calendar format
      const mappedData = data.map((item) => ({
        id: item.id,
        title: item.title,
        start: new Date(item.start), // ISO format date string
        end: new Date(item.end),     // ISO format date string
        type: item.type,
        description: item.description,
        location: item.location || 'N/A',
        time: item.time || '',
      }));

      setEvents(mappedData);
    } catch (error) {
      console.error('Error fetching calendar data:', error);
    }
  };

  useEffect(() => {
    fetchCalendarData();
  }, []);
    // Log events state for debugging
    useEffect(() => {
        console.log("Events state:", events); // Add this line
      }, [events]);
    

  // Handle event click
  const handleSelectEvent = (event) => {
    alert(`Selected Event:\n\nTitle: ${event.title}\nTime: ${event.time}\nDescription: ${event.description}`);
  };

  return (
    <div className="custom-calendar-container">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        onSelectEvent={handleSelectEvent}
        className="custom-calendar"
      />
    </div>
  );
};

export default CalendarComponent;
