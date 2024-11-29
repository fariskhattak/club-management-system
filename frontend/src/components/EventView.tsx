import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Event {
  event_id: number;
  event_name: string;
  event_description: string;
  event_date: string;
  event_time: string;
  location: string;
}

interface Attendance {
  attendance_id: number;
  member_id: number;
  attendance_status: string;
  check_in_time: string;
  member_name: string; // Optional: Combine member first and last name
}

interface EventViewProps {
  currentClub: { club_id: number } | null;
}

const EventView: React.FC<EventViewProps> = ({ currentClub }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [loadingAttendance, setLoadingAttendance] = useState(false);

  useEffect(() => {
    if (currentClub) {
      fetchEvents();
    }
  }, [currentClub]);

  const fetchEvents = async () => {
    if (!currentClub) return;

    setLoadingEvents(true);
    try {
      const response = await fetch(`http://localhost:5001/api/clubs/${currentClub.club_id}/events`);
      if (response.ok) {
        const data = await response.json();
        setEvents(data.events);
      } else {
        toast.error("Failed to fetch events.");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("An error occurred while fetching events.");
    } finally {
      setLoadingEvents(false);
    }
  };

  const fetchAttendance = async (eventId: number) => {
    setLoadingAttendance(true);
    try {
      const response = await fetch(`http://localhost:5001/api/events/${eventId}/attendance`);
      if (response.ok) {
        const data = await response.json();
        setAttendance(data.attendance);
      } else {
        toast.error("Failed to fetch attendance.");
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
      toast.error("An error occurred while fetching attendance.");
    } finally {
      setLoadingAttendance(false);
    }
  };

  const handleEventClick = (eventId: number) => {
    if (selectedEventId === eventId) {
      // If the same event is clicked, collapse it
      setSelectedEventId(null);
      setAttendance([]);
    } else {
      setSelectedEventId(eventId);
      fetchAttendance(eventId);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow text-black">
      <h2 className="text-lg font-bold text-black mb-4">Events</h2>
      {loadingEvents ? (
        <p>Loading events...</p>
      ) : events.length > 0 ? (
        <table className="table-auto w-full border">
          <thead>
            <tr>
              <th className="border px-4 py-2 text-left bg-navbar">Event Name</th>
              <th className="border px-4 py-2 text-left bg-navbar">Date</th>
              <th className="border px-4 py-2 text-left bg-navbar">Time</th>
              <th className="border px-4 py-2 text-left bg-navbar">Location</th>
              <th className="border px-4 py-2 text-left bg-navbar">Description</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <React.Fragment key={event.event_id}>
                <tr
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleEventClick(event.event_id)}
                >
                  <td className="border px-4 py-2">{event.event_name}</td>
                  <td className="border px-4 py-2">{event.event_date}</td>
                  <td className="border px-4 py-2">{event.event_time}</td>
                  <td className="border px-4 py-2">{event.location}</td>
                  <td className="border px-4 py-2">{event.event_description || "N/A"}</td>
                </tr>
                {selectedEventId === event.event_id && (
                  <tr>
                    <td colSpan={5} className="p-4 bg-gray-50">
                      {loadingAttendance ? (
                        <p>Loading attendance...</p>
                      ) : attendance.length > 0 ? (
                        <table className="table-auto w-full border">
                          <thead>
                            <tr>
                              <th className="border px-4 py-2 text-left bg-navbar">Member Name</th>
                              <th className="border px-4 py-2 text-left bg-navbar">Status</th>
                              <th className="border px-4 py-2 text-left bg-navbar">Check-in Time</th>
                            </tr>
                          </thead>
                          <tbody>
                            {attendance.map((att) => (
                              <tr key={att.attendance_id}>
                                <td className="border px-4 py-2">{att.member_name || "N/A"}</td>
                                <td className="border px-4 py-2">{att.attendance_status || "N/A"}</td>
                                <td className="border px-4 py-2">{att.check_in_time || "N/A"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <p>No attendance records found for this event.</p>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No events found for this club.</p>
      )}
    </div>
  );
};

export default EventView;