import { Layout, Menu, Row, Table } from "antd";
import { Content, Header } from "antd/lib/layout/layout";
import { signOut } from "firebase/auth";
import React, { createElement, useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../components/Context/AuthProvider";
import { auth } from "../../components/firebase/conflig";

import classNames from "classnames/bind";
import styles from "./Home.module.sass";

import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { AppContext } from "../../components/Context/AppProvider";
import Sider from "antd/lib/layout/Sider";
import SiderApp from "../../components/Sider/Sider";

const cx = classNames.bind(styles);
function UserHome() {
    const navigate = useNavigate();
    const { books, columns } = useContext(AppContext);
    const {
        user: { displayName },
        itemMenu,
    } = useContext(AuthContext);
    const [collapsed, setCollapsed] = useState(false);
    // const [isDisabled, setIsDisabled] = useState(true);

    const handleClickMenu = ({ key }) => {
        if (key === "/signout") {
            handleLogOut();
            setTimeout(() => {
                window.location.reload();
            }, 500);
        } else {
            navigate(key);
        }
    };

    const handleLogOut = () => {
        signOut(auth);
    };
    // useEffect(() => {
    //     if (displayName) setIsDisabled(false);
    // }, [displayName]);

    return (
        <Layout>
            <Row>
                <Sider
                    trigger={null}
                    collapsible
                    collapsed={collapsed}
                    style={{ display: "fixed" }}
                >
                    <div className={cx("logo")} />
                    <Menu
                        onClick={handleClickMenu}
                        inlineCollapsed={collapsed}
                        theme="dark"
                        mode="inline"
                        defaultSelectedKeys={"/" || [window.location.pathname]}
                        items={itemMenu}
                    />
                    {/* <SiderApp inlineCollapsed={collapsed} items={itemMenu} /> */}
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

export default UserHome;
