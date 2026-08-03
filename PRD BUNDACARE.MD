# PRD - BundaCare

Version: 1.0.0

Status: Draft

Author: Product Team

Last Updated: 03 Agustus 2026

---

# 1. Product Overview

## Product Name

**BundaCare**

## Tagline

**Temani setiap langkah kehamilan dengan lebih teratur dan tenang.**

## Product Vision

Menjadi aplikasi pendamping kehamilan yang membantu ibu hamil mengelola seluruh perjalanan kehamilan dalam satu tempat, mulai dari pencatatan perkembangan janin, jadwal kontrol, pengingat obat, hingga edukasi berdasarkan usia kehamilan.

---

# 2. Problem Statement

Banyak ibu hamil masih mengalami kendala seperti:

* Lupa jadwal minum vitamin atau obat.
* Lupa jadwal kontrol ke dokter atau bidan.
* Riwayat pemeriksaan tersebar di berbagai media.
* Sulit memantau perkembangan kehamilan dari minggu ke minggu.
* Sulit mencari informasi kehamilan yang sesuai dengan usia kandungan.
* Buku KIA dapat rusak atau tertinggal.

---

# 3. Goals

## Business Goals

* Menjadi aplikasi pendamping kehamilan yang sederhana dan mudah digunakan.
* Memiliki pengalaman pengguna yang cepat dan intuitif.
* Menjadi dasar pengembangan fitur kesehatan ibu dan anak di masa mendatang.

## User Goals

Sebagai ibu hamil, pengguna ingin:

* Mengetahui usia kehamilan secara otomatis.
* Mengetahui perkembangan janin setiap minggu.
* Mendapat pengingat obat dan vitamin.
* Mendapat pengingat jadwal kontrol.
* Menyimpan seluruh hasil pemeriksaan kehamilan.
* Melihat riwayat kehamilan kapan saja.

---

# 4. Target User

## Primary User

Ibu hamil.

Karakteristik:

* Usia 18–45 tahun.
* Memiliki smartphone.
* Melakukan pemeriksaan ANC secara rutin.
* Ingin mencatat perkembangan kehamilan.
* Ingin mendapatkan pengingat jadwal dan obat.

Tidak ada peran pengguna lain pada MVP.

---

# 5. Scope MVP

## Dashboard

Menampilkan ringkasan kondisi kehamilan.

Informasi:

* Nama ibu.
* Usia kehamilan.
* Trimester.
* Estimasi Hari Lahir (HPL).
* Hari menuju persalinan.
* Progress kehamilan.
* Ukuran janin.
* Berat janin.
* Ringkasan jadwal hari ini.
* Obat yang harus diminum hari ini.
* Jadwal kontrol berikutnya.
* Edukasi minggu ini.

---

## Profil Kehamilan

Data yang disimpan:

* Nama lengkap.
* Tanggal lahir.
* Nomor telepon.
* Golongan darah.
* Tinggi badan.
* Berat badan awal.
* Berat badan saat ini.
* HPHT.
* HPL.
* Riwayat alergi.
* Riwayat penyakit.
* Kontak darurat.

---

## Tracking Kehamilan

Sistem menghitung otomatis:

* Usia kehamilan.
* Trimester.
* Minggu kehamilan.
* Hari kehamilan.
* Estimasi persalinan.
* Progress kehamilan.

---

## Reminder Obat

Fitur:

* Tambah obat.
* Edit obat.
* Hapus obat.
* Reminder otomatis.
* Checklist sudah diminum.
* Riwayat konsumsi.

Field:

* Nama obat.
* Dosis.
* Frekuensi.
* Jam.
* Tanggal mulai.
* Tanggal selesai.
* Catatan.

---

## Jadwal Kontrol

Pengguna dapat menambahkan jadwal pemeriksaan.

Data:

* Rumah sakit.
* Dokter.
* Bidan.
* Jenis pemeriksaan.
* Tanggal.
* Jam.
* Catatan.

Reminder:

* H-7.
* H-1.
* Hari H.

---

## Pemeriksaan ANC

Data:

* Berat badan.
* Tekanan darah.
* Tinggi fundus.
* DJJ.
* Keluhan.
* Diagnosis.
* Catatan dokter.
* Tindakan.

Upload:

* Foto hasil pemeriksaan.
* Foto USG.

---

## Riwayat USG

Data:

* Tanggal.
* Usia kehamilan.
* Berat janin.
* HC.
* AC.
* FL.
* BPD.
* Catatan dokter.

Lampiran:

* Foto USG.

---

## Catatan Harian

Pengguna dapat menulis:

* Mood.
* Keluhan.
* Aktivitas.
* Nafsu makan.
* Tidur.
* Catatan bebas.

---

## Kalender

Menampilkan:

* Jadwal kontrol.
* Jadwal obat.
* Jadwal vitamin.
* Jadwal pemeriksaan.
* Reminder lainnya.

---

## Edukasi Mingguan

Konten berubah otomatis sesuai usia kehamilan.

Berisi:

* Perkembangan janin.
* Nutrisi.
* Aktivitas.
* Tanda bahaya.
* Persiapan persalinan.
* Tips kesehatan.

---

# 6. Future Features

* AI Assistant.
* Kick Counter.
* Contraction Timer.
* Grafik berat badan.
* Grafik tekanan darah.
* Buku KIA Digital.
* Export PDF.
* Backup Cloud.
* Multi-device.
* Sinkronisasi keluarga.
* Mode offline.

---

# 7. User Flow

## Registrasi

Splash

↓

Daftar

↓

Verifikasi Email

