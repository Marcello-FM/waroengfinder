import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export const Register = ({ onLogin }) => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Password tidak sama!",
        confirmButtonColor: "#387647",
      });
      return;
    }

    try {
      const response = await axios.post(
        "https://waroengfinder-production.up.railway.app",
        {
          fullName,
          email,
          password,
        }
      );

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Akun Anda berhasil dibuat.",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        navigate("/login", { replace: true });
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.response?.data?.error || "Gagal Mendaftar",
        confirmButtonColor: "#387647",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div
        className="w-full max-w-md rounded-2xl bg-white/95 shadow-[0px_7px_12px_#00000040] px-6 pt-8 pb-8 relative animate-fade-up"
        style={{ "--animation-delay": "0.1s" }}
      >
        <Link
          to="/"
          className="absolute left-4 top-4 inline-flex items-center justify-center w-9 h-9 text-[#387647] hover:text-[#2e613a] transition"
          aria-label="Kembali ke landing"
        >
          <span className="text-2xl leading-none">&#8592;</span>
        </Link>
        <h1 className="text-2xl font-bold text-[#387647] text-center mb-6 font-serif">
          Daftar Waroeng Finder
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#387647] mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full h-11 rounded-xl border border-[#68dc84] px-3 outline-none focus:ring-2 focus:ring-[#68dc84] text-sm font-serif"
              placeholder="Nama Anda"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#387647] mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 rounded-xl border border-[#68dc84] px-3 outline-none focus:ring-2 focus:ring-[#68dc84] text-sm font-serif"
              placeholder="email@contoh.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#387647] mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 rounded-xl border border-[#68dc84] px-3 outline-none focus:ring-2 focus:ring-[#68dc84] text-sm font-serif"
              placeholder="Password"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#387647] mb-1">
              Konfirmasi Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-11 rounded-xl border border-[#68dc84] px-3 outline-none focus:ring-2 focus:ring-[#68dc84] text-sm font-serif"
              placeholder="Ulangi Password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full h-11 rounded-full bg-[#387647] text-white font-bold shadow-md hover:bg-[#2e613a] transition font-serif"
          >
            Daftar
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-[#387647] font-serif">
          Sudah punya akun?{" "}
          <Link to="/login" className="font-bold underline">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
};
