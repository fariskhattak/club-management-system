// components/Component.tsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface DataPoint {
  name: string;
  value: number;
}

interface GraphProps {
  data: DataPoint[];
}

const LineGraph: React.FC<GraphProps> = ({ data }) => {
  return (
    <div className="w-full h-96 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Membership Count</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend
            layout="vertical" // Arranges legend items vertically
            align="right"     // Aligns the legend to the right
            verticalAlign="middle" // Vertically centers the legend
            wrapperStyle={{ paddingLeft: '10px' }} // Optional padding for spacing
            formatter={() => "Membership Count"} 
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineGraph;
