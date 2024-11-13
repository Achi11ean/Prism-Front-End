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
      console.log("Fetching calendar data...");
      const response = await fetch('/api/calendar', { credentials: 'include' });
      
      console.log("Response status:", response.status);
      if (!response.ok) {
        console.error("Failed to fetch data. Status:", response.status);
        return;
      }

      const data = await response.json();
      console.log("Raw data from API:", data);

      // Map data to calendar format
      const mappedData = data.map((item) => {
        const startDate = new Date(item.start);
        const endDate = new Date(item.end);
        
        console.log("Processing item:", item);
        console.log("Parsed start date:", startDate);
        console.log("Parsed end date:", endDate);

        return {
          id: item.id,
          title: item.title,
          start: startDate,
          end: endDate,
          type: item.type,
          description: item.description,
          location: item.location || 'N/A',
          time: item.time || '',
        };
      });

      console.log("Mapped data for calendar:", mappedData);
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
    console.log("Current events state:", events);
  }, [events]);

  // Handle event click
  const handleSelectEvent = (event) => {
    console.log("Event selected:", event);
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
