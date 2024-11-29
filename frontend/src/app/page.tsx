"use client";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toast styles

import Header from "../components/Header";
import MemberList from "../components/MemberList";
import LineGraph from "../components/LineGraph";
import SideNavbar from "../components/SideNavbar";
import MajorGraph from "../components/MajorGraph";

interface Club {
  club_id: number;
  club_name: string;
  club_description: string;
  founded_date: string;
  email: string;
}

const data = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 200 },
  { name: "Apr", value: 278 },
  { name: "May", value: 189 },
];

export default function Home() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentClub, setCurrentClub] = useState<Club | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Modal state
  const [deleteMessage, setDeleteMessage] = useState(""); // Success/Error message
  const [refreshGraphTrigger, setRefreshGraphTrigger] = useState(0);

  const handleMemberAdded = () => {
    setRefreshGraphTrigger((prev) => prev + 1); // Increment to notify dependent components
  };

  const fetchClubs = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/clubs");
      if (response.ok) {
        const data = await response.json();
        setClubs(data);
      } else {
        console.error("Failed to fetch clubs:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching clubs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  const handleClubSelection = (clubName: string) => {
    const selectedClub = clubs.find((club) => club.club_name === clubName);
    setCurrentClub(selectedClub || null);
  };

  const handleDeleteClub = async () => {
    if (!currentClub) return;

    try {
      const response = await fetch(`http://localhost:5001/api/clubs/${currentClub.club_id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Club deleted successfully!");
        setCurrentClub(null);
        fetchClubs(); // Refresh club list
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to delete club.");
      }
    } catch (error) {
      console.error("Error deleting club:", error);
      toast.error("An error occurred while deleting the club.");
    } finally {
      setIsDeleteModalOpen(false); // Close the modal
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Side Navbar */}
      <SideNavbar
        clubs={clubs.map((club) => club.club_name)}
        onSelectClub={handleClubSelection} // Pass handler to SideNavbar
        refreshClubs={fetchClubs}
      />
      {/* Main Content */}
      <div className="flex-1">
        <Header currentClub={currentClub?.club_name || undefined} />
        <main className="p-4 relative">
          {currentClub === null ? (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] bg-gray-50 rounded shadow">
              <h2 className="text-2xl font-semibold text-gray-700">
                No Club Selected
              </h2>
              <p className="text-gray-500 mt-2">
                Please select a club from the side navbar to view its details.
              </p>
              <div className="mt-4">
                <svg
                  className="w-32 h-32 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 15a4 4 0 00-1 3v1a2 2 0 002 2h16a2 2 0 002-2v-1a4 4 0 00-1-3M16 11a4 4 0 11-8 0m8 0a4 4 0 01-8 0m2 0V7a2 2 0 114 0v4"
                  ></path>
                </svg>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Graph Section */}
              <div className="col-span-3 bg-white p-4 shadow rounded">
                <MajorGraph currentClub={currentClub} refreshGraphTrigger={refreshGraphTrigger}/>
              </div>

              {/* Member List */}
              <div className="col-span-3 bg-white p-4 shadow rounded">
                <MemberList currentClub={currentClub} onMemberAdded={handleMemberAdded}/>
              </div>
            </div>
          )}

          {/* Delete Club Button */}
          {currentClub && (
            <button
              className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-red-700"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              Delete Club
            </button>
          )}

          {/* Delete Confirmation Modal */}
          {isDeleteModalOpen && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                <h2 className="text-lg font-bold text-black">
                  Are you sure you want to delete this club?
                </h2>
                <p className="text-sm text-gray-700 mt-2">
                  Deleting this club will remove all related information (members, sponsors, budgets,
                  etc.). This action cannot be undone.
                </p>
                <div className="mt-4 flex space-x-2">
                  <button
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    onClick={handleDeleteClub}
                  >
                    Confirm
                  </button>
                  <button
                    className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                    onClick={() => setIsDeleteModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Toast Notifications */}
          <ToastContainer position="bottom-right" autoClose={3000} />
        </main>
      </div>
    </div>
  );
}
