# Vercel Deploy Rehberi

## 1. GitHub'a Yükleme

### Terminal'de:
```bash
cd /mnt/okcomputer/output/fitness-coach-app

# Git repo başlat
git init

# Tüm dosyaları ekle
git add .

# Commit yap
git commit -m "Initial FitCoach deployment"

# GitHub repo oluştur ve bağla
git remote add origin https://github.com/YOUR_USERNAME/fitness-coach-app.git

# Push et
git branch -M main
git push -u origin main
```

## 2. Vercel'de Deploy

### Yöntem 1: Vercel Dashboard (Önerilen)
1. [Vercel.com](https://vercel.com)'a git
2. "New Project" tıkla
3. GitHub repo'sunu seç
4. Aşağıdaki ayarları yap:

**Build & Development Settings:**
- Framework: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

**Environment Variables:**
```
NEXT_PUBLIC_SUPABASE_URL = https://ylzsjrajmdjxovctwtxc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = sb_publishable_BmXQACm2uaiQweqHUvO33Q_AVW7WhwE
```

5. "Deploy" butonuna bas

### Yöntem 2: Vercel CLI
```bash
# Vercel CLI yükle
npm i -g vercel

# Login ol
vercel login

# Deploy et
vercel --prod

# Environment variables ekle
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
```

## 3. Deploy Sonrası

- URL: `https://fitness-coach-app-XXXX.vercel.app`
- Dashboard: `/dashboard`
- Login: `/login`
- Register: `/register`

## 4. Median.co APK

1. [Median.co](https://median.co)'ya git
2. URL olarak Vercel deploy URL'nı gir
3. App bilgilerini doldur:
   - App Name: FitCoach
   - App URL: https://fitness-coach-app-XXXX.vercel.app
4. Generate APK

## 5. Test Hesapları

**Öğrenci:**
- Email: student@demo.com
- Şifre: demo123

**Koç:**
- Email: coach@demo.com  
- Şifre: demo123

## Troubleshooting

### Build Error Alırsanız:
1. `npm run build` komutunu local'de çalıştır
2. Hataları kontrol et
3. Gerekirse `node_modules` sil ve `npm install` yap

### Environment Variables Hatası:
1. Vercel dashboard'dan Environment Variables kontrol et
2. Key'lerin doğru olduğundan emin ol

### Database Connection Hatası:
1. Supabase'de RLS policies'leri kontrol et
2. Network'te engelleme olmadığından emin ol

## Başarılar! 🚀