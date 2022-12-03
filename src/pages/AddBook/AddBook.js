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
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addDocument } from "../../components/firebase/services";

import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../components/firebase/conflig";
import moment from "moment";
import { Footer } from "antd/es/layout/layout";
import { AppContext } from "../../components/Context/AppProvider";

export default function AddBook() {
    const dateFormat = "DD/MM/YYYY";
    const categoryList = ["Hài hước", "Trinh thám", "Kì bí", "Viễn tưởng"];
    const [form] = Form.useForm();

    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [description, setDescription] = useState("");
    const [page, setPage] = useState("");
    const [category, setCategory] = useState("");
    const [releaseDate, setReleaseDate] = useState("");
    const [image, setImage] = useState(null);
    const [url, setUrl] = useState(null);
    const [sizeImage, setSizeImage] = useState(0);

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
            console.log(image);
        }
    };
    const uploadImg = () => {
        if (image.name !== null) {
            const storageRef = ref(storage, `images/${image.name}`);
            console.log(image);

            uploadBytes(storageRef, image)
                .then(() => {
                    getDownloadURL(storageRef)
                        .then((url) => {
                            setUrl(url);
                            setSizeImage(500);
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

    const handleSubmit = async (res) => {
        const newBook = {
            title,
            author,
            description,
            page,
            releaseDate,
            category,
            url,
        };

        const checkBook = books.find(
            (book) => book.title === newBook.title.trim(),
        );

        if (checkBook) {
            openNotificationWithIcon("error", "Sách đã tồn tại!!!");
            return;
        } else {
            await addDocument("books", newBook);
            openNotificationWithIcon("success", "Thêm sách thành công!!!");
            // setTimeout(() => {
            //     window.location.reload(true);
            // }, 500);
        }
        console.log(books);
    };

    return (
        <Form
            form={form}
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
            style={{
                margin: "50px 190px 0",
                background: "rgb(220 220 220 / 10%)",
                padding: "50px 0 0 0",
                borderRadius: "10px",
                boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
            }}
        >
            <Row
                style={{
                    display: "flex",
                    padding: "0 0 50px 100px",
                }}
            >
                <Col span={14}>
                    <Row justify="center">
                        <Col span={12}>
                            <Form.Item
                                name="title"
                                label="Tiêu Đề: "
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: "Điền tiêu đề",
                                    },
                                ]}
                            >
                                <Input
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="author"
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
                            name="description"
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
                                // initialValue={undefined}
                            >
                                <DatePicker
                                    style={{ width: "100%" }}
                                    onChange={(date, dateString) =>
                                        setReleaseDate(dateString)
                                    }
                                    format={dateFormat}
                                />
                            </Form.Item>
                            <Form.Item
                                name="category"
                                label="Thể loại"
                                hasFeedback
                            >
                                <Select
                                    options={categoryList.map(
                                        (categoryItem) => ({
                                            value: `${categoryItem}`,
                                            label: `${categoryItem}`,
                                        }),
                                    )}
                                    onChange={(value) => {
                                        setCategory(value);
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                hasFeedback
                                name="page"
                                label="Số Trang: "
                            >
                                <Input
                                    type="number"
                                    onChange={(e) => setPage(e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Footer style={{ width: "100%", paddingTop: "10px" }}>
                        {contextHolder}
                        <Row>
                            <Button
                                style={{ width: "80px" }}
                                type="primary"
                                htmlType="submit"
                                size="large"
                            >
                                Save
                            </Button>
                            <Button
                                style={{ width: "80px", marginLeft: 20 }}
                                type="primary"
                                size="large"
                                onClick={() => {
                                    navigate("/");
                                }}
                            >
                                Back
                            </Button>
                        </Row>
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
                            <Input type="file" onChange={handleImageChange} />
                            <Button onClick={uploadImg}>Submit</Button>
                        </div>
                        <Image
                            src={url}
                            width="80%"
                            style={{ marginTop: "20px" }}
                        />
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
}
