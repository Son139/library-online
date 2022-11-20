import { Button, Form, Layout, Menu, Row, Table } from "antd";
import "antd/dist/antd.css";
import { Content, Header } from "antd/lib/layout/layout";
import { signOut } from "firebase/auth";
import React, { createElement, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../components/Context/AuthProvider";
import { auth } from "../../components/firebase/conflig";

import classNames from "classnames/bind";
import styles from "./Home.module.sass";

import {
    LoginOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import Sider from "antd/lib/layout/Sider";
import { AppContext } from "../../components/Context/AppProvider";

const cx = classNames.bind(styles);

function Home() {
    const navigate = useNavigate();
    const {
        user: { displayName },
    } = useContext(AuthContext);

    const { books, columns } = useContext(AppContext);

    const handleLogOut = () => {
        signOut(auth);
        navigate("/login");
    };

    const items = [
        {
            key: "1",
            icon: <UserOutlined />,
            label: "Sơn",
        },
        {
            key: "/login",
            icon: <LoginOutlined />,
            label: "Đăng Nhập",
        },
        {
            key: "/signup",
            icon: <LoginOutlined />,
            label: "Đăng Ký",
        },
        {
            key: "/signout",
            icon: <LogoutOutlined />,
            label: "Đăng Xuất",
        },
    ];

    const [collapsed, setCollapsed] = useState(false);

    return (
        <Layout>
            <Row>
                <Sider trigger={null} collapsible collapsed={collapsed}>
                    <div className={cx("logo")} />
                    <Menu
                        onClick={({ key }) => {
                            if (key === "/signout") {
                                handleLogOut();
                            } else {
                                navigate(key);
                            }
                        }}
                        inlineCollapsed={collapsed}
                        theme="dark"
                        mode="inline"
                        defaultSelectedKeys={[window.location.pathname]}
                        items={items}
                    />
                </Sider>
                <Layout className={cx("site-layout")}>
                    <Header
                        className={cx("site-layout-background")}
                        style={{
                            padding: 0,
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        {createElement(
                            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                            {
                                className: cx("trigger"),
                                onClick: () => setCollapsed(!collapsed),
                            },
                        )}
                        <h2>THƯ VIỆN SÁCH ONLINE</h2>
                        <h2 style={{ paddingRight: "24px" }}>
                            {displayName
                                ? `Welcome - ${displayName}`
                                : "Login please"}
                        </h2>
                    </Header>
                    <Form>
                        <Form.Item>
                            <Button
                                icon={<PlusOutlined />}
                                type="primary"
                                value="large"
                                onClick={() => {
                                    navigate("/addBook");
                                }}
                                style={{
                                    margin: "24px 24px 0 24px",
                                    padding: "12px 24px 36px 24px",
                                    borderRadius: "6px",
                                }}
                            >
                                Thêm Sách
                            </Button>
                        </Form.Item>
                    </Form>
                    <Content
                        className={cx("site-layout-background")}
                        style={{
                            margin: "0 24px 24px 24px",
                            padding: 24,
                            height: "100%",
                        }}
                    >
                        <Table
                            dataSource={books}
                            bordered
                            columns={columns}
                        ></Table>
                    </Content>
                </Layout>
            </Row>
        </Layout>
    );
}

export default Home;
