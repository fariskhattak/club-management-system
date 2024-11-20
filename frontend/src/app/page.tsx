"use client";

import { useEffect, useState } from "react";

interface Club {
  club_id: number;
  club_name: string;
  club_description: string;
  founded_date: string;
  email: string;
}

const Home = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [clubName, setClubName] = useState("");
  const [clubDescription, setClubDescription] = useState("");
  const [foundedDate, setFoundedDate] = useState("");
  const [email, setEmail] = useState("");
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Fetch clubs from the backend
  useEffect(() => {
    fetch(`${API_URL}/clubs`)
      .then((response) => response.json())
      .then((data) => setClubs(data))
      .catch((error) => console.error("Error fetching clubs:", error));
  }, [API_URL]);

  // Add a new club
  const addClub = async () => {
    const newClub = {
      club_name: clubName,
      club_description: clubDescription,
      founded_date: foundedDate,
      email,
    };

    const response = await fetch(`${API_URL}/clubs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newClub),
    });

    if (response.ok) {
      alert("Club added successfully!");
      setClubName("");
      setClubDescription("");
      setFoundedDate("");
      setEmail("");
      // Refresh the list of clubs
      const updatedClubs = await fetch(`${API_URL}/clubs`).then((res) =>
        res.json()
      );
      setClubs(updatedClubs);
    } else {
      alert("Error adding club");
    }
  };

  // Delete a club
  const deleteClub = async (clubId: number) => {
    const response = await fetch(`${API_URL}/clubs/${clubId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert(`Club with ID ${clubId} deleted successfully!`);
      setClubs(clubs.filter((club) => club.club_id !== clubId));
    } else {
      alert("Error deleting club");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">
        College Club Management System
      </h1>

      {/* Form to Add New Club */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Add a New Club</h2>
        <input
          type="text"
          style={{ color: "blue" }}
          placeholder="Club Name"
          value={clubName}
          onChange={(e) => setClubName(e.target.value)}
          className="border p-2 mb-2 w-full"
        />
        <textarea
          style={{ color: "blue" }}
          placeholder="Club Description"
          value={clubDescription}
          onChange={(e) => setClubDescription(e.target.value)}
          className="border p-2 mb-2 w-full"
        />
        <input
          type="text"
          style={{ color: "blue" }}
          placeholder="Founded Date"
          value={foundedDate}
          onChange={(e) => setFoundedDate(e.target.value)}
          className="border p-2 mb-2 w-full"
        />
        <input
          type="email"
          style={{ color: "blue" }}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 mb-2 w-full"
        />
        <button
          onClick={addClub}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Club
        </button>
      </div>

      {/* List of Clubs */}
      <h2 className="text-2xl font-semibold mb-4">Club List</h2>
      <ul>
        <div>
          {clubs.length === 0 ? (
            <p>No clubs available at the moment.</p>
          ) : (
            clubs.map((club) => (
              <div key={club.club_id}>
                <h2>{club.club_name}</h2>
                <p>{club.club_description}</p>
              </div>
            ))
          )}
        </div>
      </ul>
    </div>
  );
};

export default Home;
