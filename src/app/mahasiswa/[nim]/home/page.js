"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { auth, db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const colors = ["bg-pink-500", "bg-green-500", "bg-blue-500", "bg-yellow-500", "bg-purple-500"];

const MahasiswaDashboard = () => {
  const router = useRouter();
  const pathname = usePathname();
  const nim = pathname.split("/")[2];
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [recentCourse, setRecentCourse] = useState(null);
  const [otherCourses, setOtherCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSticky, setIsSticky] = useState(false); // State untuk mengatur sticky
  const [isHidden, setIsHidden] = useState(false); // State untuk mengatur apakah navbar tersembunyi
  const [lastScrollTop, setLastScrollTop] = useState(0); // Menyimpan posisi scroll terakhir

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthChecked(true);
      } else {
        router.push("/mahasiswa/login");
      }
    });

    return () => {
      unsubscribe();
    };
  }, [router]);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const mataKuliahSnapshot = await getDocs(collection(db, "mataKuliah"));
        const coursesList = mataKuliahSnapshot.docs.map((doc) => ({
          id: doc.id,
          mataKuliah: doc.id,
          progress: Math.floor(Math.random() * 100),
        }));

        setRecentCourse(coursesList[0]);
        setOtherCourses(coursesList.slice(1));
      } catch (error) {
        console.error("Error fetching mata kuliah: ", error);
      }
      setLoading(false);
    };

    if (isAuthChecked) {
      fetchCourses();
    }
  }, [isAuthChecked]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollTop = window.scrollY;

      if (currentScrollTop > lastScrollTop) {
        // Jika scroll ke bawah, navbar tetap terlihat
        setIsHidden(false); // Tidak sembunyikan navbar
      } else {
        // Jika scroll ke atas, tampilkan navbar dengan animasi
        setIsHidden(currentScrollTop > 50); // Sembunyikan jika scroll lebih dari 50
      }

      setLastScrollTop(currentScrollTop <= 0 ? 0 : currentScrollTop); // Menyimpan posisi scroll terakhir
      setIsSticky(currentScrollTop > 0); // Menentukan sticky
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollTop]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthChecked ? (
    <div className="min-h-screen flex flex-col">
      <header className={`bg-gradient-to-r from-purple-500 to-pink-500 p-4 shadow-md text-white flex justify-between items-center h-20 sticky-navbar ${isSticky ? 'sticky' : ''} ${isHidden ? 'hidden' : ''}`}>
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
            <button className="text-white" onClick={() => router.push("/")}>
              Home
            </button>
            <button className="text-white">Faculty</button>
            <button className="text-white">Announcements</button>
            <button className="text-white">Helpdesk</button>

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

        <main className="flex-1 bg-gray-50 p-8">
          <div className="bg-white p-8 rounded-lg shadow-md mb-8 w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Recently accessed course
            </h2>
            {recentCourse && (
              <div className="bg-gray-100 p-4 rounded-md shadow-sm flex items-start w-full mb-4">
                <div className="flex-shrink-0 w-48 h-48 bg-pink-500 rounded-md mr-4"></div>
                <div className="flex-grow">
                  <div className="text-lg font-semibold text-gray-600 mb-1">
                    <p>S1 Informatika</p>
                    <p>2024 Ganjil | {recentCourse.mataKuliah}</p>
                  </div>
                  <div className="mb-1">
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      Published
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">
                    Mata Kuliah {recentCourse.mataKuliah} Kurikulum 511.2024
                  </p>

                  <div className="relative w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-blue-500 h-full rounded-full"
                      style={{ width: `${recentCourse.progress || 0}%` }}
                    ></div>
                    <span className="absolute right-2 top-0 text-xs text-gray-800">
                      {recentCourse.progress || 0}% complete
                    </span>
                  </div>

                  <button
                    className="mt-2 bg-blue-500 hover:bg-blue-600 text-white text-sm py-1 px-6 rounded"
                    onClick={() => {
                      const targetUrl = `/mahasiswa/mataKuliah/${encodeURIComponent(
                        recentCourse.mataKuliah
                      )}`;
                      router.push(targetUrl);
                    }}
                  >
                    View
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md mb-8 w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Courses
            </h2>
            <div className="flex flex-col space-y-4">
              {otherCourses.map((course, index) => (
                <div
                  key={course.id}
                  className="bg-gray-100 p-4 rounded-md shadow-sm flex items-start w-full"
                >
                  <div className={`flex-shrink-0 w-48 h-48 ${colors[index % colors.length]} rounded-md mr-4`}></div>
                  <div className="flex-grow">
                    <div className="text-lg font-semibold text-gray-600 mb-1">
                      <p>S1 Informatika</p>
                      <p>2024 Ganjil | {course.mataKuliah}</p>
                    </div>
                    <div className="mb-1">
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        Published
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      Mata Kuliah {course.mataKuliah} Kurikulum 511.2024
                    </p>

                    <button
                      className="mt-2 bg-blue-500 hover:bg-blue-600 text-white text-sm py-1 px-6 rounded"
                      onClick={() => {
                        const targetUrl = `/mahasiswa/mataKuliah/${encodeURIComponent(
                          course.mataKuliah
                        )}`;
                        router.push(targetUrl);
                      }}
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  ) : null;
};

export default MahasiswaDashboard;
