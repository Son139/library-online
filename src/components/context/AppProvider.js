import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Modal, Space } from "antd";
import { collection, getDocs } from "firebase/firestore";
import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/conflig";
import { deleteDocument } from "../firebase/services";

export const AppContext = createContext();
export default function AppProvider({ children }) {
    const navigate = useNavigate();

    const [books, setBooks] = useState([]);
    const [bookId, setBookId] = useState("");

    const handleDelete = (record) => {
        Modal.confirm({
            title: "Bạn có chắc chắn muốn xóa!!!",
            okText: "Yes",
            okType: "danger",
            onOk: () => {
                deleteDocument(record.id, "books");
                getBooks();
            },
        });
    };

    const handleView = (record) => {
        // getBookId(record.id);
        setBookId(record.id);
        navigate(`/view/${record.id}`);
    };

    const columns = [
        { title: "Tiêu Đề", dataIndex: "title", key: "title" },
        { title: "Tác Giả", dataIndex: "author", key: "author" },
        { title: "Thể Loại", dataIndex: "category", key: "category" },
        {
            title: "Ngày Phát Hành",
            dataIndex: "releaseDate",
            key: "releaseDate",
        },
        { title: "Số Trang", dataIndex: "page", key: "page" },
        {
            title: "Action",
            dataIndex: "action",
            key: "action",
            render: (_, record) => {
                return (
                    <Space size="middle">
                        <EditOutlined
                            style={{ color: "black" }}
                            onClick={() => handleView(record)}
                        />
                        <DeleteOutlined
                            style={{ color: "red" }}
                            onClick={(e) => handleDelete(record)}
                        />
                    </Space>
                );
            },
        },
    ];

    useEffect(() => {
        getBooks();
    }, []);

    // const getBooks = async () => {
    //     const docSnap = await getAllDocuments("books");
    //     setBooks(docSnap.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    // };

    async function getBooks() {
        const bookCol = collection(db, "books");
        const bookSnapshot = await getDocs(bookCol);
        setBooks(
            bookSnapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
                key: doc.id,
            })),
        );
    }
    return (
        <div>
            <AppContext.Provider value={{ books, columns, bookId, setBookId }}>
                {children}
            </AppContext.Provider>
        </div>
    );
}
