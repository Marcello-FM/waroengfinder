import React from "react";
import { Link } from "react-router-dom";
import { BookmarkFilled } from "../components/icons/BookmarkFilled";
import { Search } from "../components/icons/Search";
import { DummyImage } from "../components/shared/DummyImage";

const featuredWarungs = [
  {
    name: "Warung Muaz",
    price: "Mulai dari Rp10.000",
    location: "📍Jalan Dr. Mansyur",
    link: "/warung/muaz",
    imageUrl:
      "https://images.unsplash.com/photo-1543353071-873f17a7a088?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Warung Cello",
    price: "Mulai dari Rp10.000",
    location: "📍Jalan Jamin Ginting",
    link: "/warung/cello",
    imageUrl:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Warung Naswa",
    price: "Mulai dari Rp10.000",
    location: "📍Jalan Pembangunan",
    link: "/warung/naswa",
    imageUrl:
      "https://images.unsplash.com/photo-1521017432531-fbd92d768814?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Warung Rifki",
    price: "Mulai dari Rp13.000",
    location: "📍Jalan Setia Budi",
    link: "/warung/rifki",
    imageUrl:
      "https://images.unsplash.com/photo-1525755662778-989d0524087e?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Warung Slamet",
    price: "Mulai dari Rp12.000",
    location: "📍Jalan Dr. Mansyur",
    link: "/warung/slamet",
    imageUrl:
      "https://images.unsplash.com/photo-1481833761820-0509d3217039?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Warung Budi",
    price: "Mulai dari Rp12.000",
    location: "📍Jalan Jamin Ginting",
    link: "/warung/budi",
    imageUrl:
      "https://images.unsplash.com/photo-1556761223-4c4282c73f77?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Warung Intan",
    price: "Mulai dari Rp14.000",
    location: "📍Jalan Pembangunan",
    link: "/warung/intan",
    imageUrl:
      "https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Warung Fikri",
    price: "Mulai dari Rp18.000",
    location: "📍Jalan Setia Budi",
    link: "/warung/fikri",
    imageUrl:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop",
  },
];

