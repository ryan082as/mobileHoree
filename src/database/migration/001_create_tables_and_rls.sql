-- ============================================================================
-- MIGRATION SQL MANUAL (Hanya DROP, CREATE TABLE, & ALTER TABLE / RLS)
-- Copy & Run file ini di Supabase -> SQL Editor -> New Query
-- Data awal (INSERT) akan diisi otomatis oleh src/database/migration/seedData.ts
-- ============================================================================

-- 1. DROP Trigger, Function, & Tabel Lama (jika sudah pernah ada)
DROP TRIGGER IF EXISTS trg_protect_umkm_audit_fields ON umkm_gerai;
DROP FUNCTION IF EXISTS protect_umkm_audit_fields();
DROP TABLE IF EXISTS ulasan_kuliner CASCADE;
DROP TABLE IF EXISTS menu_populer CASCADE;
DROP TABLE IF EXISTS umkm_gerai CASCADE;

-- 2. CREATE TABLE: Daftar Toko / Gerai UMKM Kuliner
CREATE TABLE umkm_gerai (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users DEFAULT auth.uid(),
  is_public BOOLEAN DEFAULT false NOT NULL,
  is_seed BOOLEAN DEFAULT false NOT NULL,
  nama_usaha TEXT NOT NULL,
  nama_pemilik TEXT NOT NULL,
  kategori TEXT NOT NULL,
  lokasi_kota TEXT NOT NULL,
  tahun_berdiri INTEGER DEFAULT 2020 NOT NULL,
  foto_url TEXT,
  omzet_bulanan BIGINT DEFAULT 0 NOT NULL,
  laba_bersih BIGINT DEFAULT 0 NOT NULL,
  kapasitas_porsi_harian INTEGER DEFAULT 100 NOT NULL,
  jumlah_karyawan INTEGER DEFAULT 3 NOT NULL,
  pencatatan_keuangan TEXT DEFAULT 'Buku Kas Sederhana' NOT NULL,
  sertifikat_halal BOOLEAN DEFAULT false NOT NULL,
  izin_pirt_bpom BOOLEAN DEFAULT false NOT NULL,
  terdaftar_online_food BOOLEAN DEFAULT true NOT NULL,
  adopsi_qris BOOLEAN DEFAULT true NOT NULL,
  skor_higiene INTEGER DEFAULT 75 NOT NULL,
  skor_keuangan INTEGER DEFAULT 75 NOT NULL,
  skor_pemasaran INTEGER DEFAULT 75 NOT NULL,
  skor_operasional INTEGER DEFAULT 75 NOT NULL,
  skor_total INTEGER DEFAULT 75 NOT NULL,
  status_kelayakan TEXT DEFAULT 'Cukup Layak' NOT NULL,
  rekomendasi_asesor TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. CREATE TABLE: Menu Masing-Masing Toko
CREATE TABLE menu_populer (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  gerai_id UUID REFERENCES umkm_gerai(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users DEFAULT auth.uid(),
  nama TEXT NOT NULL,
  deskripsi TEXT NOT NULL,
  harga INTEGER NOT NULL,
  is_favorit BOOLEAN DEFAULT false NOT NULL,
  foto_url TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. CREATE TABLE: Ulasan Masing-Masing Toko
CREATE TABLE ulasan_kuliner (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  gerai_id UUID REFERENCES umkm_gerai(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users DEFAULT auth.uid(),
  email_pengulas TEXT NOT NULL,
  nama_pengulas TEXT NOT NULL,
  rating_bintang INTEGER NOT NULL CHECK (rating_bintang BETWEEN 1 AND 5),
  isi_ulasan TEXT NOT NULL,
  tanggal_ulasan TEXT NOT NULL,
  thread_balasan JSONB DEFAULT '[]'::jsonb NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TRIGGER: Kunci kolom kepemilikan & nilai audit saat di-UPDATE lewat aplikasi
CREATE OR REPLACE FUNCTION protect_umkm_audit_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public, auth
AS $$
BEGIN
  IF auth.role() = 'authenticated' THEN
    NEW.id := OLD.id;
    NEW.user_id := OLD.user_id;
    NEW.is_public := OLD.is_public;
    NEW.is_seed := OLD.is_seed;
    NEW.skor_higiene := OLD.skor_higiene;
    NEW.skor_keuangan := OLD.skor_keuangan;
    NEW.skor_pemasaran := OLD.skor_pemasaran;
    NEW.skor_operasional := OLD.skor_operasional;
    NEW.skor_total := OLD.skor_total;
    NEW.status_kelayakan := OLD.status_kelayakan;
    NEW.rekomendasi_asesor := OLD.rekomendasi_asesor;
    NEW.created_at := OLD.created_at;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_protect_umkm_audit_fields
BEFORE UPDATE ON umkm_gerai
FOR EACH ROW
EXECUTE FUNCTION protect_umkm_audit_fields();

-- 6. ALTER TABLE: Aktifkan Row Level Security (RLS) & Kebijakan Akses
ALTER TABLE umkm_gerai ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_populer ENABLE ROW LEVEL SECURITY;
ALTER TABLE ulasan_kuliner ENABLE ROW LEVEL SECURITY;

-- Policies untuk umkm_gerai (Pemilik toko hanya bisa mengubah info profil gerainya sendiri)
CREATE POLICY "Lihat katalog publik atau gerai milik sendiri"
ON umkm_gerai FOR SELECT
USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Seed awal katalog oleh user login"
ON umkm_gerai FOR INSERT
WITH CHECK (
  auth.uid() = user_id AND
  id IN (
    '11111111-1111-4111-8111-111111111101'::uuid,
    '11111111-1111-4111-8111-111111111102'::uuid,
    '11111111-1111-4111-8111-111111111103'::uuid
  )
);

CREATE POLICY "Pemilik hanya bisa ubah gerainya sendiri"
ON umkm_gerai FOR UPDATE
USING (auth.uid() = user_id AND is_seed = false)
WITH CHECK (auth.uid() = user_id AND is_seed = false);

-- Policies untuk menu_populer (terikat pada kepemilikan toko umkm_gerai)
CREATE POLICY "Lihat menu dari gerai yang dapat diakses"
ON menu_populer FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM umkm_gerai g
    WHERE g.id = gerai_id AND (g.is_public = true OR g.user_id = auth.uid())
  )
);

CREATE POLICY "Tambah menu untuk gerai milik sendiri"
ON menu_populer FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM umkm_gerai g
    WHERE g.id = gerai_id AND g.user_id = auth.uid()
  )
);

CREATE POLICY "Ubah menu pada gerai milik sendiri"
ON menu_populer FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM umkm_gerai g
    WHERE g.id = gerai_id AND g.user_id = auth.uid() AND g.is_seed = false
  )
);

