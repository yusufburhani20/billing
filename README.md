# 🌐 Idrisiyyah Net - Sistem Manajemen Billing & Mikrotik Terintegrasi

Sistem manajemen billing dan administrasi pelanggan internet (RT/RW Net / Local ISP) modern yang terintegrasi secara dinamis dengan **Mikrotik RouterOS API**, **Midtrans Payment Gateway**, dan **WhatsApp Gateway Lokal (Baileys)**. 

Aplikasi ini dibangun menggunakan arsitektur premium dengan stack modern: **Laravel 11**, **React (TypeScript)**, **Inertia.js**, dan **TailwindCSS**.

---

## ✨ Fitur Utama

### 1. 🖥️ Dashboard Admin Premium & Dinamis
* **Grafik Pendapatan:** Statistik visual interaktif (Harian & Bulanan) menggunakan *Recharts* yang terupdate secara real-time dari riwayat transaksi sukses.
* **Manajemen Pelanggan:** Registrasi pelanggan baru lengkap dengan PPPoE Username, Sandi, Peta Lokasi, dan alokasi Router.
* **Kelola Router & Paket:** Tambah/edit router Mikrotik, IP Pool, Profile Bandwidth, dan paket internet secara dinamis.
* **Cetak & Detail Invoice:** Halaman pratinjau invoice dengan layout premium dan teroptimasi cetak (*print-friendly*), lengkap dengan auto-trigger cetak/PDF.
* **Helpdesk Tiket:** Pusat bantuan tiket masuk terpadu dari pelanggan untuk respon cepat admin.

### 2. 👤 Portal Pelanggan (Customer Dashboard)
* **Status Layanan:** Tampilan ringkasan paket aktif, sisa hari, dan total tagihan bulan ini.
* **Pembayaran Instan (Midtrans Snap):** Bayar tagihan instan menggunakan berbagai metode (GoPay, QRIS, Virtual Account Mandiri/BCA/BNI/BRI) tanpa konfirmasi manual.
* **Bantuan Tiket Mandiri:** Pelanggan dapat membuat tiket kendala baru langsung dari dashboard mereka.

### 3. ⚙️ Sinkronisasi Mikrotik Otomatis
* Pembuatan Akun PPPoE secara otomatis di RouterOS begitu pelanggan didaftarkan di web.
* **Isolir Otomatis:** Akun PPPoE pelanggan akan otomatis dipindahkan ke Profile Isolir/Address List terisolasi jika melewati batas Jatuh Tempo tagihan.
* Sinkronisasi status koneksi, restart router, dan deteksi port secara real-time.

### 4. 💬 WhatsApp & Email Notification
* **WhatsApp Alert:** Notifikasi otomatis ketika tagihan baru terbit, pengingat jatuh tempo, tiket baru, maupun konfirmasi pelunasan (via local Baileys gateway).
* **Email Notifikasi:** Pengiriman email konfirmasi transaksi dan aktivasi menggunakan standard SMTP (seperti Gmail).

---

## 🛠️ Stack Teknologi

* **Backend:** Laravel 11, PHP 8.2+
* **Frontend:** React 18, TypeScript, TailwindCSS v4, Inertia.js (SSR Ready)
* **Database:** MySQL / MariaDB
* **Integrasi API:**
  * **RouterOS API:** Koneksi soket native ke Router Mikrotik
  * **Midtrans Snap SDK:** Untuk payment gateway sandbox/production
  * **Baileys (NodeJS):** WhatsApp web socket API lokal untuk gateway mandiri

---

## 🚀 Panduan Instalasi & Konfigurasi Lokal

### 1. Persyaratan Sistem
Pastikan perangkat Anda sudah terinstal:
* PHP >= 8.2 (aktifkan ekstensi `bcmath`, `curl`, `gmp`)
* Composer
* Node.js (versi 18+) & NPM
* MySQL / MariaDB Server

### 2. Langkah-Langkah Instalasi

1. **Clone Repository:**
   ```bash
   git clone https://github.com/yusufburhani20/billing.git
   cd billing
   ```

2. **Instal Dependensi Backend (PHP):**
   ```bash
   composer install
   ```

3. **Instal Dependensi Frontend (Node):**
   ```bash
   npm install
   ```

4. **Salin & Konfigurasi `.env`:**
   Salin file `.env.example` menjadi `.env` lalu buka file tersebut untuk disesuaikan:
   ```bash
   cp .env.example .env
   ```
   Lengkapi data penting di dalam `.env`:
   * **Database:** `DB_DATABASE=billing`, `DB_USERNAME`, `DB_PASSWORD`
   * **Gmail SMTP:** Masukkan email `MAIL_USERNAME` dan sandi *App Password* Gmail di `MAIL_PASSWORD`.
   * **Midtrans Keys:** Masukkan `MIDTRANS_SERVER_KEY` and `MIDTRANS_CLIENT_KEY` dari dashboard Sandbox/Production Midtrans Anda.

5. **Generate Application Key:**
   ```bash
   php artisan key:generate
   ```

6. **Migrasi Database & Seeding Data Awal:**
   ```bash
   php artisan migrate --seed
   ```
   *Perintah seed di atas akan secara otomatis membuat akun default:*
   * **Admin:** `admin@idrisiyyah.net` | Sandi: `password`
   * **Customer (Demo):** `customer@idrisiyyah.net` | Sandi: `password`

7. **Kompilasi Aset Frontend (Production Mode):**
   ```bash
   npm run build
   ```

8. **Jalankan Aplikasi:**
   ```bash
   php artisan serve
   ```
   Aplikasi Anda dapat diakses di `http://localhost:8000`.

---

## 💬 Menjalankan WhatsApp Gateway Lokal (Baileys)

WhatsApp Gateway berjalan secara independen di komputer Anda menggunakan server Node.js lokal pada port `3001`.

1. **Buka terminal baru, arahkan ke folder gateway:**
   ```bash
   cd whatsapp-gateway
   ```
2. **Jalankan Server Gateway:**
   ```bash
   node server.cjs
   ```
3. **Hubungkan WhatsApp:**
   * Masuk ke web aplikasi sebagai **Admin** (`http://localhost:8000/login`).
   * Klik menu **Pengaturan (Settings)**.
   * Ambil HP Anda, buka WhatsApp $\rightarrow$ ketuk **Perangkat Tertaut** $\rightarrow$ **Scan QR Code** yang muncul di halaman pengaturan tersebut.
   * Setelah terhubung, status berubah menjadi **CONNECTED**. Gateway Anda siap beraksi!

---

## 🔒 Lisensi

Aplikasi ini bersifat open-source di bawah lisensi [MIT License](LICENSE).
