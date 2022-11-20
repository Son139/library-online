import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore";
import { db } from "./conflig";

export const addDocument = (collectionName, data) => {
    const query = collection(db, collectionName);
    addDoc(query, {
        ...data,
        createAt: serverTimestamp(),
    });
};

export const updateDocument = (id, updateData, collectionName) => {
    const query = doc(db, collectionName, id);
    updateDoc(query, updateData);
};

export const deleteDocument = (id, collectionName) => {
    const query = doc(db, collectionName, id);
    deleteDoc(query);
};

export const getAllDocuments = (collectionName) => {
    const query = collection(db, collectionName);
    getDocs(query);
};

export const getDocument = (id, collectionName) => {
    const query = doc(db, collectionName, id);
    getDoc(query);
};
