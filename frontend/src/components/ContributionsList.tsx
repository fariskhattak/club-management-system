import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Sponsor {
  sponsor_id: number;
  sponsor_name: string;
  contact_person: string;
  contact_email: string;
  phone_number: string;
  address: string;
  sponsorship_id: number;
  contribution_amount: number;
  contribution_date: string;
}

interface SponsorsListProps {
  clubId: number;
}

const ContributionsList: React.FC<SponsorsListProps> = ({ clubId }) => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loadingSponsors, setLoadingSponsors] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [sponsorToDelete, setSponsorToDelete] = useState<Sponsor | null>(null);
  const [formData, setFormData] = useState({
    sponsor_name: "",
    contact_person: "",
    contact_email: "",
    phone_number: "",
    address: "",
    contribution_amount: "",
    contribution_date: "",
  });
  const [searchParams, setSearchParams] = useState({
    sponsor_name: "",
    contact_person: "",
    from_date: "",
    to_date: "",
  });

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = async () => {
    setLoadingSponsors(true);
    try {
      const query = new URLSearchParams(searchParams).toString();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sponsors/${clubId}/search?${query}`);

      if (response.ok) {
        const data = await response.json();
        setSponsors(data.sponsors);

        if (data.sponsors.length === 0) {
          toast.info("No sponsors found matching the criteria.");
        }
      } else {
        toast.error("Failed to search sponsors.");
      }
    } catch (error) {
      console.error("Error searching sponsors:", error);
      toast.error("An error occurred while searching sponsors.");
    } finally {
      setLoadingSponsors(false);
    }
  };


  useEffect(() => {
    if (clubId) {
      fetchSponsors();
    }
  }, [clubId]);

  const fetchSponsors = async () => {
    setLoadingSponsors(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sponsors/${clubId}`);
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sponsors/${clubId}`, {
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

  const handleRemoveSponsor = (sponsor: Sponsor) => {
    setSponsorToDelete(sponsor);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteSponsor = async () => {
    if (!sponsorToDelete) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/sponsors/${clubId}/${sponsorToDelete.sponsorship_id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        toast.success("Sponsor removed successfully!");
        setSponsors((prev) => prev.filter((s) => s.sponsor_id !== sponsorToDelete.sponsor_id));
        setIsDeleteModalOpen(false);
        setSponsorToDelete(null);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to remove sponsor.");
      }
    } catch (error) {
      console.error("Error removing sponsor:", error);
      toast.error("An error occurred while removing the sponsor.");
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow text-black">
      {/* Sponsors Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-black">Sponsorships</h2>
        <button
          className="bg-cms_soft_teal text-white px-4 py-2 rounded hover:bg-cyan-700 font-bold"
          onClick={() => setIsModalOpen(true)}
        >
          Add Sponsor
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-4">
        <div>
          <label htmlFor="sponsor_name" className="block text-gray-700 font-medium mb-1">Sponsor Name</label>
          <input
            type="text"
            id="sponsor_name"
            name="sponsor_name"
            value={searchParams.sponsor_name}
            onChange={handleSearchInputChange}
            placeholder="Sponsor Name"
            className="px-4 py-2 border rounded w-full"
          />
        </div>
        <div>
          <label htmlFor="contact_person" className="block text-gray-700 font-medium mb-1">Contact Person</label>
          <input
            type="text"
            id="contact_person"
            name="contact_person"
            value={searchParams.contact_person}
            onChange={handleSearchInputChange}
            placeholder="Contact Person"
            className="px-4 py-2 border rounded w-full"
          />
        </div>
        <div>
          <label htmlFor="from_date" className="block text-gray-700 font-medium mb-1">From Date</label>
          <input
            type="date"
            id="from_date"
            name="from_date"
            value={searchParams.from_date}
            onChange={handleSearchInputChange}
            className="px-4 py-2 border rounded w-full"
          />
        </div>
        <div>
          <label htmlFor="to_date" className="block text-gray-700 font-medium mb-1">To Date</label>
          <input
            type="date"
            id="to_date"
            name="to_date"
            value={searchParams.to_date}
            onChange={handleSearchInputChange}
            className="px-4 py-2 border rounded w-full"
          />
        </div>
      </div>
      <div className="mt-2 mb-4">
        <button
          onClick={handleSearch}
          className="bg-cms_soft_teal text-white px-4 py-2 rounded hover:bg-cyan-700 font-bold"
        >
          Search
        </button>
      </div>



      {/* Sponsors Table */}
      {loadingSponsors ? (
        <p>Loading sponsors...</p>
      ) : sponsors.length > 0 ? (
        <table className="table-auto w-full border">
          <thead>
            <tr>
              <th className="border px-4 py-2 text-left bg-cms_light_purple">Sponsor Name</th>
              <th className="border px-4 py-2 text-left bg-cms_light_purple">Contact Person</th>
              <th className="border px-4 py-2 text-left bg-cms_light_purple">Contact</th>
              <th className="border px-4 py-2 text-left bg-cms_light_purple">Address</th>
              <th className="border px-4 py-2 text-left bg-cms_light_purple">Contribution</th>
              <th className="border px-4 py-2 text-left bg-cms_light_purple">Contribution Date</th>
            </tr>
          </thead>
          <tbody>
            {sponsors.map((sponsor) => (
              <tr key={sponsor.sponsor_id}>
                <td className="border px-4 py-2 group">
                  <div className="flex justify-between items-center">
                    <span>{sponsor.sponsor_name}</span>
                    <button
                      onClick={() => handleRemoveSponsor(sponsor)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-red-500 hover:text-red-700 ml-2"
                      title="Remove Sponsor"
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
                  </div>
                </td>
                <td className="border px-4 py-2">{sponsor.contact_person || "N/A"}</td>
                <td className="border px-4 py-2">
                  <p>
                    {sponsor.contact_email || "N/A"}
                  </p>
                  <p>
                    {sponsor.phone_number || "N/A"}
                  </p>
                </td>
                <td className="border px-4 py-2">{sponsor.address || "N/A"}</td>
                <td className="border px-4 py-2">${sponsor.contribution_amount.toFixed(2)}</td>
                <td className="border px-4 py-2">{sponsor.contribution_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>
          {searchParams.from_date || searchParams.to_date || searchParams.sponsor_name || searchParams.contact_person ? (
            <>
              No sponsors found
              <span className="font-semibold">{}</span> matching your search criteria:
              <ul className="mt-2 ml-4 list-disc">
                {searchParams.sponsor_name && <li>Sponsor Name: {searchParams.sponsor_name}</li>}
                {searchParams.contact_person && <li>Contact Person: {searchParams.contact_person}</li>}
                {searchParams.from_date && <li>From Date: {searchParams.from_date}</li>}
                {searchParams.to_date && <li>To Date: {searchParams.to_date}</li>}
              </ul>
            </>
          ) : (
            `No sponsors found for this club.`
          )}
        </div>
      )}

      {/* Delete Sponsor Modal */}
      {isDeleteModalOpen && sponsorToDelete && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
            <p>
              Are you sure you want to delete the sponsorship from{" "}
              <strong>{sponsorToDelete.sponsor_name}</strong>? This action cannot be undone.
            </p>
            <div className="mt-4 flex justify-between">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={confirmDeleteSponsor}
              >
                Delete
              </button>
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Sponsor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-cms_purple rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-bold text-white mb-4">Add New Sponsor</h2>
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
            <div className="mt-4 flex justify-between">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
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

export default ContributionsList;