CREATE POLICY "Hapus menu pada gerai milik sendiri"
ON menu_populer FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM umkm_gerai g
    WHERE g.id = gerai_id AND g.user_id = auth.uid() AND g.is_seed = false
  )
);

-- Policies untuk ulasan_kuliner
CREATE POLICY "Lihat ulasan dari gerai yang dapat diakses"
ON ulasan_kuliner FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM umkm_gerai g
    WHERE g.id = gerai_id AND (g.is_public = true OR g.user_id = auth.uid())
  )
);

CREATE POLICY "Tambah ulasan milik user login"
ON ulasan_kuliner FOR INSERT
WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM umkm_gerai g
    WHERE g.id = gerai_id AND (g.is_public = true OR g.user_id = auth.uid())
  )
);

CREATE POLICY "Pemilik UMKM membalas ulasan gerainya"
ON ulasan_kuliner FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM umkm_gerai g
    WHERE g.id = gerai_id AND g.user_id = auth.uid() AND g.is_seed = false
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM umkm_gerai g
    WHERE g.id = gerai_id AND g.user_id = auth.uid() AND g.is_seed = false
  )
);

CREATE POLICY "Pemilik UMKM menghapus ulasan gerainya"
ON ulasan_kuliner FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM umkm_gerai g
    WHERE g.id = gerai_id AND g.user_id = auth.uid() AND g.is_seed = false
  )
);
