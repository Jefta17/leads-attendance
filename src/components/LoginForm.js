// src/components/LoginForm.js
"use client";

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function LoginForm({ role }) {
  const [nim, setNim] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const convertNimToEmail = (nim) => {
    return `${nim}@mahasiswa.upnvj.ac.id`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const email = convertNimToEmail(nim); // Konversi NIM menjadi email
      await signInWithEmailAndPassword(auth, email, password);
      alert(`Login berhasil untuk NIM ${nim}`);
      // Setelah login, redirect ke halaman /mahasiswa/[nim]/home
      router.push(`/mahasiswa/${nim}/home`);
    } catch (error) {
      console.error('Error during login:', error);
      setError(`Login gagal. ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        {role === 'mahasiswa' ? 'Login Mahasiswa' : 'Login Dosen'}
      </h2>
      
      {/* Input NIM */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Masukkan NIM"
          value={nim}
          onChange={(e) => setNim(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          required
        />
      </div>

      {/* Input Password */}
      <div className="mb-6">
        <input
          type="password"
          placeholder="Masukkan Kata Sandi"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          required
        />
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Checkbox dan Tombol Masuk */}
      <div className="flex items-center justify-between mb-6">
        <label className="flex items-center">
          <input type="checkbox" className="mr-2" />
          <span className="text-sm text-gray-600">Ingat username</span>
        </label>
        <a href="#" className="text-sm text-blue-500 hover:underline">Forgot Password?</a>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
      >
        Masuk
      </button>

      <p className="text-xs text-gray-500 mt-4 text-center">
        Kuki harus diaktifkan pada peramban Anda
      </p>
    </form>
  );
}


