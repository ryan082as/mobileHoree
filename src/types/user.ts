export type UserRole = 'pemilik_umkm' | 'asesor_admin';

export interface UserAccount {
  id: string;
  email: string;            // Alamat Gmail pengguna
  namaLengkap: string;
  role: UserRole;
  nomorTelepon: string;
  namaUsahaKuliner?: string; // Khusus pemilik UMKM
  instansiAsesor?: string;   // Khusus asesor dinas/perbankan
  tanggalDaftar: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: UserAccount | null;
  token?: string;
}
