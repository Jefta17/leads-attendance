// src/app/dosen/home/page.js

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";

const DosenHomePage = () => {
  const router = useRouter();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthChecked(true);
      } else {
        router.push("/dosen/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const coursesCollection = collection(db, "mataKuliah");
        const courseDocs = await getDocs(coursesCollection);
        const courseList = courseDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          progress: Math.floor(Math.random() * 100), // Optional: generate random progress
        }));
        setCourses(courseList);
      } catch (error) {
        console.error("Error fetching courses: ", error);
      }
      setLoading(false);
    };

    if (isAuthChecked) {
      fetchCourses();
    }
  }, [isAuthChecked]);

  return isAuthChecked ? (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 shadow-lg text-white text-center">
        <h1 className="text-3xl font-bold">LeADS: Dashboard Dosen</h1>
      </header>

      <main className="flex-1 p-6">
        {/* Section untuk Dashboard Cards */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard title="Messages" description="Communicate" color="bg-blue-500" />
          <DashboardCard title="Profile" description="Your Profile" color="bg-green-500" />
          <DashboardCard title="Settings" description="Preferences" color="bg-yellow-500" />
          <DashboardCard title="Grades" description="Performance" color="bg-red-500" />
        </div>

        {/* Section untuk Menampilkan Semua Mata Kuliah */}
        <div className="mt-12 max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Mata Kuliah yang Diakses
          </h2>
          {loading ? (
            <div>Loading courses...</div>
          ) : (
            courses.map((course) => (
              <div
                key={course.id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 mb-4"
              >
                <h3 className="text-lg font-semibold text-purple-700">
                  2024 Ganjil | {course.id}
                </h3>
                <p className="text-gray-500 text-sm mb-4">
                  Mata Kuliah {course.id} Kurikulum 511.2024
                </p>
                <ProgressBar progress={course.progress} />

                {/* Button untuk navigasi ke halaman detail mata kuliah */}
                <button
                  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 px-6 rounded"
                  onClick={() => {
                    const targetUrl = `/dosen/mataKuliah/${encodeURIComponent(course.id)}`;
                    router.push(targetUrl);
                  }}
                >
                  Go to Course Details
                </button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  ) : null;
};

// Komponen untuk kartu dashboard
const DashboardCard = ({ title, description, color }) => (
  <div
    className={`p-6 rounded-lg shadow-md ${color} text-white flex flex-col items-center justify-center text-center transform hover:scale-105 transition-transform duration-300`}
  >
    <h2 className="text-xl font-semibold mb-2">{title}</h2>
    <p className="text-sm">{description}</p>
  </div>
);

// Komponen untuk menampilkan progress bar
const ProgressBar = ({ progress }) => (
  <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
    <div
      className="absolute top-0 left-0 h-full bg-purple-500 rounded-full transition-width duration-500"
      style={{ width: `${progress}%` }}
    ></div>
    <span className="absolute right-2 top-0 text-xs text-gray-700 font-semibold">
      {progress}% complete
    </span>
  </div>
);

export default DosenHomePage;
