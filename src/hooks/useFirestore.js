import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../components/firebase/conflig";

function useFirestore(collectionName) {
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        let collectionRef = query(
            collection(db, collectionName),
            orderBy("createdAt"),
        );

        const unsubscribed = onSnapshot(collectionRef, (snapshot) => {
            const documents = snapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            setDocuments(documents);
            //     console.log({ data, snapshot, docs: snapshot.docs });
        });
        return unsubscribed;
    }, [collectionName]);
    return documents;
}

export default useFirestore;
