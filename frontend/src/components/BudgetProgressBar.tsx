import React, { useEffect, useState } from "react";

interface BudgetDetails {
  fiscal_year: number;
  total_budget: number;
  spent_amount: number;
  remaining_amount: number;
}

interface BudgetProgressBarProps {
  clubId: number;
}

const BudgetProgressBar: React.FC<BudgetProgressBarProps> = ({ clubId }) => {
  const [fiscalYears, setFiscalYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [budget, setBudget] = useState<BudgetDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newTotalBudget, setNewTotalBudget] = useState<string>("");

  const fetchFiscalYears = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/clubs/${clubId}/budget/years`);
      if (response.ok) {
        const data = await response.json();
        setFiscalYears(data.fiscal_years);
        if (data.fiscal_years.length > 0) {
          setSelectedYear(data.fiscal_years[0]);
        }
      } else {
        console.error("Failed to fetch fiscal years");
      }
    } catch (error) {
      console.error("Error fetching fiscal years:", error);
    }
  };

  const fetchBudget = async (year: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5001/api/clubs/${clubId}/budget?fiscal_year=${year}`
      );
      if (response.ok) {
        const data = await response.json();
        setBudget(data["budget"]);
      } else {
        console.error("Failed to fetch budget data");
        setBudget(null);
      }
    } catch (error) {
      console.error("Error fetching budget data:", error);
      setBudget(null);
    } finally {
      setLoading(false);
    }
  };

  const saveBudget = async () => {
    if (!selectedYear || !budget) return;

    try {
      const response = await fetch(
        `http://localhost:5001/api/clubs/${clubId}/budget/update`,
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
        setBudget((prev) => ({
          ...prev!,
          total_budget: updatedBudget.total_budget,
          remaining_amount:
            updatedBudget.total_budget - prev!.spent_amount,
        }));
        setIsEditing(false);
      } else {
        console.error("Failed to update budget");
      }
    } catch (error) {
      console.error("Error updating budget:", error);
    }
  };

  useEffect(() => {
    if (clubId) {
      fetchFiscalYears();
    }
  }, [clubId]);

  useEffect(() => {
    if (selectedYear) {
      fetchBudget(selectedYear);
    }
  }, [selectedYear]);

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-md text-black">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Budget Overview</h2>
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
                  className="ml-4 bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
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
              className="absolute h-full bg-blue-500"
              style={{ width: `${(budget.spent_amount / budget.total_budget) * 100}%` }}
              title={`Spent: $${budget.spent_amount.toFixed(2)}`}
            ></div>
            <div
              className="absolute h-full bg-green-500"
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
    </div>
  );
};

export default BudgetProgressBar;
