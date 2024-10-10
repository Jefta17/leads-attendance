"use client"

import { useRouter } from 'next/navigation';  // Gunakan dari 'next/navigation'
import Slider from '@/components/Slider';

export default function HomePage() {
  const router = useRouter();  // Inisialisasi useRouter untuk navigasi

  const handleLoginClick = () => {
    router.push('/mahasiswa/login');  // Arahkan pengguna ke halaman login mahasiswa
  };

  return (
    <div>
      {/* Header dengan latar belakang transparan */}
      <header className="p-4 flex justify-between items-center absolute w-full top-0 z-10">
        <nav>
          <ul className="flex space-x-6 text-white">
            <li className="font-bold text-lg">LeADS</li>
            <li className="hover:underline cursor-pointer">Beranda</li>
            <li className="hover:underline cursor-pointer">Fakultas</li>
            <li className="hover:underline cursor-pointer">Pengumuman</li>
            <li className="hover:underline cursor-pointer">Bantuan</li>
          </ul>
        </nav>
        <div className="flex items-center space-x-4">
          <select className="bg-purple-700 text-white border border-white rounded px-2 py-1">
            <option>Indonesian (id)</option>
          </select>
          {/* Tombol Login/Register */}
          <button
            className="text-white hover:underline"
            onClick={handleLoginClick}  // Panggil fungsi handleLoginClick saat tombol diklik
          >
            Login/Register
          </button>
        </div>
      </header>

      {/* Slider */}
      <Slider />
    </div>
  );
}
