class StorageService {
  async saveItem(key: string, value: string): Promise<void> {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(key, value);
      }
    } catch (error) {
      console.error(`[StorageService] Erro ao salvar item (${key}):`, error);
      throw new Error(String(error));
    }
  }

  async getItem(key: string): Promise<string | null> {
    try {
      if (typeof window !== "undefined") {
        return localStorage.getItem(key);
      }
      return null;
    } catch (error) {
      console.error(`[StorageService] Erro ao buscar item (${key}):`, error);
      throw new Error(String(error));
    }
  }

  async deleteItem(key: string): Promise<void> {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`[StorageService] Erro ao deletar item (${key}):`, error);
      throw new Error(String(error));
    }
  }

  async clear(): Promise<void> {
    try {
      if (typeof window !== "undefined") {
        localStorage.clear();
      }
    } catch (error) {
      console.error("[StorageService] Erro ao limpar storage:", error);
      throw new Error(String(error));
    }
  }
}

export { StorageService };