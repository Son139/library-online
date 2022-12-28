import { Layout, Menu, Row, Table } from "antd";
import { Content, Header } from "antd/lib/layout/layout";
import { signOut } from "firebase/auth";
import React, { createElement, useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../components/context/AuthProvider";
import { auth } from "../../components/firebase/conflig";

import classNames from "classnames/bind";
import styles from "./Home.module.sass";

import { AppContext } from "../../components/context/AppProvider";
import AppSider from "../../components/Header/Header";

const cx = classNames.bind(styles);
function Home() {
    const navigate = useNavigate();
    const { books, columns } = useContext(AppContext);
    const {
        user: { displayName },
        itemMenu,
    } = useContext(AuthContext);
    const [collapsed, setCollapsed] = useState(false);
    // const [isDisabled, setIsDisabled] = useState(true);

    const handleLogOut = () => {
        signOut(auth);
    };
    // useEffect(() => {
    //     if (displayName) setIsDisabled(false);
    // }, [displayName]);

    return (
        <Layout>
            <Row>
                <AppSider />
                <Layout className={cx("site-layout")}>
                    <Header
                        className={cx("site-layout-background")}
                        style={{
                            padding: 0,
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <h2 style={{ paddingLeft: "24px" }}>
                            THƯ VIỆN SÁCH ONLINE
                        </h2>
                        <h2 style={{ paddingRight: "24px" }}>
                            {displayName ? (
                                `Xin chào - ${displayName}`
                            ) : (
                                <Link to="/login">Đăng Nhập</Link>
                            )}
                        </h2>
                    </Header>
                    <Content
                        className={cx("site-layout-background")}
                        style={{
                            margin: "24px 24px 24px 24px",
                            padding: 24,
                            height: "100vh",
                        }}
                    >
                        <Table
                            pagination={{ pageSize: 8 }}
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
