// components/MenuButtons.tsx
import React from "react";

const MenuButtons = () => {
  return (
    <div className="flex justify-around bg-gray-800 text-white py-4">
      <button className="bg-blue-500 px-4 py-2 rounded">Event View</button>
      <button className="bg-green-500 px-4 py-2 rounded">Sponsor View</button>
      <button className="bg-red-500 px-4 py-2 rounded">Member View</button>
    </div>
  );
};

export default MenuButtons;
