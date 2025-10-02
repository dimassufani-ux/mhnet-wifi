# MHNET - WiFi/ISP Customer Management System

## Overview
MHNET adalah aplikasi manajemen pelanggan WiFi/ISP yang terintegrasi dengan Google Sheets sebagai database real-time. Aplikasi ini dirancang untuk dapat diakses dari perangkat Android melalui web browser atau sebagai Progressive Web App (PWA).

## Technology Stack
- **Frontend**: React + TypeScript + Wouter (routing)
- **Backend**: Express.js + Node.js
- **Database**: Google Sheets API (real-time sync)
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod validation

## Project Structure
```
├── client/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components (Dashboard, Customers, Packages, Payments, Settings)
│   │   ├── lib/            # Utility functions and query client
│   │   └── App.tsx         # Main app with routing
├── server/
│   ├── google-sheets.ts    # Google Sheets API client
│   ├── sheets-storage.ts   # Storage layer for Google Sheets
│   ├── routes.ts           # API routes
│   ├── storage.ts          # Storage interface
│   └── index.ts            # Express server
├── shared/
│   └── schema.ts           # Shared TypeScript types and Zod schemas
```

## Features

### 1. Dashboard
- Overview statistik: total pelanggan, pelanggan aktif, total pendapatan bulan ini
- Charts untuk visualisasi data pendapatan
- Quick actions untuk menambah pelanggan/paket/pembayaran

### 2. Customer Management (Pelanggan)
- CRUD operations: Create, Read, Update, Delete pelanggan
- Filter dan search pelanggan
- Data pelanggan: nama, alamat, nomor HP, email, paket, status, tanggal instalasi
- Status: Aktif/Nonaktif

### 3. Package Management (Paket)
- CRUD operations untuk paket WiFi
- Data paket: nama, kecepatan (Mbps), harga bulanan, deskripsi
- Package pricing dan features

### 4. Payment Management (Pembayaran)
- Record pembayaran pelanggan
- Track metode pembayaran (Cash, Transfer, E-Wallet)
- Tanggal pembayaran, periode pembayaran, catatan
- History pembayaran per pelanggan

### 5. Settings (Pengaturan)
- Setup Google Sheets integration
- Create new spreadsheet untuk menyimpan data
- Connect ke existing spreadsheet dengan Spreadsheet ID
- Dark/Light theme toggle

## Google Sheets Integration

### How It Works
Aplikasi menggunakan Google Sheets sebagai database backend dengan struktur 3 sheets:

1. **Pelanggan** (Customers)
   - Columns: ID | Nama | Alamat | No HP | Email | Paket | Status | Tanggal Instalasi

2. **Paket** (Packages)
   - Columns: ID | Nama Paket | Kecepatan (Mbps) | Harga Bulanan | Deskripsi

3. **Pembayaran** (Payments)
   - Columns: ID | ID Pelanggan | Nama Pelanggan | Jumlah | Tanggal Pembayaran | Metode | Catatan

### Setup Instructions

#### Option 1: Create New Spreadsheet
1. Go to Settings page
2. Click "Buat Spreadsheet Baru"
3. System akan otomatis create spreadsheet dengan struktur yang benar
4. Spreadsheet ID akan disimpan dan aplikasi langsung terhubung

#### Option 2: Connect to Existing Spreadsheet
1. Create spreadsheet manual di Google Sheets
2. Create 3 sheets dengan nama: "Pelanggan", "Paket", "Pembayaran"
3. Add headers sesuai struktur di atas
4. Copy Spreadsheet ID dari URL (bagian setelah /d/ dan sebelum /edit)
5. Go to Settings page → Enter Spreadsheet ID → Click "Simpan"

### CRUD Operations
- **Create**: Data baru akan di-append ke sheet
- **Read**: Fetch semua data dari range A2:X (skip header)
- **Update**: Update specific row by ID
- **Delete**: Delete row by ID dengan batchUpdate deleteDimension (rows akan auto-shift)

### Data Synchronization
- All operations langsung sync ke Google Sheets
- Real-time updates - changes immediately visible di spreadsheet
- Multiple users dapat akses data yang sama secara concurrent

