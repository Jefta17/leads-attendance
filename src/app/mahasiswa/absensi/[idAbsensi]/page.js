// mahasiswa/absensi/[idAbsensi]/page.js

"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

const AbsensiDetail = ({ params }) => {
  const { idAbsensi } = params;
  const [absensi, setAbsensi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAttending, setIsAttending] = useState(null); // Status kehadiran mahasiswa
  const userNIM = "123456"; // Masukkan NIM mahasiswa dari sistem autentikasi

  useEffect(() => {
    const fetchAbsensi = async () => {
      try {
        // Ambil data absensi dari Firestore berdasarkan ID yang sudah ada
        const absensiRef = doc(db, "mataKuliah", "Teori Bahasa dan Otomata", "Pertemuan", "Pertemuan 1", "Absensi", idAbsensi);
        const absensiDoc = await getDoc(absensiRef);

        if (absensiDoc.exists()) {
          setAbsensi(absensiDoc.data());
        } else {
          console.error("Absensi tidak ditemukan");
        }
      } catch (error) {
        console.error("Error fetching absensi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAbsensi();
  }, [idAbsensi]);

  const handleAttendance = async (status) => {
    try {
      const studentAttendanceRef = doc(db, "mataKuliah", "Teori Bahasa dan Otomata", "Pertemuan", "Pertemuan 1", "Absensi", idAbsensi, "Mahasiswa", userNIM);
      
      // Simpan status kehadiran
      await setDoc(studentAttendanceRef, { status }); 
      setIsAttending(status); // Update UI
      console.log("Status kehadiran berhasil disimpan:", status);
    } catch (error) {
      console.error("Gagal menyimpan kehadiran:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-4">Detail Absensi</h1>
      {absensi ? (
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-semibold mb-4">Status Presensi</h2>
          <p className="text-gray-600 mb-4">Silakan pilih status kehadiran Anda:</p>
          
          <div className="flex justify-center gap-4">
            <button
              onClick={() => handleAttendance("Hadir")}
              className={`px-6 py-2 rounded-md font-semibold text-white ${
                isAttending === "Hadir" ? "bg-green-500" : "bg-blue-500"
              }`}
            >
              Hadir
            </button>
            <button
              onClick={() => handleAttendance("Tidak Hadir")}
              className={`px-6 py-2 rounded-md font-semibold text-white ${
                isAttending === "Tidak Hadir" ? "bg-red-500" : "bg-gray-500"
              }`}
            >
              Tidak Hadir
            </button>
          </div>

          {isAttending && (
            <p className="mt-4 text-green-600 font-semibold">
              Anda telah menandai status sebagai: {isAttending}
            </p>
          )}
        </div>
      ) : (
        <p>Absensi tidak ditemukan</p>
      )}
    </div>
  );
};

export default AbsensiDetail;
