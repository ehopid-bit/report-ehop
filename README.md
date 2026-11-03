# Newsletter Yayasan EHOP

Website statis untuk Vercel: katalog bulanan, PDF flipbook, layar penuh, perbesar, berbagi halaman dan admin.

## 1. Supabase
Jalankan isi supabase/setup.sql di SQL Editor project report-ehop. Script membuat tabel dan RLS admin serta mendaftarkan PDF Oktober 2026 yang sudah ada. Tidak perlu upload ulang PDF.

## 2. Akun admin
Di Authentication > Users > Add user, buat akun email/password dan konfirmasi email. Salin UUID user kemudian jalankan di SQL Editor:

```sql
insert into public.newsletter_admins(user_id) values ('GANTI-DENGAN-UUID-USER') on conflict do nothing;
```

Jangan masukkan UUID/email sembarang. Hanya akun tersebut dapat mengelola edisi. Password dibuat di Supabase, jangan dibagikan dalam chat.

Di Storage > report-publik, pastikan bucket Public, MIME types mengizinkan application/pdf,image/jpeg,image/png,image/webp dan batas ukuran cukup untuk PDF Anda.

## 3. Vercel
Framework Preset: Other. Root Directory: akar repository. Build Command: kosong. Output Directory: kosong/akar project. Tidak perlu npm install atau build. vercel.json mengarahkan /admin dan /oktober-2026 ke aplikasi.

## 4. Penggunaan
Buka / untuk katalog, /oktober-2026 untuk edisi pertama, /admin untuk login dan unggah edisi. Sampul berasal dari halaman pertama PDF atau gambar yang diunggah admin. Edisi yang belum dipublikasikan hanya terlihat di admin. Menghapus edisi dari katalog tidak menghapus PDF.

## Catatan
config.js berisi publishable key yang boleh ada di browser; akses tulis dilindungi RLS. Jangan memakai service_role/secret key. Website memerlukan koneksi ke Supabase dan CDN PDF.js/PageFlip/Supabase/TUS serta Google Fonts. RLS harus diaktifkan melalui setup.sql sebelum admin berfungsi.
