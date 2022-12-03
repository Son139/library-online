import { Avatar, Typography } from "antd";
import React, { useContext } from "react";
import { AuthContext } from "../Context/AuthProvider";

import styles from "./UserInfo.module.sass";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);
export default function UserInfo() {
    const {
        user: { displayName },
    } = useContext(AuthContext);
    return (
        <div className={cx("wrap")}>
            <Avatar src="https://vtv1.mediacdn.vn/thumb_w/650/2022/8/12/87220-16602729064483119334.jpeg"></Avatar>
            <Typography.Text className={cx("user")}>
                {displayName}
            </Typography.Text>
        </div>
    );
}
