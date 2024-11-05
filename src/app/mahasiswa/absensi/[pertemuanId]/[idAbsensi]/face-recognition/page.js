// "use client";
// import { useEffect, useState, useRef, useCallback } from "react";
// import { useRouter } from "next/navigation";
// import Webcam from "react-webcam";
// import { db } from "@/lib/firebase";
// import { doc, setDoc } from "firebase/firestore";

// const FaceRecognition = ({ params }) => {
//   const { pertemuanId, idAbsensi } = params;
//   const router = useRouter();
//   const webcamRef = useRef(null);
//   const [result, setResult] = useState({ recognized: false, name: "" });

//   const sessionData =
//     typeof window !== "undefined"
//       ? JSON.parse(sessionStorage.getItem("session_mahasiswa"))
//       : null;
//   const userNIM = sessionData?.nimOrNip;

//   // Fungsi untuk menyimpan data kehadiran di Firestore
//   const saveAttendance = useCallback(async (nim) => {
//     try {
//       const studentAttendanceRef = doc(
//         db,
//         "mataKuliah",
//         "Teori Bahasa dan Otomata",
//         "Pertemuan",
//         pertemuanId,
//         "Absensi",
//         idAbsensi,
//         "Mahasiswa",
//         nim
//       );
//       await setDoc(studentAttendanceRef, { isAvailable: true });
//     } catch (error) {
//       console.error("Gagal menyimpan kehadiran:", error);
//     }
//   }, [pertemuanId, idAbsensi]);

//   const captureAndDetect = useCallback(async () => {
//     if (webcamRef.current) {
//       const imageSrc = webcamRef.current.getScreenshot();
//       const response = await fetch("http://localhost:5000/predict", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ image: imageSrc }),
//       });
//       const data = await response.json();

//       if (data.recognized) {
//         setResult({ recognized: true, name: data.name });
//         await saveAttendance(userNIM);
//         setTimeout(() => router.push(`/mahasiswa/absensi/${pertemuanId}/${idAbsensi}`), 1000);  // Arahkan ke halaman absensi setelah 1 detik
//       } else {
//         setResult({ recognized: false, name: "" });
//       }
//     }
//   }, [userNIM, saveAttendance, pertemuanId, idAbsensi, router]);

//   useEffect(() => {
//     if (!userNIM) {
//       console.error("User NIM tidak ditemukan di session storage.");
//       return;
//     }

//     const interval = setInterval(() => {
//       if (!result.recognized) {
//         captureAndDetect();
//       }
//     }, 1000); // Jalankan setiap 1 detik

//     return () => clearInterval(interval);
//   }, [captureAndDetect, userNIM, result.recognized]);

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
//       <h1 className="text-2xl font-bold mb-4">Pengenalan Wajah</h1>
//       <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-md text-center">
//         <Webcam
//           audio={false}
//           ref={webcamRef}
//           screenshotFormat="image/jpeg"
//           className="w-full h-64 rounded-lg"
//         />
//         <div className="mt-4">
//           {result.recognized ? (
//             <p className="text-green-600 font-semibold">
//               Wajah dikenali: {result.name}! Kehadiran disimpan.
//             </p>
//           ) : (
//             <p className="text-red-600 font-semibold">Mencari wajah...</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FaceRecognition;
