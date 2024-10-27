// src/app/dosen/home/page.js

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc } from "firebase/firestore";

const DosenHomePage = () => {
  const router = useRouter();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [courseData, setCourseData] = useState(null);
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
    const fetchCourseData = async () => {
      setLoading(true);
      try {
        const courseDocRef = doc(
          collection(db, "mataKuliah"),
          "Teori Bahasa dan Otomata"
        );
        const courseDoc = await getDoc(courseDocRef);

        if (courseDoc.exists()) {
          setCourseData({
            id: courseDoc.id,
            ...courseDoc.data(),
            progress: Math.floor(Math.random() * 100), // Atur progress acak atau sesuai logika yang dibutuhkan
          });
        } else {
          console.error("Mata kuliah tidak ditemukan");
        }
      } catch (error) {
        console.error("Error fetching mata kuliah: ", error);
      }
      setLoading(false);
    };

    if (isAuthChecked) {
      fetchCourseData();
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
          <DashboardCard
            title="Messages"
            description="Communicate"
            color="bg-blue-500"
          />
          <DashboardCard
            title="Profile"
            description="Your Profile"
            color="bg-green-500"
          />
          <DashboardCard
            title="Settings"
            description="Preferences"
            color="bg-yellow-500"
          />
          <DashboardCard
            title="Grades"
            description="Performance"
            color="bg-red-500"
          />
        </div>

        {/* Section untuk Recently Accessed Courses */}
        <div className="mt-12 max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Recently Accessed Courses
          </h2>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg font-semibold text-purple-700">
              2024 Ganjil | {courseData ? courseData.id : "Loading..."}
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              Mata Kuliah {courseData ? courseData.id : "Loading..."} Kurikulum
              511.2024
            </p>
            {loading ? (
              <div>Loading progress...</div>
            ) : (
              <ProgressBar progress={courseData.progress} />
            )}

            {/* Button untuk navigasi ke halaman detail mata kuliah */}
            <button
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 px-6 rounded"
              onClick={() => {
                const targetUrl = `/dosen/mataKuliah/${encodeURIComponent(
                  courseData.id
                )}`;
                router.push(targetUrl);
              }}
            >
              Go to Course Details
            </button>
          </div>
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
