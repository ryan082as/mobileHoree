# DOKUMEN PERENCANAAN ARSITEKTUR SISTEM
# "KulinerCheck UMKM — Aplikasi Penilaian Bisnis Kuliner UMKM"

> **Mata Kuliah:** Praktikum Pemrograman Mobile  
> **Laboratorium:** Laboratorium Informatika, Universitas Muhammadiyah Malang  
> **Versi Dokumen:** 1.0 (Roadmap Modul 1 s.d. Modul 6 & UAP)  
> **Target Platform:** Android, iOS, & Web (Expo Framework + Expo Router)

---

## 1. IKHTISAR SISTEM & LATAR BELAKANG

### 1.1. Deskripsi Proyek
**KulinerCheck UMKM** adalah aplikasi mobile cerdas yang dirancang untuk mengevaluasi kelayakan bisnis, standar higiene pangan, dan kesiapan permodalan (seperti Kredit Usaha Rakyat / KUR) bagi pelaku UMKM di sektor makanan dan minuman (F&B).

Aplikasi ini menggabungkan dua sudut pandang evaluasi secara seimbang:
1. **Evaluasi Formal (Top-Down oleh Asesor Dinas/Perbankan):** Menilai kepatuhan legalitas (Halal, P-IRT/BPOM), manajemen keuangan & HPP, kebersihan dapur, dan kapasitas operasional.
2. **Evaluasi Publik (Bottom-Up oleh Konsumen):** Memberikan rating bintang (1–5), ulasan rasa/layanan, serta dialog percakapan terarah dua arah dengan pemilik gerai kuliner.

### 1.2. Peran Pengguna (Multi-Role Architecture)
Aplikasi mendukung 3 peran pengguna:
* **Konsumen Publik / User Biasa:**
  * Menjelajahi katalog gerai kuliner dan melihat rapor skor kelayakan.
  * Memberikan rating bintang (1–5) dan ulasan teks di menu ulasan khusus.
  * Berdialog dua arah secara bergantian (*strict turn-based*) dengan pemilik gerai kuliner.
  * Memiliki hak mengubah (**Edit**) dan menghapus (**Delete**) ulasan miliknya.
  * Melakukan simulasi cepat estimasi kelayakan bisnis.
* **Pemilik Gerai Kuliner (Pelaku UMKM):**
  * Mendaftar akun menggunakan alamat **Gmail** dan membuat **sandi aplikasi manual**.
  * Memantau rapor audit bisnisnya pada 4 pilar.
  * Menanggapi ulasan komplain/apresiasi konsumen secara resmi (*Official Response*).
  * Melakukan *self-assessment* (audit mandiri) untuk memproyeksikan peningkatan skor usaha.
* **Asesor / Admin (Dinas Koperasi & Analis Kredit Bank):**
  * Memverifikasi data gerai kuliner di lapangan.
  * Memberikan catatan rekomendasi resmi tindak lanjut.
  * Mengelola master data gerai kuliner (fitur CRUD Admin).

---

## 2. ROADMAP PENGEMBANGAN MODUL (MODUL 1 - 6)

