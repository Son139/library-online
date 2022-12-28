import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    setDoc,
    serverTimestamp,
    updateDoc,
    arrayRemove,
    arrayUnion,
    query,
    where,
} from "firebase/firestore";
import { db } from "./conflig";


export const addDocument = (collectionName, data) => {
    const query = collection(db, collectionName);
    addDoc(query, {
        ...data,
        createAt: serverTimestamp(),
    });
};

export const addDocumentWithID = (collectionName, id, data) => {
    setDoc(doc(db, collectionName, id), data);
};

export const updateDocument = (id, updateData, collectionName) => {
    const query = doc(db, collectionName, id);
    updateDoc(query, updateData);
};

export const deleteDocument = (id, collectionName) => {
    const query = doc(db, collectionName, id);
    deleteDoc(query);
};

export const deleteItemInCart = async (id, objectToRemove, collectionName) => {
    const query = doc(db, collectionName, id);
    await updateDoc(query, {
        books: arrayRemove(objectToRemove)
    }); 
};

export const addComment = async (id, objectToAdd, collectionName) => {
    const query = doc(db, collectionName, id);
    await updateDoc(query, {
        comments: arrayUnion(objectToAdd)
    }); 
};

export const getAllDocuments = (collectionName) => {
    const query = collection(db, collectionName);
    getDocs(query);
};

export const getDocument = async (id, collectionName) => {
    const query = doc(db, collectionName, id);
    return getDoc(query);
};

export const getUser = async (id, collectionName) => {
    const q = query(collection(db, "users"), where("uid", "==", id));
    await getDocs(q).then((res) => {
        return res.docs[0].data(); 
    });
}