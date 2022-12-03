import { Button, Form, Layout, Menu, Row, Table } from "antd";
import { Content, Header } from "antd/lib/layout/layout";
import { signOut } from "firebase/auth";
import React, { createElement, useContext, useEffect, useState } from "react";
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
    const {
        user: { displayName },
    } = useContext(AuthContext);
    const [collapsed, setCollapsed] = useState(false);
    const [isDisabled, setIsDisabled] = useState(true);
    const items = [
        {
            key: "/login",
            icon: <LoginOutlined />,
            label: "Đăng Nhập",
        },
    ];

    const navigate = useNavigate();

    const { books, columns } = useContext(AppContext);
    const handleLogOut = () => {
        signOut(auth);
        items.shift({
            key: "user",
            icon: <UserOutlined />,
            label: `${displayName}`,
        });
    };
    useEffect(() => {
        if (displayName) setIsDisabled(false);
    }, [displayName]);

    if (displayName) {
        items.unshift(
            {
                key: "user",
                icon: <UserOutlined />,
                label: `${displayName}`,
            },
            {
                key: "/signout",
                icon: <LogoutOutlined />,
                label: "Đăng Xuất",
            },
        );
        items.pop({
            key: "/login",
            icon: <LoginOutlined />,
            label: "Đăng Nhập",
        });
    }

    return (
        <Layout>
            <Row>
                <Sider trigger={null} collapsible collapsed={collapsed}>
                    <div className={cx("logo")} />
                    <Menu
                        onClick={({ key }) => {
                            if (key === "/signout") {
                                handleLogOut();
                                setTimeout(() => {
                                    window.location.reload();
                                }, 500);
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
                                disabled={isDisabled}
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
                            pagination={{ pageSize: 7 }}
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