```text
┌────────────────────────────────────────────────────────────────────────┐
│ MODUL 1: Fondasi UI, Data & Logika TypeScript [STATUS: SELESAI ✅]     │
│ - Katalog Gerai Kuliner, FlatList, Type & Array of Objects             │
│ - 5 Custom Functions, External Stylesheet & Inline Style Dinamis       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│ MODUL 2: State, Hooks & Navigasi Expo Router [TARGET BERIKUTNYA 🎯]    │
│ - Stack Layout (_layout.tsx) & <Stack.Screen>                          │
│ - Dynamic Route [id].tsx (Rapor Detail Audit Kuliner)                  │
│ - Catch-All Route [...slug].tsx (Dokumentasi SOP Halal & P-IRT)        │
│ - Route Groups: (auth) & (admin)                                       │
│ - Fungsi Navigasi: push(), back(), replace()                           │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│ MODUL 3: Form Input Interaktif & State Management                      │
│ - Form Ulasan & Rating Bintang (1–5) dengan useState                   │
│ - Thread Dialog 2 Arah (Konsumen ↔ Pemilik Gerai)                      │
│ - Role Switcher Cepat untuk Kemudahan Demo                             │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│ MODUL 4: Data Persistence Lokal & CRUD Penuh                           │
│ - Penyimpanan Lokal HP via SQLite / AsyncStorage                       │
│ - Fitur CRUD Penuh untuk Ulasan (Create, Read, Update, Delete)         │
│ - Perhitungan Ulang Otomatis Rata-Rata Rating saat Data Dihapus        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│ MODUL 5 & 6: Backend Cloud, Autentikasi Gmail & Final Demo UAP         │
│ - Integrasi Firebase Firestore / Supabase                              │
│ - Autentikasi Akun Gmail + Sandi Manual Terenkripsi                    │
│ - Ekspor Dokumen Rapor Kelayakan Siap Cetak (Format KUR Bank)          │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. POHON STRUKTUR FILE & FOLDER LENGKAP

Struktur direktori di dalam folder `E:\ide\mobile\mobileHoreeV1\myUMKM`:

```text
myUMKM/
├── assets/                           # Gambar statis, logo, icon tab
├── src/
│   ├── app/                          # 📱 EXPO ROUTER (Navigasi Berbasis File)
│   │   ├── _layout.tsx               # Root Layout (Stack Navigator & ThemeProvider)
│   │   ├── index.tsx                 # [Modul 1] Dashboard Utama & Katalog Kuliner
│   │   ├── about.tsx                 # Profil Aplikasi & Identitas 3 Anggota Kelompok
│   │   │
│   │   ├── (auth)/                   # 🔐 Route Group: Autentikasi Pengguna
│   │   │   ├── _layout.tsx           # Layout Autentikasi
│   │   │   ├── login.tsx             # Masuk dengan Akun Gmail + Sandi Manual
│   │   │   └── register.tsx          # Daftar Akun Baru (Pemilik UMKM / Asesor)
│   │   │
│   │   ├── (admin)/                  # 🛠️ Route Group: Panel Khusus Asesor / Admin
│   │   │   ├── _layout.tsx           # Layout Admin
│   │   │   ├── kelola.tsx            # Layar Kelola Data Gerai Kuliner (CRUD)
│   │   │   └── profil-asesor.tsx     # Profil Asesor & Aksi Logout (router.replace)
│   │   │
│   │   ├── umkm/                     # 🌐 Dynamic Routes
│   │   │   ├── [id].tsx              # Rapor Detail Audit 4 Pilar Usaha Kuliner
│   │   │   └── ulasan/
│   │   │       └── [id].tsx          # [Modul 2-3] Menu Ulasan, Rating & Thread Dialog
│   │   │
│   │   ├── evaluasi/                 # 📝 Form Audit Mandiri
│   │   │   └── index.tsx             # Form Input Data Gerai Kuliner Baru
│   │   │
│   │   └── docs/                     # 📚 Catch-All Route
│   │       └── [...slug].tsx         # Panduan Regulasi Dinamis (/docs/halal, /docs/pirt)
│   │
│   ├── types/                        # 🏷️ Definisi Tipe & Interface (TypeScript)
│   │   ├── umkm.ts                   # Model Data UMKM Kuliner, Aspek Skor, Kategori
│   │   ├── ulasan.ts                 # Model Data Ulasan, Rating, & Thread Percakapan
│   │   └── user.ts                   # Model Data UserAccount, Role, AuthState
│   │
│   ├── data/                         # 🗄️ Mock Database (Array of Objects)
│   │   ├── umkmData.ts               # Data 6 Gerai Kuliner Riil (Modul 1)
│   │   ├── ulasanData.ts             # Data Dummy Ulasan & Percakapan 2 Arah
│   │   └── regulasiData.ts           # Data SOP Keamanan Pangan & Regulasi
│   │
│   ├── services/                     # ⚙️ Logika Bisnis & Layanan
│   │   ├── assessmentService.ts      # Algoritma Hitung Skor 4 Pilar Berbobot
│   │   └── authService.ts            # Validasi Akun Gmail & Sesi Pengguna
│   │
│   ├── database/                     # 💾 Engine Penyimpanan (Modul 3-6)
│   │   └── db.ts                     # Wrapper SQLite / AsyncStorage Client
│   │
│   └── styles/                       # 🎨 External Stylesheet
│       └── umkmStyles.ts             # Stylesheet Utama Tampilan Dashboard
```

---

## 4. SPESIFIKASI MODEL DATA (TYPESCRIPT SCHEMA)

### 4.1. Data Gerai Kuliner (`src/types/umkm.ts`)
```typescript
export type KategoriKuliner =
  | 'Semua'
  | 'Makanan Berat'
  | 'Minuman & Kopi'
  | 'Snack & Oleh-oleh'
  | 'Frozen Food'
  | 'Bakery & Pastry'
  | 'Katering';

export type StatusKelayakan = 'Sangat Layak' | 'Cukup Layak' | 'Perlu Pembinaan' | 'Risiko Tinggi';

export interface SkorAspekKuliner {
  higieneSanitasi: number;    // Bobot: 30%
  keuanganHPP: number;        // Bobot: 30%
  pemasaranDigital: number;   // Bobot: 20%
  operasionalDapur: number;   // Bobot: 20%
}

