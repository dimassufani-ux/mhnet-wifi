# MHNET WiFi Management System

Sistem manajemen pelanggan WiFi dengan fitur lengkap untuk mengelola pelanggan, paket internet, dan pembayaran.

## 🚀 Fitur

### High Priority (✅ Implemented)
- ✅ **Authentication System** - Login/logout dengan session management
- ✅ **Edit Functionality** - Edit customer, package, dan payment
- ✅ **Database Integration** - PostgreSQL dengan Drizzle ORM
- ✅ **Error Boundary** - Error handling di React

### Medium Priority (✅ Implemented)
- ✅ **Pagination** - Pagination untuk customer dan payment tables
- ✅ **Export Data** - Export ke CSV dan PDF
- ✅ **Better Error Handling** - Improved error messages
- ✅ **Loading States** - Loading indicators

### Low Priority (✅ Implemented)
- ✅ **Unit Tests Setup** - Vitest configuration
- ✅ **Analytics Dashboard** - Stats cards dengan data real-time
- ✅ **Notification System** - Alert untuk pembayaran terlambat

## 📦 Tech Stack

- **Frontend**: React 18, TypeScript, Vite, TailwindCSS, shadcn/ui
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL (Neon), Drizzle ORM
- **Auth**: Passport.js, bcrypt
- **State**: TanStack Query
- **Testing**: Vitest, Testing Library
- **Export**: jsPDF, CSV

## 🛠️ Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/mhnet_wifi
SESSION_SECRET=your-super-secret-key
PORT=5000
NODE_ENV=development
```

### 3. Database Setup

Push schema ke database:

```bash
npm run db:push
```

### 4. Create First User

Jalankan server dan register user pertama via API:

```bash
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123",
    "name": "Administrator",
    "role": "admin"
  }'
```

### 5. Run Development

```bash
npm run dev
```

Buka http://localhost:5000

## 🧪 Testing

Run tests:

```bash
npm test
```

Run tests with UI:

```bash
npm run test:ui
```

## 📝 API Endpoints

### Authentication
- `POST /api/register` - Register user baru
- `POST /api/login` - Login
- `POST /api/logout` - Logout
- `GET /api/me` - Get current user

### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/:id` - Get customer by ID
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Packages
- `GET /api/packages` - Get all packages
- `POST /api/packages` - Create package
- `PUT /api/packages/:id` - Update package
- `DELETE /api/packages/:id` - Delete package

### Payments
- `GET /api/payments` - Get all payments
- `POST /api/payments` - Create payment
- `PUT /api/payments/:id` - Update payment
- `DELETE /api/payments/:id` - Delete payment

## 🔒 Security Features

- Password hashing dengan bcrypt
- Session-based authentication
- Protected API routes
- CSRF protection ready
- Environment variables untuk secrets

## 📊 Storage Options

Aplikasi mendukung 3 storage options:

1. **PostgreSQL** (Recommended) - Set `DATABASE_URL`
2. **Google Sheets** - Set `SPREADSHEET_ID`
3. **Memory Storage** - Fallback (data hilang saat restart)

Priority: Database > Google Sheets > Memory

## 🚀 Production Deployment

1. Build aplikasi:

```bash
npm run build
```

2. Set environment variables di production
3. Run migration:

```bash
npm run db:push
```

4. Start server:

```bash
npm start
```

## 📄 License

MIT
