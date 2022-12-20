import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    createUserWithEmailAndPassword,
    getAdditionalUserInfo,
    updateProfile,
} from "firebase/auth";

import InputControl from "../../components/InputControl/InputControl";
import { auth } from "../../components/firebase/conflig";

import styles from "./Signup.module.sass";
import classNames from "classnames/bind";
import { faEnvelope, faKey, faUser } from "@fortawesome/free-solid-svg-icons";
import { addDocument } from "../../components/firebase/services";

const cx = classNames.bind(styles);

function Signup() {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        name: "",
        email: "",
        pass: "",
    });

    const [errorMsg, setErrorMsg] = useState("");
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

    const handleSubmission = () => {
        if (!values.name || !values.email || !values.pass) {
            setErrorMsg("Vui lòng điền đủ thông tin!!!");
            return;
        }
        setErrorMsg("");

        setSubmitButtonDisabled(true);
        createUserWithEmailAndPassword(auth, values.email, values.pass)
            .then(async (res) => {
                setSubmitButtonDisabled(false);
                const user = res.user;
                await updateProfile(user, {
                    displayName: values.name,
                });
                const data = getAdditionalUserInfo(res);

                if (data.isNewUser) {
                    addDocument("users", {
                        displayName: res.user.displayName,
                        email: res.user.email,
                        uid: res.user.uid,
                    });
                }

                navigate("/login");
            })
            .catch((err) => {
                setSubmitButtonDisabled(false);
                setErrorMsg("Tài khoản đẫ tồn tại!!!");
            });
    };

    return (
        <div className={cx("container")}>
            <div className={cx("innerBox")}>
                <div className={cx("signup-form")}>
                    <h1 className={cx("heading")}>Đăng ký</h1>

                    <InputControl
                        type="text"
                        icon={faUser}
                        placeholder="Nhập Tên"
                        onChange={(event) =>
                            setValues((prev) => ({
                                ...prev,
                                name: event.target.value,
                            }))
                        }
                    />
                    <InputControl
                        type="email"
                        icon={faEnvelope}
                        placeholder="Nhập Email"
                        onChange={(event) =>
                            setValues((prev) => ({
                                ...prev,
                                email: event.target.value,
                            }))
                        }
                    />
                    <InputControl
                        type="password"
                        icon={faKey}
                        placeholder="Nhập Password"
                        onChange={(event) =>
                            setValues((prev) => ({
                                ...prev,
                                pass: event.target.value,
                            }))
                        }
                    />

                    <InputControl
                        type="password"
                        icon={faKey}
                        placeholder="Nhập Lại Password"
                        onChange={(event) =>
                            setValues((prev) => ({
                                ...prev,
                                pass: event.target.value,
                            }))
                        }
                    />

                    <b className={cx("error")}>{errorMsg}</b>
                    <button
                        onClick={handleSubmission}
                        disabled={submitButtonDisabled}
                    >
                        Đăng Ký
                    </button>
                </div>

                <div className={cx("signup-image")}>
                    <figure>
                        <img src="images/signup-image.jpg" alt="singinImg" />
                    </figure>
                    <p>
                        Bạn Đã Có Tài Khoản ?{" "}
                        <span>
                            <Link to="/login">Đăng Nhập</Link>
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Signup;
