# 💎 Flowix Instant Checkout – Node.js Express Edition

![Node.js Version](https://img.shields.io/badge/Node.js-18.x%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white)
![Security](https://img.shields.io/badge/Security-Helmet_%26_CSRF-red?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

> **High-Performance, Secure, & Scalable.** Sistem checkout produk digital berbasis **Node.js Express** yang terintegrasi penuh dengan Payment Gateway Flowix. Dirancang khusus dengan lapisan keamanan tingkat lanjut untuk menangani transaksi QRIS secara real-time.

---

## 📑 Daftar Isi
- [Arsitektur & Logika Sistem](#-arsitektur--logika-sistem)
- [Fitur Utama](#-fitur-utama)
- [Teknologi & Dependensi](#-teknologi--dependensi)
- [Struktur Proyek](#-struktur-proyek)
- [Instalasi & Konfigurasi](#-instalasi--konfigurasi)
- [API Reference (Internal Proxy)](#-api-reference-internal-proxy)
- [Keamanan & Best Practices](#-keamanan--best-practices)
- [Kontribusi & Lisensi](#-kontribusi--lisensi)

---

## 🧠 Arsitektur & Logika Sistem

Aplikasi ini mengimplementasikan pola **Backend-for-Frontend (BFF)** untuk memastikan kredensial sensitif seperti `API_KEY` dan `MERCHANT_ID` tidak pernah bocor ke sisi klien.

### Workflow Transaksi:
1.  **Request Initiation:** Frontend mengirimkan request ke endpoint internal Express dengan proteksi **CSRF Token**.
2.  **Server-Side Proxy:** `server.js` menerima request, menyuntikkan API Key dari `.env`, dan melakukan handshake ke Flowix Gateway API v1.
3.  **Dynamic Rendering:** Response berupa data QRIS dikirim kembali ke klien untuk dirender secara dinamis.
4.  **Real-time Polling:** Sistem melakukan verifikasi status otomatis setiap beberapa detik hingga pembayaran terdeteksi sukses oleh server.

---

## ✨ Fitur Utama

### 🛡️ Enterprise-Grade Security
* **CSRF Protection:** Mencegah serangan *Cross-Site Request Forgery* pada setiap endpoint mutasi.
* **XSS Mitigation:** Menggunakan middleware **Helmet** untuk mengatur header HTTP yang aman.
* **Rate Limiting:** Proteksi bawaan terhadap serangan Brute Force pada API pembayaran.

### ⚡ Performance & UI
* **Express EJS Engine:** Rendering sisi server yang cepat dengan integrasi data yang mulus.
* **Clean Architecture:** Pemisahan konfigurasi, logika server, dan aset publik.
* **Mobile Optimized:** Tampilan yang sepenuhnya responsif untuk transaksi via smartphone.

---

## 🛠 Teknologi & Dependensi

* **Runtime:** Node.js (v18+)
* **Framework:** Express.js
* **View Engine:** EJS (Embedded JavaScript templates)
* **Core Libraries:**
    * `axios`: Handling HTTP requests ke gateway.
    * `csurf`: Middleware proteksi CSRF.
    * `helmet`: Pengamanan header HTTP.
    * `express-rate-limit`: Pembatasan trafik API.
    * `dotenv`: Manajemen variabel lingkungan.

---

## 📂 Struktur Proyek

```bash
/project-root
├── public/               # Static assets (Images, CSS, JS)
│   └── images/           # Asset gambar produk
├── views/                # EJS Templates (Frontend UI)
│   └── index.ejs
├── .env                  # Environment Variables (PRIVATE)
├── config.js             # Centralized Configuration Logic
├── server.js             # Main Entry Point & API Routes
├── package.json          # Project Metadata & Dependencies
└── README.md             # Dokumentasi

```

---

## 🚀 Instalasi & Konfigurasi

### 1. Persiapan Lingkungan

Pastikan Anda sudah menginstall [Node.js](https://nodejs.org/) (versi LTS sangat disarankan).

### 2. Kloning & Install Dependensi

```bash
git clone https://github.com/dani-techno/script-market-node.git
cd script-market-node
npm install

```

### 3. Konfigurasi Environment

Buat file `.env` di root direktori dan sesuaikan dengan kredensial dari Dashboard Flowix Anda:

```env
PORT=3000

# API Configuration
API_BASE_URL=https://flowix.web.id
API_KEY=sk-xxxx-xxxx-xxxx
MERCHANT_ID=MID-XXXX

# Product Details
PRODUCT_TITLE=Script Bot WhatsApp
PRODUCT_DESC=Otomatisasi pesan pelanggan dengan fitur AI dan integrasi API lengkap.
PRODUCT_PRICE=5000
DOWNLOAD_URL=https://your-storage.com/file.zip

```

### 4. Menjalankan Aplikasi

**Mode Produksi:**

```bash
npm start

```

**Mode Pengembangan (Auto-reload):**

```bash
npm run dev

```

Akses aplikasi di: `http://localhost:3000`

---

## 📡 API Reference (Internal Proxy)

Semua endpoint dilindungi oleh middleware `csrfProtection`.

| Endpoint | Method | Fungsi |
| --- | --- | --- |
| `/` | `GET` | Render halaman utama (Checkout Page) |
| `/api/payment/create` | `POST` | Inisiasi transaksi & Generate QRIS |
| `/api/payment/status` | `POST` | Cek status pembayaran (Polling) |
| `/api/payment/cancel` | `POST` | Pembatalan transaksi manual |
| `/api/download` | `POST` | Mendapatkan link download aman setelah sukses |

---

## 🛡 Keamanan & Best Practices

Sebagai **Senior Engineer**, saya merekomendasikan langkah berikut untuk tahap produksi:

1. **SSL/HTTPS:** Selalu jalankan aplikasi di balik SSL (Nginx Reverse Proxy atau Certbot) untuk mengamankan cookie CSRF.
2. **Session Store:** Untuk skala besar, ganti default cookie-parser dengan session store berbasis Redis atau Database.
3. **Environment Security:** Pastikan `.env` masuk ke dalam `.gitignore`. Jangan pernah melakukan commit file `.env` ke repositori publik.
4. **Logging:** Implementasikan library logging seperti `winston` atau `pino` untuk memantau error transaksi secara real-time.

---

## 👨‍💻 Credits & License

* **Lead Developer:** Dani Joest, S.M.T., C.P.M.
* **Company:** PT INOVIXA TECHNOLOGIES SOLUTION
* **License:** MIT License - Lihat file `LICENSE` untuk detailnya.

---

Build with ❤️ by **Mr. Dani Joest**.