// src/components/LoginForm.js
"use client";

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore'; // Import updateDoc
import { useRouter } from 'next/navigation';

export default function LoginForm({ role }) {
  const [nim, setNim] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const convertNimToEmail = (nim) => {
    return `${nim}@mahasiswa.upnvj.ac.id`;
  };

  const formatLastLogin = () => {
    const currentDate = new Date();
    return currentDate.toLocaleString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric"
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const email = convertNimToEmail(nim); 
      await signInWithEmailAndPassword(auth, email, password);
      alert(`Login berhasil untuk NIM ${nim}`);
      
      // Simpan waktu login dan NIM di localStorage
      localStorage.setItem('lastActivity', new Date().getTime());
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('nim', nim); // Simpan NIM

      // Simpan last login ke Firestore
      const userDocRef = doc(db, "mahasiswa", nim);
      await updateDoc(userDocRef, {
        lastLogin: formatLastLogin() // Simpan dalam format yang mudah dibaca
      });

      // Redirect ke dashboard mahasiswa
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
