"use client";
import Header from "../components/Header";
import MemberList from "../components/MemberList";
import LineGraph from "../components/LineGraph";
import PieGraph from "../components/PieGraph";
import MenuButtons from "../components/MenuButtons";

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 200 },
  { name: 'Apr', value: 278 },
  { name: 'May', value: 189 },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Graph Section */}
        <div className="col-span-2 bg-white p-4 shadow rounded">
          <LineGraph data={data}/>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-4 shadow rounded">
          <PieGraph />
        </div>

        {/* Member List */}
        <div className="col-span-3 bg-white p-4 shadow rounded">
          <MemberList />
        </div>
      </main>

      {/* Menu Buttons */}
      {/* <MenuButtons /> */}
    </div>
  );
}
