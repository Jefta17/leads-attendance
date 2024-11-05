// src/app/mahasiswa/absensi/[pertemuanID]/[IDabsensi]/page.js

"use client";
import { useEffect, useState, useRef } from "react";
import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import Navbar from "@/components/Navbar";
import Webcam from "react-webcam";

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

const AbsensiDetail = ({ params }) => {
  const pertemuanId = decodeURIComponent(params.pertemuanId);
  const idAbsensi = decodeURIComponent(params.idAbsensi);
  const [absensi, setAbsensi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAttending, setIsAttending] = useState(null);
  const [detectedName, setDetectedName] = useState(null); // Nama dari prediksi model
  const [confidence, setConfidence] = useState(null); // Akurasi prediksi
  const [isFaceRecognitionActive, setIsFaceRecognitionActive] = useState(false); // Status aktif face recognition
  const webcamRef = useRef(null);
  const sessionData = typeof window !== "undefined" ? JSON.parse(sessionStorage.getItem("session_mahasiswa")) : null;
  const userNIM = sessionData?.nimOrNip;

  useEffect(() => {
    const fetchAbsensi = async () => {
      try {
        const absensiRef = doc(
          db,
          "mataKuliah",
          "Teori Bahasa dan Otomata",
          "Pertemuan",
          pertemuanId,
          "Absensi",
          idAbsensi
        );

        const absensiDoc = await getDoc(absensiRef);
        if (absensiDoc.exists()) {
          setAbsensi(absensiDoc.data());
        } else {
          console.error("Absensi tidak ditemukan.");
        }
      } catch (error) {
        console.error("Error fetching absensi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAbsensi();
  }, [idAbsensi, pertemuanId]);

  const saveAttendance = async () => {
    try {
      const studentAttendanceRef = doc(
        db,
        "mataKuliah",
        "Teori Bahasa dan Otomata",
        "Pertemuan",
        pertemuanId,
        "Absensi",
        idAbsensi,
        "Mahasiswa",
        userNIM
      );
      await setDoc(studentAttendanceRef, { isAvailable: true });
      setIsAttending("Hadir");
    } catch (error) {
      console.error("Gagal menyimpan kehadiran:", error);
    }
  };

  // Fungsi untuk memulai proses face recognition secara real-time
  const startFaceRecognition = () => {
    setIsFaceRecognitionActive(true);

    // Deteksi wajah secara periodik
    const interval = setInterval(async () => {
      if (webcamRef.current) {
        const imageSrc = webcamRef.current.getScreenshot();
        try {
          const response = await fetch("http://localhost:5000/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: imageSrc }),
          });

          const data = await response.json();
          if (data.recognized) {
            setDetectedName(data.name);
            setConfidence(data.accuracy);
          } else {
            setDetectedName("Tidak dikenal");
            setConfidence("N/A");
          }
        } catch (error) {
          console.error("Gagal mengenali wajah:", error);
        }
      }
    }, 2000); // Pengambilan gambar setiap 2 detik

    // Bersihkan interval ketika face recognition dihentikan
    return () => clearInterval(interval);
  };

  // Fungsi untuk menyimpan data absensi ketika tombol diklik
  const handleSaveAttendance = async () => {
    if (detectedName && detectedName !== "Tidak dikenal") {
      await saveAttendance(); // Simpan kehadiran ke database
      alert(`Kehadiran ${detectedName} berhasil disimpan.`);
    } else {
      alert("Wajah tidak dikenali. Kehadiran tidak dapat disimpan.");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <header className="bg-gradient-to-r from-purple-500 to-pink-500 p-8 text-white flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            2024 Ganjil | Teori Bahasa dan Otomata
          </h1>
          <Breadcrumb
            path={[
              "Dashboard",
              "Courses",
              "2024/2025 Ganjil",
              "Teori Bahasa dan Otomata",
              "Detail Absensi",
            ]}
          />
        </div>
      </header>
      <main className="flex-1 p-8">
        <section className="container mx-auto bg-white rounded-lg shadow-md p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Detail Absensi
          </h2>
          {absensi ? (
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h2 className="text-2xl font-semibold mb-4">Status Presensi</h2>
              <p className="text-gray-600 mb-4">
                Silakan pilih status kehadiran Anda:
              </p>

              <div className="flex justify-center gap-4">
                <button
                  onClick={startFaceRecognition}
                  className={`px-6 py-2 rounded-md font-semibold text-white ${
                    isAttending === "Hadir" ? "bg-green-500" : "bg-blue-500"
                  }`}
                >
                  Hadir
                </button>
                <button
                  onClick={() => setIsAttending("Tidak Hadir")}
                  className={`px-6 py-2 rounded-md font-semibold text-white ${
                    isAttending === "Tidak Hadir" ? "bg-red-500" : "bg-gray-500"
                  }`}
                >
                  Tidak Hadir
                </button>
              </div>

              {isFaceRecognitionActive && (
                <div className="mt-6">
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="w-full h-64 rounded-lg"
                  />
                  <p className="mt-4 text-green-600 font-semibold">
                    Wajah terdeteksi: {detectedName || "Mendeteksi..."} dengan tingkat akurasi: {confidence || "Mendeteksi..."}
                  </p>
                  <button
                    onClick={handleSaveAttendance}
                    className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md font-semibold"
                  >
                    Simpan Kehadiran
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p>Absensi tidak ditemukan</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default AbsensiDetail;
