import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Officer {
    student_id: number;
    first_name: string;
    last_name: string;
    role_id: number,
    role_name: string;
    role_description: string;
    email: string;
    phone_number?: string;
}

interface Role {
    role_id: number;
    role_name: string;
    role_description: string;
}

interface Club {
    club_id: number;
    club_name: string;
}

interface OfficerListProps {
    currentClub: Club | null;
}

const ITEMS_PER_PAGE = 10;

const OfficerList: React.FC<OfficerListProps> = ({ currentClub }) => {
    const [officers, setOfficers] = useState<Officer[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [newOfficer, setNewOfficer] = useState({
        student_id: "",
        role_id: "",
    });
    const [officerToDelete, setOfficerToDelete] = useState<Officer | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);


    const fetchOfficers = async () => {
        if (!currentClub) return;

        setLoading(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/clubs/${currentClub.club_id}/officers`
            );
            if (response.ok) {
                const data = await response.json();
                setOfficers(data.officers);
            } else {
                console.error("Failed to fetch officers:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching officers:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/roles/`);
            if (response.ok) {
                const data = await response.json();
                setRoles(data.roles);
            } else {
                console.error("Failed to fetch roles:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    };

    const handleAddOfficer = async () => {
        if (!currentClub) return;
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/clubs/${currentClub.club_id}/officers`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newOfficer),
                }
            );
            if (response.ok) {
                toast.success("Officer added successfully!");
                setNewOfficer({ student_id: "", role_id: "" });
                setShowModal(false);
                fetchOfficers();
            } else {
                const errorData = await response.json();
                toast.error(`Error adding officer: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Error adding officer:", error);
            toast.error("Failed to add officer.");
        }
    };

    const handleRemoveOfficer = (officer: Officer) => {
        setOfficerToDelete(officer);
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteOfficer = async () => {
        if (!currentClub || !officerToDelete) return;

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/clubs/${currentClub.club_id}/officers/${officerToDelete.student_id}/${officerToDelete.role_id}`,
                {
                    method: "DELETE",
                }
            );

            if (response.ok) {
                toast.success("Officer removed successfully!");

                // Update the officer list after deletion
                setOfficers((prevOfficers) =>
                    prevOfficers.filter(
                        (officer) =>
                            officer.student_id !== officerToDelete.student_id ||
                            officer.role_id !== officerToDelete.role_id
                    )
                );

                // Close the modal
                setIsDeleteModalOpen(false);
                setOfficerToDelete(null);
            } else {
                const errorData = await response.json();
                toast.error(errorData.error || "Failed to remove officer.");
            }
        } catch (error) {
            toast.error("An error occurred while removing the officer.");
        }
    };

    useEffect(() => {
        fetchOfficers();
        fetchRoles();
    }, [currentClub]);

    if (!currentClub) {
        return (
            <div className="text-gray-600 italic">
                <p>Select a club to view its officers.</p>
            </div>
        );
    }

    const totalPages = Math.ceil(officers.length / ITEMS_PER_PAGE);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const paginatedOfficers = officers.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="text-black">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Officers</h2>
                <button
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 bg-cms_soft_teal font-bold text-white rounded hover:bg-cyan-700"
                >
                    Add Officer
                </button>
            </div>
            {loading ? (
                <p>Loading officers...</p>
            ) : paginatedOfficers.length > 0 ? (
                <>
                    <table className="table-auto w-full border">
                        <thead>
                            <tr>
                                <th className="border px-4 py-2 text-left bg-cms_light_purple">Name</th>
                                <th className="border px-4 py-2 text-left bg-cms_light_purple">Position</th>
                                <th className="border px-4 py-2 text-left bg-cms_light_purple">Contact</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedOfficers.map((officer, index) => (
                                <tr key={index}>
                                    <td className="border px-4 py-2 group">
                                        <div className="flex items-center justify-between">
                                            <span>{`${officer?.first_name || "N/A"} ${officer?.last_name || "N/A"
                                                }`}</span>
                                            <button
                                                onClick={() => handleRemoveOfficer(officer)}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-red-500 hover:text-red-700 ml-2"
                                                title="Remove Officer"
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
                                        </div>
                                    </td>
                                    <td className="border px-4 py-2">{officer.role_name}</td>
                                    <td className="border px-4 py-2">
                                        <p>{officer?.email || "N/A"}</p>
                                        <p>{officer?.phone_number || "N/A"}</p>
                                    </td>
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
                <p>No officers found for this club.</p>
            )}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-cms_light_purple p-6 rounded shadow">
                        <h3 className="text-lg font-bold mb-4 text-white">Add Officer</h3>
                        <form>
                            <label className="block mb-4">
                                <input
                                    type="text"
                                    className="border rounded px-3 py-2 w-full"
                                    value={newOfficer.student_id}
                                    placeholder="Student ID"
                                    onChange={(e) =>
                                        setNewOfficer({ ...newOfficer, student_id: e.target.value })
                                    }
                                />
                            </label>
                            <label className="block mb-4">
                                <select
                                    className="border rounded px-3 py-2 w-full"
                                    value={newOfficer.role_id}
                                    onChange={(e) =>
                                        setNewOfficer({ ...newOfficer, role_id: e.target.value })
                                    }
                                >
                                    <option value="">Select a role</option>
                                    {roles.map((role) => (
                                        <option key={role.role_id} value={role.role_id}>
                                            {role.role_name}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <button
                                type="button"
                                onClick={handleAddOfficer}
                                className="mt-4 px-4 py-2 bg-cms_accept hover:bg-green-700 text-white rounded"
                            >
                                Submit
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setNewOfficer({
                                        student_id: "",
                                        role_id: "",
                                    })
                                    setShowModal(false)
                                }}
                                className="mt-4 ml-2 px-4 py-2 bg-cms_deny hover:bg-red-700 text-white rounded"
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Officer Modal */}
            {isDeleteModalOpen && officerToDelete && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                        <h2 className="text-lg font-bold text-black mb-4">Confirm Deletion</h2>
                        <p className="text-gray-700">
                            Are you sure you want to remove{" "}
                            <strong>{`${officerToDelete.first_name} ${officerToDelete.last_name}`}</strong>{" "}
                            as an officer? This action cannot be undone.
                        </p>
                        <div className="mt-4 flex space-x-2">
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                onClick={confirmDeleteOfficer}
                            >
                                Delete
                            </button>
                            <button
                                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                                onClick={() => {
                                    setIsDeleteModalOpen(false);
                                    setOfficerToDelete(null);
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

export default OfficerList;
