"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

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
            const topicsList = await Promise.all(
              pertemuanSnapshot.docs.map(async (pertemuanDoc) => {
                const absensiRef = collection(pertemuanDoc.ref, "Absensi");
                const absensiSnapshot = await getDocs(absensiRef);
                const absensiList = absensiSnapshot.docs.map((absenDoc) => ({
                  id: absenDoc.id,
                  ...absenDoc.data(),
                }));
                return {
                  id: pertemuanDoc.id,
                  ...pertemuanDoc.data(),
                  absensi: absensiList,
                };
              })
            );

            setTopics(topicsList);
          } else {
            console.error("Course tidak ditemukan di Firestore:", courseRef.path);
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
      <Navbar />
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
              <details key={index} className="rounded-lg">
                <summary className="font-semibold text-gray-800 cursor-pointer bg-gray-100 px-4 py-2 rounded-lg border border-gray-300">
                  Pertemuan {index + 1}: {topic.topic || "No Topic Available"}
                </summary>

                <div className="mt-4 text-gray-600 p-4 bg-white">
                  {/* Link Presensi */}
                  {topic.absensi.length > 0 ? (
                    topic.absensi.map((absen, idx) => (
                      <div key={idx} className="mt-2">
                        <div className="flex items-center">
                          <Image
                            src="/images/icon/iconPresensi.png"
                            alt="Presence Icon"
                            width={20}
                            height={20}
                            className="mr-2"
                          />
                          <a
                            href={`/mahasiswa/absensi/${absen.id}`}
                            className="font-semibold text-blue-500 hover:underline"
                          >
                            Presensi
                          </a>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">Belum ada presensi untuk pertemuan ini.</p>
                  )}
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
