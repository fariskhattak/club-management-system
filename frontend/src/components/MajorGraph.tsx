import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface Member {
  major: string;
}

interface Club {
  club_id: number;
  club_name: string;
  club_description: string;
  founded_date: string;
  email: string;
}

interface PieGraphProps {
  currentClub: Club | null;
  refreshGraphTrigger: number;
}

const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF", "#FF6E73",
  "#FF5733", "#C70039", "#900C3F", "#581845", "#1ABC9C", "#2ECC71",
  "#3498DB", "#9B59B6", "#E74C3C", "#34495E", "#F1C40F", "#E67E22",
  "#BDC3C7", "#7F8C8D", "#16A085", "#27AE60", "#2980B9", "#8E44AD",
  "#2C3E50", "#F39C12", "#D35400", "#C0392B", "#7D3C98", "#6C3483",
  "#1F618D", "#2874A6", "#1E8449", "#196F3D", "#B9770E", "#A04000"
];

const MajorGraph: React.FC<PieGraphProps> = ({ currentClub, refreshGraphTrigger }) => {
  const [data, setData] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMajors = async () => {
      if (!currentClub) {
        setData([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5001/api/clubs/${currentClub.club_id}/members`);
        if (response.ok) {
          const data = await response.json();
          const members = data["members"]

          // Group members by major and count occurrences
          const majorCounts = members.reduce((acc: Record<string, number>, member: Member) => {
            if (member.major) {
              acc[member.major] = (acc[member.major] || 0) + 1;
            }
            return acc;
          }, {});

          // Convert to array of { name, value }
          const majorData = Object.entries(majorCounts).map(([major, count]) => ({
            name: major,
            value: count as number,
          }));

          setData(majorData);
        } else {
          console.error("Failed to fetch members:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMajors();
  }, [currentClub, refreshGraphTrigger]);

  if (!currentClub) {
    return (
      <div className="w-full h-96 p-4 bg-white rounded-lg shadow-md flex items-center justify-center">
        <p className="text-gray-600 italic">Select a club to see its major distribution.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full h-96 p-4 bg-white rounded-lg shadow-md flex items-center justify-center">
        <p className="text-gray-600 italic">Loading major distribution...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-96 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-black mb-4">
        Major Distribution
      </h2>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-600 italic">No majors recorded for this club.</p>
      )}
    </div>
  );
};

export default MajorGraph;
