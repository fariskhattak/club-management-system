import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Budget {
  fiscal_year: number;
  total_budget: number;
  spent_amount: number;
  remaining_amount: number;
}

const BudgetBarChart: React.FC<{ clubId: number }> = ({ clubId }) => {
  const [budget, setBudget] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clubs/${clubId}/budget`);
        if (response.ok) {
          const data = await response.json();
          if (data.message === "No budget data found") {
            setErrorMessage(data.message);
            setBudget([]);
          } else {
            setErrorMessage(null);
            setBudget(data.budget);
          }
        } else {
          console.error("Failed to fetch budget data:", response.statusText);
          setErrorMessage("Failed to fetch budget data.");
        }
      } catch (error) {
        console.error("Error fetching budget data:", error);
        setErrorMessage("An error occurred while fetching budget data.");
      } finally {
        setLoading(false);
      }
    };

    if (clubId) {
      fetchBudget();
    }
  }, [clubId]);

  // Map budget data into the format required for the chart
  const chartData = budget.map((item) => ({
    name: `FY ${item.fiscal_year}`,
    Total: item.total_budget,
    Spent: item.spent_amount,
    Remaining: item.remaining_amount,
  }));

  const ActiveBar = (props: any) => {
    const { fill, x, y, width, height } = props;
    return (
      <Rectangle
        fill={fill}
        x={x}
        y={y}
        width={width}
        height={height}
        stroke="black"
        strokeWidth={2}
      />
    );
  };

  return (
    <div className="w-full h-96 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Budget Overview</h2>
      {loading ? (
        <p>Loading budget data...</p>
      ) : errorMessage ? (
        <p className="">{errorMessage}.</p>
      ) : budget.length === 0 ? (
        <p>No budget data available for this club.</p>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Total" fill="#8884d8" activeBar={<ActiveBar fill="pink" />} />
            <Bar dataKey="Spent" fill="#82ca9d" activeBar={<ActiveBar fill="gold" />} />
            <Bar dataKey="Remaining" fill="#ffc658" activeBar={<ActiveBar fill="skyblue" />} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default BudgetBarChart;
