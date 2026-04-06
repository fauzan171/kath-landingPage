# KUESIONER KONTEN E2E - TIM OPERASIONAL KOMPETISI
## KATH Event Organizer x CIBC Competition Platform

> **Tujuan:** Mengumpulkan informasi konten dari Tim Operasional agar website bisa disesuaikan secara end-to-end (E2E).
> **Catatan:** Kompetisi ini adalah edisi pertama.

---

## BAGIAN 0: FLOW SYSTEM YANG SUDAH KAMI BUAT

Sebelum menjawab pertanyaan, ini adalah flow system yang sudah kami bangun di website. Mohon dibaca dan beri masukan apakah flow ini sudah sesuai atau perlu diubah.

### Flow Peserta (Participant Flow)
```
1. Peserta membuka landing page kompetisi
   → Melihat info kompetisi: deskripsi, kategori, hadiah, FAQ, panduan

2. Peserta klik "Daftar Sekarang"
   → Isi form registrasi (nama, email, password, no. WhatsApp)
   → Verifikasi email (klik link di email)
   → Menunggu approval admin
   → WA konfirmasi: "Akun kamu sudah aktif"

3. Peserta login dan masuk Dashboard
   → Melihat kompetisi aktif
   → Melihat status tahapan saat ini
   → Melihat notifikasi via WA

4. Peserta membuat/bbergabung dengan Tim
   → Ketua membuat tim → dapat kode tim
   → Anggota join via kode tim
   → Menunggu tim lengkap (min X orang)

5. Peserta mengumpulkan BMC (Submission)
   → Upload file BMC + dokumen pendamping
   → Submit sebelum deadline
   → WA konfirmasi: "Submission berhasil diterima"

6. Menunggu penilaian juri
   → Juri memberi skor & feedback
   → (Opsional) Peserta diminta revisi
   → WA notifikasi: "Ada feedback dari juri"

7. Pengumuman hasil
   → Peserta melihat hasil di website
   → WA notifikasi: "Pengumuman hasil sudah bisa dilihat"
```

### Flow Juri (Judge Flow)
```
1. Juri mendapat akun dari admin
   → Login dengan email + password sementara
   → Wajib ganti password saat pertama kali login

2. Juri melihat dashboard
   → Daftar submission yang harus dinilai
   → Deadline penilaian

3. Juri memberi penilaian
   → Melihat submission (BMC + dokumen)
   → Memberi skor per kriteria rubric
   → Memberi feedback wajib
   → Scoring bersifat anonim (blind grading)
```

### Flow Admin
```
1. Admin mengelola peserta
   → Approve/reject registrasi baru
   → Kelola user dan role

2. Admin mengelola kompetisi
   → Buat/edit tahapan kompetisi
   → Set rubric penilaian per tahap
   → Assign juri ke submission

3. Admin mengelola submission
   → Lihat semua submission
   → Monitor progres penilaian juri
   → Publikasikan hasil/leaderboard

4. Admin mengelola konten website
   → Pengumuman (announcements)
   → Berita (news)
```

### Notifikasi WhatsApp (Konfirmasi via WA)
```
- Konfirmasi akun berhasil didaftarkan
- Konfirmasi akun sudah aktif (setelah approval)
- Pengingat langkah selanjutnya (submit BMC, lengkapi tim, dll)
- Konfirmasi submission diterima
- Notifikasi feedback dari juri
- Pengumuman hasil
```

---

### PERTANYAAN KE TIM OPERASIONAL:

**Q0.** Apakah flow system di atas sudah sesuai dengan keinginan tim operasional?
Jika ada yang perlu ditambah/diubah/hilangkan, tolong sebutkan:

- Yang perlu ditambah: ?
- Yang perlu diubah: ?
- Yang perlu dihilangkan: ?

---

## BAGIAN 1: INFO UMUM KOMPETISI

