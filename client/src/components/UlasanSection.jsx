import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export const UlasanSection = ({ warungId }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hover, setHover] = useState(0);

  const user = JSON.parse(localStorage.getItem("authUser"));

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        if (!warungId) return;
        const response = await axios.get(
          `https://waroengfinder-production.up.railway.app/reviews/${warungId}`
        );

        if (Array.isArray(response.data)) {
          setReviews(response.data);
        } else {
          setReviews([]);
        }
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        setReviews([]);
      }
    };

    fetchReviews();
  }, [warungId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      Swal.fire("Gagal", "Anda harus login untuk memberi ulasan.", "warning");
      return;
    }
    if (rating === 0) {
      Swal.fire(
        "Pilih Bintang",
        "Silakan beri rating bintang terlebih dahulu.",
        "info"
      );
      return;
    }

    try {
      await axios.post(
        "https://waroengfinder-production.up.railway.app/reviews",
        {
          userId: user.id,
          warungId: warungId,
          rating: rating,
          comment: comment,
        }
      );

      await Swal.fire({
        icon: "success",
        title: "Terima Kasih!",
        text: "Ulasan berhasil dikirim",
        timer: 1500,
        showConfirmButton: false,
      });

      setRating(0);
      setComment("");

      const response = await axios.get(
        `https://waroengfinder-production.up.railway.app/reviews/${warungId}`
      );
      if (Array.isArray(response.data)) {
        setReviews(response.data);
      } else {
        setReviews([]);
      }

      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      Swal.fire("Error", "Gagal mengirim ulasan.", "error");
    }
  };
  return (
    <div className="mt-8 p-6 bg-white rounded-2xl shadow-md">
      <h3 className="text-2xl font-bold text-[#387647] mb-6 font-serif">
        Ulasan Pengunjung ({reviews?.length || 0})
      </h3>

      <div className="mb-8 border-b pb-6">
        <p className="mb-2 font-medium text-gray-600">
          Bagaimana pengalamanmu makan di sini?
        </p>

        <div className="flex gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className={`text-3xl transition-colors duration-200 ${
                star <= (hover || rating) ? "text-yellow-400" : "text-gray-300"
              }`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(rating)}
            >
              ★
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#68dc84] outline-none"
            rows="3"
            placeholder="Tulis ulasanmu di sini..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
          <button
            type="submit"
            className="mt-3 px-6 py-2 bg-[#387647] text-white rounded-full font-bold shadow-md hover:bg-[#2e613a] transition"
          >
            Kirim Ulasan
          </button>
        </form>
      </div>

      <div className="space-y-6">
        {!reviews || reviews.length === 0 ? (
          <p className="text-gray-500 italic text-center">
            Belum ada ulasan. Jadilah yang pertama!
          </p>
        ) : (
          (reviews || []).map((rev, index) => (
            <div
              key={rev.id || index}
              className="flex gap-4 border-b border-gray-100 pb-4 last:border-0"
            >
              <div className="w-10 h-10 rounded-full bg-[#68dc84] flex items-center justify-center text-white font-bold text-lg shrink-0">
                {rev.full_name ? rev.full_name.charAt(0).toUpperCase() : "U"}
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-[#387647]">
                    {rev.full_name || "Pengguna"}
                  </h4>
                  <span className="text-xs text-gray-400">
                    {rev.created_at
                      ? new Date(rev.created_at).toLocaleDateString("id-ID")
                      : "-"}
                  </span>
                </div>

                <div className="flex text-yellow-400 text-sm my-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>{i < rev.rating ? "★" : "☆"}</span>
                  ))}
                </div>

                <p className="text-gray-700 text-sm">{rev.comment}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
