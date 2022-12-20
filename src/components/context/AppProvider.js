import {
    DeleteOutlined,
    EditOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import { Button, Input, Modal, Space } from "antd";
import { collection, onSnapshot } from "firebase/firestore";
import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/conflig";
import { deleteDocument } from "../firebase/services";
import { AuthContext } from "./AuthProvider";
import Highlighter from "react-highlight-words";
import { deleteObject, getStorage, ref } from "firebase/storage";

export const AppContext = createContext();
export default function AppProvider({ children }) {
    const navigate = useNavigate();

    const { user } = useContext(AuthContext);
    const [books, setBooks] = useState([]);
    const [bookId, setBookId] = useState("");
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);

    const storage = getStorage();

    // Modal Handle Delete Book
    const handleDelete = (record) => {
        const desertRef = ref(storage, `images/${record.imageName}`);
        Modal.confirm({
            title: "Bạn có chắc chắn muốn xóa!!!",
            okText: "Yes",
            okType: "danger",
            onOk: () => {
                deleteDocument(record.id, "books");
                // getBooks();
                deleteObject(desertRef)
                    .then(() => {
                        // File deleted successfully
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            },
        });
    };

    // Handle view book path
    const handleView = (record) => {
        // getBookId(record.id);
        setBookId(record.id);
        navigate(`/view/${record.id}`);
    };

    //Handle search fields
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText("");
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
            close,
        }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    onPressEnter={() =>
                        handleSearch(selectedKeys, confirm, dataIndex)
                    }
                    style={{
                        marginBottom: 8,
                        display: "block",
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() =>
                            handleSearch(selectedKeys, confirm, dataIndex)
                        }
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() =>
                            clearFilters && handleReset(clearFilters)
                        }
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? "#1890ff" : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: "#ffc069",
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ""}
                />
            ) : (
                text
            ),
    });

    const columns = [
        {
            title: "Tiêu Đề",
            dataIndex: "title",
            key: "title",
            ...getColumnSearchProps("title"),
        },
        {
            title: "Tác Giả",
            dataIndex: "author",
            key: "author",
            ...getColumnSearchProps("author"),
        },
        {
            title: "Thể Loại",
            dataIndex: "category",
            key: "category",
            ...getColumnSearchProps("category"),
        },
        {
            title: "Ngày Phát Hành",
            dataIndex: "releaseDate",
            key: "releaseDate",
        },
        {
            title: "Số Trang",
            dataIndex: "page",
            key: "page",
            sorter: (a, b) => a.page - b.page,
        },
        {
            title: "Action",
            dataIndex: "action",
            key: "action",

            render: (_, record) => {
                if (user.uid)
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

    function getBooks() {
        const bookCol = collection(db, "books");
        // const bookSnapshot = await getDocs(bookCol);
        onSnapshot(bookCol, (snapshot) => {
            const documents = snapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
                key: doc.id,
            }));

            setBooks(documents);
        });
    }
    return (
        <div>
            <AppContext.Provider value={{ books, columns, bookId, setBookId }}>
                {children}
            </AppContext.Provider>
        </div>
    );
}
