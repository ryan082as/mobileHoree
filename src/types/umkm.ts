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
  higieneSanitasi: number;
  keuanganHPP: number;
  pemasaranDigital: number;
  operasionalDapur: number;
}

export interface MenuPopulerItem {
  id: string;
  nama: string;
  deskripsi: string;
  harga: number;
  isFavorit?: boolean;
  fotoUrl?: string;
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
  menuPopuler?: MenuPopulerItem[];
  
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

export interface RingkasanStatistikKuliner {
  totalUMKM: number;
  rataRataSkor: number;
  jumlahLayak: number;
}