- [ ] **1.1** Apa nama resmi kompetisi ini?
- [ ] **1.2** Apa tagline atau tema kompetisi?
- [ ] **1.3** Tuliskan deskripsi singkat kompetisi (1-2 paragraf, akan ditampilkan di Hero website)
- [ ] **1.4** Tuliskan deskripsi lengkap kompetisi (3-5 paragraf, akan ditampilkan di halaman About)
- [ ] **1.5** Apa tujuan/misi utama kompetisi ini?
- [ ] **1.6** Siapa penyelenggara utama? (nama organisasi)
- [ ] **1.7** Siapa co-organizer / partner (jika ada)?

---

## BAGIAN 2: KATEGORI & HADIAH

### 2.1 Kategori
Untuk setiap kategori yang dibuka, isi tabel berikut:

| Kategori | Deskripsi Singkat | Siapa yang boleh ikut | Hadiah Juara 1 | Hadiah Juara 2 | Hadiah Juara 3 |
|----------|-------------------|----------------------|----------------|----------------|----------------|
| ? | ? | ? | ? | ? | ? |
| ? | ? | ? | ? | ? | ? |
| ? | ? | ? | ? | ? | ? |

- [ ] **2.2** Apakah ada penghargaan khusus selain juara 1-2-3? (Best Presentation, Most Innovative, People's Choice, dll)
- [ ] **2.3** Apakah hadiah selain uang tunai? (trophy, sertifikat, mentoring, inkubasi, dll)

### 2.4 Biaya Pendaftaran
- [ ] Apakah pendaftaran gratis atau berbayar?
- [ ] Jika berbayar, berapa biayanya per tim?
- [ ] Metode pembayaran apa yang diterima?
- [ ] Apakah perlu upload bukti pembayaran di website?

---

## BAGIAN 3: SYARAT & KETENTUAN PESERTA

- [ ] **3.1** Siapa yang boleh mendaftar? (mahasiswa S1, S2, umum, startup, pelaku UMKM, dll)
- [ ] **3.2** Batasan usia? (jika ada)
- [ ] **3.3** Wajib tim atau boleh perorangan?
- [ ] **3.4** Berapa minimum dan maksimum anggota per tim?
- [ ] **3.5** Apakah boleh anggota dari universitas/instansi berbeda dalam satu tim?
- [ ] **3.6** Apakah boleh ikut lebih dari satu kategori?
- [ ] **3.7** Apakah boleh ikut lebih dari satu tim?
- [ ] **3.8** Apakah panitia/penyelenggara boleh ikut berkompetisi?
- [ ] **3.9** Dalam kondisi apa peserta bisa didiskualifikasi?
- [ ] **3.10** Apakah ada kebijakan plagiarisme? Jelaskan

---

## BAGIAN 4: PANDUAN BMC & FORMAT SUBMISSION

### 4.1 Format BMC
- [ ] **4.1** Apakah menggunakan format BMC standar 9 blok (Osterwalder)?
- [ ] **4.2** Apakah ada template BMC resmi yang harus dipakai peserta? Jika ya, kirim filenya
- [ ] **4.3** Peserta mengisi BMC dalam bentuk apa?
  - [ ] Upload file (PDF/Gambar)
  - [ ] Isi form online (9 blok di website)
  - [ ] Keduanya

### 4.2 Dokumen Pendamping (selain BMC)
| Dokumen | Wajib/Opsional | Format | Batas Ukuran | Keterangan |
|---------|---------------|--------|-------------|------------|
| Business Proposal | ? | ? | ? | ? |
| Pitch Deck | ? | ? | ? | ? |
| Video Pitch | ? | ? | ? | Durasi: ? |
| Financial Projection | ? | ? | ? | ? |
| Lainnya: ? | ? | ? | ? | ? |

### 4.3 Ketentuan Submission
- [ ] **4.4** Berapa kali boleh submit ulang sebelum deadline?
- [ ] **4.5** Apakah bisa edit submission setelah submit?
- [ ] **4.6** Format file yang diterima? (PDF, DOCX, PPT, MP4, dll)
- [ ] **4.7** Berapa batas ukuran file total per submission?

---

## BAGIAN 5: KRITERIA PENILAIAN (RUBRIC)

### 5.1 Bobot Penilaian
Isi tabel berikut dengan bobot dan deskripsi penilaian:

| Kriteria Penilaian | Bobot (%) | Apa yang Dinilai |
|-------------------|-----------|-----------------|
| Customer Segments | ?% | ? |
| Value Proposition | ?% | ? |
| Channels | ?% | ? |
| Customer Relationships | ?% | ? |
| Revenue Streams | ?% | ? |
| Key Resources | ?% | ? |
| Key Activities | ?% | ? |
| Key Partners | ?% | ? |
| Cost Structure | ?% | ? |
| Innovation / Originality | ?% | ? |
| Impact & Scalability | ?% | ? |
| Kriteria lainnya? | ?% | ? |

**Total harus 100%**

### 5.2 Level Penilaian per Kriteria
Untuk setiap kriteria, bagaimana membedakan Excellent / Good / Fair / Poor?

| Level | Umpan deskripsi (contoh) |
|-------|------------------------|
| Excellent (90-100) | ? |
| Good (70-89) | ? |
| Fair (50-69) | ? |
| Poor (0-49) | ? |

### 5.3 Penilaian Lainnya
- [ ] **5.3** Apakah ada penilaian Presentasi/Pitch terpisah dari BMC? Jika ya, kriterianya?
- [ ] **5.4** Apakah ada penilaian Q&A terpisah? Jika ya, kriterianya?
- [ ] **5.5** Berapa jumlah juri per submission?
- [ ] **5.6** Bagaimana skor akhir dihitung? (rata-rata semua juri, drop highest/lowest, dll)
- [ ] **5.7** Apakah feedback juri wajib diberikan?
- [ ] **5.8** Apakah peserta boleh melihat feedback dari juri?
- [ ] **5.9** Apakah ada mekanisme keberatan (appeal) atas penilaian?

---

## BAGIAN 6: FLOW TIM

- [ ] **6.1** Bagaimana mekanisme pembentukan tim yang diinginkan?
  - [ ] Ketua daftar, lalu invite anggota via email
  - [ ] Ketua daftar, lalu share kode tim ke anggota
  - [ ] Admin yang assign anggota ke tim
  - [ ] Lainnya: ?
- [ ] **6.2** Apakah ketua tim punya hak khusus? (hapus anggota, submit final, dll)
- [ ] **6.3** Bagaimana jika anggota keluar sebelum deadline?
- [ ] **6.4** Apakah bisa tambah/ganti anggota setelah submit?
- [ ] **6.5** Apakah ada batas jumlah tim per universitas/instansi?

---

## BAGIAN 7: TERMS & CONDITIONS

- [ ] **7.1** Apakah sudah ada naskah Terms & Conditions resmi? Jika sudah, kirim filenya
- [ ] **7.2** Apakah ada klausul Intellectual Property (kepemilikan ide/BMC yang disubmit)?
- [ ] **7.3** Apakah ada klausul kerahasiaan (NDA)?
- [ ] **7.4** Apakah peserta WAJIB centang "Saya menyetujui T&C" sebelum mendaftar?
- [ ] **7.5** Apakah ada privacy policy yang harus ditampilkan di website?

---

## BAGIAN 8: JURI

### 8.1 Profil Juri
| Nama | Jabatan | Instansi | Bidang Keahlian | Foto (Y/T) | Bio Singkat |
|------|---------|----------|-----------------|------------|-------------|
| ? | ? | ? | ? | ? | ? |

- [ ] **8.2** Apakah profil juri boleh dipublikasikan di website sebelum kompetisi dimulai?
- [ ] **8.3** Apakah ada Ketua Juri (Head Judge)?
- [ ] **8.4** Apakah juri yang sama menilai semua kategori atau berbeda per kategori?
- [ ] **8.5** Juri menilai via platform digital (dashboard juri di website) atau manual (paper)?

---

## BAGIAN 9: NOTIFIKASI WHATSAPP

> Semua konfirmasi dan notifikasi ke peserta akan dikirim via WhatsApp.

### 9.1 Infrastruktur WA
- [ ] **9.1** Apakah sudah ada WhatsApp Business API atau layanan WA blast? (Fonnte, Wablas, Twilio, dll)
- [ ] **9.2** Jika belum, notifikasi WA akan dilakukan manual oleh tim operasional atau butuh integrasi otomatis dari website?

### 9.2 Kapan WA Harus Dikirim?
Tandai event yang perlu dikirimkan notifikasi WA:

| Event | Perlu WA? |
|-------|-----------|
| Konfirmasi akun berhasil didaftarkan | [ ] Ya / [ ] Tidak |
| Akun sudah aktif (setelah approval admin) | [ ] Ya / [ ] Tidak |
| Pengingat lengkapi profil/tim | [ ] Ya / [ ] Tidak |
| Pengingat submit sebelum deadline (H-7, H-3, H-1) | [ ] Ya / [ ] Tidak |
| Konfirmasi submission berhasil diterima | [ ] Ya / [ ] Tidak |
| Notifikasi ada feedback revisi dari juri | [ ] Ya / [ ] Tidak |
| Pengumuman finalis / hasil | [ ] Ya / [ ] Tidak |
| Info teknis (link zoom, lokasi offline) | [ ] Ya / [ ] Tidak |
| Lainnya: ? | [ ] Ya / [ ] Tidak |

### 9.3 Template Pesan WA
- [ ] **9.3** Apakah sudah ada template pesan WA untuk notifikasi di atas?
- [ ] **9.4** Apakah pesan WA akan menyertakan link ke website? (contoh: "Cek detail di [link]")
- [ ] **9.5** Apakah ada pesan broadcast ke semua peserta sekaligus? (blast WA)

---

## BAGIAN 10: PENGUMUMAN & HASIL

- [ ] **10.1** Bagaimana mekanisme pengumuman yang diinginkan?
  - [ ] Leaderboard publik di website (bisa dilihat semua orang)
  - [ ] Halaman hasil khusus peserta (harus login)
  - [ ] Hanya via WA blast
  - [ ] Offline event
  - [ ] Lainnya: ?
- [ ] **10.2** Apakah ada sertifikat digital untuk peserta?
  - [ ] Untuk semua peserta
  - [ ] Hanya untuk finalis/pemenang
  - [ ] Tidak ada sertifikat
- [ ] **10.3** Apakah ada program lanjutan setelah kompetisi? (inkubasi, mentoring, pendanaan)

---

## BAGIAN 11: FAQ

Berikut pertanyaan yang sudah kami siapkan di website. Tolong diisi jawabannya:

| No | Pertanyaan | Jawaban |
|----|-----------|---------|
| 1 | Siapa yang bisa mendaftar? | ? |
| 2 | Apakah ada biaya pendaftaran? | ? |
| 3 | Berapa anggota maksimal dalam satu tim? | ? |
| 4 | Apakah boleh mendaftar perorangan? | ? |
| 5 | Format BMC apa yang harus disubmit? | ? |
| 6 | Berapa kali boleh submit ulang? | ? |
| 7 | Format file apa yang diterima? | ? |
| 8 | Berapa ukuran file maksimal? | ? |
| 9 | Apakah ada mentoring? | ? |
| 10 | Bagaimana proses penilaian? | ? |
| 11 | Apakah ada feedback dari juri? | ? |
| 12 | Bisa ganti kategori setelah mendaftar? | ? |
| 13 | Kebijakan plagiarisme? | ? |
| 14 | Boleh dari universitas berbeda dalam satu tim? | ? |
| 15 | Pertanyaan lain yang perlu ditambahkan? | ? |

---

## CATATAN TAMBAHAN

Informasi lain yang menurut tim operasional penting untuk website:

1. ?
2. ?
3. ?

---

**Disiapkan oleh:** Tim IT / Developer
**Ditujukan untuk:** Tim Operasional Kompetisi
**Deadline pengisian:** [Tanggal]
