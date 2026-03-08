# KATH Event Organizer - Backend API Documentation

## Overview

Dokumentasi ini menjelaskan endpoint-endpoint yang dibutuhkan untuk CMS/Dashboard backend KATH Event Organizer. Backend ini akan mengelola konten untuk landing page, termasuk Portfolio, News, Competition, dan Featured Events.

---

## Table of Contents

1. [Portfolio API](#1-portfolio-api)
2. [News API](#2-news-api)
3. [Competition API](#3-competition-api)
4. [Featured Events API](#4-featured-events-api)
5. [Authentication](#5-authentication)
6. [File Upload](#6-file-upload)
7. [Data Types](#7-data-types)
8. [Database Schema](#8-database-schema)

---

## 1. Portfolio API

Mengelola portfolio/event yang telah dikerjakan oleh KATH Event Organizer.

### Endpoints

#### GET /api/portfolio

Mendapatkan semua data portfolio.

**Query Parameters:**

| Parameter | Type   | Required | Description                           |
|-----------|--------|----------|---------------------------------------|
| category  | string | No       | Filter by category (Wedding, Corporate, Exhibition, Private) |
| year      | string | No       | Filter by year                        |
| page      | number | No       | Page number (default: 1)              |
| limit     | number | No       | Items per page (default: 10)          |

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "image": "/uploads/portfolio/wedding-event.webp",
      "title": "Garden Romance Wedding",
      "category": "Wedding",
      "location": "Jakarta",
      "year": "2025",
      "createdAt": "2025-01-15T10:00:00Z",
      "updatedAt": "2025-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

---

#### GET /api/portfolio/:id

Mendapatkan detail portfolio berdasarkan ID.

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "1",
    "image": "/uploads/portfolio/wedding-event.webp",
    "title": "Garden Romance Wedding",
    "category": "Wedding",
    "location": "Jakarta",
    "year": "2025",
    "description": "A magical celebration of love with elegant floral arrangements...",
    "createdAt": "2025-01-15T10:00:00Z",
    "updatedAt": "2025-01-15T10:00:00Z"
  }
}
```

---

#### POST /api/portfolio

Membuat portfolio baru. **(Requires Authentication)**

**Request Body:**

```json
{
  "image": "/uploads/portfolio/new-event.webp",
  "title": "Elegant Beach Wedding",
  "category": "Wedding",
  "location": "Bali",
  "year": "2025",
  "description": "Optional description text"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Portfolio created successfully",
  "data": {
    "id": "7",
    "image": "/uploads/portfolio/new-event.webp",
    "title": "Elegant Beach Wedding",
    "category": "Wedding",
    "location": "Bali",
    "year": "2025",
    "description": "Optional description text",
    "createdAt": "2025-03-08T10:00:00Z",
    "updatedAt": "2025-03-08T10:00:00Z"
  }
}
```

---

#### PUT /api/portfolio/:id

Update portfolio berdasarkan ID. **(Requires Authentication)**

**Request Body:**

```json
{
  "title": "Elegant Beach Wedding - Updated",
  "location": "Nusa Dua, Bali"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Portfolio updated successfully",
  "data": {
    "id": "7",
    "image": "/uploads/portfolio/new-event.webp",
    "title": "Elegant Beach Wedding - Updated",
    "category": "Wedding",
    "location": "Nusa Dua, Bali",
    "year": "2025",
    "updatedAt": "2025-03-08T12:00:00Z"
  }
}
```

---

#### DELETE /api/portfolio/:id

Hapus portfolio berdasarkan ID. **(Requires Authentication)**

**Response:**

```json
{
  "success": true,
  "message": "Portfolio deleted successfully"
}
```

---

#### GET /api/portfolio/categories

Mendapatkan daftar kategori portfolio.

**Response:**

```json
{
  "success": true,
  "data": ["All", "Wedding", "Corporate", "Exhibition", "Private"]
}
```

---

## 2. News API

Mengelola berita dan pengumuman dari KATH Event Organizer.

### Endpoints

#### GET /api/news

Mendapatkan semua artikel berita.

**Query Parameters:**

| Parameter | Type   | Required | Description                           |
|-----------|--------|----------|---------------------------------------|
| category  | string | No       | Filter by category (Competition, Announcement, News) |
| search    | string | No       | Search by title or content            |
| page      | number | No       | Page number (default: 1)              |
| limit     | number | No       | Items per page (default: 10)          |
| sort      | string | No       | Sort by date (asc, desc) - default: desc |

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "title": "Wedding Planner Competition 2026 Registration Now Open",
      "excerpt": "Join our prestigious Wedding Planner Competition...",
      "content": "Full article content here...",
      "image": "/uploads/news/competition-2026.webp",
      "category": "Competition",
      "date": "2025-03-01",
      "author": "KATH Team",
      "slug": "wedding-planner-competition-2026-open",
      "createdAt": "2025-03-01T08:00:00Z",
      "updatedAt": "2025-03-01T08:00:00Z"
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  }
}
```

---

#### GET /api/news/:slug

Mendapatkan detail artikel berdasarkan slug.

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "1",
    "title": "Wedding Planner Competition 2026 Registration Now Open",
    "excerpt": "Join our prestigious Wedding Planner Competition...",
    "content": "<p>Full HTML content here...</p>",
    "image": "/uploads/news/competition-2026.webp",
    "category": "Competition",
    "date": "2025-03-01",
    "author": "KATH Team",
    "slug": "wedding-planner-competition-2026-open",
    "views": 1250,
    "createdAt": "2025-03-01T08:00:00Z",
    "updatedAt": "2025-03-01T08:00:00Z"
  }
}
```

---

#### POST /api/news

Membuat artikel baru. **(Requires Authentication)**

**Request Body:**

```json
{
  "title": "New Competition Category Announced",
  "excerpt": "We are excited to announce a new category...",
  "content": "<p>Full article content in HTML format...</p>",
  "image": "/uploads/news/new-category.webp",
  "category": "Announcement",
  "author": "KATH Team",
  "slug": "new-competition-category-announced"
}
```

**Response:**

```json
{
  "success": true,
  "message": "News article created successfully",
  "data": {
    "id": "7",
    "title": "New Competition Category Announced",
    "slug": "new-competition-category-announced",
    "createdAt": "2025-03-08T10:00:00Z"
  }
}
```

---

#### PUT /api/news/:id

Update artikel berdasarkan ID. **(Requires Authentication)**

**Request Body:**

```json
{
  "title": "Updated Title",
  "content": "<p>Updated content...</p>"
}
```

---

#### DELETE /api/news/:id

Hapus artikel berdasarkan ID. **(Requires Authentication)**

**Response:**

```json
{
  "success": true,
  "message": "News article deleted successfully"
}
```

---

#### GET /api/news/categories

Mendapatkan daftar kategori berita.

**Response:**

```json
{
  "success": true,
  "data": ["All", "Competition", "Announcement", "News"]
}
```

---

## 3. Competition API

Mengelola kompetisi dan kategori kompetisi.

### Endpoints

#### GET /api/competitions

Mendapatkan semua kompetisi.

**Query Parameters:**

| Parameter | Type   | Required | Description                           |
|-----------|--------|----------|---------------------------------------|
| status    | string | No       | Filter by status (Open, Coming Soon, Closed) |
| page      | number | No       | Page number (default: 1)              |
| limit     | number | No       | Items per page (default: 10)          |

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "Wedding Concept Competition",
      "target": "Wedding Planners",
      "prize": "Rp 200M",
      "status": "Open",
      "deadline": "2025-12-31",
      "description": "Design the wedding of the year...",
      "image": "/uploads/competitions/wedding-concept.webp",
      "requirements": [
        "Must be 18 years or older",
        "Submit portfolio of previous work"
      ],
      "registeredCount": 150,
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-03-08T00:00:00Z"
    }
  ],
  "pagination": {
    "total": 4,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

---

#### GET /api/competitions/main

Mendapatkan informasi kompetisi utama (highlighted competition).

**Response:**

```json
{
  "success": true,
  "data": {
    "name": "Wedding Planner Competition 2026",
    "deadline": "2025-12-31",
    "description": "Design the wedding of the year and win exclusive prizes worth over Rp 500,000,000",
    "categories": [
      {
        "id": "1",
        "name": "Wedding Concept Competition",
        "target": "Wedding Planners",
        "prize": "Rp 200M",
        "status": "Open"
      },
      {
        "id": "2",
        "name": "Event Design Challenge",
        "target": "Designers",
        "prize": "Rp 150M",
        "status": "Open"
      }
    ]
  }
}
```

---

#### GET /api/competitions/:id

Mendapatkan detail kompetisi berdasarkan ID.

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "1",
    "name": "Wedding Concept Competition",
    "target": "Wedding Planners",
    "prize": "Rp 200M",
    "status": "Open",
    "deadline": "2025-12-31",
    "description": "Design the wedding of the year...",
    "image": "/uploads/competitions/wedding-concept.webp",
    "requirements": [
      "Must be 18 years or older",
      "Submit portfolio of previous work",
      "Individual or team participation"
    ],
    "timeline": [
      {
        "phase": "Registration",
        "startDate": "2025-03-01",
        "endDate": "2025-06-30"
      },
      {
        "phase": "Submission",
        "startDate": "2025-07-01",
        "endDate": "2025-10-31"
      },
      {
        "phase": "Judging",
        "startDate": "2025-11-01",
        "endDate": "2025-12-15"
      }
    ],
    "registeredCount": 150,
    "maxParticipants": 500,
    "judges": [
      {
        "name": "Sarah Wong",
        "role": "Lead Judge",
        "image": "/uploads/judges/sarah.webp"
      }
    ],
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-03-08T00:00:00Z"
  }
}
```

---

#### POST /api/competitions

Membuat kompetisi baru. **(Requires Authentication)**

**Request Body:**

```json
{
  "name": "New Competition Name",
  "target": "Target Participants",
  "prize": "Rp 100M",
  "status": "Open",
  "deadline": "2025-12-31",
  "description": "Competition description...",
  "image": "/uploads/competitions/new-comp.webp",
  "requirements": [
    "Requirement 1",
    "Requirement 2"
  ]
}
```

---

#### PUT /api/competitions/:id

Update kompetisi berdasarkan ID. **(Requires Authentication)**

---

#### DELETE /api/competitions/:id

Hapus kompetisi berdasarkan ID. **(Requires Authentication)**

---

#### POST /api/competitions/:id/register

Registrasi peserta ke kompetisi.

**Request Body:**

```json
{
  "participantName": "John Doe",
  "email": "john@example.com",
  "phone": "+62 812 3456 7890",
  "teamName": "Creative Team A",
  "teamMembers": [
    {
      "name": "Jane Doe",
      "email": "jane@example.com"
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "registrationId": "REG-2025-001",
    "competitionId": "1",
    "participantName": "John Doe",
    "status": "confirmed",
    "registeredAt": "2025-03-08T10:00:00Z"
  }
}
```

---

## 4. Featured Events API

Mengelola event yang ditampilkan di CardStack section (Featured Events).

### Endpoints

#### GET /api/featured-events

Mendapatkan semua featured events.

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "image": "/uploads/featured/card-1.webp",
      "title": "Eternal Love Wedding",
      "description": "A magical celebration of love with elegant floral arrangements...",
      "rotation": -2,
      "category": "Wedding",
      "order": 1,
      "isActive": true,
      "createdAt": "2025-01-15T00:00:00Z",
      "updatedAt": "2025-01-15T00:00:00Z"
    }
  ]
}
```

---

#### POST /api/featured-events

Membuat featured event baru. **(Requires Authentication)**

**Request Body:**

```json
{
  "image": "/uploads/featured/new-event.webp",
  "title": "New Featured Event",
  "description": "Event description...",
  "rotation": 0,
  "category": "Corporate",
  "order": 4,
  "isActive": true
}
```

---

#### PUT /api/featured-events/:id

Update featured event. **(Requires Authentication)**

---

#### DELETE /api/featured-events/:id

Hapus featured event. **(Requires Authentication)**

---

#### PUT /api/featured-events/reorder

Update urutan featured events. **(Requires Authentication)**

**Request Body:**

```json
{
  "orders": [
    { "id": 1, "order": 2 },
    { "id": 2, "order": 1 },
    { "id": 3, "order": 3 }
  ]
}
```

---

## 5. Authentication

### Endpoints

#### POST /api/auth/login

Login admin untuk mendapatkan access token.

**Request Body:**

```json
{
  "email": "admin@kathevent.com",
  "password": "securepassword123"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "1",
      "email": "admin@kathevent.com",
      "name": "Admin",
      "role": "admin"
    }
  }
}
```

---

#### POST /api/auth/refresh

Refresh access token.

**Request Body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

#### POST /api/auth/logout

Logout admin.

---

### Authentication Header

Untuk endpoint yang memerlukan authentication, tambahkan header:

```
Authorization: Bearer <accessToken>
```

---

## 6. File Upload

### POST /api/upload

Upload file (gambar). **(Requires Authentication)**

**Request:** `multipart/form-data`

| Field  | Type | Required | Description                    |
|--------|------|----------|--------------------------------|
| file   | File | Yes      | File to upload (image only)    |
| folder | string | No     | Destination folder (portfolio, news, competitions) |

**Response:**

```json
{
  "success": true,
  "data": {
    "url": "/uploads/portfolio/image-123.webp",
    "filename": "image-123.webp",
    "mimetype": "image/webp",
    "size": 245678
  }
}
```

### Allowed File Types

- `image/jpeg`
- `image/png`
- `image/webp`
- `image/gif`

### Max File Size

- 5MB per file

---

## 7. Data Types

### Portfolio

```typescript
interface Portfolio {
  id: string;
  image: string;
  title: string;
  category: 'Wedding' | 'Corporate' | 'Exhibition' | 'Private';
  location: string;
  year: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}
