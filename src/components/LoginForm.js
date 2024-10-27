// src/components/LoginForm.js
"use client";

import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function LoginForm({ role }) {
  const [nim, setNim] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const convertToEmail = (nim) => {
    return role === 'dosen' ? `${nim}@dosen.upnvj.ac.id` : `${nim}@mahasiswa.upnvj.ac.id`;
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
      const email = convertToEmail(nim);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      const userDocRef = doc(db, role, nim);
      const userDoc = await getDoc(userDocRef);
  
      if (!userDoc.exists() || userDoc.data().role !== role) {
        throw new Error(`Login hanya diperbolehkan untuk ${role}`);
      }
  
      // Simpan waktu login, role, dan NIM di localStorage
      localStorage.setItem('lastActivity', new Date().getTime());
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('nim', nim);
      localStorage.setItem('role', role); // Menyimpan role di localStorage
  
      // Simpan last login ke Firestore
      await updateDoc(userDocRef, {
        lastLogin: formatLastLogin()
      });
  
      // Redirect ke dashboard berdasarkan role
      if (role === 'mahasiswa') {
        router.push(`/mahasiswa/${nim}/home`);
      } else if (role === 'dosen') {
        router.push(`/dosen/${nim}/home`);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError(`Login gagal. ${error.message}`);
    }
  };
  

  // Auto-logout setup
  const handleLogout = () => {
    localStorage.removeItem('lastActivity');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('nim');
    if (role === 'mahasiswa') {
      router.push("/mahasiswa/login");
    } else {
      router.push("/dosen/login");
    }
  };

  useEffect(() => {
    const updateActivity = () => localStorage.setItem('lastActivity', new Date().getTime());

    const interval = setInterval(() => {
      const lastActivity = localStorage.getItem('lastActivity');
      const currentTime = new Date().getTime();

      if (currentTime - lastActivity > 5 * 60 * 1000) {
        localStorage.removeItem('lastActivity');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('nim');
        if (role === 'mahasiswa') {
          router.push("/mahasiswa/login");
        } else {
          router.push("/dosen/login");
        }
      }
    }, 1000);

    window.addEventListener("mousemove", updateActivity);
    window.addEventListener("keydown", updateActivity);

    return () => {
      clearInterval(interval);
      window.removeEventListener("mousemove", updateActivity);
      window.removeEventListener("keydown", updateActivity);
    };
  }, [role, router]);

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        {role === 'mahasiswa' ? 'Login Mahasiswa' : 'Login Dosen'}
      </h2>
      
      <div className="mb-4">
        <input
          type="text"
          placeholder={role === 'mahasiswa' ? "Masukkan NIM" : "Masukkan NIP"}
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
