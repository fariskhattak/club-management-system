// components/Header.tsx
import React from "react";

interface HeaderProps {
  currentClub?: string; // Chosen club to display
}

const Header: React.FC<HeaderProps> = ({ currentClub }) => {
  return (
    <header className="bg-gray-800 text-white p-4">
      <h1 className="text-2xl font-bold text-center">Welcome {currentClub}</h1>
    </header>
  );
};

export default Header;
