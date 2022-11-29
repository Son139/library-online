import {
    Button,
    Col,
    DatePicker,
    Form,
    Input,
    Row,
    Select,
    Image,
    notification,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import { doc, getDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../components/Context/AppProvider";
import { db } from "../../components/firebase/conflig";
import { updateDocument } from "../../components/firebase/services";

import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../components/firebase/conflig";
import { Footer } from "antd/es/layout/layout";

export default function View() {
    const { bookId, setBookId } = useContext(AppContext);
    const navigate = useNavigate();
    const categoryList = ["Hài hước", "Trinh thám", "Kì bí", "Viễn tưởng"];
    const dateFormat = "DD/MM/YYYY";

    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [description, setDescription] = useState("");
    const [page, setPage] = useState("");
    const [category, setCategory] = useState("");
    const [releaseDate, setReleaseDate] = useState("");
    const [buttonName, setButtonName] = useState("Edit");
    const [isDisabled, setIsDisabled] = useState(true);
    const [image, setImage] = useState(null);
    const [url, setUrl] = useState(null);

    const { books } = useContext(AppContext);

    const [api, contextHolder] = notification.useNotification();
    const openNotificationWithIcon = (type, message) => {
        api[type]({
            message: message,
        });
    };
    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const uploadImg = () => {
        if (image.name !== null) {
            const storageRef = ref(storage, `images/${image.name}`);

            uploadBytes(storageRef, image)
                .then(() => {
                    getDownloadURL(storageRef)
                        .then((url) => {
                            setUrl(url);
                            console.log(url);
                        })
                        .catch((error) => {
                            console.log(
                                error.message,
                                "error getting the image url",
                            );
                        });
                    setImage(null);
                })
                .catch((error) => {
                    console.log(error.message);
                });
        }
    };

    const handleSubmit = async () => {
        const newBook = {
            title,
            author,
            description,
            page,
            category,
            releaseDate,
            url,
        };

        const checkBook = books.filter(
            (book) => book.title === newBook.title.trim(),
        );
        console.log(checkBook);
        if (checkBook.length === 0) {
            openNotificationWithIcon("success", "Update sách thành công!!!");
            await updateDocument(bookId, newBook, "books");
        } else {
            openNotificationWithIcon("error", "Sách đã tồn tại!!!");
            return;
        }
    };

    const editHandler = async () => {
        const bookDoc = doc(db, `books/${bookId}`);
        const docSnap = await getDoc(bookDoc);
        setTitle(docSnap.data().title);
        setAuthor(docSnap.data().author);
        setDescription(docSnap.data().description);
        setReleaseDate(docSnap.data().releaseDate);
        setPage(docSnap.data().page);
        setCategory(docSnap.data().category);
        setUrl(docSnap.data().url);
    };

    useEffect(() => {
        console.log("The id here is : ", bookId);
        if (bookId !== undefined && bookId !== "") {
            editHandler();
        }
    }, [bookId]);

    // const initialValue = undefined;
    return (
        <Form
            labelCol={{
                span: 8,
            }}
            wrapperCol={{
                span: 16,
            }}
            initialValues={{
                remember: true,
            }}
            layout="vertical"
            // onFinish={handleSubmit}
            style={{
                margin: "100px 190px 0",
                background: "rgb(220 220 220 / 10%)",
                padding: "50px 0 0 0",
                borderRadius: "10px",
                boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
            }}
        >
            <Row
                style={{
                    display: "flex",
                    padding: "0 0 50px 140px",
                }}
            >
                <Col span={14}>
                    <Row justify="center">
                        <Col span={12}>
                            <Form.Item
                                label="Tiêu Đề: "
                                rules={[
                                    {
                                        required: true,
                                        message: "Điền tiêu đề",
                                    },
                                ]}
                            >
                                <Input
                                    onChange={(e) => setTitle(e.target.value)}
                                    value={`${title}`}
                                    disabled={isDisabled}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Tác Giả: "
                                rules={[
                                    {
                                        required: true,
                                        message: "Điền tác giả",
                                    },
                                ]}
                                hasFeedback
                            >
                                <Input
                                    type="text"
                                    onChange={(e) => setAuthor(e.target.value)}
                                    value={`${author}`}
                                    disabled={isDisabled}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        wrapperCol={{
                            span: 20,
                        }}
                        label="Mô tả về sách: "
                    >
                        <TextArea
                            rows={6}
                            onChange={(e) => setDescription(e.target.value)}
                            value={`${description}`}
                            disabled={isDisabled}
                        />
                    </Form.Item>

                    <Row>
                        <Col span={12}>
                            <Form.Item
                                label="Ngày phát hành: "
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: "Điền ngày phát hành",
                                    },
                                ]}
                                // initialValue={undefined}
                            >
                                <DatePicker
                                    style={{ width: "100%" }}
                                    onChange={(date, dateString) =>
                                        setReleaseDate(dateString)
                                    }
                                    format={dateFormat}
                                    // value={moment(
                                    //     releaseDate
                                    //         ? `${releaseDate}`
                                    //         : "20/11/2022",
                                    //     dateFormat,
                                    // )}
                                    // value={`${releaseDate}`}
                                    disabled={isDisabled}
                                />
                            </Form.Item>
                            <Form.Item label="Thể loại" hasFeedback>
                                <Select
                                    value={`${category}`}
                                    options={categoryList.map(
                                        (categoryItem) => ({
                                            value: `${categoryItem}`,
                                            label: `${categoryItem}`,
                                        }),
                                    )}
                                    onChange={(value) => {
                                        setCategory(value);
                                    }}
                                    disabled={isDisabled}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Số Trang: ">
                                <Input
                                    type="number"
                                    onChange={(e) => setPage(e.target.value)}
                                    value={`${page}`}
                                    disabled={isDisabled}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Footer style={{ width: "100%", paddingTop: "10px" }}>
                        {contextHolder}
                        <Button
                            style={{ width: "80px" }}
                            type="primary"
                            htmlType="submit"
                            onClick={() => {
                                if (buttonName === "Edit") {
                                    setButtonName("Save");
                                    setIsDisabled(false);
                                } else {
                                    handleSubmit();
                                    setButtonName("Edit");
                                    setIsDisabled(true);
                                }
                            }}
                            size="large"
                        >
                            {buttonName}
                        </Button>
                        {/* <Button
                            style={{ width: "80px", marginLeft: 20 }}
                            type="primary"
                            htmlType="submit"
                            onClick={() => {
                                if (buttonName === "Edit") {
                                    setButtonName("Save");
                                    setIsDisabled(false);
                                } else {
                                    setButtonName("Edit");
                                    setIsDisabled(true);
                                }
                            }}
                            size="large"
                        >
                            {buttonName}
                        </Button> */}
                        <Button
                            style={{ width: "80px", marginLeft: 20 }}
                            type="primary"
                            size="large"
                            onClick={() => {
                                navigate("/");
                                window.location.reload(false);
                            }}
                        >
                            Back
                        </Button>
                    </Footer>
                </Col>
                <Col span={10}>
                    <Form.Item>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <Input
                                type="file"
                                onChange={handleImageChange}
                                disabled={isDisabled}
                            />
                            <Button onClick={uploadImg} disabled={isDisabled}>
                                Submit
                            </Button>
                        </div>
                        <Image
                            src={url}
                            width="100%"
                            style={{ marginTop: "20px" }}
                        />
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
}
