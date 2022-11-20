import { onAuthStateChanged } from "firebase/auth";
import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useFirestore from "../../hooks/useFirestore";
import { auth } from "../firebase/conflig";

export const AuthContext = createContext();
export default function AuthProvider({ children }) {
    const [user, setUser] = useState({});
    const navigate = useNavigate();

    const firestore = useFirestore("user");
    useEffect(() => {
        const unsubscribed = onAuthStateChanged(auth, (user) => {
            console.log(user);
            if (user) {
                const { displayName, email, uid } = user;
                setUser({ displayName, email, uid });
                // navigate("/");
                // return;
            } 
            // else {
            //     navigate("/login");
            // }
        });
        return () => {
            unsubscribed();
        };
    }, [navigate]);

    return (
        <div>
            <AuthContext.Provider value={{ user }}>
                {children}
            </AuthContext.Provider>
        </div>
    );
}
