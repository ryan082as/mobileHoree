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
  threadBalasan: PesanThread[];
  isEdited?: boolean;
}
