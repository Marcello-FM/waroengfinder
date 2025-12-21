import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const LandingPage = () => {
  const [featuredMenus, setFeaturedMenus] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        // Menggunakan URL Railway yang kamu berikan sebelumnya
        const apiUrl = 'https://waroengfinder-production-948c.up.railway.app';
        const response = await fetch(`${apiUrl}/api/landing/featured`);
        const data = await response.json();
        setFeaturedMenus(data);
      } catch (error) {
        console.error("Gagal mengambil data menu:", error);
      }
    };

    fetchMenus();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-b from-[#052e16] via-[#15803d] to-[#fef9c3] text-gray-900 relative overflow-x-hidden animate-fade-in">

      {/* Navbar */}
      <header className="w-full z-20 border-b border-white/10 bg-[linear-gradient(90deg,rgba(56,118,71,0.9)_0%,rgba(255,232,135,0.9)_100%)] backdrop-blur-md animate-fade-in" style={{ "--animation-delay": "0.05s" }}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 select-none">
            <div className="h-9 w-9 rounded-2xl bg-[#22c55e] flex items-center justify-center shadow-lg shadow-emerald-500/40">
              <span className="text-white text-xl font-black">WF</span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold text-emerald-100 tracking-widest uppercase">Waroeng</span>
              <span className="text-lg font-black text-white -mt-1">Finder</span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <button className="px-4 py-2 rounded-full text-sm font-semibold text-[#052e16] bg-white shadow-md border border-white/80 hover:bg-emerald-50 hover:border-emerald-200 transition-all">
                Login
              </button>
            </Link>
            <Link to="/register">
              <button className="px-5 py-2 rounded-full text-sm font-semibold text-[#052e16] bg-emerald-400 shadow-lg shadow-emerald-500/40 hover:bg-emerald-300 transition-all">
                Register
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-32 h-80 w-80 rounded-full bg-emerald-500/25 blur-3xl" />
        <div className="absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-yellow-300/30 blur-3xl" />
      </div>

      {/* Hero section */}
      <main
        id="beranda"
        className="flex-none flex items-center justify-center px-4 py-10 md:py-16 relative min-h-[90vh]"
      >
        <div className="relative z-10 max-w-6xl w-full grid md:grid-cols-2 gap-10 md:gap-16 items-center">

          {/* Left: text content */}
          <div className="animate-fade-up" style={{ "--animation-delay": "0.15s" }}>
            <div className="inline-flex items-center gap-2 mb-5 px-4 py-1 rounded-full bg-[#22c55e]/10 border border-[#22c55e]/40 text-xs font-semibold tracking-[0.2em] uppercase text-[#ecfdf3]">
              <span className="text-base">✨</span>
              <span>Rekomendasi Kuliner Kampus</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 font-serif text-white leading-tight drop-shadow-sm">
              Temukan Waroeng Favorit di Sekitar Kampus
            </h1>

            <p className="text-base md:text-lg mb-4 font-medium text-emerald-100/90 leading-relaxed max-w-xl">
              Waroeng Finder membantu kamu menemukan warung makan murah, enak, dan nyaman.
              Lihat menu, harga, rating, dan ulasan mahasiswa lain sebelum kamu berangkat.
            </p>
            <p className="text-xs md:text-sm mb-8 text-emerald-100/80 max-w-md">
              Tidak perlu bingung lagi pilih tempat makan. Semua rekomendasi sudah dikurasi
              khusus untuk kebutuhan mahasiswa kampus.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#22c55e] text-[#052e16] font-bold text-sm md:text-base shadow-xl shadow-emerald-500/40 hover:bg-[#4ade80] hover:scale-[1.02] transition-all">
                  Daftar Sekarang
                </button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-8 py-3 rounded-full bg-transparent text-emerald-50 font-semibold text-sm md:text-base border border-emerald-200/70 hover:bg-emerald-900/40 transition-all">
                  Saya Sudah Punya Akun
                </button>
              </Link>
            </div>

            <div
              id="fitur"
              className="mt-8 grid grid-cols-2 gap-4 text-left text-xs md:text-sm text-emerald-100/90 animate-fade-up"
              style={{ "--animation-delay": "0.25s" }}
            >
              <div className="p-3 rounded-2xl bg-emerald-900/40 border border-emerald-400/30">
                <p className="font-semibold mb-1">Filter Sesuai Budget</p>
                <p>Atur kisaran harga makanan yang sesuai dengan kantong mahasiswa.</p>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-900/40 border border-emerald-400/30">
                <p className="font-semibold mb-1">Rating & Ulasan</p>
                <p>Lihat review jujur dari mahasiswa lain sebelum kamu memutuskan.</p>
              </div>
            </div>
          </div>

          {/* Right: card that meniru tampilan app */}
          <div className="relative flex justify-center md:justify-end animate-fade-up" style={{ "--animation-delay": "0.2s" }}>
            <div className="relative h-[420px] w-[260px] md:h-[460px] md:w-[280px] rounded-4xl bg-[#f0fdf4]/95 shadow-[0_20px_60px_rgba(0,0,0,0.45)] border border-emerald-900/30 overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-b from-emerald-900/70 via-emerald-900/40 to-transparent" />
              <div className="relative z-10 h-full flex flex-col">
                <div className="px-4 pt-4 pb-3 flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-emerald-100 uppercase tracking-[0.25em]">
                    Near Campus
                  </span>
                  <span className="text-[11px] text-emerald-100/80">1.2 km • 5 min</span>
                </div>

                <div className="px-4 space-y-3">
                  <div className="p-3 rounded-xl bg-white/95 flex items-center justify-between shadow-sm">
                    <div>
                      <p className="text-xs font-bold text-emerald-900">Waroeng Nasi Ayam Geprek</p>
                      <p className="text-[10px] text-gray-500">Mulai 12K • Pedas level 1–5</p>
                    </div>
                    <span className="text-[11px] font-semibold text-amber-500">4.8★</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/90 flex items-center justify-between shadow-sm">
                    <div>
                      <p className="text-xs font-bold text-emerald-900">Kopi Belajar Malam</p>
                      <p className="text-[10px] text-gray-500">WiFi kencang • Colokan banyak</p>
                    </div>
                    <span className="text-[11px] font-semibold text-amber-500">4.9★</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/90 flex items-center justify-between shadow-sm">
                    <div>
                      <p className="text-xs font-bold text-emerald-900">Mie Rebus Anak Kos</p>
                      <p className="text-[10px] text-gray-500">Porsi jumbo • Friendly keuangan</p>
                    </div>
                    <span className="text-[11px] font-semibold text-amber-500">4.7★</span>
                  </div>
                </div>

                <div className="mt-auto px-4 pb-4 pt-3 border-t border-emerald-900/20 bg-emerald-900/60">
                  <p className="text-[10px] text-emerald-100/80 mb-1">
                    Siap jelajahi waroeng dekat kampus?
                  </p>
                  <button className="w-full py-2 rounded-full bg-[#22c55e] text-[11px] font-semibold text-emerald-950 hover:bg-[#4ade80] transition-all">
                    Mulai Cari Waroeng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Featured Menu Section */}
      <section className="bg-white py-16 px-4 md:py-20 relative z-10 rounded-t-[3rem] -mt-10 shadow-[0_-20px_60px_rgba(0,0,0,0.1)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-[#052e16] mb-4">
              Menu Pilihan Mahasiswa
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
              Rekomendasi menu terbaik di sekitar kampus dengan rating terpercaya dari teman-temanmu.
              Login untuk melihat detail dan ulasan lengkapnya.
            </p>
          </div>

          {featuredMenus.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <p>Memuat menu rekomendasi...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {featuredMenus.map((menu) => (
                <div 
                  key={menu.id}
                  onClick={() => navigate('/login')}
                  className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group overflow-hidden"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={menu.image || "https://via.placeholder.com/400x300?text=No+Image"} 
                      alt={menu.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-2 py-1 rounded-lg shadow-sm flex items-center gap-1">
                      <span className="text-amber-500 text-sm">★</span>
                      <span className="text-xs font-bold text-gray-800">
                        {Number(menu.rating).toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                        {menu.name}
                      </h3>
                      {/* PERBAIKAN DI SINI: Format Harga Menangani NaN */}
                      <p className="text-emerald-600 font-bold text-sm whitespace-nowrap bg-emerald-50 px-2 py-1 rounded-md">
                        {Number(String(menu.price).replace(/[^0-9]/g, "") || 0).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </p>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-600 text-xs">
                        <span className="font-semibold bg-gray-100 px-2 py-0.5 rounded text-gray-700 truncate max-w-[200px]">{menu.warung_name}</span>
                      </div>
                      <div className="flex items-start text-gray-500 text-xs gap-1.5">
                        <svg className="w-3.5 h-3.5 mt-0.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="line-clamp-2 leading-relaxed">{menu.address}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                      <button className="w-full py-2 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-bold group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                        Lihat Detail
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-12 text-center">
            <Link to="/login">
                <button className="px-8 py-3 rounded-full bg-[#052e16] text-white font-bold text-sm shadow-lg hover:bg-[#0a4523] transition-all transform hover:scale-105">
                  Jelajahi Lebih Banyak Menu
                </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="kontak"
        className="relative z-10 border-t border-gray-200 bg-white text-gray-600 text-[11px] md:text-xs tracking-widest uppercase"
      >
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-semibold text-emerald-900">
            &copy; 2025 Waroeng Finder Project
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-emerald-600 transition-colors">Instagram</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">Twitter</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">Github</a>
          </div>
          <div className="flex gap-1 items-center">
            <span>Created with <span className="text-red-500">♥</span> by Waroeng Finder Team</span>
          </div>
        </div>
      </footer>
    </div>
  );
};