↓

Lengkapi Profil

↓

Isi HPHT

↓

Dashboard

---

## Tambah Obat

Dashboard

↓

Obat

↓

Tambah

↓

Isi Data

↓

Simpan

↓

Reminder Aktif

---

## Tambah Pemeriksaan

Dashboard

↓

Pemeriksaan

↓

Tambah

↓

Isi Data

↓

Upload Foto

↓

Simpan

---

## Tambah Jadwal Kontrol

Dashboard

↓

Kalender

↓

Tambah Jadwal

↓

Simpan

---

# 8. Sitemap

Dashboard

Profil

Kalender

Obat

Pemeriksaan

Edukasi

Pengaturan

---

# 9. Database

## users

* id
* fullname
* email
* password
* phone
* birth_date
* blood_type
* height
* emergency_contact
* created_at
* updated_at

---

## pregnancies

* id
* user_id
* hpht
* due_date
* trimester
* current_week
* current_day
* weight_before
* current_weight
* allergy
* medical_history
* created_at

---

## medicines

* id
* pregnancy_id
* name
* dosage
* frequency
* reminder_time
* start_date
* end_date
* note

---

## medicine_logs

* id
* medicine_id
* taken_date
* taken_time
* status

---

## appointments

* id
* pregnancy_id
* hospital
* doctor
* appointment_date
* appointment_time
* note

---

## anc_records

* id
* pregnancy_id
* visit_date
* weight
* blood_pressure
* fundal_height
* fetal_heart_rate
* complaint
* diagnosis
* doctor_note

---

## usg_records

* id
* anc_record_id
* image_url
* fetal_weight
* hc
* ac
* fl
* bpd
* note

---

## diary

* id
* pregnancy_id
* mood
* complaint
* activity
* appetite
* sleep
* note
* image_url
* created_at

---

## educations

* id
* week
* title
* content

---

# 10. Functional Requirements

## Authentication

* Register.
* Login.
* Logout.
* Forgot Password.
* Reset Password.

---

## Dashboard

* Menampilkan ringkasan data.
* Progress kehamilan.
* Reminder hari ini.

---

## Reminder

* Reminder obat.
* Reminder kontrol.
* Reminder vitamin.

---

## Calendar

* CRUD jadwal.
* Filter.
* Reminder.

---

## ANC

* CRUD pemeriksaan.
* Upload foto.

---

## USG

* Upload foto.
* Riwayat.
* Detail.

---

## Edukasi

* Berdasarkan minggu kehamilan.
* Search.
* Bookmark (opsional).

---

# 11. Non Functional Requirements

* Responsive.
* Mobile First.
* Dark Mode.
* Light Mode.
* Loading <3 detik.
* SSL.
* Password terenkripsi.
* Backup database.
* Error logging.
* Optimasi SEO untuk halaman publik.
* Mendukung Progressive Web App (PWA) pada tahap selanjutnya.

---

# 12. Tech Stack

## Frontend

* Next.js 15
* React 19
* TypeScript
* Tailwind CSS
* shadcn/ui
* React Hook Form
* Zod
* TanStack Query

## Backend

* Next.js Route Handlers
* Prisma ORM

## Database

* PostgreSQL

## ORM

* Prisma

## Authentication

* Auth.js (NextAuth)

## Storage

* Prisma

## Notification

* Firebase Cloud Messaging

## Email

* Resend

## Validation

* Zod

## Deployment

Frontend dan Backend:

* Vercel

Database:

* PostgreSQL (Prisma Postgres)

Storage:

* Prisma Storage

Monitoring:

* Vercel Analytics
* Vercel Speed Insights

Error Tracking (opsional):

* Sentry

---

# 13. Success Metrics

* ≥80% pengguna berhasil menyelesaikan onboarding.
* ≥90% reminder obat terkirim sesuai jadwal.
* ≥70% pengguna mencatat minimal satu pemeriksaan ANC.
* ≥60% pengguna kembali menggunakan aplikasi setiap minggu.
* Rating pengguna ≥4,5/5.

---

# 14. Roadmap

## Version 1.0 (MVP)

* Autentikasi
* Dashboard
* Tracking usia kehamilan
* Jadwal obat
* Jadwal kontrol
* Pemeriksaan ANC
* Riwayat USG
* Kalender
* Edukasi mingguan

## Version 1.5

* Grafik berat badan
* Catatan harian
* Upload beberapa foto USG
* Export PDF

## Version 2.0

* AI Assistant
* api gemini (dapat dimasukkan via halaman Pengaturan / Asisten AI)


* Kick Counter
* Contraction Timer
* Buku KIA Digital
* Sinkronisasi cloud
* Integrasi dengan layanan kesehatan (jika tersedia)

---

# 15. Risks

* Pengguna memasukkan data HPHT yang tidak akurat sehingga perhitungan usia kehamilan menjadi keliru.
* Notifikasi dapat dipengaruhi oleh pengaturan perangkat pengguna.
* Data medis bersifat sensitif sehingga diperlukan perlindungan keamanan dan privasi yang memadai.
* Informasi edukasi tidak boleh dianggap sebagai pengganti konsultasi dengan tenaga kesehatan.

---

# 16. Disclaimer

BundaCare merupakan aplikasi pendamping kehamilan dan bukan alat diagnosis medis. Seluruh informasi yang ditampilkan bertujuan untuk edukasi dan pencatatan pribadi. Pengguna tetap disarankan berkonsultasi dengan dokter atau bidan untuk mendapatkan diagnosis, pengobatan, dan keputusan medis yang sesuai.
