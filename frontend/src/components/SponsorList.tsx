import React, { useEffect, useState } from "react";

interface Sponsor {
  sponsor_id: number;
  sponsor_name: string;
  contact_person: string;
  contact_email: string;
  phone_number: string;
  address: string;
}

const SponsorList: React.FC = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/sponsors/");
        if (response.ok) {
          const data = await response.json();
          setSponsors(data.sponsors);
        } else {
          console.error("Failed to fetch sponsors:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching sponsors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSponsors();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-gray-600 italic">Loading sponsors...</p>
      </div>
    );
  }

  if (sponsors.length === 0) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-gray-600 italic">No sponsors registered yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 shadow-lg rounded-lg p-6 max-w-5xl mx-auto text-black">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-900">
        Registered Sponsors
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-navbar_hover text-left">
          <thead>
            <tr className="bg-blue-200 text-blue-900">
              <th className="px-6 py-3 border-b border-navbar_hover font-semibold">Sponsor Name</th>
              <th className="px-6 py-3 border-b border-navbar_hover font-semibold">Contact Person</th>
              <th className="px-6 py-3 border-b border-navbar_hover font-semibold">Email</th>
              <th className="px-6 py-3 border-b border-navbar_hover font-semibold">Phone Number</th>
              <th className="px-6 py-3 border-b border-navbar_hover font-semibold">Address</th>
            </tr>
          </thead>
          <tbody>
            {sponsors.map((sponsor, index) => (
              <tr
                key={sponsor.sponsor_id}
                className={`${
                  index % 2 === 0 ? "bg-blue-50" : "bg-blue-100"
                } hover:bg-blue-200`}
              >
                <td className="px-6 py-3 border-b border-navbar_hover">{sponsor.sponsor_name}</td>
                <td className="px-6 py-3 border-b border-navbar_hover">{sponsor.contact_person}</td>
                <td className="px-6 py-3 border-b border-navbar_hover">{sponsor.contact_email}</td>
                <td className="px-6 py-3 border-b border-navbar_hover">{sponsor.phone_number}</td>
                <td className="px-6 py-3 border-b border-navbar_hover">{sponsor.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SponsorList;
