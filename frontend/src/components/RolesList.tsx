import React, { useEffect, useState } from "react";

interface Role {
  role_id: number;
  role_name: string;
  role_description: string;
}

const RolesList: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/roles/");
        if (response.ok) {
          const data = await response.json();
          setRoles(data.roles);
        } else {
          console.error("Failed to fetch roles:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-gray-600 italic">Loading roles...</p>
      </div>
    );
  }

  if (roles.length === 0) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-gray-600 italic">No roles registered yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 shadow-lg rounded-lg p-6 max-w-5xl mx-auto text-black">
      <h2 className="text-3xl font-bold mb-6 text-center text-yellow-900">
        Registered Roles
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300 text-left">
          <thead>
            <tr className="bg-yellow-200 text-yellow-900">
              <th className="px-6 py-3 border-b border-gray-300 font-semibold">
                Role ID
              </th>
              <th className="px-6 py-3 border-b border-gray-300 font-semibold">
                Role Name
              </th>
              <th className="px-6 py-3 border-b border-gray-300 font-semibold">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role, index) => (
              <tr
                key={role.role_id}
                className={`${
                  index % 2 === 0 ? "bg-yellow-50" : "bg-yellow-100"
                } hover:bg-yellow-200`}
              >
                <td className="px-6 py-3 border-b border-gray-300">
                  {role.role_id}
                </td>
                <td className="px-6 py-3 border-b border-gray-300">
                  {role.role_name}
                </td>
                <td className="px-6 py-3 border-b border-gray-300">
                  {role.role_description || "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RolesList;
