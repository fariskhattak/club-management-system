// components/MemberList.tsx
import React from "react";

const MemberList = () => {
  const members = [
    { name: "John Doe", id: "12345" },
    { name: "Jane Smith", id: "67890" },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Member List</h2>
      <table className="table-auto w-full border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">ID</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{member.name}</td>
              <td className="border px-4 py-2">{member.id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MemberList;
