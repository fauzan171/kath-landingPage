# 🔐 Cara Login ke Dashboard - Step by Step

## 📋 Informasi Akun

**Server URL:** http://localhost:3001  
**Email:** test@kath.com  
**Password:** password123

---

## 🚀 Langkah-Langkah

### 1. Buka Browser Console

Tekan **F12** atau **Cmd+Option+J** (Mac) untuk membuka console.

### 2. Clear LocalStorage (Jika Ada Masalah Sebelumnya)

Jalankan di console:
```javascript
localStorage.clear();
location.reload();
```

### 3. Tunggu Akun Test Dibuat

Setelah reload, cek console. Harusnya muncul:
```
✅ Akun testing berhasil dibuat!
📧 Email: test@kath.com
🔑 Password: password123
🌐 Server running at: http://localhost:3001
```

### 4. Pergi ke Halaman Login

Buka: http://localhost:3001/login

### 5. Masukkan Kredensial

- **Email:** test@kath.com
- **Password:** password123

### 6. Klik Tombol "Login"

### 7. Cek Console Log

Setelah klik login, Anda akan melihat log seperti ini:

```
🔐 Login attempt: {email: "test@kath.com"}
🔑 AuthContext.login called: {email: "test@kath.com"}
📋 Found users: 1
✅ User found, verifying password...
🔐 Password valid: true
✅ Setting user: test@kath.com
✅ Login successful!
🔍 Checking auth status: {isAuthenticated: true}
✅ User authenticated, redirecting to dashboard...
```

### 8. Redirect ke Dashboard

Browser akan redirect ke: **http://localhost:3001/dashboard**

---

## 🐛 Troubleshooting

### Masalah 1: "Email tidak terdaftar"

**Solusi:**
```javascript
// Cek apakah user ada di localStorage
const users = localStorage.getItem('kath_users');
console.log('Users:', JSON.parse(users));
```

Jika kosong, reload halaman untuk membuat akun test:
```javascript
location.reload();
```

### Masalah 2: "Password salah"

**Solusi:**
```javascript
// Cek password hash
const users = JSON.parse(localStorage.getItem('kath_users'));
const testUser = users.find(u => u.email === 'test@kath.com');
console.log('Stored password hash:', testUser.password);
console.log('Expected hash:', btoa('password123' + 'kath_salt_2026'));
```

Jika hash berbeda, reset dan reload:
```javascript
localStorage.clear();
location.reload();
```

### Masalah 3: Login Berhasil Tapi Tidak Redirect

**Cek:**
```javascript
// Cek apakah user tersimpan
const user = localStorage.getItem('kath_current_user');
console.log('Current user:', JSON.parse(user));

// Cek isAuthenticated
// (Akan null jika dicek dari console, karena di dalam React context)
```

**Solusi - Force Redirect:**
```javascript
window.location.href = '/dashboard';
```

### Masalah 4: Error di Console

Jika ada error, screenshot dan periksa:
- Network error? → Restart dev server
- CORS error? → Check Vite config
- React error? → Check console details

---

## ✅ Debug Mode Aktif

Saya sudah menambahkan console logging di:

1. **Login.tsx** - Login attempt & result
2. **AuthContext.tsx** - Authentication process
3. **testData.ts** - Account creation

Semua log akan muncul di browser console.

---

## 🎯 Quick Test

Copy-paste ini ke console untuk auto-login:

```javascript
// Auto-login test account
const testUser = {
  id: 'usr_test_001',
  fullName: 'Budi Santoso',
  email: 'test@kath.com',
  phone: '081234567890',
  birthDate: '1998-05-15',
  address: 'Jl. Sudirman No. 123, Jakarta Pusat',
  city: 'Jakarta',
  institution: 'Universitas Indonesia',
  institutionType: 'Universitas',
  major: 'Manajemen Perhotelan',
  nim: '1801234567',
  competitionCategory: 'Wedding Concept Competition',
  teamName: 'Dream Team',
  teamMembers: '3',
  registrationDate: new Date().toISOString(),
  status: 'active'
};

localStorage.setItem('kath_current_user', JSON.stringify(testUser));
console.log('✅ User set!');
console.log('🔄 Redirecting...');
setTimeout(() => {
  window.location.href = '/dashboard';
}, 1000);
```

---

## 📊 Expected Console Output

Setelah login berhasil, console akan menampilkan:

```
🔐 Login attempt: {email: "test@kath.com"}
🔑 AuthContext.login called: {email: "test@kath.com"}
📋 Found users: 1
✅ User found, verifying password...
🔐 Password valid: true
✅ Setting user: test@kath.com
✅ Login successful!
🔍 Checking auth status: {isAuthenticated: true}
✅ User authenticated, redirecting to dashboard...
```

---

## 🌐 Server Info

- **Development Server:** http://localhost:3001
- **Login Page:** http://localhost:3001/login
- **Dashboard:** http://localhost:3001/dashboard

---

**Last Updated:** March 17, 2026
