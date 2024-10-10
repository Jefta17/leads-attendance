// src/app/mahasiswa/login/page.js

import LoginForm from '@/components/LoginForm';

export default function MahasiswaLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 flex flex-col">
      <header className="bg-transparent p-4 flex justify-between items-center">
        <nav>
          <ul className="flex space-x-6 text-white">
            <li className="font-bold text-lg">LeADS Mahasiswa</li>
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
          <button className="text-white hover:underline">Login/Register</button>
        </div>
      </header>
      <main className="flex flex-col items-center justify-center flex-grow">
        <h2 className="text-4xl font-bold text-white mb-4">Login Mahasiswa</h2>
        <LoginForm role="mahasiswa" />
      </main>
    </div>
  );
}
