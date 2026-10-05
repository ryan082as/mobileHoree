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
  higieneSanitasi: number;    // Standar kebersihan dapur & bahan pangan
  keuanganHPP: number;        // Manajemen HPP, pembukuan kasir & laba
  pemasaranDigital: number;   // Rating online food & branding
  operasionalDapur: number;   // Kapasitas porsi & tenaga kerja
}

export interface UMKMKulinerData {
  id: string;
  namaUsaha: string;
  namaPemilik: string;
  kategori: Exclude<KategoriKuliner, 'Semua'>;
  lokasiKota: string;
  tahunBerdiri: number;
  fotoUrl: string;
  fotoLocal?: any;
  
  // Metrik Finansial & Operasional Kuliner
  omzetBulanan: number;
  labaBersih: number;
  kapasitasPorsiHarian: number;
  jumlahKaryawan: number;
  pencatatanKeuangan: string;

  // Legalitas & Kesiapan Bisnis Kuliner
  sertifikatHalal: boolean;
  izinPIRT_BPOM: boolean;
  terdaftarOnlineFood: boolean;
  adopsiQRIS: boolean;

  // Hasil Skor & Penilaian
  skorTotal: number;
  statusKelayakan: StatusKelayakan;
  skorAspek: SkorAspekKuliner;
  rekomendasiAsesor: string;
}

export interface RingkasanStatistikKuliner {
  totalUMKM: number;
  rataRataSkor: number;
  jumlahLayak: number;
}
