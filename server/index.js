require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// --- 1. FITUR LOGIN PINTAR (Membedakan User & Admin) ---
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (user.rows.length === 0)
      return res.status(401).json({ error: "Email salah" });

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword)
      return res.status(401).json({ error: "Password salah" });

    // ATURAN: Jika emailnya 'admin@gmail.com', maka dia ADMIN.
    const role = email === "admin@gmail.com" ? "admin" : "user";

    res.json({
      id: user.rows[0].id,
      fullName: user.rows[0].full_name,
      email: user.rows[0].email,
      role: role,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// --- 2. FITUR REGISTER ---
app.post("/register", async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    const userCheck = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (userCheck.rows.length > 0)
      return res.status(400).json({ error: "Email sudah terdaftar." });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await pool.query(
      "INSERT INTO users (full_name, email, password) VALUES ($1, $2, $3) RETURNING id, full_name, email",
      [fullName, email, hashedPassword]
    );
    res.json(newUser.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// --- 3. FITUR USER: Kirim Rekomendasi Warung ---
app.post("/request-warung", async (req, res) => {
  const { userId, name, address, imageUrl, description } = req.body;
  try {
    const newRequest = await pool.query(
      `INSERT INTO warung_requests (user_id, name, address, image_url, description) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [userId, name, address, imageUrl, description]
    );
    res.json(newRequest.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- 4. FITUR ADMIN: Lihat Semua Request ---
app.get("/admin/requests", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM warung_requests ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- 5. FITUR ADMIN: TERIMA (ACC) ---
app.post("/admin/approve/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // A. Ambil data dari tabel request
    const requestData = await pool.query(
      "SELECT * FROM warung_requests WHERE id = $1",
      [id]
    );
    if (requestData.rows.length === 0)
      return res.status(404).json({ error: "Data tidak ditemukan" });

    const data = requestData.rows[0];

    // B. Buat Slug Otomatis
    const slug =
      data.name
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "") +
      "-" +
      Date.now();

    // C. Pindahkan ke tabel WARUNGS Utama
    await pool.query(
      `INSERT INTO warungs (name, slug, image_url, address, rating_avg) 
       VALUES ($1, $2, $3, $4, 0.0)`,
      [data.name, slug, data.image_url, data.address]
    );

    // D. Hapus dari daftar antrean request
    await pool.query("DELETE FROM warung_requests WHERE id = $1", [id]);

    res.json({ message: "Warung berhasil di-ACC!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// --- 6. FITUR ADMIN: TOLAK (Hapus) ---
app.delete("/admin/reject/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM warung_requests WHERE id = $1", [id]);
    res.json({ message: "Ditolak" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- 7. DATA UMUM ---
app.get("/warungs", async (req, res) => {
  const { sort } = req.query;
  try {
    let query = `SELECT w.*, (SELECT COUNT(*) FROM reviews r WHERE r.warung_id = w.id) as review_count FROM warungs w `;
    if (sort === "terlaris") query += " ORDER BY rating_avg DESC";
    else if (sort === "ulasan") query += " ORDER BY review_count DESC";
    else if (sort === "terdekat") query += " ORDER BY name ASC";
    else query += " ORDER BY id ASC";

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/warungs/:slug", async (req, res) => {
  const { slug } = req.params;
  try {
    const warung = await pool.query(
      "SELECT * FROM warungs WHERE slug = $1 OR id::text = $1",
      [slug]
    );
    if (warung.rows.length === 0)
      return res.status(404).json({ error: "Warung tidak ditemukan" });
    const menus = await pool.query("SELECT * FROM menus WHERE warung_id = $1", [
      warung.rows[0].id,
    ]);
    res.json({ warung: warung.rows[0], menus: menus.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/reviews/:warungId", async (req, res) => {
  try {
    const reviews = await pool.query(
      `SELECT r.*, u.full_name FROM reviews r LEFT JOIN users u ON r.user_id = u.id WHERE r.warung_id = $1 ORDER BY r.created_at DESC`,
      [req.params.warungId]
    );
    res.json(reviews.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/reviews", async (req, res) => {
  const { userId, warungId, rating, comment } = req.body;
  try {
    const newReview = await pool.query(
      "INSERT INTO reviews (user_id, warung_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *",
      [userId, warungId, rating, comment]
    );
    res.json(newReview.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 1. UPDATE: User Kirim Rekomendasi (Simpan menu dalam bentuk teks JSON)
app.post("/request-warung", async (req, res) => {
  const { userId, name, address, imageUrl, description, menus } = req.body;

  // Ubah array menu menjadi string JSON agar bisa masuk satu kolom
  const menusString = JSON.stringify(menus);

  try {
    const newRequest = await pool.query(
      `INSERT INTO warung_requests (user_id, name, address, image_url, description, menus_json) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [userId, name, address, imageUrl, description, menusString]
    );
    res.json(newRequest.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. UPDATE: Admin Terima (Pindahkan Warung DAN Menunya)
app.post("/admin/approve/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // A. Ambil data request
    const requestData = await pool.query(
      "SELECT * FROM warung_requests WHERE id = $1",
      [id]
    );
    if (requestData.rows.length === 0)
      return res.status(404).json({ error: "Data tidak ditemukan" });

    const data = requestData.rows[0];
    const slug =
      data.name
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "") +
      "-" +
      Date.now();

    // B. Masukkan ke tabel WARUNGS Utama & AMBIL ID BARUNYA
    const newWarung = await pool.query(
      `INSERT INTO warungs (name, slug, image_url, address, rating_avg) 
       VALUES ($1, $2, $3, $4, 0.0) RETURNING id`,
      [data.name, slug, data.image_url, data.address]
    );

    const newWarungId = newWarung.rows[0].id;

    // C. Buka bungkusan JSON Menu tadi, lalu masukkan ke tabel MENUS satu per satu
    if (data.menus_json) {
      const menuList = JSON.parse(data.menus_json);
      for (const item of menuList) {
        // Kita kasih emoji default 🍲 kalau user gak isi emoji
        await pool.query(
          `INSERT INTO menus (warung_id, name, price, category, emoji) VALUES ($1, $2, $3, $4, $5)`,
          [newWarungId, item.name, item.price, "Makanan", "🍲"]
        );
      }
    }

    // D. Hapus request
    await pool.query("DELETE FROM warung_requests WHERE id = $1", [id]);

    res.json({ message: "Warung dan Menunya berhasil tayang!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
