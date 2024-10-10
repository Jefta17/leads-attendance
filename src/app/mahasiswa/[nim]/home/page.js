// src/app/mahasiswa/[nim]/home/page.js

// src/app/mahasiswa/[nim]/home/page.js

"use client";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import { auth } from "@/lib/firebase";

const MahasiswaDashboard = () => {
  const router = useRouter();
  const pathname = usePathname();
  const nim = pathname.split("/")[2]; // Ambil NIM dari URL
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown visibility

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      // Jika tidak ada user yang login, redirect ke halaman login
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 shadow-md text-white flex justify-between items-center h-20">
        <div className="flex items-center w-full">
          {/* Bagian Logo */}
          <div className="flex items-center space-x-4">
            <Image
              src="/images/logo/leads_poppins.png"
              alt="LeADS Logo"
              width={300}
              height={40}
              className="h-13"
            />
            {/* Garis vertikal tipis setelah logo */}
            <div className="border-l border-gray-200 h-10 mx-4"></div>
          </div>

          {/* Bagian Button Navbar */}
          <div className="flex-1 flex ml-8 space-x-8 text-xl">
            <button className="text-white">Home</button>
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

          {/* Avatar dan Ikon di Kanan */}
          <div className="flex items-center justify-end space-x-4">
            {/* Icon Section */}
            <div className="flex space-x-4">
              <div className="bg-white p-2 rounded-full cursor-pointer hover:bg-gray-200">
                <Image
                  src="/svg/Visibility.svg"
                  alt="Visibility Icon"
                  width={24}
                  height={24}
                  className="cursor-pointer"
                />
              </div>
              <div className="bg-white p-2 rounded-full relative cursor-pointer hover:bg-gray-200">
                <Image
                  src="/svg/bell.svg"
                  alt="Notification Icon"
                  width={24}
                  height={24}
                  className="cursor-pointer"
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
                  className="cursor-pointer"
                />
              </div>
              <div className="bg-white p-2 rounded-full cursor-pointer hover:bg-gray-200">
                <Image
                  src="/svg/settings.svg"
                  alt="Settings Icon"
                  width={24}
                  height={24}
                  className="cursor-pointer"
                />
              </div>
            </div>

            {/* Avatar User di Kanan */}
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
        <aside className="bg-gray-100 w-64 p-4 shadow-md">
          <nav className="flex flex-col space-y-4">
            <button className="flex items-center space-x-2 text-gray-700 hover:bg-gray-200 p-2 rounded">
              <span>Dashboard</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-700 hover:bg-gray-200 p-2 rounded">
              <span>Profile</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-700 hover:bg-gray-200 p-2 rounded">
              <span>Grades</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-700 hover:bg-gray-200 p-2 rounded">
              <span>Messages</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-700 hover:bg-gray-200 p-2 rounded">
              <span>Preferences</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-700 hover:bg-gray-200 p-2 rounded">
              <span>Log out</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-gray-50 p-8">
          {/* Dashboard Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">Messages</h3>
                <p>Communicate</p>
              </div>
              <div className="bg-blue-500 p-3 rounded-full text-white">
                <i className="fas fa-envelope"></i>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">Profile</h3>
                <p>Your Profile</p>
              </div>
              <div className="bg-pink-500 p-3 rounded-full text-white">
                <i className="fas fa-user-graduate"></i>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">Settings</h3>
                <p>Preferences</p>
              </div>
              <div className="bg-green-500 p-3 rounded-full text-white">
                <i className="fas fa-cog"></i>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">Grades</h3>
                <p>Performance</p>
              </div>
              <div className="bg-yellow-500 p-3 rounded-full text-white">
                <i className="fas fa-star"></i>
              </div>
            </div>
          </div>

          {/* Courses Section */}
          <div>
            <h2 className="text-2xl font-bold mb-4">
              Recently accessed courses
            </h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-200 rounded-md"></div>
                <div className="flex-grow">
                  <h3 className="text-lg font-bold">
                    2024 Ganjil | Analisis dan Desain Perangkat Lunak
                  </h3>
                  <p className="text-sm">
                    Mata Kuliah Analisis dan Desain Perangkat Lunak Kurikulum
                    511.2024
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div
                      className="bg-green-500 h-full rounded-full"
                      style={{ width: "15%" }}
                    ></div>
                  </div>
                </div>
                <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
                  View
                </button>
              </div>
            </div>
          </div>

          {/* Announcements */}
          <aside className="bg-white p-6 rounded-lg shadow-md mt-8">
            <h2 className="text-2xl font-bold mb-4">Latest Announcements</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Kuesioner Umpan Langsung (UBL) TA Genap 2022/2023</li>
              <li>Kuesioner Penilaian LeADS UPNVJ 2022</li>
              <li>Kuesioner Umpan Langsung (UBL) TA Ganjil 2022/2023</li>
            </ul>
          </aside>
        </main>
      </div>
    </div>
  );
};

export default MahasiswaDashboard;

