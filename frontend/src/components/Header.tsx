import React from "react";
import { FaHome } from "react-icons/fa"; // Import the home icon from react-icons

interface Club {
  club_id: number;
  club_name: string;
  club_description: string;
  founded_date: string;
  email: string;
}

interface HeaderProps {
  currentClub?: string; // Chosen club to display
  setCurrentClub: React.Dispatch<React.SetStateAction<Club | null>>; // Function to reset the chosen club
}

const Header: React.FC<HeaderProps> = ({ currentClub, setCurrentClub }) => {
  return (
    <header className="bg-gray-800 text-white p-4 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-center flex-grow">
        {currentClub ? `${currentClub}` : "Welcome to the Club Management System!"}
      </h1>
      <button
        className="text-white hover:text-navbar text-3xl ml-4"
        onClick={() => setCurrentClub(null)}
        title="Home"
      >
        <FaHome />
      </button>
    </header>
  );
};

export default Header;
