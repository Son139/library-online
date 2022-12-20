import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    signInWithEmailAndPassword,
} from "firebase/auth";

import styles from "./Login.module.sass";
import { auth } from "../../components/firebase/conflig";
import InputControl from "../../components/InputControl/InputControl";
import classNames from "classnames/bind";
import { faEnvelope, faKey } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);

function Login() {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        email: "",
        pass: "",
    });
    const [errorMsg, setErrorMsg] = useState("");
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

    const handleSubmit = () => {
        if (!values.email || !values.pass) {
            setErrorMsg("Fill all fields");
            return;
        }
        setErrorMsg("");

        setSubmitButtonDisabled(true);

        signInWithEmailAndPassword(auth, values.email, values.pass)
            .then(async (res) => {
                setSubmitButtonDisabled(false);
                // check new user

                navigate("/");
            })
            .catch((err) => {
                setSubmitButtonDisabled(false);
                setErrorMsg("Sai mật khẩu hoặc tài khoản!!!");
            });
    };
    return (
        <div className={cx("container")}>
            <div className={cx("innerBox")}>
                <div className={cx("signin-image")}>
                    <figure>
                        <img src="images/signin-image.jpg" alt="singinImg" />
                    </figure>
                    <p>
                        Tạo Tài Khoản ?{" "}
                        <span>
                            <Link to="/signup">Đăng Ký</Link>
                        </span>
                    </p>
                </div>
                <div className={cx("singin-form")}>
                    <h1 className={cx("heading")}>Đăng Nhập</h1>

                    <InputControl
                        icon={faEnvelope}
                        onChange={(event) =>
                            setValues((prev) => ({
                                ...prev,
                                email: event.target.value,
                            }))
                        }
                        placeholder="Nhập Email"
                    />

                    <InputControl
                        icon={faKey}
                        onChange={(event) =>
                            setValues((prev) => ({
                                ...prev,
                                pass: event.target.value,
                            }))
                        }
                        placeholder="Nhập Password"
                    />
                    <b className={cx("error")}>{errorMsg}</b>
                    <button
                        disabled={submitButtonDisabled}
                        onClick={handleSubmit}
                    >
                        Đăng Nhập
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;
