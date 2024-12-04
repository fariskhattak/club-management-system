import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Student {
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

const ITEMS_PER_PAGE = 10; // Number of members per page

const MemberList: React.FC<MemberListProps> = ({ currentClub, onMemberAdded }) => {
  const [members, setMembers] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<Student | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
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

  const handleAddMemberInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value })); // Update for Add Member form
  };

  const handleSearchMemberInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
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

  const handleRemoveMember = (member: Student) => {
    setMemberToDelete(member);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteMember = async () => {
    if (!currentClub || !memberToDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5001/api/clubs/${currentClub.club_id}/members/${memberToDelete.student_id}`,
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

  const totalPages = Math.ceil(members.length / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedMembers = members.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="text-black">
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Members</h2>
          <button
            className="bg-cms_soft_teal text-white px-4 py-2 rounded hover:bg-cyan-700 font-bold"
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
            onChange={handleSearchMemberInputChange}
            placeholder="First Name"
            className="px-4 py-2 border rounded"
          />
          <input
            type="text"
            name="last_name"
            value={searchParams.last_name}
            onChange={handleSearchMemberInputChange}
            placeholder="Last Name"
            className="px-4 py-2 border rounded"
          />
          <input
            type="text"
            name="student_id"
            value={searchParams.student_id}
            onChange={handleSearchMemberInputChange}
            placeholder="Student ID"
            className="px-4 py-2 border rounded"
          />
          <input
            type="email"
            name="email"
            value={searchParams.email}
            onChange={handleSearchMemberInputChange}
            placeholder="Email"
            className="px-4 py-2 border rounded"
          />
          <input
            type="text"
            name="major"
            value={searchParams.major}
            onChange={handleSearchMemberInputChange}
            placeholder="Major"
            className="px-4 py-2 border rounded"
          />
          <input
            type="number"
            name="graduation_year"
            value={searchParams.graduation_year}
            onChange={handleSearchMemberInputChange}
            placeholder="Graduation Year"
            className="px-4 py-2 border rounded"
          />
        </div>
        <div className="mt-2">
          <button
            onClick={handleSearch}
            className="bg-cms_soft_teal text-white px-4 py-2 rounded hover:bg-cyan-700 font-bold"
          >
            Search
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading members...</p>
      ) : paginatedMembers.length > 0 ? (
        <>
          <table className="table-auto w-full border">
            <thead>
              <tr>
                <th className="border px-4 py-2 text-left align-middle bg-cms_light_purple">Name</th>
                <th className="border px-4 py-2 text-left align-middle bg-cms_light_purple">Student ID</th>
                <th className="border px-4 py-2 text-left align-middle bg-cms_light_purple">Email</th>
                <th className="border px-4 py-2 text-left align-middle bg-cms_light_purple">Major</th>
                <th className="border px-4 py-2 text-left align-middle bg-cms_light_purple">Graduation Year</th>
              </tr>
            </thead>
            <tbody>
              {paginatedMembers.map((member, index) => (
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

          {/* Pagination Controls */}
          <div className="flex justify-center items-center mt-4 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 border rounded ${currentPage === page
                  ? "bg-cms_purple text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
              >
                {page}
              </button>
            ))}
          </div>
        </>
      ) : (
        <p>No members found for this club.</p>
      )}

      {/* Delete Member Modal */}
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


      {/* Add Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-cms_purple rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-bold text-white">Add New Member</h2>
            <form className="space-y-4">
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleAddMemberInputChange}
                placeholder="First Name"
                className="w-full px-3 py-2 border rounded"
                required
              />
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleAddMemberInputChange}
                placeholder="Last Name"
                className="w-full px-3 py-2 border rounded"
                required
              />
              <input
                type="text"
                name="student_id"
                value={formData.student_id}
                onChange={handleAddMemberInputChange}
                placeholder="Student ID"
                className="w-full px-3 py-2 border rounded"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleAddMemberInputChange}
                placeholder="Email"
                className="w-full px-3 py-2 border rounded"
                required
              />
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleAddMemberInputChange}
                placeholder="Phone Number"
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="text"
                name="major"
                value={formData.major}
                onChange={handleAddMemberInputChange}
                placeholder="Major"
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="number"
                name="graduation_year"
                value={formData.graduation_year}
                onChange={handleAddMemberInputChange}
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
