import React, { useEffect, useState } from "react";

interface Student {
  student_id: string;
  first_name: string;
  last_name: string;
  email: string;
  major: string;
  graduation_year: number;
}

const StudentList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/students");
        if (response.ok) {
          const data = await response.json();
          setStudents(data.students);
        } else {
          console.error("Failed to fetch students:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-gray-600 italic">Loading students...</p>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-gray-600 italic">No students registered yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-purple-50 to-purple-100 shadow-lg rounded-lg p-6 max-w-5xl mx-auto text-black">
      <h2 className="text-3xl font-bold mb-6 text-center text-purple-900">
        Registered Students
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-navbar_hover text-left">
          <thead>
            <tr className="bg-purple-200 text-purple-900">
              <th className="px-6 py-3 border-b border-navbar_hover font-semibold">Student ID</th>
              <th className="px-6 py-3 border-b border-navbar_hover font-semibold">Name</th>
              <th className="px-6 py-3 border-b border-navbar_hover font-semibold">Email</th>
              <th className="px-6 py-3 border-b border-navbar_hover font-semibold">Major</th>
              <th className="px-6 py-3 border-b border-navbar_hover font-semibold">Graduation Year</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr
                key={student.student_id}
                className={`${
                  index % 2 === 0 ? "bg-purple-50" : "bg-purple-100"
                } hover:bg-purple-200`}
              >
                <td className="px-6 py-3 border-b border-navbar_hover">{student.student_id}</td>
                <td className="px-6 py-3 border-b border-navbar_hover">
                  {student.first_name} {student.last_name}
                </td>
                <td className="px-6 py-3 border-b border-navbar_hover">{student.email}</td>
                <td className="px-6 py-3 border-b border-navbar_hover">{student.major}</td>
                <td className="px-6 py-3 border-b border-navbar_hover">{student.graduation_year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentList;
