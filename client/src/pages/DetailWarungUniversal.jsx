import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; // useParams untuk baca URL
import { UlasanSection } from "../components/UlasanSection";

export const DetailWarungUniversal = () => {
  const { slug } = useParams(); // Ambil 'slug' dari URL
  const navigate = useNavigate();
  const [warung, setWarung] = useState(null);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Panggil Backend pakai slug
        const response = await axios.get(
          `https://waroengfinder-production.up.railway.app/warungs/${slug}`
        );
        setWarung(response.data.warung);
        setMenus(response.data.menus);
        try {
          let key = "favoriteWarungs";
          try {
            const user = JSON.parse(localStorage.getItem("authUser") || "null");
            if (user && user.email) {
              key = `favoriteWarungs_${user.email}`;
            }
          } catch {
            // fallback ke key default
          }

          const stored = JSON.parse(localStorage.getItem(key) || "[]");

          if (Array.isArray(stored)) {
            const exists = stored.some((w) => w.id === response.data.warung.id);
            setIsFavorite(exists);
          }
        } catch {
          setIsFavorite(false);
        }
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        console.error("Warung tidak ditemukan");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  const handleToggleFavorite = () => {
    if (!warung) return;
    setIsFavorite((prev) => {
      const next = !prev;
      try {
        let key = "favoriteWarungs";
        try {
          const user = JSON.parse(localStorage.getItem("authUser") || "null");
          if (user && user.email) {
            key = `favoriteWarungs_${user.email}`;
          }
        } catch {
          // fallback ke key default
        }

        let stored = JSON.parse(localStorage.getItem(key) || "[]");

        if (!Array.isArray(stored)) stored = [];

        if (next) {
          const exists = stored.some((w) => w.id === warung.id);
          if (!exists) {
            stored.push({
              id: warung.id,
              name: warung.name,
              price: warung.price_range || "Harga bervariasi",
              location: warung.address || "Lokasi belum tersedia",
              link: `/warung/${warung.slug || warung.id}`,
            });
          }
        } else {
          stored = stored.filter((w) => w.id !== warung.id);
        }

        localStorage.setItem(key, JSON.stringify(stored));
      } catch {
        // abaikan error localStorage
      }
      return next;
    });
  };

  if (loading) return <div className="text-center py-20">Memuat...</div>;
  if (!warung)
    return <div className="text-center py-20">Warung tidak ditemukan 😢</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-4 bg-linear-to-b from-black/60 to-transparent">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center bg-white/95 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all text-[#387647] font-bold text-lg"
        >
          ←
        </button>
        <button
          onClick={handleToggleFavorite}
          className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center bg-white/95 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all text-xl text-[#FACC15]"
        >
          {isFavorite ? "★" : "☆"}
        </button>
      </header>

      {/* Banner */}
      <div className="relative h-[400px]">
        <img
          src={warung.image_url || "https://placehold.co/600x400"}
          alt={warung.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-0 p-8 w-full text-center text-white">
          <h1 className="text-4xl font-black font-serif mb-2">{warung.name}</h1>
          <p className="opacity-90">{warung.address}</p>
          <div className="mt-4 inline-block bg-[#FACC15] text-black px-4 py-1 rounded-full font-bold">
            ⭐ {warung.rating_avg || "New"}
          </div>
        </div>
      </div>

      {/* Daftar Menu */}
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-black text-[#387647] mb-6 border-l-4 border-yellow-400 pl-4">
          Menu Makanan
        </h2>

        {menus.length === 0 ? (
          <p className="text-gray-400 italic">Belum ada menu terdaftar.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {menus.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-xl shadow-sm border flex justify-between items-center hover:shadow-md transition"
              >
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{item.emoji || "🍲"}</div>
                  <h3 className="font-bold text-gray-700">{item.name}</h3>
                </div>
                <span className="font-bold text-[#387647] bg-green-50 px-3 py-1 rounded-lg text-sm">
                  {item.price}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Ulasan Section */}
        <div className="mt-12">
          {/* Kita kirim ID warung agar ulasan masuk ke tempat yang benar */}
          <UlasanSection warungId={warung.id} />
        </div>
      </div>
    </div>
  );
};
