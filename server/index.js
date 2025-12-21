require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const path = require("path");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "public/images")));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

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

app.post("/request-warung", async (req, res) => {
  const { userId, name, address, imageUrl, description, menus } = req.body;
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

app.post("/admin/approve/:id", async (req, res) => {
  const { id } = req.params;
  try {
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

    const newWarung = await pool.query(
      `INSERT INTO warungs (name, slug, image_url, address, rating_avg) 
      VALUES ($1, $2, $3, $4, 0.0) RETURNING id`,
      [data.name, slug, data.image_url, data.address]
    );

    const newWarungId = newWarung.rows[0].id;

    if (data.menus_json) {
      const menuList = JSON.parse(data.menus_json);
      for (const item of menuList) {
        await pool.query(
          `INSERT INTO menus (warung_id, name, price, category, emoji) VALUES ($1, $2, $3, $4, $5)`,
          [newWarungId, item.name, item.price, "Makanan", "🍲"]
        );
      }
    }

    await pool.query("DELETE FROM warung_requests WHERE id = $1", [id]);

    res.json({ message: "Warung dan Menunya berhasil tayang!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.delete("/admin/reject/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM warung_requests WHERE id = $1", [id]);
    res.json({ message: "Ditolak" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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

app.put("/warungs/:id", async (req, res) => {
  const { id } = req.params;
  const { name, address, rating_avg, image_url } = req.body;

  try {
    const query = `
      UPDATE warungs
      SET name = $1, address = $2, rating_avg = $3, image_url = $4
      WHERE id = $5 RETURNING *;
    `;
    const result = await pool.query(query, [
      name,
      address,
      rating_avg,
      image_url,
      id,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Warung tidak ditemukan" });
    }
    res.json(result.rows[0]);
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

app.get("/api/landing/featured", async (req, res) => {
  try {
    const query = `
      SELECT 
        m.id, 
        m.name, 
        m.price, 
        -- m.image KITA HAPUS KARENA TIDAK ADA DI DATABASE
        w.name as warung_name, 
        w.address,
        w.image_url as image, -- KITA GANTI PAKAI GAMBAR WARUNG SAJA BIAR CANTIK
        COALESCE(AVG(r.rating), 0) as rating
      FROM menus m
      JOIN warungs w ON m.warung_id = w.id
      LEFT JOIN reviews r ON w.id = r.warung_id
      GROUP BY m.id, w.id, w.image_url
      ORDER BY RANDOM()
      LIMIT 6
    `;
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});
