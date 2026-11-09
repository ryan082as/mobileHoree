import { UserAccount, UserRole } from "@/types/user";


export const authService = {
  
  async login(email: string, passwordManual: string): Promise<UserAccount> {
    if (!email.toLowerCase().endsWith("@gmail.com")) {
      throw new Error("Pendaftaran wajib menggunakan akun berekstensi @gmail.com");
    }
    if (passwordManual.length < 6) {
      throw new Error("Sandi minimal 6 karakter.");
    }

    return {
      id: "usr-01",
      email,
      namaLengkap: "Pemilik Gerai Contoh",
      role: "pemilik_umkm",
      nomorTelepon: "081234567890",
      namaUsahaKuliner: "Kedai Kopi Lereng",
      tanggalDaftar: new Date().toISOString(),
    };
  },

  
  async register(
    email: string,
    passwordManual: string,
    namaLengkap: string,
    role: UserRole
  ): Promise<UserAccount> {
    if (!email.toLowerCase().endsWith("@gmail.com")) {
      throw new Error("Wajib menggunakan alamat Gmail!");
    }

    return {
      id: `usr-${Date.now()}`,
      email,
      namaLengkap,
      role,
      nomorTelepon: "081234567890",
      tanggalDaftar: new Date().toISOString(),
    };
  },

  
  async logout(): Promise<void> {
    return Promise.resolve();
  },
};
