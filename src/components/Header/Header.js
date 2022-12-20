import { Menu } from "antd";
import Sider from "antd/lib/layout/Sider";
import { signOut } from "firebase/auth";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthProvider";
import { auth } from "../firebase/conflig";

export default function AppHeader() {
    const navigate = useNavigate();

    const { itemMenu } = useContext(AuthContext);
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
    return (
        <Sider trigger={null} collapsible style={{ width: "100%" }}>
            <div
                style={{
                    height: "32px",
                    margin: "16px",
                    background: " rgba(255, 255, 255, 0.3)",
                }}
            />
            <Menu
                onClick={handleClickMenu}
                theme="dark"
                mode="inline"
                defaultSelectedKeys={"/" || [window.location.pathname]}
                items={itemMenu}
            />
            {/* <SiderApp inlineCollapsed={collapsed} items={itemMenu} /> */}
        </Sider>
    );
}
