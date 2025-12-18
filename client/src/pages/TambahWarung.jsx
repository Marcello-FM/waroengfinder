import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export const TambahWarung = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("authUser"));

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    imageUrl: "",
    description: "",
  });

  // State khusus untuk menampung daftar menu
  const [menuList, setMenuList] = useState([
    { name: "", price: "" }, // Menu pertama (kosong)
  ]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Fungsi mengubah isi input menu
  const handleMenuChange = (index, e) => {
    const newMenus = [...menuList];
    newMenus[index][e.target.name] = e.target.value;
    setMenuList(newMenus);
  };

  // Fungsi tambah baris menu baru
  const addMenuField = () => {
    setMenuList([...menuList, { name: "", price: "" }]);
  };

  // Fungsi hapus baris menu
  const removeMenuField = (index) => {
    const newMenus = [...menuList];
    newMenus.splice(index, 1);
    setMenuList(newMenus);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      Swal.fire("Ups!", "Login dulu ya.", "warning");
      return;
    }

    try {
      await axios.post(
        "https://waroengfinder-production.up.railway.app/request-warung",
        {
          userId: user.id,
          ...formData,
          menus: menuList, // Kirim daftar menu juga
        }
      );

      Swal.fire(
        "Berhasil",
        "Rekomendasi warung & menu terkirim ke Admin!",
        "success"
      ).then(() => navigate("/beranda"));
      // eslint-disable-next-line no-unused-vars
    } catch (_) {
      Swal.fire("Gagal", "Terjadi kesalahan.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#dcfce7] via-[#f0fdf4] to-white py-10 px-4 flex justify-center">
      <div className="bg-white/95 max-w-3xl w-full rounded-3xl shadow-xl p-8 md:p-10 border border-green-100">
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center w-9 h-9 text-[#387647] hover:text-[#2e613a] transition"
            aria-label="Kembali"
          >
            <span className="text-2xl leading-none">&#8592;</span>
          </button>
        </div>

        <div className="mb-6 text-center space-y-2">
          <h2 className="text-3xl md:text-4xl font-black text-[#387647] font-serif">
            Tambah Warung & Menu
          </h2>
          <p className="text-sm md:text-base text-gray-500 max-w-xl mx-auto">
            Bantu mahasiswa lain menemukan tempat makan favoritmu dengan mengisi
            informasi warung dan menu andalan di bawah ini.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Data Warung */}
          <div className="space-y-4 border-b pb-6">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-gray-700">Info Warung</h3>
              <span className="text-[11px] uppercase tracking-[0.2em] text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-semibold">
                Step 1
              </span>
            </div>
            <input
              name="name"
              onChange={handleChange}
              required
              placeholder="Nama Warung (contoh: Waroeng Nasi Ayam Geprek)"
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none text-sm"
            />
            <input
              name="address"
              onChange={handleChange}
              required
              placeholder="Alamat lengkap warung"
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none text-sm"
            />
            <input
              name="imageUrl"
              onChange={handleChange}
              placeholder="Link foto warung (URL, opsional)"
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none text-sm"
            />
            <textarea
              name="description"
              onChange={handleChange}
              placeholder="Deskripsi singkat (suasana, kisaran harga, keunggulan)"
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none text-sm min-h-[90px]"
            />
          </div>

          {/* Data Menu Dinamis */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-700">
                    Daftar Menu Unggulan
                  </h3>
                  <span className="text-[11px] uppercase tracking-[0.2em] text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-semibold">
                    Step 2
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Tambahkan beberapa menu utama beserta harganya. Kamu bisa
                  menambah lebih dari satu menu.
                </p>
              </div>
              <button
                type="button"
                onClick={addMenuField}
                className="h-9 w-9 flex items-center justify-center rounded-full bg-green-100 text-green-700 text-lg font-bold shadow-sm hover:bg-green-200 hover:shadow-md transition-all"
                aria-label="Tambah baris menu"
              >
                +
              </button>
            </div>

            <div className="space-y-3">
              {menuList.map((menu, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row gap-2 sm:items-center bg-slate-50 border border-slate-200 rounded-2xl px-3 py-3"
                >
                  <div className="flex-1 flex flex-col sm:flex-row gap-2">
                    <input
                      name="name"
                      value={menu.name}
                      onChange={(e) => handleMenuChange(index, e)}
                      placeholder="Nama Makanan (contoh: Ayam Geprek Keju)"
                      required
                      className="flex-1 p-2.5 rounded-xl bg-white border border-slate-200 outline-none text-sm"
                    />
                    <input
                      name="price"
                      value={menu.price}
                      onChange={(e) => handleMenuChange(index, e)}
                      placeholder="Harga (contoh: 15000)"
                      required
                      className="w-full sm:w-40 p-2.5 rounded-xl bg-white border border-slate-200 outline-none text-sm"
                    />
                  </div>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeMenuField(index)}
                      className="self-end sm:self-auto text-red-500 font-bold px-3 py-1 text-xs rounded-full hover:bg-red-50"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-full bg-[#387647] text-white font-bold text-lg shadow-lg hover:bg-[#2e613a] transition-transform hover:scale-[1.01]"
          >
            Kirim Semua Data
          </button>
        </form>
      </div>
    </div>
  );
};
