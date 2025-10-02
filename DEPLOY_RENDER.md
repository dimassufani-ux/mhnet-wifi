# 🚀 Deploy ke Render.com (GRATIS)

## Persiapan (5 menit)

### 1. Push ke GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/username/mhnet-wifi.git
git push -u origin main
```

### 2. Buat Account Render

- Buka https://render.com
- Sign up dengan GitHub
- Authorize Render

## Deploy (10 menit)

### Step 1: Create Web Service

1. Dashboard > "New +" > "Web Service"
2. Connect repository: Pilih repo `mhnet-wifi`
3. Configure:
   - **Name**: `mhnet-wifi`
   - **Region**: Singapore (terdekat)
   - **Branch**: `main`
   - **Root Directory**: (kosongkan)
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

### Step 2: Environment Variables

Klik "Advanced" > "Add Environment Variable":

1. **GOOGLE_CREDENTIALS**
   - Buka file `google-credentials.json`
   - Copy seluruh isi (format JSON)
   - Paste ke value

2. **SPREADSHEET_ID_PSB**
   - Value: `1IXUeXBUtO1eaPCBhbdrl9b3vqokrczsMu6u9HZlDvmA`

3. **SPREADSHEET_ID_PAYMENT**
   - Value: `10PdU6e52Gokhp7dHpJLYbLYaN3VkrERK-oVTuHuaZrY`

4. **SESSION_SECRET**
   - Value: `random-secret-key-ganti-dengan-string-acak`

5. **NODE_ENV**
   - Value: `production`

6. **PORT**
   - Value: `5000`

### Step 3: Deploy

1. Klik "Create Web Service"
2. Tunggu build selesai (5-10 menit)
3. Setelah selesai, klik URL yang diberikan
4. Login dengan:
   - Username: `admin`
   - Password: `admin123`

## ✅ Selesai!

Aplikasi Anda sekarang online di:
- URL: `https://mhnet-wifi.onrender.com`
- Auto-deploy setiap push ke GitHub
- Free SSL certificate
- 750 jam gratis/bulan

## 🔄 Auto-Deploy

Setiap kali Anda push ke GitHub:
```bash
git add .
git commit -m "Update feature"
git push
```

Render otomatis deploy ulang!

## ⚙️ Settings Penting

### Custom Domain (Optional)

1. Dashboard > Settings > Custom Domain
2. Add domain Anda
3. Update DNS records

### Health Check

Render otomatis restart jika app crash.

### Logs

Dashboard > Logs untuk lihat error/debug

## 🚨 Troubleshooting

**Build Failed**
- Cek logs di Render dashboard
- Pastikan `npm run build` jalan di lokal

**App Crash**
- Cek environment variables sudah benar
- Pastikan GOOGLE_CREDENTIALS valid JSON

**Google Sheets Error**
- Pastikan spreadsheet sudah di-share ke service account
- Cek SPREADSHEET_ID benar

## 💡 Tips

1. **Free tier limitations:**
   - App sleep setelah 15 menit tidak ada traffic
   - Cold start ~30 detik
   - 750 jam/bulan (cukup untuk 1 bulan penuh)

2. **Keep app awake:**
   - Gunakan cron job untuk ping setiap 10 menit
   - Atau upgrade ke paid plan ($7/bulan)

3. **Monitor usage:**
   - Dashboard > Usage untuk cek jam terpakai

## 🎉 Done!

Aplikasi Anda sekarang:
- ✅ Online 24/7
- ✅ Auto-deploy dari GitHub
- ✅ Free SSL
- ✅ Connected ke Google Sheets
- ✅ Gratis selamanya (dengan limitasi)
