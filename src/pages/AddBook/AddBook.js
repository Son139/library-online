import { Button, Col, DatePicker, Form, Input, Row, Select } from "antd";
import TextArea from "antd/lib/input/TextArea";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../components/Context/AppProvider";
import { addDocument } from "../../components/firebase/services";
import UploadImage from "../../components/UploadImage/UploadImage";

export default function AddBook({ id, setBookId }) {
    const [inputValue, setInputValue] = useState("");
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [description, setDescription] = useState("");
    const [page, setPage] = useState("");
    const [category, setCategory] = useState("");
    const [releaseDate, setReleaseDate] = useState("");

    const { books } = useContext(AppContext);
    console.log(books);

    const categoryList = ["Hài hước", "Trinh thám", "Kì bí", "Viễn tưởng"];
    const handleSubmit = async () => {
        const newBook = {
            title,
            author,
            description,
            page,
            releaseDate,
            category,
        };

        await addDocument("books", newBook);
        // setMessage({ error: false, msg: "New Book added successfully!" });

        setTitle("");
        setAuthor("");
        setDescription("");
        setReleaseDate("");
        setPage("");
        setCategory("");
    };

    const handleChange = (value) => {
        setCategory(value);
    };

    const dateFormat = "DD/MM/YYYY";
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
                                name="title"
                                label="Tiêu Đề: "
                                rules={[
                                    { required: true, message: "Điền tiêu đề" },
                                ]}
                            >
                                <Input
                                    placeholder="Tiêu Đề"
                                    type="text"
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="author"
                                label="Tác Giả: "
                                rules={[
                                    { required: true, message: "Điền tác giả" },
                                ]}
                            >
                                <Input
                                    placeholder="Tác Giả"
                                    type="text"
                                    onChange={(e) => setAuthor(e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        wrapperCol={{
                            span: 20,
                        }}
                        name="description"
                        label="Mô tả về sách: "
                    >
                        <TextArea
                            placeholder="Mô tả về sách"
                            rows={6}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Form.Item>

                    <Row>
                        <Col span={12}>
                            <Form.Item
                                name="releaseDate"
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
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="page" label="Số Trang: ">
                                <Input
                                    placeholder="Số trang"
                                    type="number"
                                    onChange={(e) => setPage(e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Col span={12}>
                        <Form.Item
                            label="Thể Loại: "
                            hasFeedback
                            name="category"
                        >
                            <Select
                                defaultValue={`${categoryList[0]}`}
                                options={categoryList.map((categoryItem) => ({
                                    value: `${categoryItem}`,
                                    label: `${categoryItem}`,
                                }))}
                                onChange={handleChange}
                            />
                        </Form.Item>
                    </Col>
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
                    onClick={() => {
                        // handleSubmit();
                        // navigate("/");
                        // window.location.reload(false);
                    }}
                    htmlType="submit"
                >
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
}
