// components/PieChart.tsx
import { Pie } from "react-chartjs-2";

const PieChart = () => {
  const data = {
    labels: ["Option 1", "Option 2", "Option 3"],
    datasets: [
      {
        data: [40, 30, 30],
        backgroundColor: ["#ff6384", "#36a2eb", "#cc65fe"],
      },
    ],
  };

  return <Pie data={data} />;
};

export default PieChart;
