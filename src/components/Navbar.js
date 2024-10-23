// src/components/Navbar.js
"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const Navbar = () => {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const loginStatus = localStorage.getItem("isLoggedIn");
    const nim = localStorage.getItem("nim");

    if (loginStatus === "true" && nim) {
      setIsLoggedIn(true);
      fetchUserName(nim); // Ambil nama pengguna berdasarkan NIM
    }
  }, []);

  const fetchUserName = async (nim) => {
    try {
      console.log(`Fetching data for NIM: ${nim}`);
      const userDoc = await getDoc(doc(db, "mahasiswa", nim));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log("User data:", userData); 
        setUserName(userData.nama); // Pastikan field nama tersimpan dengan benar
      } else {
        console.log("Pengguna tidak ditemukan");
      }
    } catch (error) {
      console.error("Error mengambil data pengguna:", error);
    }
  };

  const handleHomeClick = () => {
    router.push("/");
  };

  const handleLoginClick = () => {
    router.push("/mahasiswa/login");
  };

  const handleLogout = () => {
    localStorage.setItem("isLoggedIn", "false");
    setIsLoggedIn(false);
    router.push("/");
  };

  return (
    <header className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 shadow-md text-white flex justify-between items-center h-20 fixed top-0 w-full z-50">
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
          <button className="text-white" onClick={handleHomeClick}>
            Home
          </button>
          <button className="text-white">Faculty</button>
          <button className="text-white">Announcements</button>
          <button className="text-white">Helpdesk</button>
        </div>

        <div className="flex items-center space-x-4">
          <select className="bg-purple-700 text-white border border-white rounded px-2 py-1">
            <option>Indonesian (id)</option>
          </select>

          {isLoggedIn ? (
            <div className="relative">
              <span className="mr-4">Selamat datang, {userName || 'Pengguna'}</span> 
              <div
                className="cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <Image
                  src="/profile.png"
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </div>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white text-black rounded-lg shadow-lg z-20">
                  <div className="px-4 py-2 border-b">
                    <p className="font-bold">{localStorage.getItem('nim')}</p>
                    <p className="text-gray-500 text-sm">Email mahasiswa</p>
                  </div>
                  <ul className="py-2">
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => router.push("/mahasiswa/home")}>
                      Dashboard
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Grades</li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Messages</li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Preferences</li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600" onClick={handleLogout}>
                      Log out
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <button className="text-white hover:underline" onClick={handleLoginClick}>
              Login/Register
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