## API Endpoints

### Customers
- `GET /api/customers` - Get all customers
- `POST /api/customers` - Create customer
- `PATCH /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Packages
- `GET /api/packages` - Get all packages
- `POST /api/packages` - Create package
- `PATCH /api/packages/:id` - Update package
- `DELETE /api/packages/:id` - Delete package

### Payments
- `GET /api/payments` - Get all payments
- `POST /api/payments` - Create payment
- `PATCH /api/payments/:id` - Update payment
- `DELETE /api/payments/:id` - Delete payment

### Sheets Setup
- `POST /api/init-spreadsheet` - Create new spreadsheet with proper structure

## Development

### Running Locally
```bash
npm run dev
```
Application akan berjalan di `http://localhost:5000`

### Environment Variables
- `SPREADSHEET_ID` - Google Sheets Spreadsheet ID (optional, bisa diset via Settings page)
- `SESSION_SECRET` - Express session secret
- `REPLIT_CONNECTORS_HOSTNAME` - Replit connectors hostname (auto-set by Replit)

### Google Sheets Connection
Aplikasi menggunakan Replit's Google Sheet connector untuk authentication. OAuth flow handled secara otomatis oleh Replit platform.

## Deployment

### Publishing on Replit
1. Ensure Google Sheet connector is properly configured
2. Click "Publish" button di Replit
3. Application akan di-deploy dengan custom .replit.app domain
4. Dapat diakses dari Android browser atau install sebagai PWA

### PWA Features
- Install to home screen
- Offline-capable (dengan service worker)
- Native app-like experience
- Fast loading dan responsive

## User Guide (Bahasa Indonesia)

### Cara Menggunakan Aplikasi

#### 1. Setup Awal
- Buka Settings → Pilih "Buat Spreadsheet Baru" atau masukkan Spreadsheet ID existing
- Pastikan koneksi Google Sheet berhasil

#### 2. Menambah Paket WiFi
- Go to Paket page → Click "Tambah Paket"
- Isi nama paket, kecepatan, harga, dan deskripsi
- Click "Tambah Paket" untuk save

#### 3. Menambah Pelanggan
- Go to Pelanggan page → Click "Tambah Pelanggan"
- Isi data pelanggan (nama, alamat, kontak, paket)
- Pilih status: Aktif atau Nonaktif
- Click "Tambah Pelanggan" untuk save

#### 4. Record Pembayaran
- Go to Pembayaran page → Click "Tambah Pembayaran"
- Pilih pelanggan dari dropdown
- Isi jumlah pembayaran, tanggal, dan metode
- Tambahkan catatan jika perlu
- Click "Tambah Pembayaran" untuk save

#### 5. Update Data
- Click tombol Edit pada row yang ingin diubah
- Update fields yang diperlukan
- Click "Update" untuk save changes

#### 6. Delete Data
- Click tombol Delete pada row yang ingin dihapus
- Confirm deletion
- Data akan langsung terhapus dari Google Sheets

### Tips
- Gunakan search/filter untuk menemukan pelanggan dengan cepat
- Check Dashboard untuk overview bisnis
- Backup spreadsheet secara berkala (Google Sheets auto-save)
- Gunakan dark mode untuk hemat baterai di Android

## Known Issues & Limitations
- Google Sheets API has quota limits (baca: 60 requests/minute per user)
- Large datasets (>1000 rows) may have slower performance
- Internet connection required (tidak fully offline)

## Future Enhancements
- Notification system untuk payment reminders
- SMS integration untuk invoice
- Export data ke PDF
- Multi-user roles dan permissions
- Analytics dan reporting yang lebih advanced

## Support
Untuk pertanyaan atau issue, silakan contact developer atau create issue di repository.

## Recent Changes
- **2024-10-02**: Initial implementation dengan Google Sheets integration
- Complete CRUD operations untuk customers, packages, payments
- Fixed date handling issues dengan proper Date object normalization
- Implemented proper row deletion dengan batchUpdate deleteDimension
- Setup page untuk easy spreadsheet configuration
