// src/app/page.js 

"use client"; 

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Slider from "@/components/Slider";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "@/lib/firebase";
import Image from "next/image";

export default function HomePage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userNim, setUserNim] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const db = getFirestore(app);

  // Fungsi untuk mengambil data pengguna berdasarkan NIM dari Firestore
  const fetchUserDetails = useCallback(async (nim) => {
    try {
      const userDoc = await getDoc(doc(db, "mahasiswa", nim));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserName(userData.nama);
        setUserEmail(userData.email);
      } else {
        console.error("No such document!");
      }
    } catch (error) {
      console.error("Error fetching user data: ", error);
    }
  }, [db]);

  // Mengecek status login saat komponen dimount
  useEffect(() => {
    const sessionData = JSON.parse(sessionStorage.getItem("session_mahasiswa"));
    if (sessionData && sessionData.isLoggedIn && sessionData.nimOrNip) {
      setIsLoggedIn(true); // Set status sebagai logged in jika session ada
      setUserNim(sessionData.nimOrNip); // Set user NIM dari sessionStorage
      fetchUserDetails(sessionData.nimOrNip); // Ambil data pengguna dari Firestore
    }

    // Event listener untuk mendeteksi ketika user menutup atau me-refresh halaman
    const handleBeforeUnload = () => {
      sessionStorage.removeItem("session_mahasiswa"); // Hapus session saat halaman ditutup atau direfresh
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Membersihkan event listener saat komponen di-unmount
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [fetchUserDetails]);

  // Fungsi untuk navigasi ke halaman login
  const handleLoginClick = () => {
    router.push("/mahasiswa/login"); // Arahkan pengguna ke halaman login mahasiswa
  };

  // Fungsi untuk navigasi ke dashboard mahasiswa
  const handleDashboardClick = () => {
    if (userNim) {
      router.push(`/mahasiswa/${userNim}/home`); // Arahkan pengguna ke halaman dashboard mahasiswa
    }
  };

  // Fungsi untuk log out
  const handleLogout = () => {
    sessionStorage.removeItem("session_mahasiswa"); // Hapus session data
    setIsLoggedIn(false); // Set state login menjadi false
    setUserNim("");
    setUserName("");
    setUserEmail("");
    router.push("/"); // Arahkan ke halaman utama setelah logout
  };

  return (
    <div>
      {/* Header dengan latar belakang transparan */}
      <header className="p-4 flex justify-between items-center absolute w-full top-0 z-10 bg-transparent">
        <div className="flex items-center space-x-4">
          <Image
            src="/images/logo/leads_poppins.png"
            alt="LeADS Logo"
            width={200}
            height={40}
            className="h-13"
          />
          <div className="border-l border-gray-200 h-10 mx-4"></div>
          <nav className="flex space-x-8 text-white text-xl">
            <button className="hover:underline cursor-pointer">Home</button>
            <button className="hover:underline cursor-pointer">Faculty</button>
            <button className="hover:underline cursor-pointer">
              Announcements
            </button>
            <button className="hover:underline cursor-pointer">Helpdesk</button>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          {/* Tombol Login/Register */}
          {!isLoggedIn && (
            <button
              className="text-white hover:underline"
              onClick={handleLoginClick}
            >
              Login/Register
            </button>
          )}
          {/* Ikon Profil di Pojok Kanan dengan Dropdown */}
          {isLoggedIn && (
            <>
              {/* Ikon Profil Baru di Pojok Kanan */}
              <div className="relative">
                <div
                  className="cursor-pointer bg-white p-2 rounded-full hover:bg-gray-200"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <Image
                    src="/profile.png"
                    alt="Profile Icon"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </div>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white text-black rounded-lg shadow-lg z-20">
                    <div className="px-4 py-2 border-b flex items-center space-x-4">
                      <Image
                        src="/profile.png"
                        alt="Profile Picture"
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div>
                        <p className="font-bold">
                          {userNim} - {userName}
                        </p>
                        {/* Tambahkan properti CSS untuk mencegah email keluar dari kotak */}
                        <p className="text-gray-500 text-xs break-all max-w-[240px]">
                          {userEmail}
                        </p>
                      </div>
                    </div>
                    <ul className="py-2">
                      <li
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={handleDashboardClick}  // Arahkan ke halaman dashboard mahasiswa
                      >
                        Dashboard
                      </li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        Profile
                      </li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        Grades
                      </li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        Messages
                      </li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        Preferences
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600"
                        onClick={handleLogout}
                      >
                        Log out
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </header>

      {/* Slider */}
      <Slider />
    </div>
  );
}
