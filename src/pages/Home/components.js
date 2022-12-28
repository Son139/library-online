import { Button, message } from "antd";
import { useState } from "react";

export function AddToCartButton({ item, addToCart }) {
  const [loading, setLoading] = useState(false);
  const addBookToCart = () => {
    setLoading(true);
    addToCart(item).then((res) => {
      message.success(`Đã thêm ${item.title} vào giỏ.`);
      setLoading(false);
    });
  };

  return (
    <Button type="link" onClick={addBookToCart} loading={loading}>
      Thêm vào giỏ
    </Button>
  );
}