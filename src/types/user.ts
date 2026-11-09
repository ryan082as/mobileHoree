export type UserRole = 'pemilik_umkm' | 'asesor_admin';

export interface UserAccount {
  id: string;
  email: string;
  namaLengkap: string;
  role: UserRole;
  nomorTelepon: string;
  namaUsahaKuliner?: string;
  instansiAsesor?: string;
  tanggalDaftar: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: UserAccount | null;
  token?: string;
}
