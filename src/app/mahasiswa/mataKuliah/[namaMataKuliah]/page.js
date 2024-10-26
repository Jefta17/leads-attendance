// pages/[namaMataKuliah]/page.js

"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import Navbar from "@/components/Navbar";
import Image from "next/image";

const Breadcrumb = ({ path }) => (
  <nav className="text-white text-sm mt-2 text-center">
    {path.map((item, index) => (
      <span key={index}>
        {item}
        {index < path.length - 1 && " / "}
      </span>
    ))}
  </nav>
);

const CourseDetail = ({ params }) => {
  const { namaMataKuliah } = params;
  const [course, setCourse] = useState(null);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  const decodedNamaMataKuliah = decodeURIComponent(namaMataKuliah);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (decodedNamaMataKuliah) {
        const courseRef = doc(db, "mataKuliah", decodedNamaMataKuliah);

        try {
          const courseDoc = await getDoc(courseRef);
          if (courseDoc.exists()) {
            setCourse(courseDoc.data());

            const pertemuanRef = collection(courseRef, "Pertemuan");
            const pertemuanSnapshot = await getDocs(pertemuanRef);
            const topicsList = pertemuanSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));

            setTopics(topicsList);
          } else {
            console.error(
              "Course tidak ditemukan di Firestore:",
              courseRef.path
            );
          }
        } catch (error) {
          console.error("Error fetching course data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCourseData();
  }, [decodedNamaMataKuliah]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!course) {
    return <div>Course tidak ditemukan</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar /> {/* Navbar */}
      <header className="bg-gradient-to-r from-purple-500 to-pink-500 p-8 text-white flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            2024 Ganjil | {decodedNamaMataKuliah.toUpperCase()}
          </h1>
          <Breadcrumb
            path={[
              "Dashboard",
              "Courses",
              "2024/2025 Ganjil",
              "Fakultas Ilmu Komputer",
              "S1 Informatika",
              decodedNamaMataKuliah,
            ]}
          />
        </div>
      </header>
      <main className="flex-1 p-8">
        <section className="container mx-auto bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Course Content
          </h2>
          <div className="space-y-4">
            {topics.map((topic, index) => (
              <details
                key={index}
                className="rounded-lg" // Hapus border dari elemen details
              >
                {/* Summary dengan background abu-abu dan border */}
                <summary className="font-semibold text-gray-800 cursor-pointer bg-gray-100 px-4 py-2 rounded-lg border border-gray-300">
                  Pertemuan {index + 1}: {topic.topic || "No Topic Available"}
                </summary>

                {/* Konten yang akan tampil saat dropdown dibuka tanpa border */}
                <div className="mt-4 text-gray-600 p-4 bg-white">
                  {" "}
                  {/* Tanpa border */}
                  {/* Presensi Section */}
                  <div className="rounded-md p-4 mt-2">
                    <div className="flex items-center">
                      <Image
                        src="/images/icon/iconPresensi.png"
                        alt="Presence Icon"
                        width={20}
                        height={20}
                        className="mr-2"
                      />
                      <p className="font-semibold">Presensi Kelas A</p>
                    </div>
                    <p className="text-sm text-red-500 my-2">
                      Restricted: Not available unless you belong to Kelas A
                    </p>
                  </div>
                  <div className="rounded-md p-4 mt-2">
                    <div className="flex items-center">
                      <p className="font-semibold">
                        Bab {index + 1}: {topic.topic || "No Topic Available"}
                      </p>
                    </div>
                    <button className="bg-blue-500 text-white font-semibold px-3 py-1 rounded-md mt-2">
                      Mark as done
                    </button>
                  </div>
                  <div className="rounded-md p-4 mt-2">
                    <div className="flex items-center">
                      <Image
                        src="/images/icon/iconPresensi.png"
                        alt="Presence Icon"
                        width={20}
                        height={20}
                        className="mr-2"
                      />
                      <p className="font-semibold">Presensi Kelas B</p>
                    </div>
                    <button className="bg-blue-500 text-white font-semibold px-3 py-1 rounded-md mt-2">
                      Mark as done
                    </button>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default CourseDetail;
