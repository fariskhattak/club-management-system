import { error } from "console";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Budget {
  budget_id: number;
  fiscal_year: number;
  total_budget: number;
  spent_amount: number;
  remaining_amount: number;
}

interface BudgetProgressBarProps {
  clubId: number | null;
  budget: Budget | null;
  fiscalYears: number[];
  selectedYear: number | null;
  loading: boolean;
  setSelectedYear: (year: number) => void;
  setBudget: (budget: Budget | null) => void;
}

const BudgetProgressBar: React.FC<BudgetProgressBarProps> = ({
  clubId,
  budget,
  fiscalYears,
  selectedYear,
  loading,
  setSelectedYear,
  setBudget,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTotalBudget, setNewTotalBudget] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBudget, setNewBudget] = useState({
    fiscal_year: "",
    total_budget: "",
  });

  const saveBudget = async () => {
    if (!selectedYear || !budget) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/clubs/${clubId}/budget/update`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fiscal_year: selectedYear,
            total_budget: parseFloat(newTotalBudget),
          }),
        }
      );

      if (response.ok) {
        const updatedBudget = await response.json();
        setBudget({
          budget_id: budget.budget_id,
          fiscal_year: selectedYear,
          total_budget: updatedBudget.total_budget,
          spent_amount: budget?.spent_amount || 0,
          remaining_amount: updatedBudget.total_budget - (budget?.spent_amount || 0),
        });

        setIsEditing(false);
        toast.success("Budget updated successfully!");
      } else {
        console.error("Failed to update budget");
        toast.error("Failed to update budget.");
      }
    } catch (error) {
      console.error("Error updating budget:", error);
      toast.error("An error occurred while updating the budget.");
    }
  };

  const handleAddNewBudget = async () => {
    if (!clubId || !newBudget.fiscal_year || !newBudget.total_budget) {
      toast.error("All fields are required to add a budget.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/clubs/${clubId}/budget`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fiscal_year: parseInt(newBudget.fiscal_year),
            total_budget: parseFloat(newBudget.total_budget),
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Budget added successfully:", result);

        // Refresh budget list
        setSelectedYear(parseInt(newBudget.fiscal_year));
        setBudget({
          budget_id: 0, // Temporary placeholder until the budget list refreshes
          fiscal_year: parseInt(newBudget.fiscal_year),
          total_budget: parseFloat(newBudget.total_budget),
          spent_amount: 0,
          remaining_amount: parseFloat(newBudget.total_budget),
        });

        setIsModalOpen(false);
        setNewBudget({ fiscal_year: "", total_budget: "" });
        toast.success("Budget added successfully!");
      } else {
        const errorData = await response.json();
        // console.error("Failed to add budget:", errorData);
        toast.error(errorData.error || "Failed to add budget.");
      }
    } catch (error) {
      console.error("Error adding budget:", error);
      toast.error("An error occurred while adding the budget.");
    }
  };

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-md text-black relative">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Budget Overview</h2>
      <button
        className="absolute top-4 right-4 bg-cms_soft_teal font-bold text-white px-4 py-2 rounded hover:bg-cyan-700"
        onClick={() => setIsModalOpen(true)}
      >
        Add New Budget
      </button>
      {fiscalYears.length > 0 && (
        <div className="mb-4">
          <label htmlFor="fiscal-year" className="mr-4 text-gray-600 font-medium">
            Fiscal Year:
          </label>
          <select
            id="fiscal-year"
            className="mt-1 p-2 border rounded w-40 text-black"
            value={selectedYear || ""}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {fiscalYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      )}
      {loading ? (
        <p>Loading budget data...</p>
      ) : budget ? (
        <div>
          <div className="my-2 flex items-center">
            <strong>Total Budget:</strong>
            {!isEditing ? (
              <>
                <span className="ml-2">${budget.total_budget.toFixed(2)}</span>
                <button
                  className="ml-4 bg-cms_soft_teal text-white px-2 py-1 rounded hover:bg-cyan-700"
                  onClick={() => {
                    setIsEditing(true);
                    setNewTotalBudget(budget.total_budget.toString());
                  }}
                >
                  Edit
                </button>
              </>
            ) : (
              <>
                <input
                  type="number"
                  className="ml-2 p-1 border rounded"
                  value={newTotalBudget}
                  onChange={(e) => setNewTotalBudget(e.target.value)}
                />
                <button
                  className="ml-4 bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                  onClick={saveBudget}
                >
                  Save
                </button>
                <button
                  className="ml-2 bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
          <div className="relative h-8 bg-gray-300 rounded-full overflow-hidden mb-2">
            <div
              className="absolute h-full bg-cms_soft_teal"
              style={{ width: `${(budget.spent_amount / budget.total_budget) * 100}%` }}
              title={`Spent: $${budget.spent_amount.toFixed(2)}`}
            ></div>
            <div
              className="absolute h-full bg-cms_golden_yellow"
              style={{
                width: `${(budget.remaining_amount / budget.total_budget) * 100}%`,
                left: `${(budget.spent_amount / budget.total_budget) * 100}%`,
              }}
              title={`Remaining: $${budget.remaining_amount.toFixed(2)}`}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Spent: ${budget.spent_amount.toFixed(2)}</span>
            <span>Remaining: ${budget.remaining_amount.toFixed(2)}</span>
          </div>
        </div>
      ) : (
        <p>No budget data found for the selected fiscal year.</p>
      )}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-cms_purple rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-bold mb-4 text-white">Add New Budget</h2>
            <form className="space-y-4">
              <input
                type="number"
                name="fiscal_year"
                value={newBudget.fiscal_year}
                onChange={(e) =>
                  setNewBudget((prev) => ({ ...prev, fiscal_year: e.target.value }))
                }
                placeholder="Fiscal Year"
                className="w-full px-3 py-2 border rounded"
                required
              />
              <input
                type="number"
                name="total_budget"
                value={newBudget.total_budget}
                onChange={(e) =>
                  setNewBudget((prev) => ({ ...prev, total_budget: e.target.value }))
                }
                placeholder="Total Budget"
                className="w-full px-3 py-2 border rounded"
                required
              />
            </form>
            <div className="mt-4 flex justify-between">
              <button
                className="bg-cms_accept text-white px-4 py-2 rounded hover:bg-green-700"
                onClick={handleAddNewBudget}
              >
                Submit
              </button>
              <button
                className="bg-cms_deny text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={() => {
                  setNewBudget({
                    fiscal_year: "",
                    total_budget: "",
                  })
                  setIsModalOpen(false)
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

export default BudgetProgressBar;
