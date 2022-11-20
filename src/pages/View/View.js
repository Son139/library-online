import { Button, Col, DatePicker, Form, Input, Row, Select } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { doc, getDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../components/Context/AppProvider";
import { db } from "../../components/firebase/conflig";
import { updateDocument } from "../../components/firebase/services";
import UploadImage from "../../components/UploadImage/UploadImage";

export default function View() {
    const [inputValue, setInputValue] = useState("");
    const { bookId, setBookId } = useContext(AppContext);
    const navigate = useNavigate();
    const categoryList = ["Hài hước", "Trinh thám", "Kì bí", "Viễn tưởng"];

    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [description, setDescription] = useState("");
    const [page, setPage] = useState("");
    const [category, setCategory] = useState("");
    const [releaseDate, setReleaseDate] = useState("");
    const [buttonName, setButtonName] = useState("Edit");
    const [isDisabled, setIsDisabled] = useState("true");
    const handleSubmit = async () => {
        const newBook = {
            title,
            author,
            description,
            page,
            category,
        };
        if (bookId !== undefined && bookId !== "") {
            await updateDocument(bookId, newBook, "books");
            // setBookId("");
            // setMessage({ error: false, msg: "Updated successfully!" });
        }
        // setTitle("");
        // setAuthor("");
        // setDescription("");
        // setReleaseDate("");
        // setPage("");
        // setCategory("");
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
    };

    useEffect(() => {
        console.log("The id here is : ", bookId);
        if (bookId !== undefined && bookId !== "") {
            editHandler();
        }
    }, [bookId]);

    console.log(releaseDate);
    console.log(page);
    console.log(category);
    const dateFormat = "DD/MM/YYYY";

    const handleChange = (value) => {
        setCategory(value);
    };
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
            onFinish={handleSubmit}
        >
            <Row>
                <Col span={12}>
                    <Row>
                        <Col span={12}>
                            <Form.Item
                                label="Tiêu Đề: "
                                rules={[
                                    { required: true, message: "Điền tiêu đề" },
                                ]}
                            >
                                <Input
                                    placeholder="Tiêu Đề"
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
                                    { required: true, message: "Điền tác giả" },
                                ]}
                            >
                                <Input
                                    placeholder="Tác Giả"
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
                            placeholder="Mô tả về sách"
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
                            >
                                <DatePicker
                                    style={{ width: "100%" }}
                                    onChange={(date, dateString) =>
                                        setReleaseDate(dateString)
                                    }
                                    format={dateFormat}
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
                                    onChange={handleChange}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Số Trang: ">
                                <Input
                                    placeholder="Số trang"
                                    type="number"
                                    onChange={(e) => setPage(e.target.value)}
                                    value={`${page}`}
                                    disabled={isDisabled}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Col>
                <Col span={12}>
                    <Form.Item>
                        <UploadImage />
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item
                wrapperCol={{
                    offset: 8,
                    span: 16,
                }}
            >
                <Button
                    type="primary"
                    htmlType="submit"
                    onClick={() => {
                        setButtonName("Save");
                        setIsDisabled(false);
                        if (buttonName == "Save") {
                            handleSubmit();
                            navigate("/");
                            window.location.reload(false);
                        }
                    }}
                >
                    {buttonName}
                </Button>
            </Form.Item>
        </Form>
    );
}
