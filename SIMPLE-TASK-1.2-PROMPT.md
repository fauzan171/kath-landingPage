# SIMPLE CONTINUATION PROMPT - TASK 1.2

Kirim ini ke Cloudcode:

---

```
Lanjut Task 1.2: Fix RLS Policies

Mode: Agent + DevTools ON
Skills: @backend-engineer @supabase-integration-expert

Kerjakan ini:

1. BACA dulu semua file SQL:
   - supabase-schema.sql
   - supabase-complete-setup.sql
   - supabase-add-missing-columns.sql

2. ANALYZE RLS policies yang ada:
   - Cari yang terlalu permissive (contoh: "Anyone can update")
   - List semua masalah yang ditemukan

3. FIX RLS policies untuk tables:
   - teams (hanya owner & admin yang bisa edit)
   - submissions (hanya tim sendiri & judge yang di-assign)
   - users (hanya profile sendiri)
   - tables lainnya yang perlu

4. ATURAN PENTING:
   - Quality over speed - teliti jangan terburu-buru
   - Kalau ada decision/architectural choice, TANYA dulu sebelum implement
   - Format tanya: CONTEXT → OPTION A/B → RECOMMENDATION
   - Document setiap policy dengan comment
   - Test setiap policy setelah implement

5. OUTPUT setelah selesai:
   - List files yang dibuat/diubah
   - List policies yang di-fix
   - Migration script (jika ada)
   - Next task

MULAI dari baca semua SQL files dulu. Laporan temuan sebelum implement.
```

---

## 📌 EXPECTED BEHAVIOR AI:

**Yang HARUS dilakukan:**
- ✅ Baca SQL files dulu sebelum coding
- ✅ Laporan temuan (policies yang bermasalah)
- ✅ Tanya jika ada decision point (pilihan architectural)
- ✅ Test setiap policy setelah implement
- ✅ Dokumentasi dengan comments

**Yang TIDAK boleh:**
- ❌ Langsung coding tanpa analisis
- ❌ Putuskan architectural choices tanpa approval
- ❌ Skip testing
- ❌ Terburu-buru

---

## 🎯 SUCCESS CRITERIA:

Task 1.2 DONE kalau:
- [ ] User tidak bisa akses data tim lain
- [ ] Admin bisa akses semua data
- [ ] Judge bisa akses submission yang di-assign
- [ ] Policies documented
- [ ] Build masih pass
- [ ] No breaking changes

---

**Copy prompt di atas, paste ke Cloudcode, DONE!** 🚀
