import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UlasanSection } from "../components/UlasanSection";

const FALLBACK_FOOD_IMAGE =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop";

const menuItems = [
  {
    id: 1,
    name: "Ayam S. Ijo",
    price: "Rp 10.000",
    imageUrl:
      "https://images.unsplash.com/photo-1604908176997-1251884b08a3?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Ayam Gulai",
    price: "Rp 10.000",
    imageUrl:
      "https://images.unsplash.com/photo-1606491956689-2ea866880c84?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Ayam Geprek",
    price: "Rp 10.000",
    imageUrl:
      "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Ayam Penyet",
    price: "Rp 10.000",
    imageUrl:
      "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "Mie Goreng",
    price: "Rp 10.000",
    imageUrl:
      "https://images.unsplash.com/photo-1612874742237-6526221588e3?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 6,
    name: "Mie ayam",
    price: "Rp 10.000",
    imageUrl:
      "https://images.unsplash.com/photo-1604908176995-1251884b08a2?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 7,
    name: "Mie Gomak",
    price: "Rp 10.000",
    imageUrl:
      "https://images.unsplash.com/photo-1494597564530-871f2e3b79e3?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 8,
    name: "Kwetiau",
    price: "Rp 10.000",
    imageUrl:
      "https://images.unsplash.com/photo-1625944230946-0f5b9f633507?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 9,
    name: "Es Teh Manis",
    price: "Rp 6.000",
    imageUrl:
      "https://images.unsplash.com/photo-1582571352032-448f7928eca3?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 10,
    name: "Lemon Tea",
    price: "Rp 8.000",
    imageUrl:
      "https://images.unsplash.com/photo-1546539782-6fc531453083?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 11,
    name: "Nutrisari",
    price: "Rp 5.000",
    imageUrl:
      "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 12,
    name: "Kopi",
    price: "Rp 5.000",
    imageUrl:
      "https://images.unsplash.com/photo-1512568400610-62da28bc8a13?q=80&w=800&auto=format&fit=crop",
  },
];

export const DetailWarungMuaz = () => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [warungData, setWarungData] = useState(null);

  useEffect(() => {
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
        const exists = stored.some((w) => w.id === 1);
        setIsFavorite(exists);
      }
    } catch {
      setIsFavorite(false);
    }

    const fetchWarungData = async () => {
      try {
        const response = await axios.get(
          "http://https://waroengfinder-production.up.railway.app/warungs/1"
        );
        setWarungData(response.data.warung);
      } catch (error) {
        console.error(error);
      }
    };
    fetchWarungData();
  }, []);

  const handleToggleFavorite = () => {
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
          const exists = stored.some((w) => w.id === 1);
          if (!exists) {
            stored.push({
              id: 1,
              name: warungData ? warungData.name : "Warung Muaz",
              price: "Mulai dari Rp10.000",
              location: "Jalan Dr. Mansyur",
              link: "/warung/muaz",
            });
          }
        } else {
          stored = stored.filter((w) => w.id !== 1);
        }

        localStorage.setItem(key, JSON.stringify(stored));
      } catch {
        // abaikan error localStorage
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="fixed top-0 left-0 right-0 z-50 h-16 sm:h-20 flex items-center justify-between px-4 sm:px-8 transition-all duration-300 bg-linear-to-b from-black/60 to-transparent">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center bg-white/95 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all text-[#387647] font-bold text-lg"
        >
          ←
        </button>
        <button
          onClick={handleToggleFavorite}
          className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center bg-white/95 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all text-2xl text-[#FACC15]"
        >
          {isFavorite ? "★" : "☆"}
        </button>
      </header>

      <div className="relative h-[350px] sm:h-[450px]">
        <img
          src="https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=2000&auto=format&fit=crop"
          alt="Warung Muaz"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#387647] via-transparent to-transparent opacity-90" />

        <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-8">
          <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-4xl mx-auto border-b-4 border-[#387647]">
            <h1 className="text-3xl sm:text-5xl font-black text-[#387647] font-serif text-center mb-2">
              {warungData ? warungData.name : "Warung Muaz"}
            </h1>
            <p className="text-center text-gray-500 font-medium mb-4 text-lg">
              Spesialis Ayam Penyet & Sambal Ijo
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-sm font-bold text-white">
              <span className="bg-[#FACC15] text-[#387647] px-4 py-1.5 rounded-full shadow-sm">
                {warungData ? warungData.rating_avg : "0.0"} ★
              </span>
              <span className="bg-[#387647] px-4 py-1.5 rounded-full shadow-sm">
                08:00 - 22:00 🕒
              </span>
              <span className="bg-[#387647] px-4 py-1.5 rounded-full shadow-sm">
                Murah Meriah 💲
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 sm:mt-20 pb-20">
        <section className="px-4 sm:px-8 max-w-6xl mx-auto">
          <h2 className="font-serif font-black text-[#387647] text-2xl sm:text-3xl mb-6 border-l-4 border-[#FACC15] pl-4">
            Daftar Menu
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {menuItems.map((item) => (
              <article
                key={item.id}
                className="group rounded-3xl bg-white shadow-lg p-4 flex flex-col items-center text-center transition-all hover:-translate-y-2 hover:shadow-2xl border border-gray-100"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 mb-4 rounded-full overflow-hidden flex items-center justify-center bg-linear-to-br from-[#dcfce7] to-[#86efac] shadow-inner group-hover:scale-110 transition-transform">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    onError={(e) => {
                      if (e.target.src !== FALLBACK_FOOD_IMAGE) {
                        e.target.onerror = null;
                        e.target.src = FALLBACK_FOOD_IMAGE;
                      }
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-serif font-bold text-gray-800 text-lg mb-1 leading-tight">
                  {item.name}
                </h3>
                <p className="text-[#387647] font-bold bg-green-50 px-4 py-1 rounded-full text-sm mt-2">
                  {item.price}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="px-4 sm:px-8 max-w-5xl mx-auto mt-12">
          <UlasanSection warungId={1} />
        </section>
      </div>
    </div>
  );
};
