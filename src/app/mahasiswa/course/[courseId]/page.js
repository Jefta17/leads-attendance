// src/app/mahasiswa/course/[courseId]/page.js
"use client";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import CourseContent from "@/components/CourseContent"; // Tetap tambahkan CourseContent

const CourseDetail = () => {
  const params = useParams();
  const [courseId, setCourseId] = useState(null);

  useEffect(() => {
    if (params?.courseId) {
      setCourseId(params.courseId);
    }
  }, [params]);

  const courseData = [
    { id: "511.2024", title: "Analisis dan Desain Perangkat Lunak", progress: 16 },
    { id: "512.2024", title: "Bahasa Inggris", progress: 30 },
    { id: "513.2024", title: "Teori Bahasa dan Automata", progress: 50 },
    { id: "514.2024", title: "Agama", progress: 75 },
    { id: "515.2024", title: "Matematika Diskrit", progress: 40 },
  ];

  const course = courseData.find((course) => course.id === courseId);

  if (!courseId) {
    return <div className="text-center text-gray-700">Loading...</div>;
  }

  if (!course) {
    return <div className="text-center text-gray-700">Course not found</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gray-50 pt-20 pb-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center py-8 rounded-t-lg shadow-md">
          <h1 className="text-3xl font-bold">2024 GANJIL | {course.title}</h1>
          <p className="text-sm mt-2">
            Dashboard / Courses / {course.title} - Kurikulum {course.id}
          </p>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <CourseContent />

          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Level up!</h2>
            <div className="flex items-center">
              <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl shadow-md">
                1
              </div>
              <p className="ml-4 text-gray-700">0 XP</p>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Participate in the course to gain experience points and level up!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CourseDetail;
