import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://waroengfinder-production.up.railway.app/login",
        { email, password }
      );
      const userData = response.data;

      onLogin(userData); // Simpan status login

      Swal.fire({
        icon: "success",
        title: "Berhasil Masuk!",
        text: `Halo, ${
          userData.role === "admin" ? "Admin" : userData.fullName
        }`,
        timer: 1500,
        showConfirmButton: false,
      });

      // --- LOGIKA PEMBEDA ARAH ---
      if (userData.role === "admin") {
        navigate("/admin"); // KE DASHBOARD ADMIN
      } else {
        navigate("/beranda"); // KE WEB PENCARI MAKAN
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.response?.data?.error || "Cek email/password Anda",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      <div
        className="bg-white/92 backdrop-blur-xl pt-8 px-8 pb-8 rounded-4xl shadow-2xl w-full max-w-md border border-white/50 relative z-10 animate-fade-up"
        style={{ "--animation-delay": "0.1s" }}
      >
        <Link
          to="/"
          className="absolute left-4 top-4 inline-flex items-center justify-center w-9 h-9 text-[#387647] hover:text-[#2e613a] transition"
          aria-label="Kembali ke landing"
        >
          <span className="text-2xl leading-none">&#8592;</span>
        </Link>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-[#387647] font-serif mb-2">
            Login Akun
          </h2>
          <p className="text-gray-500">Masuk sebagai User atau Admin</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
              Email
            </label>
            <input
              type="email"
              placeholder="admin@gmail.com atau user@gmail.com"
              className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#387647]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#387647]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-[#387647] text-white font-bold text-lg shadow-lg hover:bg-[#2e613a] hover:scale-[1.02] transition-all transform duration-200"
          >
            Masuk
          </button>
        </form>
        <div className="mt-8 text-center">
          <p className="text-gray-500">
            Belum punya akun?{" "}
            <Link
              to="/register"
              className="font-bold text-[#387647] hover:underline"
            >
              Daftar User
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
