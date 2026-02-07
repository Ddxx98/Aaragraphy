import { db, storage } from "../firebase";
import { ref, get, set, remove, push, child } from "firebase/database";
import { ref as sRef, uploadBytes, getDownloadURL } from "firebase/storage";

/**
 * Upload a file to Firebase Storage
 * @param {File} file - The file to upload
 * @param {string} path - The storage path (folder/filename)
 * @returns {Promise<string>} - The download URL
 */
export const uploadFile = async (file, path) => {
    try {
        const storageRef = sRef(storage, path);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
    } catch (error) {
        console.error(`Firebase upload error at ${path}:`, error);
        throw error;
    }
};

/**
 * Fetch data from a specific path in Realtime Database
 * @param {string} path - The DB path (e.g., 'services')
 */
export const getFromDB = async (path) => {
    try {
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, path));
        if (snapshot.exists()) {
            return snapshot.val();
        }
        return null;
    } catch (error) {
        console.error(`Firebase fetch error at ${path}:`, error);
        throw error;
    }
};

/**
 * Save data to a specific path (overwrites existing)
 * @param {string} path - The DB path
 * @param {any} data - The data to save
 */
export const saveToDB = async (path, data) => {
    try {
        await set(ref(db, path), data);
        return true;
    } catch (error) {
        console.error(`Firebase save error at ${path}:`, error);
        throw error;
    }
};

/**
 * Delete data from a specific path
 * @param {string} path - The DB path
 */
export const deleteFromDB = async (path) => {
    try {
        await remove(ref(db, path));
        return true;
    } catch (error) {
        console.error(`Firebase delete error at ${path}:`, error);
        throw error;
    }
};

/**
 * Push new data to a list in Realtime Database (generates unique key)
 * @param {string} path - The list path
 * @param {any} data - The item to add
 */
export const pushToDB = async (path, data) => {
    try {
        const listRef = ref(db, path);
        const newItemRef = push(listRef);
        await set(newItemRef, data);
        return newItemRef.key;
    } catch (error) {
        console.error(`Firebase push error at ${path}:`, error);
        throw error;
    }
};