```

### News

```typescript
interface News {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: 'Competition' | 'Announcement' | 'News';
  date: string;
  author: string;
  slug: string;
  views?: number;
  createdAt: string;
  updatedAt: string;
}
```

### Competition

```typescript
interface Competition {
  id: string;
  name: string;
  target: string;
  prize: string;
  status: 'Open' | 'Coming Soon' | 'Closed';
  deadline: string;
  description: string;
  image?: string;
  requirements?: string[];
  timeline?: Timeline[];
  registeredCount?: number;
  maxParticipants?: number;
  createdAt: string;
  updatedAt: string;
}
```

### Featured Event

```typescript
interface FeaturedEvent {
  id: number;
  image: string;
  title: string;
  description: string;
  rotation: number;
  category: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

---

## 8. Database Schema

### PostgreSQL / MySQL Schema

```sql
-- Portfolio Table
CREATE TABLE portfolio (
  id SERIAL PRIMARY KEY,
  image VARCHAR(500) NOT NULL,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  location VARCHAR(100) NOT NULL,
  year VARCHAR(4) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- News Table
CREATE TABLE news (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  image VARCHAR(500) NOT NULL,
  category VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  author VARCHAR(100) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Competitions Table
CREATE TABLE competitions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  target VARCHAR(100) NOT NULL,
  prize VARCHAR(100) NOT NULL,
  status VARCHAR(20) DEFAULT 'Open',
  deadline DATE NOT NULL,
  description TEXT NOT NULL,
  image VARCHAR(500),
  requirements JSONB,
  timeline JSONB,
  max_participants INTEGER DEFAULT 500,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Competition Registrations Table
CREATE TABLE competition_registrations (
  id SERIAL PRIMARY KEY,
  competition_id INTEGER REFERENCES competitions(id),
  registration_code VARCHAR(50) UNIQUE NOT NULL,
  participant_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  team_name VARCHAR(255),
  team_members JSONB,
  status VARCHAR(20) DEFAULT 'confirmed',
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Featured Events Table
CREATE TABLE featured_events (
  id SERIAL PRIMARY KEY,
  image VARCHAR(500) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  rotation DECIMAL(4,2) DEFAULT 0,
  category VARCHAR(50) NOT NULL,
  "order" INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin Users Table
CREATE TABLE admin_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Error Responses

Semua endpoint mengembalikan error dengan format konsisten:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "title",
        "message": "Title is required"
      }
    ]
  }
}
```

### Error Codes

| Code                   | HTTP Status | Description                    |
|------------------------|-------------|--------------------------------|
| UNAUTHORIZED           | 401         | Missing or invalid token       |
| FORBIDDEN              | 403         | Insufficient permissions       |
| NOT_FOUND              | 404         | Resource not found             |
| VALIDATION_ERROR       | 400         | Request validation failed      |
| DUPLICATE_ENTRY        | 409         | Resource already exists        |
| FILE_TOO_LARGE         | 413         | Uploaded file exceeds limit    |
| INVALID_FILE_TYPE      | 415         | File type not allowed          |
| INTERNAL_ERROR         | 500         | Server error                   |

---

## Rate Limiting

- **Public endpoints:** 100 requests per minute
- **Authenticated endpoints:** 300 requests per minute

---

## CORS Configuration

```
Access-Control-Allow-Origin: https://kathevent.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

---

## Environment Variables

```env
# Server
PORT=3001
NODE_ENV=production

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=kath_cms
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880

# CORS
CORS_ORIGIN=https://kathevent.com
```

---

## Notes

1. Semua endpoint mengembalikan response dalam format JSON
2. Timestamp menggunakan format ISO 8601 (e.g., `2025-03-08T10:00:00Z`)
3. Pagination menggunakan `page` dan `limit` parameters
4. Semua data creation/update memerlukan authentication kecuali GET endpoints
5. File upload mendukung format gambar dengan max size 5MB

---

## 9. Frontend Integration Guide (Untuk Client)

### Overview
Bagian ini menjelaskan bagaimana konten ditampilkan di website dan bagaimana Anda dapat mengelolanya melalui Dashboard Backend.

### Konten yang Ditampilkan di Website

| Section Website | Endpoint Backend | Update Frequency |
|-----------------|------------------|------------------|
| **Portfolio** | `GET /api/portfolio` | Tambah/ubah events yang telah dikerjakan |
| **News/Blog** | `GET /api/news` | Posting artikel baru, update berita |
| **Competition** | `GET /api/competitions` | Buat kompetisi baru, update prize |
| **Featured Events** | `GET /api/featured-events` | Update gambar kartu depan (CardStack) |
| **Hero Section** | `GET /api/config` (static) | Perlu developer update |
| **Services** | `GET /api/config` (static) | Perlu developer update |
| **FAQ** | `GET /api/config` (static) | Perlu developer update |

### Dashboard Operations

#### 1. Manajemen Portfolio
```
Menu: Portfolio > All Items

Apa yang bisa dilakukan:
- Tambah event baru (upload gambar, tulis judul, kategori, lokasi, tahun)
- Edit informasi event yang sudah ada
- Hapus event yang sudah tidak актуal
- Filter berdasarkan kategori (Wedding, Corporate, Exhibition, Private)
```

#### 2. Manajemen News
```
Menu: News > All Articles

Apa yang bisa dilakukan:
- Buat artikel berita baru
- Upload gambar thumbnail
- Pilih kategori (Competition, Announcement, News)
- Set tanggal publikasi
- Hapus artikel lama
```

#### 3. Manajemen Competition
```
Menu: Competitions > All Competitions

Apa yang bisa dilakukan:
- Buat kompetisi baru (nama, hadiah, deadline)
- Set target participant (Wedding Planners, Designers, Photographers, Students)
- Update status (Open, Coming Soon, Closed)
- Lihat jumlah pendaftar real-time
- Edit instruksi pendaftaran
```

#### 4. Manajemen Featured Events (CardStack)
```
Menu: Featured Events > All Events

Apa yang bisa dilakukan:
- Upload gambar untuk kartu featured
- Edit deskripsi event
- Ubah urutan tampilan (drag & drop)
- Set rotasi tampilan (angle tilt effect)
- Aktifkan/nonaktifkan event tertentu
```

#### 5. User Management
```
Menu: Settings > Admin Users

Apa yang bisa dilakukan:
- Tambah admin baru
- Manage password
- Set role (Admin, Editor)
- Logout dari semua perangkat
```

### Flow Data dari Backend ke Website

```
1. Admin login ke Dashboard
   └─> Login API: POST /api/auth/login

2. Upload gambar baru
   └─> Upload API: POST /api/upload

3. Buat Portofolio Baru
   └─> Create API: POST /api/portfolio

4. Website otomatis update
   └─> Frontend fetch: GET /api/portfolio (cached)
   └─> User lihat di /portfolio
```

### Timeline Pengembangan

| Phase | Deskripsi | Estimasi | Status |
|-------|-----------|----------|--------|
| Phase 1 | Setup Backend API | 3-5 hari |Ready|
| Phase 2 | Dashboard UI | 5-7 hari |In Progress|
| Phase 3 | Data Migration | 1-2 hari |Pending|
| Phase 4 | Testing & Training | 2-3 hari |Pending|
| Phase 5 | Go Live | 1 hari |Pending|

### Training Materials

Saat delivery, Anda akan mendapatkan:

1. **Username & Password** untuk akses Dashboard
2. **Video Tutorial** cara:
   - Menambah portfolio baru
   - Membuat artikel berita
   - Mengatur kompetisi
   - Mengupdate featured events
3. **Quick Reference Guide** ( PDF ) dengan screenshot
4. **Support Channel** (Slack/WhatsApp) untuk pertanyaan teknis

### Importan Notes untuk Client

1. **Update Image Location**: Setelah upload gambar, copy URL yang dihasilkan untuk digunakan di konten lain.

2. **Image Requirements**:
   - Format: JPG, PNG, WebP
   - Max size: 5MB per file
   - Recommended resolution: 1920x1080 untuk hero, 800x600 untuk portfolio

3. **SEO Friendly**: Setiap artikel/news punya field "slug" yang bisa dikustomisasi untuk URL yang lebih baik.

4. **Real-time Updates**: Setelah submit changes di Dashboard, website akan update setelah cache refresh (max 1 menit).

5. **Backup Data**: Semua data tersimpan di database PostgreSQL, backup otomatis setiap hari.

---

## 10. FAQ Untuk Client

### Pertanyaan Umum

**Q: Apakah saya perlu coding untuk update konten?**
A: Tidak. Dashboard sudah menyediakan form yang mudah digunakan. Anda hanya perlu mengisi data dan upload gambar.

**Q: Berapa biaya maintenance setiap bulan?**
A: Setelah project selesai, Anda bisa memilih paket maintenance bulanan untuk:
- Update content
- Technical support
- Backup verification
- Performance monitoring

**Q: Siapa yang mengupload konten pertama kali?**
A: Tim developer akan migrate data awal dari config file. Setelah itu, Anda bisa update sendiri.

**Q: Bagaimana jika website error?**
A: Ada monitoring system yang akan notify kami jika ada issue. Untuk emergency, hubungi support channel.

**Q: Bisa akses dari HP?**
A: Dashboard bersifat responsive, bisa diakses dari HP tapi untuk upload gambar lebih mudah dari laptop.

**Q: Apakah ada limit jumlah konten?**
A: Tidak ada limit. Anda bisa menambahkan sebanyak yang Anda perlukan.

**Q: Bisa Integrasi dengan media sosial?**
A: Ya, untuk versi selanjutnya bisa ditambahkan fitur share otomatis ke Instagram/Facebook.

---

**Version:** 1.0.0
**Last Updated:** March 8, 2025
**Author:** KATH Event Organizer Development Team