
export const dbClient = {
  isInitialized: false,

  async initDatabase(): Promise<boolean> {
    this.isInitialized = true;
    return true;
  },

  async query<T>(tableName: string): Promise<T[]> {
    return [];
  },
};