export interface UMKMKulinerData {
  id: string;
  namaUsaha: string;
  namaPemilik: string;
  emailPemilik: string;
  kategori: Exclude<KategoriKuliner, 'Semua'>;
  lokasiKota: string;
  tahunBerdiri: number;
  fotoUrl: string;
  omzetBulanan: number;
  labaBersih: number;
  kapasitasPorsiHarian: number;
  jumlahKaryawan: number;
  pencatatanKeuangan: string;
  sertifikatHalal: boolean;
  izinPIRT_BPOM: boolean;
  terdaftarOnlineFood: boolean;
  adopsiQRIS: boolean;
  skorTotal: number;
  statusKelayakan: StatusKelayakan;
  skorAspek: SkorAspekKuliner;
  rekomendasiAsesor: string;
}
```

### 4.2. Data Ulasan, Rating & Thread Dialog 2 Arah (`src/types/ulasan.ts`)
```typescript
export interface PesanThread {
  id: string;
  pengirimEmail: string;
  pengirimNama: string;
  role: 'konsumen' | 'pemilik_gerai';
  teksPesan: string;
  waktuKirim: string;
}

export interface UlasanKuliner {
  id: string;
  geraiId: string;
  emailPengulas: string;
  namaPengulas: string;
  ratingBintang: number; // Skala 1 s.d. 5
  isiUlasan: string;
  tanggalUlasan: string;
  // Percakapan bergantian eksklusif antara Konsumen dan Pemilik
  threadBalasan: PesanThread[];
  isEdited?: boolean;
}
```

---

## 5. ATURAN BISNIS SISTEM (BUSINESS RULES)

### 5.1. Algoritma Pembobotan Skor Asesor (Assessment Engine)
Total nilai kelayakan bisnis kuliner dihitung menggunakan formula *Weighted Scoring*:
$$\text{Skor Akhir} = (Higiene \times 0.30) + (HPP \times 0.30) + (Pemasaran \times 0.20) + (Operasional \times 0.20)$$

* **$\ge 85$ (Sangat Layak):** Lolos standar retail modern & pengajuan kredit bank.
* **$70 - 84$ (Cukup Layak):** Layak KUR Mikro dengan pemenuhan perizinan Halal.
* **$55 - 69$ (Perlu Pembinaan):** Prioritas bimbingan teknis HPP dan sanitasi dinas.
* **$< 55$ (Risiko Tinggi):** Risiko kredit tinggi; perbaikan dapur mendasar diperlukan.

### 5.2. Aturan Dialog Percakapan Bergantian (Strict Turn-Based Policy)
Untuk mencegah spam dan menjaga etika komunikasi:
1. **Konsumen membalas Pemilik:** DIPERBOLEHKAN (✅).
2. **Pemilik membalas Konsumen:** DIPERBOLEHKAN (✅).
3. **Pemilik membalas Pemilik:** DILARANG (❌) — Sistem memunculkan alert: *"Menunggu tanggapan dari konsumen"*.
4. **Konsumen membalas Konsumen:** DILARANG (❌) — Sistem mengarahkan: *"Gunakan tombol Edit Ulasan jika ingin memperbarui pesan Anda"*.
5. **Pihak Ketiga (Akun Lain):** DILARANG (❌) — Tidak memiliki akses kirim pesan di thread tersebut.

### 5.3. Aturan CRUD Ulasan
* **Create:** Konsumen membuat ulasan pertama (bintang 1–5 + komentar).
* **Read:** Ditampilkan di menu ulasan gerai dengan format kartu bersih.
* **Update (Edit):** Konsumen dapat mengubah bintang dan isi teks ulasan miliknya kapan saja.
* **Delete (Hapus):** Konsumen dapat menghapus ulasannya. Sistem secara otomatis menjalankan **Cascade Delete** (seluruh balasan di thread ikut terhapus) dan melakukan **Recalculate Average Rating** gerai.

---

## 6. PANDUAN MENGHADAPI TANYA JAWAB PEKAN DEMO

| Pertanyaan Asisten Praktikum | Kunci Jawaban Resmi |
| :--- | :--- |
| **"Mengapa memilih sektor Kuliner, bukan UMKM umum?"** | *"Sektor kuliner memiliki parameter risiko yang unik: risiko makanan basi/kedaluwarsa, kepatuhan sertifikasi Halal (UU JPH) dan P-IRT/BPOM, serta ketergantungan pada pesanan online food. Aplikasi ini memadukan audit kepatuhan pangan dengan analisis keuangan HPP."* |
| **"Di mana letak Custom Function dan Looping di Modul 1?"** | *"Custom Function: `formatRupiah()`, `getStatusBadge()`, `hitungRingkasan()`, dan `hitungSimulasiKuliner()` di file `src/app/index.tsx`. Looping: `<FlatList>` untuk kartu kuliner dan `.map()` untuk filter kategori."* |
| **"Bagaimana cara membuktikan dialog 2 arah tidak bisa dispam?"** | *"Gunakan tombol Role Switcher saat demo. Tunjukkan bahwa ketika peran aktif adalah pemilik gerai yang sudah menanggapi, tombol balas terkunci hingga konsumen membalas kembali."* |

---

*Dokumen ini dirancang sebagai acuan resmi arsitektur sistem Praktikum Pemrograman Mobile Modul 1 hingga UAP.*
