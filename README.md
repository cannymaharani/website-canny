# GeoArch Studio

Website statis (HTML + Tailwind CDN + Leaflet) — siap deploy ke GitHub Pages.

## Struktur
```
index.html
style.css
app.js
assets/images/   (logo, gambar katalog, QRIS placeholder)
```

## Yang WAJIB diganti
- `app.js` → `CONFIG.waNumber` (nomor WhatsApp, format 62xxxxxxxxxx)
- `index.html` → nomor rekening & nama pemilik (modal pembayaran)
- `assets/images/qris-placeholder.svg` → ganti dengan QRIS asli Anda (mis. `qris.png`, lalu ubah `src` di `index.html`)
- Harga & katalog → array `katalogData` di `app.js`

## Deploy ke GitHub Pages
1. Buat repository baru di GitHub, upload semua isi folder ini (index.html harus di root).
2. Settings → Pages → Source: *Deploy from a branch* → Branch: `main` / folder `/ (root)` → Save.
3. Tunggu 1-2 menit, situs aktif di `https://username.github.io/nama-repo/`.
