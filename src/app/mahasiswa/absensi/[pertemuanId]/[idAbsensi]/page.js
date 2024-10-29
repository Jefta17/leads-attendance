// mahasiswa/absensi/

"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import Navbar from "@/components/Navbar";

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
  const pertemuanId = decodeURIComponent(params.pertemuanId); // decode pertemuanId
  const idAbsensi = decodeURIComponent(params.idAbsensi); // decode idAbsensi
  const [absensi, setAbsensi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAttending, setIsAttending] = useState(null);

  const sessionData =
    typeof window !== "undefined"
      ? JSON.parse(sessionStorage.getItem("session_mahasiswa"))
      : null;
  const userNIM = sessionData?.nimOrNip;
  console.log("NIM mahasiswa dari session:", userNIM);

  useEffect(() => {
    const fetchAbsensi = async () => {
      try {
        console.log("Mengambil data absensi untuk ID:", idAbsensi);
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
          console.log("Data absensi ditemukan:", absensiDoc.data());
        } else {
          console.error(
            `Absensi tidak ditemukan untuk path: mataKuliah/Teori Bahasa dan Otomata/Pertemuan/${pertemuanId}/Absensi/${idAbsensi}`
          );
        }
      } catch (error) {
        console.error("Error fetching absensi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAbsensi();
  }, [idAbsensi, pertemuanId]);

  console.log("Pertemuan ID:", pertemuanId);
  console.log("ID Absensi:", idAbsensi);

  const handleAttendance = async (status) => {
    try {
      if (!userNIM) {
        console.error("User NIM tidak ditemukan di session storage.");
        return;
      }

      console.log(
        `Mencoba menyimpan status kehadiran sebagai "${status}" untuk NIM: ${userNIM}`
      );
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

      await setDoc(studentAttendanceRef, { status });
      setIsAttending(status);
      console.log("Status kehadiran berhasil disimpan:", status);
    } catch (error) {
      console.error("Gagal menyimpan kehadiran:", error);
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
        </section>
      </main>
    </div>
  );
};

export default AbsensiDetail;
