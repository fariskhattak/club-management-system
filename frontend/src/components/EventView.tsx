import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Event {
  event_id: number;
  event_name: string;
  event_description: string;
  event_date: string; // ISO date
  event_time: string; // ISO time
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
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    event_name: "",
    event_description: "",
    event_date: "",
    event_time: "",
    location: "",
  });
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [newAttendance, setNewAttendance] = useState({
    student_id: "",
    attendance_status: "Present",
    check_in_time: "",
  });

  // Add new attendance record
  const handleAddAttendance = async () => {
    if (!currentClub || !selectedEventId) {
      toast.error("No club or event selected.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/events/${selectedEventId}/attendance`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newAttendance),
        }
      );

      if (response.ok) {
        toast.success("Attendance added successfully!");
        fetchAttendance(selectedEventId); // Refresh attendance list
        setIsAttendanceModalOpen(false);
        setNewAttendance({
          student_id: "",
          attendance_status: "Present",
          check_in_time: "",
        });
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to add attendance.");
      }
    } catch (error) {
      console.error("Error adding attendance:", error);
      toast.error("An error occurred while adding attendance.");
    }
  };

  // Delete attendance record
  const handleDeleteAttendance = async (attendanceId: number) => {
    if (!selectedEventId) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/events/${selectedEventId}/attendance/${attendanceId}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        toast.success("Attendance record deleted successfully!");
        setAttendance((prev) =>
          prev.filter((record) => record.attendance_id !== attendanceId)
        );
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to delete attendance.");
      }
    } catch (error) {
      console.error("Error deleting attendance:", error);
      toast.error("An error occurred while deleting attendance.");
    }
  };

  useEffect(() => {
    if (currentClub) {
      fetchEvents();
    }
  }, [currentClub]);

  const fetchEvents = async () => {
    if (!currentClub) return;

    setLoadingEvents(true);
    try {
      const [upcomingResponse, pastResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${currentClub.club_id}/upcoming`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${currentClub.club_id}/past`),
      ]);

      if (upcomingResponse.ok && pastResponse.ok) {
        const upcomingData = await upcomingResponse.json();
        const pastData = await pastResponse.json();
        setUpcomingEvents(upcomingData);
        setPastEvents(pastData);
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}/attendance`);
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
      // Collapse expanded event
      setSelectedEventId(null);
      setAttendance([]);
    } else {
      setSelectedEventId(eventId);
      fetchAttendance(eventId);
    }
  };

  const handleAddEvent = async () => {
    if (!currentClub) {
      toast.error("No club selected.");
      return;
    }

    // Format the event_time to include seconds
    const formattedEvent = {
      ...newEvent,
      event_time: `${newEvent.event_time}:00`, // Add seconds if not provided
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/events/${currentClub.club_id}/events`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedEvent),
        }
      );

      if (response.ok) {
        toast.success("Event added successfully!");
        fetchEvents(); // Refresh the event list
        setIsAddModalOpen(false);
        setNewEvent({
          event_name: "",
          event_description: "",
          event_date: "",
          event_time: "",
          location: "",
        });
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to add event.");
      }
    } catch (error) {
      console.error("Error adding event:", error);
      toast.error("An error occurred while adding the event.");
    }
  };


  const handleDeleteEvent = async () => {
    if (!eventToDelete || !currentClub) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/events/${currentClub.club_id}/${eventToDelete.event_id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        toast.success("Event deleted successfully!");
        fetchEvents(); // Refresh event list
        setIsDeleteModalOpen(false);
        setEventToDelete(null);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to delete event.");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("An error occurred while deleting the event.");
    }
  };


  const renderEventTable = (events: Event[], title: string) => (
    <>
      <h2 className="text-lg font-bold text-black mb-4">{title}</h2>
      {events.length > 0 ? (
        <table className="table-auto w-full border mb-8">
          <thead>
            <tr>
              <th className="border px-4 py-2 text-left bg-cms_light_purple">Event Name</th>
              <th className="border px-4 py-2 text-left bg-cms_light_purple">Date</th>
              <th className="border px-4 py-2 text-left bg-cms_light_purple">Time</th>
              <th className="border px-4 py-2 text-left bg-cms_light_purple">Location</th>
              <th className="border px-4 py-2 text-left bg-cms_light_purple">Actions</th>
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
                  <td className="border px-4 py-2 flex items-center">
                    <button
                      onClick={() => {
                        setEventToDelete(event);
                        setIsDeleteModalOpen(true);
                      }}
                      className="text-red-500 hover:text-red-700 ml-2"
                      title="Delete Event"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 3a3 3 0 00-3 3v1H4.5a.75.75 0 000 1.5h15a.75.75 0 000-1.5H18V6a3 3 0 00-3-3H9zM6.75 7.5v12a2.25 2.25 0 002.25 2.25h6a2.25 2.25 0 002.25-2.25v-12H6.75zm3 3a.75.75 0 011.5 0v6a.75.75 0 01-1.5 0v-6zm4.5 0a.75.75 0 011.5 0v6a.75.75 0 01-1.5 0v-6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
                {selectedEventId === event.event_id && (
                  <tr>
                    <td colSpan={5} className="p-4 bg-gray-50">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold">Attendance</h3>
                        <button
                          onClick={() => setIsAttendanceModalOpen(true)}
                          className="px-4 py-2 bg-cms_soft_teal font-bold text-white rounded hover:bg-cyan-700"
                        >
                          Add Attendance
                        </button>
                      </div>
                      {loadingAttendance ? (
                        <p>Loading attendance...</p>
                      ) : attendance.length > 0 ? (
                        <table className="table-auto w-full border">
                          <thead>
                            <tr>
                              <th className="border px-4 py-2 text-left bg-cms_light_purple">Student Name</th>
                              <th className="border px-4 py-2 text-left bg-cms_light_purple">Status</th>
                              <th className="border px-4 py-2 text-left bg-cms_light_purple">Check-in Time</th>
                              <th className="border px-4 py-2 text-left bg-cms_light_purple">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {attendance.map((record) => (
                              <tr key={record.attendance_id}>
                                <td className="border px-4 py-2">{record.member_name}</td>
                                <td className="border px-4 py-2">{record.attendance_status}</td>
                                <td className="border px-4 py-2">{record.check_in_time || "N/A"}</td>
                                <td className="border px-4 py-2">
                                  <button
                                    onClick={() => handleDeleteAttendance(record.attendance_id)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 24 24"
                                      fill="currentColor"
                                      className="w-6 h-6"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M9 3a3 3 0 00-3 3v1H4.5a.75.75 0 000 1.5h15a.75.75 0 000-1.5H18V6a3 3 0 00-3-3H9zM6.75 7.5v12a2.25 2.25 0 002.25 2.25h6a2.25 2.25 0 002.25-2.25v-12H6.75zm3 3a.75.75 0 011.5 0v6a.75.75 0 01-1.5 0v-6zm4.5 0a.75.75 0 011.5 0v6a.75.75 0 01-1.5 0v-6z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </button>
                                </td>
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
        <p className="mb-8">No events found.</p>
      )}
    </>
  );


  return (
    <div className="p-4 bg-white rounded shadow text-black">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-black">Events</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-cms_soft_teal font-bold text-white rounded hover:bg-cyan-700"
        >
          Add Event
        </button>
      </div>
      {loadingEvents ? (
        <p>Loading events...</p>
      ) : (
        <>
          {renderEventTable(upcomingEvents, "Upcoming Events")}
          {renderEventTable(pastEvents, "Past Events")}
        </>
      )}

      {/* Add Event Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-bold text-black mb-4">Add Event</h2>
            <form className="space-y-4">
              <input
                type="text"
                name="event_name"
                value={newEvent.event_name}
                onChange={(e) =>
                  setNewEvent((prev) => ({ ...prev, event_name: e.target.value }))
                }
                placeholder="Event Name"
                className="w-full px-3 py-2 border rounded"
                required
              />
              <textarea
                name="event_description"
                value={newEvent.event_description}
                onChange={(e) =>
                  setNewEvent((prev) => ({ ...prev, event_description: e.target.value }))
                }
                placeholder="Event Description"
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="date"
                name="event_date"
                value={newEvent.event_date}
                onChange={(e) =>
                  setNewEvent((prev) => ({ ...prev, event_date: e.target.value }))
                }
                className="w-full px-3 py-2 border rounded"
                required
              />
              <input
                type="time"
                name="event_time"
                value={newEvent.event_time}
                onChange={(e) =>
                  setNewEvent((prev) => ({ ...prev, event_time: e.target.value }))
                }
                className="w-full px-3 py-2 border rounded"
                required
              />
              <input
                type="text"
                name="location"
                value={newEvent.location}
                onChange={(e) =>
                  setNewEvent((prev) => ({ ...prev, location: e.target.value }))
                }
                placeholder="Location"
                className="w-full px-3 py-2 border rounded"
                required
              />
            </form>
            <div className="mt-4 flex justify-between">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={handleAddEvent}
              >
                Submit
              </button>
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setIsAddModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && eventToDelete && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-bold text-black mb-4">Confirm Deletion</h2>
            <p className="text-gray-700">
              Are you sure you want to delete the event{" "}
              <strong>{eventToDelete.event_name}</strong>? This action cannot be undone.
            </p>
            <div className="mt-4 flex space-x-2">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={handleDeleteEvent}
              >
                Delete
              </button>
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setEventToDelete(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Attendance Modal */}
      {isAttendanceModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-cms_light_purple rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-bold ">Add Attendance</h2>
            <form className="space-y-4">
              <input
                type="text"
                name="student_id"
                value={newAttendance.student_id}
                onChange={(e) =>
                  setNewAttendance((prev) => ({
                    ...prev,
                    student_id: e.target.value,
                  }))
                }
                placeholder="Student ID"
                className="w-full px-3 py-2 border rounded"
                required
              />
              <select
                name="attendance_status"
                value={newAttendance.attendance_status}
                onChange={(e) =>
                  setNewAttendance((prev) => ({
                    ...prev,
                    attendance_status: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border rounded"
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Excused">Excused</option>
              </select>
              <input
                type="time"
                name="check_in_time"
                value={newAttendance.check_in_time}
                onChange={(e) =>
                  setNewAttendance((prev) => ({
                    ...prev,
                    check_in_time: e.target.value,
                  }))
                }
                placeholder="Check-in Time"
                className="w-full px-3 py-2 border rounded"
              />
            </form>
            <div className="mt-4 flex justify-between">
              <button
                className="bg-cms_accept hover:bg-green-700 text-white px-4 py-2 rounded"
                onClick={handleAddAttendance}
              >
                Submit
              </button>
              <button
                className="hover:bg-red-700 bg-cms_deny text-white px-4 py-2 rounded"
                onClick={() => setIsAttendanceModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventView;
