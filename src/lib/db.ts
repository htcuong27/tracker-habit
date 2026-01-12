import { Habit, Photo } from "./types";

const DB_NAME = "HabitSnapDB";
const DB_VERSION = 1;
const HABITS_STORE = "habits";
const PHOTOS_STORE = "photos";

let db: IDBDatabase | null = null;

export const initDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        if (db) {
            resolve(db);
            return;
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            db = request.result;
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            const database = (event.target as IDBOpenDBRequest).result;

            // Create habits store
            if (!database.objectStoreNames.contains(HABITS_STORE)) {
                const habitsStore = database.createObjectStore(HABITS_STORE, {
                    keyPath: "id",
                });
                habitsStore.createIndex("name", "name", { unique: false });
            }

            // Create photos store
            if (!database.objectStoreNames.contains(PHOTOS_STORE)) {
                const photosStore = database.createObjectStore(PHOTOS_STORE, {
                    keyPath: "id",
                    autoIncrement: true,
                });
                photosStore.createIndex("habitId", "habitId", { unique: false });
                photosStore.createIndex("date", "date", { unique: false });
            }
        };
    });
};

// Habits CRUD
export const getAllHabits = async (): Promise<Habit[]> => {
    const database = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = database.transaction(HABITS_STORE, "readonly");
        const store = transaction.objectStore(HABITS_STORE);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

export const addHabit = async (habit: Habit): Promise<void> => {
    const database = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = database.transaction(HABITS_STORE, "readwrite");
        const store = transaction.objectStore(HABITS_STORE);
        const request = store.add(habit);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
};

export const updateHabit = async (habit: Habit): Promise<void> => {
    const database = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = database.transaction(HABITS_STORE, "readwrite");
        const store = transaction.objectStore(HABITS_STORE);
        const request = store.put(habit);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
};

export const deleteHabit = async (id: string): Promise<void> => {
    const database = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = database.transaction(HABITS_STORE, "readwrite");
        const store = transaction.objectStore(HABITS_STORE);
        const request = store.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
};

// Photos CRUD

export const addPhoto = async (photo: Photo): Promise<void> => {
    const database = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = database.transaction(PHOTOS_STORE, "readwrite");
        const store = transaction.objectStore(PHOTOS_STORE);
        const request = store.add(photo);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
};

export const getPhotosByHabit = async (habitId: string): Promise<Photo[]> => {
    const database = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = database.transaction(PHOTOS_STORE, "readonly");
        const store = transaction.objectStore(PHOTOS_STORE);
        const index = store.index("habitId");
        const request = index.getAll(habitId);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

export const getAllPhotos = async (): Promise<Photo[]> => {
    const database = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = database.transaction(PHOTOS_STORE, "readonly");
        const store = transaction.objectStore(PHOTOS_STORE);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

export const deletePhoto = async (id: number): Promise<void> => {
    const database = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = database.transaction(PHOTOS_STORE, "readwrite");
        const store = transaction.objectStore(PHOTOS_STORE);
        const request = store.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
};

export const updatePhoto = async (photo: Photo): Promise<void> => {
    const database = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = database.transaction(PHOTOS_STORE, "readwrite");
        const store = transaction.objectStore(PHOTOS_STORE);
        const request = store.put(photo);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
};
