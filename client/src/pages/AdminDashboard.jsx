import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export const AdminDashboard = () => {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("authUser"));
    // Proteksi: Kalau bukan admin@gmail.com, tendang keluar
    if (!user || user.email !== "admin@gmail.com") {
      navigate("/beranda");
    }
    // eslint-disable-next-line react-hooks/immutability
    fetchRequests();
  }, [navigate]);

  const fetchRequests = async () => {
    try {
      const response = await axios.get("http://localhost:5000/admin/requests");
      setRequests(response.data);
    } catch (error) { console.error(error); }
  };

  const handleApprove = async (id, name) => {
    Swal.fire({
      title: `Terima ${name}?`,
      text: "Warung ini akan langsung muncul di halaman pencarian user.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Tayangkan!",
      confirmButtonColor: "#387647"
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.post(`http://localhost:5000/admin/approve/${id}`);
        Swal.fire("Sukses!", "Warung sudah tayang.", "success");
        fetchRequests();
      }
    });
  };

  const handleReject = async (id) => {
    Swal.fire({
      title: "Tolak Request?",
      text: "Data akan dihapus permanen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Hapus"
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(`http://localhost:5000/admin/reject/${id}`);
        Swal.fire("Dihapus", "", "success");
        fetchRequests();
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#052e16] via-[#15803d] to-[#fef9c3] p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 bg-[linear-gradient(90deg,rgba(56,118,71,0.9)_0%,rgba(255,232,135,0.9)_100%)] p-6 rounded-2xl shadow-[0_12px_30px_rgba(0,0,0,0.35)] border border-white/20">
          <div>
            <h1 className="text-3xl font-black text-white">Admin Panel 🛡️</h1>
            <p className="text-emerald-50 text-sm">Kelola rekomendasi warung dari pengguna</p>
          </div>
          <button
            onClick={() => navigate("/beranda")}
            className="px-5 py-2 rounded-full bg-white/95 text-[#052e16] font-bold text-sm shadow-md border border-white/80 hover:bg-emerald-50 hover:border-emerald-200 transition-all"
          >
            Lihat Website
          </button>
        </div>

        <div className="bg-white/95 rounded-2xl shadow-xl overflow-hidden border border-emerald-900/10">
          <div className="p-6 border-b border-emerald-900/10 flex justify-between items-center bg-emerald-50/60">
            <h2 className="text-xl font-bold text-[#052e16]">Daftar Antrean ({requests.length})</h2>
          </div>

          {requests.length === 0 ? (
            <div className="p-12 text-center text-gray-400 bg-emerald-50/40 text-sm">
              Belum ada rekomendasi baru.
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-emerald-50 text-emerald-900 font-bold uppercase text-xs">
                <tr>
                  <th className="p-4">Warung</th>
                  <th className="p-4">Alamat</th>
                  <th className="p-4">Deskripsi</th>
                  <th className="p-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-50">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-emerald-50/60">
                    <td className="p-4 font-bold text-[#387647]">{req.name}</td>
                    <td className="p-4 text-sm text-gray-700">{req.address}</td>
                    <td className="p-4 text-sm text-gray-600 italic">"{req.description}"</td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleApprove(req.id, req.name)}
                          className="px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-800 border border-emerald-400/70 font-semibold text-xs hover:bg-emerald-500/20 hover:border-emerald-500 transition"
                        >
                          ✅ Terima
                        </button>
                        <button
                          onClick={() => handleReject(req.id)}
                          className="px-4 py-2 rounded-full bg-red-50 text-red-700 border border-red-200 font-semibold text-xs hover:bg-red-100 transition"
                        >
                          ❌ Tolak
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};