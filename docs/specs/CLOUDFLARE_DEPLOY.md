# KATH Event Organizer - Cloudflare Deployment Guide

## 🚀 Deployment ke Cloudflare Pages

### Opsi 1: Deploy via Cloudflare Dashboard (Mudah)

1. **Login ke Cloudflare Dashboard**
   - Buka https://dash.cloudflare.com
   - Pilih akun Anda

2. **Buat Pages Project Baru**
   - Klik "Pages" di sidebar
   - Klik "Create a project"
   - Pilih "Upload assets" (untuk upload manual) atau connect Git repo

3. **Upload Manual**
   - Build project: `npm run build`
   - Upload folder `dist/`
   - Atau drag & drop folder dist ke dashboard

4. **Configure Build Settings** (jika pakai Git integration):
   ```
   Build command: npm run build
   Build output directory: dist
   Root directory: /
   ```

### Opsi 2: Deploy via Wrangler CLI (Recommended)

1. **Install Wrangler CLI**:
   ```bash
   npm install -g wrangler
   ```

2. **Login ke Cloudflare**:
   ```bash
   wrangler login
   ```

3. **Build dan Deploy**:
   ```bash
   npm run build
   wrangler pages deploy dist --project-name=kath-event-organizer
   ```

### Opsi 3: Deploy via Git Integration (Auto Deploy)

1. **Push ke GitHub/GitLab**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Connect di Cloudflare Dashboard**:
   - Pages → Create a project → Connect to Git
   - Pilih repository
   - Configure build:
     - Build command: `npm run build`
     - Build output: `dist`
   - Klik "Save and Deploy"

## ⚙️ Konfigurasi File

### `_headers` (Security Headers)
File ini di `public/_headers` akan otomatis di-copy ke `dist/` saat build.
Menambahkan security headers untuk proteksi XSS, CSP, dan caching.

### `_redirects` (SPA Routing)
File ini di `public/_redirects` menangani client-side routing untuk React SPA.
Semua path akan diarahkan ke `index.html`.

### `wrangler.toml`
Konfigurasi untuk Wrangler CLI deployment.

## 🔧 Environment Variables

Jika perlu environment variables, tambahkan di:
1. Cloudflare Dashboard → Pages → Project → Settings → Environment variables
2. Atau via Wrangler: `wrangler pages secret put VAR_NAME`

## 📋 Pre-deployment Checklist

- [ ] Logo KATH sudah di `public/KATH-Logo.png` (atau SVG)
- [ ] Semua gambar sudah di-optimize
- [ ] Build berhasil tanpa error: `npm run build`
- [ ] Test locally: `npm run preview`
- [ ] Content Security Policy di `_headers` sudah sesuai

## 🔍 Troubleshooting

### Issue: Assets tidak load (404)
**Solusi**: Pastikan `vite.config.ts` menggunakan `base: '/'` (bukan `'./'`)

### Issue: Routing tidak berfungsi (404 saat refresh)
**Solusi**: File `_redirects` sudah dikonfigurasi dengan benar. Pastikan ada di `dist/`.

### Issue: Security headers tidak teraplikasi
**Solusi**: File `_headers` harus berada di root `dist/` folder.

### Issue: Build failed
**Solusi**: Pastikan Node.js version sesuai (lihat `.nvmrc` - v20)

## 📚 Resources

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)
- [Custom Headers](https://developers.cloudflare.com/pages/configuration/headers/)
- [Redirects](https://developers.cloudflare.com/pages/configuration/redirects/)

## 🌐 Custom Domain (Opsional)

1. Dashboard → Pages → Project → Custom domains
2. Klik "Set up a custom domain"
3. Masukkan domain Anda (contoh: `kathevent.com`)
4. Ikuti instruksi DNS setup
5. Tunggu SSL certificate otomatis

## 📊 Analytics & Performance

Cloudflare Pages otomatis memberikan:
- Real-time analytics
- Performance metrics
- Security analytics
- Access logs

Lihat di Dashboard → Pages → Project → Analytics

## 🔒 Security Features (Aktif Otomatis)

- DDoS protection
- SSL/TLS encryption (auto)
- Security headers (dari `_headers`)
- Bot management
- Rate limiting (bisa ditambahkan)
