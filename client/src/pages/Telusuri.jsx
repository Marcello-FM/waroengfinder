import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export const DetailTelusuri = () => {
  const [warungs, setWarungs] = useState([]);
  const [activeFilter, setActiveFilter] = useState("terkait");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchWarungs = async (filterType) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://https://waroengfinder-production.up.railway.app/warungs?sort=${filterType}`
      );
      setWarungs(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarungs(activeFilter);
  }, [activeFilter]);

  const FilterButton = ({ label, value }) => (
    <button
      onClick={() => setActiveFilter(value)}
      className={`px-6 py-2 rounded-full font-bold text-sm transition-all shadow-md flex-1 sm:flex-none ${
        activeFilter === value
          ? "bg-[#387647] text-white border-2 border-[#387647] shadow-lg scale-105"
          : "bg-white text-[#387647] border-2 border-green-100 hover:bg-green-50 hover:scale-105"
      }`}
    >
      {label}
    </button>
  );

  const filteredWarungs = warungs.filter((warung) =>
    warung.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen relative bg-[#f0fdf4]">
      <div
        className="absolute inset-0 z-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `url('https://www.transparenttextures.com/patterns/food.png')`,
          backgroundSize: "400px",
        }}
      />

      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 z-0 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 z-0 animate-pulse"></div>

      <div className="bg-[linear-gradient(90deg,rgba(56,118,71,1)_0%,rgba(255,232,135,1)_100%)] px-4 py-4 shadow-lg sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <Link
            to="/beranda"
            className="inline-flex items-center justify-center w-9 h-9 text-white hover:text-emerald-100 transition"
            aria-label="Kembali ke beranda"
          >
            <span className="text-2xl leading-none">&#8592;</span>
          </Link>

          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Cari nama warung..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-11 rounded-full px-5 pl-12 outline-none text-gray-800 bg-white shadow-[0px_5px_8px_rgba(0,0,0,0.25)] font-medium focus:ring-2 focus:ring-yellow-400 transition-all border border-white/70"
            />
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 pb-20">
        <div className="flex flex-wrap gap-2 sm:gap-4 justify-center my-6 sticky top-20 z-40 py-3 bg-[#f0fdf4]/80 backdrop-blur-md rounded-2xl border border-green-100 shadow-sm">
          <FilterButton label="Terkait" value="terkait" />
          <FilterButton label="Terlaris (Rating)" value="terlaris" />
          <FilterButton label="Ulasan Terbanyak" value="ulasan" />
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
            <p className="mt-4 text-green-700 font-bold">
              Sedang memuat kuliner...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWarungs.length > 0 ? (
              filteredWarungs.map((warung) => (
                <Link
                  to={`/warung/${warung.slug || warung.id}`}
                  key={warung.id}
                >
                  <div className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border border-green-50 h-full flex flex-col">
                    <div className="h-48 w-full bg-gray-200 relative overflow-hidden">
                      <img
                        src={warung.image_url || "https://placehold.co/400"}
                        alt={warung.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-[#387647] shadow-lg flex items-center gap-1">
                        <span>⭐</span> {warung.rating_avg || "0.0"}
                      </div>
                    </div>

                    <div className="p-5 flex flex-col grow relative">
                      <h3 className="text-xl font-bold text-[#387647] mb-1 font-serif group-hover:text-green-600 transition-colors">
                        {warung.name}
                      </h3>
                      <p className="text-gray-500 text-sm mb-4 flex items-center gap-1">
                        📍 {warung.address || "Alamat belum tersedia"}
                      </p>

                      <div className="mt-auto pt-4 border-t border-dashed border-gray-200 flex justify-between items-center text-xs font-semibold">
                        <span className="text-gray-400 flex items-center gap-1">
                          💬{" "}
                          {warung.review_count
                            ? `${warung.review_count} Ulasan`
                            : "Baru"}
                        </span>
                        <span className="text-white bg-[#387647] px-4 py-1.5 rounded-full shadow-md transform group-hover:scale-105 transition-transform">
                          Lihat Detail →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                <div className="text-6xl mb-4">🍲</div>
                <h3 className="text-xl font-bold text-gray-700">
                  Yah, warung tidak ditemukan
                </h3>
                <p className="text-gray-500">
                  Coba cari dengan kata kunci lain.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
