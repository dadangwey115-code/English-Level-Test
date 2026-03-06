import { UserProfile, Message } from "../types";

const DB_NAME = "MingalarESLDB";
const DB_VERSION = 1;
const STORES = {
  PROFILE: "profile",
  CHAT: "chat",
};

export class LocalDB {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORES.PROFILE)) {
          db.createObjectStore(STORES.PROFILE, { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains(STORES.CHAT)) {
          db.createObjectStore(STORES.CHAT, { keyPath: "id" });
        }
      };
    });
  }

  async getProfile(): Promise<UserProfile | null> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(STORES.PROFILE, "readonly");
      const store = transaction.objectStore(STORES.PROFILE);
      const request = store.get(1); // We only store one profile

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || null);
    });
  }

  async saveProfile(profile: UserProfile): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(STORES.PROFILE, "readwrite");
      const store = transaction.objectStore(STORES.PROFILE);
      const request = store.put({ ...profile, id: 1 });

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getChatHistory(): Promise<Message[]> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(STORES.CHAT, "readonly");
      const store = transaction.objectStore(STORES.CHAT);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const results = request.result as Message[];
        resolve(results.sort((a, b) => a.timestamp - b.timestamp));
      };
    });
  }

  async saveMessage(message: Message): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(STORES.CHAT, "readwrite");
      const store = transaction.objectStore(STORES.CHAT);
      const request = store.put(message);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async clearChat(): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(STORES.CHAT, "readwrite");
      const store = transaction.objectStore(STORES.CHAT);
      const request = store.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }
}

export const localDB = new LocalDB();
