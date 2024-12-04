"use client";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toast styles

import Header from "../components/Header";
import MemberList from "../components/MemberList";
import StudentList from "@/components/StudentsList";
import MajorGraph from "../components/MajorGraph";
import GraduationGraph from "../components/GraduationGraph";
import SideNavbar from "../components/SideNavbar";
import EventView from "../components/EventView";
import LineGraph from "@/components/LineGraph";
import FinancesView from "../components/FinancesView";

interface Club {
  club_id: number;
  club_name: string;
  club_description: string;
  founded_date: string;
  email: string;
}

export default function Home() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentClub, setCurrentClub] = useState<Club | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Modal state
  const [refreshGraphTrigger, setRefreshGraphTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState("membership"); // Tracks the selected tab

  const membershipData = [
    { name: "January", value: 10 },
    { name: "February", value: 20 },
    { name: "March", value: 35 },
    { name: "April", value: 50 },
    { name: "May", value: 65 },
    { name: "June", value: 80 },
    { name: "July", value: 95 },
    { name: "August", value: 110 },
    { name: "September", value: 125 },
    { name: "October", value: 140 },
    { name: "November", value: 150 },
    { name: "December", value: 165 },
  ];

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
    setActiveTab("membership"); // Reset tab to Membership when a new club is selected
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

  const renderTabContent = () => {
    switch (activeTab) {
      case "membership":
        return (
          <>
            {/* Graphs Row */}
            {/* <div className="bg-white p-4 shadow rounded mb-4">
              <LineGraph data={membershipData} />
            </div> */}
            <div className="grid grid-cols-12 gap-4 mb-4">
              <div className="col-span-6 p-4 shadow rounded bg-cms_light_purple">
                <MajorGraph
                  currentClub={currentClub}
                  refreshGraphTrigger={refreshGraphTrigger}
                />
              </div>
              <div className="col-span-6 bg-cms_light_purple p-4 shadow rounded">
                <GraduationGraph
                  currentClub={currentClub}
                  refreshGraphTrigger={refreshGraphTrigger}
                />
              </div>
            </div>

            {/* Member List */}
            <div className="bg-white p-4 shadow rounded">
              <MemberList
                currentClub={currentClub}
                onMemberAdded={handleMemberAdded}
              />
            </div>
          </>
        );
      case "events":
        return <EventView currentClub={currentClub} />;
      case "finances":
        return <FinancesView currentClub={currentClub} />;
      default:
        return null;
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
        <Header currentClub={currentClub?.club_name || undefined} setCurrentClub={setCurrentClub} />
        <main className="p-4 relative">
          {currentClub === null ? (
              <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] bg-gray-50 rounded shadow">
                <h2 className="text-2xl font-semibold text-gray-700">
                  No Club Selected
                </h2>
                <p className="text-gray-500 my-2">
                  Please select a club from the side navbar to view its details.
                </p>
                <div className="mt-10 bg-gray-50 rounded shadow">
                  <StudentList />
                </div>
              </div>

          ) : (
            <>
              {/* Tab Navigation */}
              <div className="bg-white shadow-md mb-4">
                <div className="flex text-center justify-center space-x-4 border-b">
                  <button
                    className={`px-6 py-3 font-medium ${activeTab === "membership" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"
                      }`}
                    onClick={() => setActiveTab("membership")}
                  >
                    Memberships
                  </button>
                  <button
                    className={`px-6 py-3 font-medium ${activeTab === "events" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"
                      }`}
                    onClick={() => setActiveTab("events")}
                  >
                    Events
                  </button>
                  <button
                    className={`px-6 py-3 font-medium ${activeTab === "finances" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"
                      }`}
                    onClick={() => setActiveTab("finances")}
                  >
                    Finances
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="grid grid-cols-1 gap-4">{renderTabContent()}</div>
            </>
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
          <ToastContainer position="top-right" autoClose={3000} />
        </main>
      </div>
    </div>
  );
}
