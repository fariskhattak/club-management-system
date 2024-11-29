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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
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

  useEffect(() => {
    const fetchMembers = async () => {
      if (!currentClub) return;

      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5001/api/clubs/${currentClub.club_id}/members`);
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

    fetchMembers();
  }, [currentClub, onMemberAdded]);

  const handleRemoveMember = (member: Member) => {
    setMemberToDelete(member);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteMember = async () => {
    if (!currentClub || !memberToDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5001/api/clubs/${currentClub.club_id}/members/${memberToDelete.member_id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        toast.success("Member removed successfully!");

        // Update the member list after deletion
        setMembers((prevMembers) =>
          prevMembers.filter((member) => member.member_id !== memberToDelete.member_id)
        );

        // Optionally notify parent component
        onMemberAdded();

        // Close the modal
        setIsDeleteModalOpen(false);
        setMemberToDelete(null);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to remove member.");
      }
    } catch (error) {
      console.error("Error removing member:", error);
      toast.error("An error occurred while removing the member.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
        const result = await response.json();

        if (result.message === "Member already exists in this club") {
          toast.info("Member is already in this club.");
        } else {
          toast.success("Member added successfully!");

          // Notify parent component to refresh member list and major graph
          onMemberAdded();
        }

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


  if (!currentClub) {
    return (
      <div className="text-gray-600 italic">
        <p>Select a club to view its members.</p>
      </div>
    );
  }

  return (
    <div className="text-black">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Members List</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setIsModalOpen(true)}
        >
          + Add Member
        </button>
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
                <td className="border px-4 py-2 flex items-center justify-between group">
                  <span>{`${member?.first_name || "N/A"} ${member?.last_name || "N/A"}`}</span>
                  <button
                    onClick={() => handleRemoveMember(member)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-red-500 hover:text-red-700 ml-2"
                    title="Remove Member"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 3a3 3 0 00-3 3v1H4.5a.75.75 0 000 1.5h15a.75.75 0 000-1.5H18V6a3 3 0 00-3-3H9zM6.75 7.5v12a2.25 2.25 0 002.25 2.25h6a2.25 2.25 0 002.25-2.25v-12H6.75zm3 3a.75.75 0 011.5 0v6a.75.75 0 01-1.5 0v-6zm4.5 0a.75.75 0 011.5 0v6a.75.75 0 01-1.5 0v-6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </td>
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
      {isDeleteModalOpen && memberToDelete && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-bold text-black mb-4">Confirm Deletion</h2>
            <p className="text-gray-700">
              Are you sure you want to remove <strong>{`${memberToDelete.first_name} ${memberToDelete.last_name}`}</strong> from the club? This action cannot be undone.
            </p>
            <div className="mt-4 flex space-x-2">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={confirmDeleteMember}
              >
                Delete
              </button>
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setMemberToDelete(null);
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

export default MemberList;
