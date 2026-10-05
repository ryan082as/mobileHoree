export interface PanduanRegulasi {
  slug: string;
  judul: string;
  kategori: string;
  ringkasan: string;
  isiLengkap: string[];
}

export const DATA_REGULASI: Record<string, PanduanRegulasi> = {
  "halal": {
    slug: "halal",
    judul: "SOP Sertifikasi Halal BPJPH & MUI",
    kategori: "Legalitas Pangan",
    ringkasan: "Kewajiban sertifikasi halal untuk seluruh produk makanan dan minuman UMKM.",
    isiLengkap: [
      "1. Penggunaan bahan baku yang bersertifikat halal.",
      "2. Pemisahan alat produksi antara bahan halal dan non-halal.",
      "3. Menunjuk Penyelia Halal internal di usaha kuliner.",
      "4. Pengajuan mandiri melalui program SEHATI (Sertifikasi Halal Gratis).",
    ],
  },
  "pirt": {
    slug: "pirt",
    judul: "Panduan Pengurusan Izin Edar P-IRT",
    kategori: "Legalitas Pangan",
    ringkasan: "Izin edar pangan olahan skala rumah tangga dari Dinas Kesehatan.",
    isiLengkap: [
      "1. Mengikuti Penyuluhan Keamanan Pangan (PKP) di Dinkes setempat.",
      "2. Pemeriksaan sarana dapur dan sanitasi tempat pengolahan.",
      "3. Pendaftaran melalui OSS (Online Single Submission) berbasis risiko.",
      "4. Pencantuman nomor registrasi P-IRT dan tanggal kedaluwarsa pada kemasan.",
    ],
  },
  "higiene": {
    slug: "higiene",
    judul: "Standar Higiene & Sanitasi Dapur Kuliner",
    kategori: "Operasional Dapur",
    ringkasan: "Protokol kebersihan lingkungan pengolahan makanan untuk mencegah kontaminasi.",
    isiLengkap: [
      "1. Ketersediaan air bersih mengalir dan sabun cuci tangan food-grade.",
      "2. Penanganan sampah sisa makanan (food waste) tertutup dan rutin dibuang.",
      "3. Pengendalian hama (serangga/tikus) di area penyimpanan bahan baku.",
      "4. Penjaga makanan wajib menggunakan celemek, penutup kepala, dan sarung tangan.",
    ],
  },
};
