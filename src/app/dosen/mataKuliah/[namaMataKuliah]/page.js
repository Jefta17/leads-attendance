// dosen/mataKuliah[namaMatkuliah]/page.js

"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, getDocs, setDoc, addDoc } from "firebase/firestore";
import Image from "next/image";

const CourseDetailPage = ({ params }) => {
  const { namaMataKuliah } = params;
  const router = useRouter();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [courseData, setCourseData] = useState(null);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPertemuan, setSelectedPertemuan] = useState(null);
  const [newTopic, setNewTopic] = useState("");
  const [error, setError] = useState("");

  const decodedNamaMataKuliah = decodeURIComponent(namaMataKuliah);

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
        const courseRef = doc(db, "mataKuliah", decodedNamaMataKuliah);
        const courseDoc = await getDoc(courseRef);

        if (courseDoc.exists()) {
          setCourseData(courseDoc.data());

          const pertemuanRef = collection(courseRef, "Pertemuan");
          const pertemuanSnapshot = await getDocs(pertemuanRef);
          const topicsList = pertemuanSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setTopics(topicsList);
        } else {
          console.error("Course tidak ditemukan di Firestore:", courseRef.path);
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
      setLoading(false);
    };

    if (isAuthChecked) {
      fetchCourseData();
    }
  }, [decodedNamaMataKuliah, isAuthChecked]);

  const handleCreateAttendance = async (pertemuanId) => {
    try {
      // Membuat dokumen absensi baru dengan ID unik di sub-koleksi Absensi
      const absensiRef = collection(
        db,
        "mataKuliah",
        decodedNamaMataKuliah,
        "Pertemuan",
        pertemuanId,
        "Absensi"
      );
      const newAbsensiDoc = await addDoc(absensiRef, { isAvailable: true });
      const idAbsensi = newAbsensiDoc.id;

      console.log(`Presensi berhasil dibuat untuk pertemuan ${pertemuanId} dengan idAbsensi: ${idAbsensi}`);
      
      setTopics((prevTopics) =>
        prevTopics.map((topic) =>
          topic.id === pertemuanId
            ? { ...topic, idAbsensi, isAvailable: true }
            : topic
        )
      );
    } catch (error) {
      console.error("Error membuat presensi:", error);
    }
  };

  if (!isAuthChecked) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 shadow-md text-white">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">LeADS: Dashboard Dosen</h1>
          <nav className="space-x-6 text-lg">
            <button className="hover:underline" onClick={() => router.push("/dosen/home")}>Home</button>
            <button className="hover:underline">Faculty</button>
            <button className="hover:underline">Announcements</button>
            <button className="hover:underline">Helpdesk</button>
          </nav>
        </div>
      </header>

      <main className="flex-1 p-8">
        {loading ? (
          <div>Loading...</div>
        ) : courseData ? (
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold mb-6 text-center text-gray-900">
              {decodedNamaMataKuliah.toUpperCase()}
            </h2>
            <p className="text-gray-600 mb-8 text-center text-lg">
              Mata Kuliah {courseData?.id} - Kurikulum 511.2024
            </p>

            <section className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Course Content</h3>
              <div className="space-y-6">
                {topics.length > 0 ? (
                  topics.map((topic, index) => (
                    <div key={index} className="border rounded-lg p-4 shadow-md bg-gray-100">
                      <div className="flex justify-between items-center">
                        <h4 className="text-lg font-semibold text-black">
                          Pertemuan {index + 1}: {topic.topic || "No Topic Available"}
                        </h4>
                        <button
                          onClick={() => setSelectedPertemuan(topic)}
                          className="text-blue-500 hover:underline"
                        >
                          Tambah Topic
                        </button>
                      </div>

                      {/* Buat Presensi untuk Pertemuan */}
                      <div className="mt-4">
                        <button
                          onClick={() => handleCreateAttendance(topic.id)}
                          className="bg-blue-500 text-white px-4 py-2 rounded-md"
                        >
                          Buat Presensi
                        </button>
                        {topic.idAbsensi && (
                          <p className="mt-2 text-gray-600">
                            Presensi ID: <span className="font-semibold">{topic.idAbsensi}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">No topics available for this course.</p>
                )}
              </div>
            </section>
          </div>
        ) : (
          <div>Course tidak ditemukan</div>
        )}
      </main>
    </div>
  );
};

export default CourseDetailPage;
