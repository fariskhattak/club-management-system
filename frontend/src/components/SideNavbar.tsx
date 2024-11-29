import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface SideNavbarProps {
  clubs: string[]; // List of clubs to display
  onSelectClub: (clubName: string) => void; // Callback to change the current club
  refreshClubs: () => void; // Callback to refresh clubs after addition
}

const SideNavbar: React.FC<SideNavbarProps> = ({ clubs, onSelectClub, refreshClubs }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    club_name: "",
    club_description: "",
    founded_date: "",
    contact_email: "",
    faculty_advisor: "",
  });

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddClub = async () => {
    const { club_name, contact_email } = formData;

    if (!club_name.trim() || !contact_email.trim()) {
      toast.error("Club name and contact email are required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/api/clubs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Club added successfully!");
        setFormData({
          club_name: "",
          club_description: "",
          founded_date: "",
          contact_email: "",
          faculty_advisor: "",
        });
        setIsModalOpen(false); // Close the modal
        refreshClubs(); // Refresh the club list
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to add the club. Please try again.");
      }
    } catch (error) {
      console.error("Error adding club:", error);
      toast.error("An error occurred while adding the club.");
    }
  };

  return (
    <div className={`flex ${isOpen ? "pl-64" : "pl-0"} transition-all duration-300`}>
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-navbar text-white shadow-lg transition-transform transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } w-64`}
      >
        <div className="p-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Clubs</h1>
          <button
            className="text-white hover:text-gray-300 focus:outline-none"
            onClick={toggleNavbar}
          >
            ✕
          </button>
        </div>
        <ul className="mt-4 space-y-2">
          <li
            className="px-3 py-1 hover:bg-navbar_hover rounded-full cursor-pointer bg-blue-600 text-white text-center inline-block w-auto mx-3"
            onClick={() => setIsModalOpen(true)}
          >
            + Add New Club
          </li>
          {clubs.map((club, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-navbar_hover rounded cursor-pointer"
              onClick={() => onSelectClub(club)}
            >
              {club}
            </li>
          ))}
        </ul>
      </div>

      {/* Toggle Button */}
      {!isOpen && (
        <button
          className="fixed top-4 left-4 bg-navbar text-white p-2 rounded-md shadow hover:bg-navbar_hover z-10"
          onClick={toggleNavbar}
        >
          ☰
        </button>
      )}

      {/* Popup Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6">
            <h2 className="text-xl font-bold mb-4 text-black">Add New Club</h2>
            <form className="space-y-4">
              <input
                type="text"
                name="club_name"
                value={formData.club_name}
                onChange={handleInputChange}
                placeholder="Club Name"
                className="w-full px-3 py-2 border rounded text-black"
                required
              />
              <textarea
                name="club_description"
                value={formData.club_description}
                onChange={handleInputChange}
                placeholder="Description"
                className="w-full px-3 py-2 border rounded text-black"
              />
              <div>
                <label
                  htmlFor="founded_date"
                  className="block text-gray-400 mb-1 pl-2"
                >
                  Founded Date
                </label>
                <input
                  type="date"
                  name="founded_date"
                  id="founded_date"
                  value={formData.founded_date}
                  onChange={handleInputChange}
                  placeholder="Founded Date"
                  className="w-full px-3 py-2 border rounded text-black"
                />
              </div>
              <input
                type="email"
                name="contact_email"
                value={formData.contact_email}
                onChange={handleInputChange}
                placeholder="Contact Email"
                className="w-full px-3 py-2 border rounded text-black"
                required
              />
              <input
                type="text"
                name="faculty_advisor"
                value={formData.faculty_advisor}
                onChange={handleInputChange}
                placeholder="Faculty Advisor"
                className="w-full px-3 py-2 border rounded text-black"
              />
            </form>
            <div className="mt-4 flex space-x-2">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={handleAddClub}
              >
                Submit
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={() => {
                  setIsModalOpen(false);
                  setFormData({
                    club_name: "",
                    club_description: "",
                    founded_date: "",
                    contact_email: "",
                    faculty_advisor: "",
                  });
                }}
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

export default SideNavbar;
