#!/bin/bash
# ==========================================
# Idrisiyyah Net Auto Deployment Script for aaPanel
# ==========================================
# CATATAN: Script ini TIDAK menjalankan npm build di server.
# Aset frontend (public/build/) sudah di-compile secara lokal
# dan di-commit ke GitHub bersama kode sumber.
# ==========================================

LOG_PREFIX="[$(date '+%H:%M:%S')]"
APP_DIR="$(cd "$(dirname "$0")" && pwd)"

# Fungsi untuk menangani error
die() {
    echo "$LOG_PREFIX ❌ ERROR: $1"
    echo "[PROCESS_FAILED]"
    exit 1
}

echo "$LOG_PREFIX 🚀 Memulai proses deployment Idrisiyyah Net..."

# 1. Pindah ke direktori utama
cd "$APP_DIR" || die "Gagal masuk ke direktori $APP_DIR"

# 2. Menarik kode terbaru dari GitHub
echo "$LOG_PREFIX 📥 Menarik kode terbaru dari GitHub..."

# Buang perubahan lokal agar git pull tidak konflik
git checkout -- . 2>/dev/null || true

# Pull biasa (repo publik atau SSH yang sudah terkonfigurasi)
git pull origin main 2>&1

if [ $? -ne 0 ]; then
    die "git pull GAGAL!"
fi

echo "$LOG_PREFIX ✅ git pull berhasil."

# Fix kepemilikan file agar user www bisa membaca/menulis (cegah EACCES)
chown -R www:www "$APP_DIR" 2>/dev/null || true

# 3. Menginstall dependensi PHP (Composer)
echo "$LOG_PREFIX 📦 Memperbarui paket PHP (composer install)..."
/www/server/php/83/bin/php /usr/bin/composer install --no-dev --optimize-autoloader --no-interaction 2>&1 || die "Gagal memperbarui dependensi PHP (Composer)"

# 4. Menjalankan Migrasi Database
echo "$LOG_PREFIX 🗄️ Menjalankan migrasi database..."
/www/server/php/83/bin/php artisan migrate --force 2>&1 || die "Gagal menjalankan migrasi database"

# 5. Membersihkan Cache Laravel
# (Tidak perlu npm build - aset sudah ada di public/build/ dari repo)
echo "$LOG_PREFIX 🧹 Membersihkan cache sistem..."
/www/server/php/83/bin/php artisan optimize:clear 2>&1
/www/server/php/83/bin/php artisan optimize 2>&1

echo "$LOG_PREFIX ✅ DEPLOYMENT SELESAI SUKSES!"
echo "[PROCESS_COMPLETED]"
