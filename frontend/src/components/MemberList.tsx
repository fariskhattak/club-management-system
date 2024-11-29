import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Member {
  member_id: number;
  first_name: string;
  last_name: string;
  student_id: string;
  email: string;
  phone_number?: string;
  major?: string;
  graduation_year?: number;
}

interface Club {
  club_id: number;
  club_name: string;
  club_description: string;
  founded_date: string;
  email: string;
}

interface MemberListProps {
  currentClub: Club | null;
  onMemberAdded: () => void; // Callback to notify parent of a new member
}

const MemberList: React.FC<MemberListProps> = ({ currentClub, onMemberAdded }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useState({
    first_name: "",
    last_name: "",
    student_id: "",
    email: "",
    major: "",
    graduation_year: "",
  });
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    student_id: "",
    email: "",
    phone_number: "",
    major: "",
    graduation_year: "",
    active_status: "Active",
  });

  const fetchMembers = async () => {
    if (!currentClub) return;

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5001/api/clubs/${currentClub.club_id}/members`
      );
      if (response.ok) {
        const data = await response.json();
        setMembers(data["members"]);
      } else {
        console.error("Failed to fetch members:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!currentClub) return;

    setLoading(true);
    try {
      const query = new URLSearchParams(searchParams).toString();
      const response = await fetch(
        `http://localhost:5001/api/clubs/${currentClub.club_id}/members/search?${query}`
      );

      if (response.ok) {
        const data = await response.json();
        setMembers(data.members);

        if (data.members.length === 0) {
          toast.info("No members found matching the criteria.");
        }
      } else {
        console.error("Failed to search members:", response.statusText);
      }
    } catch (error) {
      console.error("Error searching members:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
    setFormData((prev) => ({ ...prev, [name]: value })); // Update for Add Member form
  };

  const handleAddMember = async () => {
    if (!currentClub) {
      toast.error("No club selected.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/api/clubs/${currentClub.club_id}/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Member added successfully!");

        // Notify parent component to refresh member list and major graph
        onMemberAdded();

        // Close the modal and reset the form
        setIsModalOpen(false);
        setFormData({
          first_name: "",
          last_name: "",
          student_id: "",
          email: "",
          phone_number: "",
          major: "",
          graduation_year: "",
          active_status: "Active",
        });
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to add member.");
      }
    } catch (error) {
      console.error("Error adding member:", error);
      toast.error("An error occurred while adding the member.");
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [currentClub, onMemberAdded]);

  if (!currentClub) {
    return (
      <div className="text-gray-600 italic">
        <p>Select a club to view its members.</p>
      </div>
    );
  }

  return (
    <div className="text-black">
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Members List</h2>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => setIsModalOpen(true)}
          >
            Add Member
          </button>
        </div>

        {/* Search Bar */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          <input
            type="text"
            name="first_name"
            value={searchParams.first_name}
            onChange={handleInputChange}
            placeholder="First Name"
            className="px-4 py-2 border rounded"
          />
          <input
            type="text"
            name="last_name"
            value={searchParams.last_name}
            onChange={handleInputChange}
            placeholder="Last Name"
            className="px-4 py-2 border rounded"
          />
          <input
            type="text"
            name="student_id"
            value={searchParams.student_id}
            onChange={handleInputChange}
            placeholder="Student ID"
            className="px-4 py-2 border rounded"
          />
          <input
            type="email"
            name="email"
            value={searchParams.email}
            onChange={handleInputChange}
            placeholder="Email"
            className="px-4 py-2 border rounded"
          />
          <input
            type="text"
            name="major"
            value={searchParams.major}
            onChange={handleInputChange}
            placeholder="Major"
            className="px-4 py-2 border rounded"
          />
          <input
            type="number"
            name="graduation_year"
            value={searchParams.graduation_year}
            onChange={handleInputChange}
            placeholder="Graduation Year"
            className="px-4 py-2 border rounded"
          />
        </div>
        <div className="mt-2">
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Search
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading members...</p>
      ) : members.length > 0 ? (
        <table className="table-auto w-full border">
          <thead>
            <tr>
              <th className="border px-4 py-2 text-left align-middle bg-navbar">Name</th>
              <th className="border px-4 py-2 text-left align-middle bg-navbar">Student ID</th>
              <th className="border px-4 py-2 text-left align-middle bg-navbar">Email</th>
              <th className="border px-4 py-2 text-left align-middle bg-navbar">Major</th>
              <th className="border px-4 py-2 text-left align-middle bg-navbar">Graduation Year</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{`${member?.first_name || "N/A"} ${
                  member?.last_name || "N/A"
                }`}</td>
                <td className="border px-4 py-2">{member?.student_id || "N/A"}</td>
                <td className="border px-4 py-2">{member?.email || "N/A"}</td>
                <td className="border px-4 py-2">{member?.major || "N/A"}</td>
                <td className="border px-4 py-2">{member?.graduation_year || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No members found for this club.</p>
      )}

      {/* Add Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-bold text-black">Add New Member</h2>
            <form className="space-y-4">
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                placeholder="First Name"
                className="w-full px-3 py-2 border rounded"
                required
              />
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                placeholder="Last Name"
                className="w-full px-3 py-2 border rounded"
                required
              />
              <input
                type="text"
                name="student_id"
                value={formData.student_id}
                onChange={handleInputChange}
                placeholder="Student ID"
                className="w-full px-3 py-2 border rounded"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="w-full px-3 py-2 border rounded"
                required
              />
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                placeholder="Phone Number"
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="text"
                name="major"
                value={formData.major}
                onChange={handleInputChange}
                placeholder="Major"
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="number"
                name="graduation_year"
                value={formData.graduation_year}
                onChange={handleInputChange}
                placeholder="Graduation Year"
                className="w-full px-3 py-2 border rounded"
              />
            </form>
            <div className="mt-4 flex space-x-2">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                onClick={handleAddMember}
              >
                Submit
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={() => setIsModalOpen(false)}
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

export default MemberList;
