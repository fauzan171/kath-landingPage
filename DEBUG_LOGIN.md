# 🔧 Debug Login Issue - Dashboard tidak redirect

## Masalah
User sudah login tapi tidak redirect ke dashboard.

## Solusi Step-by-Step

### Step 1: Clear LocalStorage (Reset Data)

Buka browser console (F12) dan jalankan:

```javascript
localStorage.clear();
console.log('✅ LocalStorage cleared!');
location.reload();
```

### Step 2: Refresh Halaman

Setelah clear localStorage, halaman akan reload otomatis.

Tunggu sampai muncul log di console:
```
✅ Akun testing berhasil dibuat!
📧 Email: test@kath.com
🔑 Password: password123
🌐 Server running at: http://localhost:3001
```

### Step 3: Login Manual

1. Pergi ke: `http://localhost:3001/login`
2. Masukkan:
   - Email: `test@kath.com`
   - Password: `password123`
3. Klik **Login**

### Step 4: Cek Console

Setelah klik login, cek console untuk melihat apa yang terjadi:

**Harusnya muncul:**
```
✅ Login berhasil!
```

**Kemudian redirect ke:** `http://localhost:3001/dashboard`

---

## Jika Masih Tidak Bisa

### Option A: Cek AuthContext Status

Jalankan di console:

```javascript
// Cek apakah user tersimpan
const user = localStorage.getItem('kath_current_user');
console.log('Current user:', JSON.parse(user));

// Cek semua users
const users = localStorage.getItem('kath_users');
console.log('All users:', JSON.parse(users));
```

**Harusnya ada output seperti:**
```javascript
Current user: {
  email: "test@kath.com",
  fullName: "Budi Santoso",
  status: "active"
}
```

### Option B: Manual Login via Console

Jika masih ada masalah, coba manual login via console:

```javascript
// Set user manually
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
console.log('✅ Manual login set!');
console.log('🔄 Redirecting to dashboard...');
window.location.href = '/dashboard';
```

### Option C: Cek Error di Login

Jika ada error saat login, cek:

```javascript
// Di Login.tsx, tambahkan console.log
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  console.log('📧 Login attempt:', {
    email: formData.email,
    password: formData.password
  });
  
  const result = await login(formData.email, formData.password);
  
  console.log('🔐 Login result:', result);
  
  if (result.success) {
    console.log('✅ Login success, navigating to dashboard...');
    navigate('/dashboard');
  } else {
    console.log('❌ Login failed:', result.message);
  }
};
```

---

## Kemungkinan Masalah & Solusi

### Problem 1: Password Hash Mismatch

**Gejala:** "Password salah"

**Sebab:** AuthContext menggunakan `verifyPassword` dari `security.ts`, tapi testData menggunakan `btoa`.

**Solusi:** Reset localStorage dan reload:

```javascript
localStorage.clear();
location.reload();
```

### Problem 2: isAuthenticated Tidak Update

**Gejala:** Login berhasil tapi tetap di halaman login

**Sebab:** useEffect di Login.tsx tidak trigger

**Solusi:** Tambahkan debug di Login.tsx:

```typescript
useEffect(() => {
  console.log('🔍 Auth status changed:', {
    isAuthenticated,
    willNavigate: !!isAuthenticated
  });
  
  if (isAuthenticated) {
    console.log('🚀 Navigating to dashboard...');
    navigate('/dashboard');
  }
}, [isAuthenticated, navigate]);
```

### Problem 3: Navigation Block

**Gejala:** Navigate dipanggil tapi tidak redirect

**Sebab:** Mungkin ada error di App.tsx atau routing

**Solusi:** Cek console untuk error routing

---

## Quick Fix - Force Login

Jika semua gagal, tambahkan ini di `src/pages/Login.tsx`:

```typescript
// Tambahkan di bagian atas component
const forceLogin = () => {
  const testUser = {
    id: 'usr_test_001',
    fullName: 'Budi Santoso',
    email: 'test@kath.com',
    status: 'active'
  };
  
  localStorage.setItem('kath_current_user', JSON.stringify(testUser));
  window.location.href = '/dashboard';
};

// Tambahkan button untuk testing
<button onClick={forceLogin} className="mt-4 text-xs text-gray-400">
  Debug: Force Login
</button>
```

---

## Testing Checklist

- [ ] LocalStorage cleared
- [ ] Halaman reloaded
- [ ] Akun test dibuat (cek console log)
- [ ] Login dengan email: test@kath.com
- [ ] Login dengan password: password123
- [ ] Klik Login button
- [ ] Console shows "Login berhasil"
- [ ] Redirect ke /dashboard
- [ ] Dashboard loads successfully

---

## Expected Flow

```
1. User di /login
2. Input email & password
3. Klik Login
4. AuthContext.login() dipanggil
5. Password diverifikasi
6. User disimpan di localStorage
7. isAuthenticated = true
8. useEffect trigger
9. navigate('/dashboard')
10. User di /dashboard ✅
```

---

**Server URL:** http://localhost:3001  
**Test Account:** test@kath.com / password123
