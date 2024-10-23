// src/app/mahasiswa/[nim]/home/page.js
"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth"; // Import listener autentikasi Firebase

const MahasiswaDashboard = () => {
  const router = useRouter();
  const pathname = usePathname();
  const nim = pathname.split("/")[2]; // Ambil NIM dari URL
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown visibility
  const [isAuthChecked, setIsAuthChecked] = useState(false); // State untuk melacak apakah autentikasi sudah diperiksa

  const checkInactivity = useCallback(() => {
    const currentTime = new Date().getTime();
    const lastActivity = localStorage.getItem("lastActivity");

    if (lastActivity) {
      const timeDifference = currentTime - lastActivity;

      if (timeDifference > 300000) {
        alert("Sesi Anda telah habis. Silakan login kembali.");
        localStorage.removeItem("lastActivity");
        router.push("/mahasiswa/login");
      }
    }
  }, [router]);

  const updateActivityTime = () => {
    const currentTime = new Date().getTime();
    localStorage.setItem("lastActivity", currentTime);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        updateActivityTime(); // Perbarui waktu aktivitas saat pengguna ada
        setIsAuthChecked(true); // Tanda bahwa autentikasi sudah diperiksa
      } else {
        router.push("/mahasiswa/login");
      }
    });

    return () => {
      unsubscribe(); // Bersihkan listener saat komponen di-unmount
    };
  }, [router]);

  useEffect(() => {
    if (isAuthChecked) {
      const inactivityTimer = setTimeout(() => {
        checkInactivity();
      }, 300000); // 5 menit dalam milidetik

      const handleUserActivity = () => {
        updateActivityTime();
      };

      window.addEventListener("mousemove", handleUserActivity);
      window.addEventListener("keydown", handleUserActivity);
      window.addEventListener("click", handleUserActivity);

      return () => {
        clearTimeout(inactivityTimer);
        window.removeEventListener("mousemove", handleUserActivity);
        window.removeEventListener("keydown", handleUserActivity);
        window.removeEventListener("click", handleUserActivity);
      };
    }
  }, [isAuthChecked, checkInactivity]);

  const handleHomeClick = () => {
    console.log("Navigasi ke halaman utama");
    router.push("/");  // Arahkan ke halaman utama
  };

  const courseData = [
    { id: "511.2024", title: "Analisis dan Desain Perangkat Lunak", progress: 16 },
    { id: "512.2024", title: "Bahasa Inggris", progress: 30 },
    { id: "513.2024", title: "Teori Bahasa dan Automata", progress: 50 },
    { id: "514.2024", title: "Agama", progress: 75 },
    { id: "515.2024", title: "Matematika Diskrit", progress: 40 },
  ];

  return isAuthChecked ? (
    <div className="min-h-screen flex flex-col">
      {/* Header tetap sama */}
      <header className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 shadow-md text-white flex justify-between items-center h-20">
        <div className="flex items-center w-full">
          <div className="flex items-center space-x-4">
            <Image
              src="/images/logo/leads_poppins.png"
              alt="LeADS Logo"
              width={300}
              height={40}
              className="h-13"
            />
            <div className="border-l border-gray-200 h-10 mx-4"></div>
          </div>
          <div className="flex-1 flex ml-8 space-x-8 text-xl">
            <button className="text-white" onClick={handleHomeClick}>Home</button>
            <button className="text-white">Faculty</button>
            <button className="text-white">Announcements</button>
            <button className="text-white">Helpdesk</button>

            {/* Dropdown Bahasa */}
            <div className="relative">
              <button
                className="text-white flex items-center"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                English (EN) <span className="ml-1">▼</span>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
                  <ul className="py-2">
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black">
                      English (EN)
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black">
                      Indonesian (ID)
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Avatar and Icons */}
          <div className="flex items-center justify-end space-x-4">
            <div className="bg-white p-2 rounded-full cursor-pointer hover:bg-gray-200">
              <Image
                src="/svg/Visibility.svg"
                alt="Visibility Icon"
                width={24}
                height={24}
              />
            </div>
            <div className="bg-white p-2 rounded-full relative cursor-pointer hover:bg-gray-200">
              <Image
                src="/svg/bell.svg"
                alt="Notification Icon"
                width={24}
                height={24}
              />
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2">
                377
              </span>
            </div>
            <div className="bg-white p-2 rounded-full cursor-pointer hover:bg-gray-200">
              <Image
                src="/svg/chat.svg"
                alt="Chat Icon"
                width={24}
                height={24}
              />
            </div>
            <div className="bg-white p-2 rounded-full cursor-pointer hover:bg-gray-200">
              <Image
                src="/svg/settings.svg"
                alt="Settings Icon"
                width={24}
                height={24}
              />
            </div>
            <div className="relative ml-4">
              <Image
                src="/profile.png"
                alt="User Avatar"
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2">
                377
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="bg-gray-100 w-64 p-4 shadow-md flex-shrink-0">
          <nav className="flex flex-col space-y-4">
            <button className="flex items-center space-x-2 text-gray-700 hover:bg-gray-200 p-2 rounded">
              <i className="fas fa-tachometer-alt"></i>
              <span>Dashboard</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-700 hover:bg-gray-200 p-2 rounded">
              <i className="fas fa-user-graduate"></i>
              <span>Profile</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-700 hover:bg-gray-200 p-2 rounded">
              <i className="fas fa-star"></i>
              <span>Grades</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-700 hover:bg-gray-200 p-2 rounded">
              <i className="fas fa-envelope"></i>
              <span>Messages</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-700 hover:bg-gray-200 p-2 rounded">
              <i className="fas fa-cog"></i>
              <span>Preferences</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-700 hover:bg-gray-200 p-2 rounded">
              <i className="fas fa-sign-out-alt"></i>
              <span>Log out</span>
            </button>
          </nav>
        </aside>

        {/* Konten Utama */}
        <main className="flex-1 bg-gray-50 p-8">
          {/* Dashboard Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Messages</h3>
                <p className="text-gray-600">Communicate</p>
              </div>
              <div className="bg-blue-500 p-3 rounded-full text-white">
                <i className="fas fa-envelope"></i>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Profile</h3>
                <p className="text-gray-600">Your Profile</p>
              </div>
              <div className="bg-pink-500 p-3 rounded-full text-white">
                <i className="fas fa-user-graduate"></i>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Settings</h3>
                <p className="text-gray-600">Preferences</p>
              </div>
              <div className="bg-green-500 p-3 rounded-full text-white">
                <i className="fas fa-cog"></i>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Grades</h3>
                <p className="text-gray-600">Performance</p>
              </div>
              <div className="bg-yellow-500 p-3 rounded-full text-white">
                <i className="fas fa-star"></i>
              </div>
            </div>
          </div>

          {/* Recently Accessed Courses */}
          <div className="bg-white p-16 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Recently accessed courses</h2>
            <div className="flex items-start space-x-4">
              <div className="w-32 h-32 bg-purple-500 rounded-md"></div>
              <div className="flex-grow">
                <h3 className="text-2xl font-bold text-gray-900">2024 Ganjil | Analisis dan Desain Perangkat Lunak</h3>
                <p className="text-sm text-gray-600">Mata Kuliah Analisis dan Desain Perangkat Lunak Kurikulum 511.2024</p>
                <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                  <div className="bg-green-500 h-full rounded-full" style={{ width: "16%" }}></div>
                </div>
                <button
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-8 rounded text-sm mt-4"
                  onClick={() => router.push(`/mahasiswa/course/${"511.2024"}`)}
                >
                  View
                </button>
              </div>
            </div>
          </div>

          {/* Daftar Courses Lain */}
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Courses</h2>
          <div className="space-y-6">
            <div className="bg-white p-16 rounded-lg shadow-md">
              <div className="flex items-start space-x-4">
                <div className="w-32 h-32 bg-blue-500 rounded-md"></div>
                <div className="flex-grow">
                  <h3 className="text-2xl font-bold text-gray-900">2024 Ganjil | Bahasa Inggris</h3>
                  <p className="text-sm text-gray-600">Mata Kuliah Bahasa Inggris Kurikulum 511.2024</p>
                  <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                    <div className="bg-green-500 h-full rounded-full" style={{ width: "30%" }}></div>
                  </div>
                  <button
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-8 rounded text-sm mt-4"
                    onClick={() => router.push(`/mahasiswa/course/${"512.2024"}`)}
                  >
                    View
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white p-16 rounded-lg shadow-md">
              <div className="flex items-start space-x-4">
                <div className="w-32 h-32 bg-red-500 rounded-md"></div>
                <div className="flex-grow">
                  <h3 className="text-2xl font-bold text-gray-900">2024 Ganjil | Teori Bahasa dan Automata</h3>
                  <p className="text-sm text-gray-600">Mata Kuliah Teori Bahasa dan Automata Kurikulum 511.2024</p>
                  <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                    <div className="bg-green-500 h-full rounded-full" style={{ width: "50%" }}></div>
                  </div>
                  <button
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-8 rounded text-sm mt-4"
                    onClick={() => router.push(`/mahasiswa/course/${"513.2024"}`)}
                  >
                    View
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white p-16 rounded-lg shadow-md">
              <div className="flex items-start space-x-4">
                <div className="w-32 h-32 bg-orange-500 rounded-md"></div>
                <div className="flex-grow">
                  <h3 className="text-2xl font-bold text-gray-900">2024 Ganjil | Agama</h3>
                  <p className="text-sm text-gray-600">Mata Kuliah Agama Kurikulum 511.2024</p>
                  <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                    <div className="bg-green-500 h-full rounded-full" style={{ width: "75%" }}></div>
                  </div>
                  <button
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-8 rounded text-sm mt-4"
                    onClick={() => router.push(`/mahasiswa/course/${"514.2024"}`)}
                  >
                    View
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white p-16 rounded-lg shadow-md">
              <div className="flex items-start space-x-4">
                <div className="w-32 h-32 bg-purple-500 rounded-md"></div>
                <div className="flex-grow">
                  <h3 className="text-2xl font-bold text-gray-900">2024 Ganjil | Matematika Diskrit</h3>
                  <p className="text-sm text-gray-600">Mata Kuliah Matematika Diskrit Kurikulum 511.2024</p>
                  <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                    <div className="bg-green-500 h-full rounded-full" style={{ width: "40%" }}></div>
                  </div>
                  <button
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-8 rounded text-sm mt-4"
                    onClick={() => router.push(`/mahasiswa/course/${"515.2024"}`)}
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  ) : null;
};

export default MahasiswaDashboard;
