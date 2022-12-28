import { Modal } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function LoginRequiredNofi({notificationOpen, setNotificationOpen}) {

  const navigate = useNavigate();
  const handleOk = () => {
    setNotificationOpen(false);
    navigate("/login");
  };
  const handleCancel = () => {
    setNotificationOpen(false);
  };
  return <div>
    <Modal title="Cảnh báo" open={notificationOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>Vui lòng đăng nhập!!!!</p>
      </Modal>
  </div>
}