import {
    BookOutlined,
    HomeOutlined,
    LogoutOutlined,
    PlusCircleOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { onAuthStateChanged } from "firebase/auth";
import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/conflig";

export const AuthContext = createContext();
export default function AuthProvider({ children }) {
    const [user, setUser] = useState({});
    const [itemMenu, setItemMenu] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const unsubscribed = onAuthStateChanged(auth, (user) => {
            const items = [];

            if (user) {
                const { displayName, email, uid } = user;
                setUser({ displayName, email, uid });
                items.push(
                    email === "admin123@gmail.com" ? {
                        key: "/user",
                        icon: <UserOutlined />,
                        label: `${displayName}`,
                    } : "",
                    email === "admin123@gmail.com" ? {
                        key: "/",
                        icon: <BookOutlined />,
                        label: "Danh mục Sách",
                    } : "",
                    email === "admin123@gmail.com" ? {
                        key: "/addbook",
                        icon: <PlusCircleOutlined />,
                        label: "Thêm Sách",
                    } : "",
                    email === "admin123@gmail.com" ? "" : {
                        key: "/listbooks",
                        icon: <HomeOutlined />,
                        label: "Home User",
                    },
                    {
                        key: "/signout",
                        icon: <LogoutOutlined />,
                        label: "Đăng Xuất",
                    },
                );
                setItemMenu(items);
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
    }, []);

    return (
        <div>
            <AuthContext.Provider value={{ user, itemMenu }}>
                {children}
            </AuthContext.Provider>
        </div>
    );
}
