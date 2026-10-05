/**
 * Konfigurasi Database Lokal / Client Wrapper (Untuk Modul 3 s.d. 6)
 */
export const dbClient = {
  isInitialized: false,

  async initDatabase(): Promise<boolean> {
    // Di Modul 3/4 akan menggunakan SQLite / AsyncStorage
    this.isInitialized = true;
    return true;
  },

  async query<T>(tableName: string): Promise<T[]> {
    return [];
  },
};
