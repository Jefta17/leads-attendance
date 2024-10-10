// src/app/dosen/login/page.js

import LoginForm from '@/components/LoginForm';

export default function DosenLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-green-500 via-blue-600 to-purple-500 flex flex-col">
      <header className="bg-transparent p-4 flex justify-between items-center">
        <nav>
          <ul className="flex space-x-6 text-white">
            <li className="font-bold text-lg">LeADS Dosen</li>
            <li className="hover:underline cursor-pointer">Beranda</li>
            <li className="hover:underline cursor-pointer">Fakultas</li>
            <li className="hover:underline cursor-pointer">Pengumuman</li>
            <li className="hover:underline cursor-pointer">Bantuan</li>
          </ul>
        </nav>
        <div className="flex items-center space-x-4">
          <select className="bg-blue-700 text-white border border-white rounded px-2 py-1">
            <option>Indonesian (id)</option>
          </select>
          <button className="text-white hover:underline">Login/Register</button>
        </div>
      </header>
      <main className="flex flex-col items-center justify-center flex-grow">
        <h2 className="text-4xl font-bold text-white mb-4">Login Dosen</h2>
        <LoginForm role="dosen" />
      </main>
    </div>
  );
}