export const Beranda = ({ onLogout }) => {
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="h-20 flex items-center justify-between px-4 sm:px-8 shadow-[0px_5px_4px_#00000040] bg-[linear-gradient(90deg,rgba(56,118,71,1)_0%,rgba(255,232,135,1)_100%)]">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleLogout}
            className="px-3 py-1 rounded-full bg-white/20 text-white text-xs sm:text-sm font-['Playfair-Black',Helvetica] shadow-[0px_3px_3px_#00000040] transition-transform duration-150 hover:-translate-y-0.5 active:scale-95"
          >
            Logout
          </button>
        </div>
        <h1 className="font-['Playfair-Black',Helvetica] font-black text-white text-2xl sm:text-3xl tracking-[0] leading-[normal]">
          Waroeng Finder
        </h1>
        <Link
          to="/favorite"
          className="text-white transition-transform active:scale-95 hover:scale-105"
        >
          <BookmarkFilled className="w-10 h-10" color="#387647" />
        </Link>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 sm:px-8 lg:px-16 py-8 sm:py-10 space-y-10 sm:space-y-12">
        {/* Telusuri bar */}
        <div className="max-w-6xl mx-auto">
          <Link to="/telusuri" className="block">
            <button className="w-full h-14 sm:h-16 rounded-full shadow-[0px_7px_10px_rgba(0,0,0,0.35)] bg-[linear-gradient(90deg,rgba(104,220,132,1)_0%,rgba(56,118,71,1)_100%)] flex items-center justify-center relative transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-0 border border-white/60">
              <div className="absolute left-6 flex items-center gap-2 text-white drop-shadow-sm">
                <Search className="w-6 h-6" />
              </div>
              <span className="font-['Playfair-Black',Helvetica] font-black text-white text-lg sm:text-xl tracking-wide leading-[normal] drop-shadow-sm">
                TELUSURI
              </span>
            </button>
          </Link>
        </div>

        {/* Hero section */}
        <section
          className="max-w-6xl mx-auto rounded-3xl shadow-[0px_7px_4px_#00000040] bg-[linear-gradient(180deg,rgba(104,220,132,1)_0%,rgba(56,118,71,1)_100%)] px-6 sm:px-10 py-10 sm:py-14 text-center text-white animate-fade-up"
          style={{ "--animation-delay": "0.05s" }}
        >
          <h2 className="font-['Playfair-Black',Helvetica] font-black text-3xl sm:text-4xl lg:text-5xl leading-tight mb-4">
            Selamat Datang di
            <br />
            Waroeng Finder!
          </h2>
          <p className="font-['Playfair-Medium',Helvetica] font-medium text-base sm:text-lg lg:text-xl max-w-3xl mx-auto">
            Lagi laper tapi bingung mau makan di mana? Tenang! Biar kami bantu
            cari yang Murah, Enak, dan Dekat! Waroeng Finder ngebantu kamu
            nemuin tempat makan paling worth it. Cukup temukan, datangi, dan
            nikmati!
          </p>
        </section>

        {/* Waroeng Paling Diminati */}
        <section className="max-w-6xl mx-auto space-y-6">
          <div className="w-full h-14 rounded-full shadow-[0px_7px_4px_#00000040] bg-[linear-gradient(90deg,rgba(56,118,71,1)_0%,rgba(255,232,135,1)_100%)] flex items-center justify-center">
            <h3 className="font-['Playfair-Black',Helvetica] font-black text-white text-xl sm:text-2xl">
              Waroeng Paling Diminati
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredWarungs.map((warung) => (
              <article
                key={warung.name}
                className="rounded-[30px] shadow-[0px_7px_4px_#00000040] bg-[linear-gradient(180deg,rgba(104,220,132,1)_0%,rgba(56,118,71,1)_100%)] p-4 flex flex-col items-center text-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0px_12px_18px_rgba(0,0,0,0.25)] animate-fade-up"
                style={{ "--animation-delay": "0.1s" }}
              >
                <Link to={warung.link} className="w-full">
                  <DummyImage
                    className="w-full aspect-[1] mb-4"
                    alt={warung.name}
                    src={warung.imageUrl}
                  />
                </Link>
                <Link
                  to={warung.link}
                  className="font-['Playfair-Black',Helvetica] font-black text-2xl text-center mb-1"
                >
                  {warung.name}
                </Link>
                <p className="font-['Playfair-Black',Helvetica] text-sm text-center">
                  {warung.price}
                </p>
                <p className="font-['Playfair-Black',Helvetica] text-sm text-center mt-1">
                  {warung.location}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Mau makan apa hari ini? */}
        <section className="max-w-6xl mx-auto space-y-6 pb-8">
          <div className="w-full h-14 rounded-full shadow-[0px_7px_4px_#00000040] bg-[linear-gradient(90deg,rgba(56,118,71,1)_0%,rgba(255,232,135,1)_100%)] flex items-center justify-center">
            <h3 className="font-['Playfair-Black',Helvetica] font-black text-white text-xl sm:text-2xl">
              Mau makan apa hari ini?
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredWarungs.map((warung) => (
              <article
                key={`${warung.name}-second`}
                className="rounded-[30px] shadow-[0px_7px_4px_#00000040] bg-[linear-gradient(180deg,rgba(104,220,132,1)_0%,rgba(56,118,71,1)_100%)] p-4 flex flex-col items-center text-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0px_12px_18px_rgba(0,0,0,0.25)] animate-fade-up"
                style={{ "--animation-delay": "0.15s" }}
              >
                <Link to={warung.link} className="w-full">
                  <DummyImage
                    className="w-full aspect-[1] mb-4"
                    alt={warung.name}
                    src={warung.imageUrl}
                  />
                </Link>
                <Link
                  to={warung.link}
                  className="font-['Playfair-Black',Helvetica] font-black text-2xl text-center mb-1"
                >
                  {warung.name}
                </Link>
                <p className="font-['Playfair-Black',Helvetica] text-sm text-center">
                  {warung.price}
                </p>
                <p className="font-['Playfair-Black',Helvetica] text-sm text-center mt-1">
                  {warung.location}
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>
      {/* Tombol Melayang Tambah Warung */}
      <Link to="/tambah-warung">
        <div className="fixed bottom-8 right-8 z-50 group">
          <button className="w-16 h-16 bg-[#387647] rounded-full shadow-[0_4px_20px_rgba(56,118,71,0.4)] flex items-center justify-center text-white text-3xl font-bold hover:scale-110 hover:rotate-90 transition-all duration-300 border-4 border-[#f0fdf4]">
            +
          </button>
          <span className="absolute right-20 top-1/2 -translate-y-1/2 bg-white px-4 py-2 rounded-lg shadow-lg text-[#387647] font-bold text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Rekomendasikan Warung
          </span>
        </div>
      </Link>
    </div>
  );
};
