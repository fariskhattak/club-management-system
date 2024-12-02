import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Sponsor {
  sponsor_id: number;
  sponsor_name: string;
  contact_person: string;
  contact_email: string;
  phone_number: string;
  address: string;
  contribution_amount: number;
  contribution_date: string;
}

interface SponsorsListProps {
  clubId: number;
}

const SponsorsList: React.FC<SponsorsListProps> = ({ clubId }) => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loadingSponsors, setLoadingSponsors] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    sponsor_name: "",
    contact_person: "",
    contact_email: "",
    phone_number: "",
    address: "",
    contribution_amount: "",
    contribution_date: "",
  });

  useEffect(() => {
    if (clubId) {
      fetchSponsors();
    }
  }, [clubId]);

  const fetchSponsors = async () => {
    setLoadingSponsors(true);
    try {
      const response = await fetch(`http://localhost:5001/api/clubs/${clubId}/sponsors`);
      if (response.ok) {
        const data = await response.json();
        setSponsors(data.sponsors);
      } else {
        toast.error("Failed to fetch sponsors.");
      }
    } catch (error) {
      console.error("Error fetching sponsors:", error);
      toast.error("An error occurred while fetching sponsors.");
    } finally {
      setLoadingSponsors(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSponsor = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/clubs/${clubId}/sponsors`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Sponsor added successfully!");
        setIsModalOpen(false);
        setFormData({
          sponsor_name: "",
          contact_person: "",
          contact_email: "",
          phone_number: "",
          address: "",
          contribution_amount: "",
          contribution_date: "",
        });
        fetchSponsors(); // Refresh sponsor list
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to add sponsor.");
      }
    } catch (error) {
      console.error("Error adding sponsor:", error);
      toast.error("An error occurred while adding the sponsor.");
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow text-black">
      {/* Sponsors Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-black">Sponsorships</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setIsModalOpen(true)}
        >
          Add Sponsor
        </button>
      </div>

      {/* Sponsors Table */}
      {loadingSponsors ? (
        <p>Loading sponsors...</p>
      ) : sponsors.length > 0 ? (
        <table className="table-auto w-full border">
          <thead>
            <tr>
              <th className="border px-4 py-2 text-left bg-navbar">Sponsor Name</th>
              <th className="border px-4 py-2 text-left bg-navbar">Contact Person</th>
              <th className="border px-4 py-2 text-left bg-navbar">Contact Email</th>
              <th className="border px-4 py-2 text-left bg-navbar">Phone Number</th>
              <th className="border px-4 py-2 text-left bg-navbar">Address</th>
              <th className="border px-4 py-2 text-left bg-navbar">Contribution Amount</th>
              <th className="border px-4 py-2 text-left bg-navbar">Contribution Date</th>
            </tr>
          </thead>
          <tbody>
            {sponsors.map((sponsor) => (
              <tr key={sponsor.sponsor_id}>
                <td className="border px-4 py-2">{sponsor.sponsor_name}</td>
                <td className="border px-4 py-2">{sponsor.contact_person || "N/A"}</td>
                <td className="border px-4 py-2">{sponsor.contact_email || "N/A"}</td>
                <td className="border px-4 py-2">{sponsor.phone_number || "N/A"}</td>
                <td className="border px-4 py-2">{sponsor.address || "N/A"}</td>
                <td className="border px-4 py-2">
                  ${sponsor.contribution_amount.toFixed(2)}
                </td>
                <td className="border px-4 py-2">{sponsor.contribution_date || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No sponsors found for this club.</p>
      )}

      {/* Add Sponsor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-bold text-black mb-4">Add New Sponsor</h2>
            <form className="space-y-4">
              <input
                type="text"
                name="sponsor_name"
                value={formData.sponsor_name}
                onChange={handleInputChange}
                placeholder="Sponsor Name"
                className="w-full px-3 py-2 border rounded"
                required
              />
              <input
                type="text"
                name="contact_person"
                value={formData.contact_person}
                onChange={handleInputChange}
                placeholder="Contact Person"
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="email"
                name="contact_email"
                value={formData.contact_email}
                onChange={handleInputChange}
                placeholder="Contact Email"
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                placeholder="Phone Number"
                className="w-full px-3 py-2 border rounded"
              />
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Address"
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="number"
                name="contribution_amount"
                value={formData.contribution_amount}
                onChange={handleInputChange}
                placeholder="Contribution Amount"
                className="w-full px-3 py-2 border rounded"
                required
              />
              <input
                type="date"
                name="contribution_date"
                value={formData.contribution_date}
                onChange={handleInputChange}
                placeholder="Contribution Date"
                className="w-full px-3 py-2 border rounded"
              />
            </form>
            <div className="mt-4 flex space-x-2">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                onClick={handleAddSponsor}
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

export default SponsorsList;
