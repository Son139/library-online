import { ShoppingCartOutlined } from "@ant-design/icons";
import {
  Badge,
  Button,
  Checkbox,
  Drawer,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Table,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import {
  deleteItemInCart,
  getDocument,
  updateDocument,
} from "../firebase/services";

import styles from "../../pages/Home/Home.module.sass";
import {LoginRequiredNofi} from "./LoginRequiredNotification";
export function ItemQuantity({
  uid,
  cart,
  setCart,
  cartItems,
  setCartItems,
  quantity,
  record,
}) {
  const [qty, setQty] = useState(0);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const confirm = () => {
    let index = cart.findIndex((item) => record.id === item.id);
    deleteItemInCart(uid, cart[index], "carts");

    setCart((prev => prev.filter((item) => item.id!== record.id)));
    setCartItems(prev => prev.filter((item) => item.id !== record.id));

    setOpenConfirmDialog(false);
    message.info("Đã xóa sách khỏi giỏ hàng.");
  };

  useEffect(() => {
    setQty(quantity);
  }, [quantity]);
  

  const cancel = () => {
    handleValueChange(1);
    setOpenConfirmDialog(false);
  };

  const handleValueChange = (value) => {
    setQty(value);
    setCartItems((pre) =>
      pre.map((cart) => {
        if (record.id === cart.id) {
          cart.total = Number(cart.price) * value;
        }
        return cart;
      })
    );
    let index = cart.findIndex((b) => b.id === record.id);
    cart[index].quantity = value;
    updateDocument(uid, { books: cart }, "carts");
    setCart(cart);
  };
  return (
    <Popconfirm
      title="Delete this item?"
      onConfirm={confirm}
      onCancel={cancel}
      open={openConfirmDialog}
    >
      <InputNumber
        min={0}
        type="number"
        parser={(x) =>
          parseFloat(
            `${x}`.replace(/,/, "#").replace(/\./g, "").replace(/#/, ".")
          )
        }
        defaultValue={quantity}
        value={qty}
        onChange={(value) => {
          if (value === 0) {
            setOpenConfirmDialog(true);
          } else {
            handleValueChange(value);
          }
        }}
      ></InputNumber>
    </Popconfirm>
  );
}

export function AppCart({ uid, cart, setCart }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [cartNotificationOpen, setCartNotificationOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkoutDrawerOpen, setCheckoutDrawerOpen] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let tempItems = [];
        for (const item of cart) {
          const getBook = await getDocument(item.id, "books");
          const bookInfo = getBook.data();
          tempItems.push({
            id: item.id,
            title: bookInfo.title,
            price: bookInfo.price,
            quantity: item.quantity,
            total: Number(bookInfo.price) * Number(item.quantity),
          });
        }
        return tempItems;
      } catch (error) {
        console.log(error);
      }
    };
    fetchData().then((res) => {
      setCartItems(res);
      setLoading(false);
    });
  }, [cart]);
  const onConfirmOrder = (value) => {
    setCartDrawerOpen(false);
    setCheckoutDrawerOpen(false);
    message.success("Bạn đã đặt hàng thành công.");
  };
  return (
    <div className={styles["cartWrapper"]}>
      <Badge
        className={styles["shoppingCartIcon"]}
        count={cartItems.length}
        onClick={() => {
          uid ? setCartDrawerOpen(true) : setCartNotificationOpen(true);
        }}
      >
        <ShoppingCartOutlined />
      </Badge>
      <LoginRequiredNofi notificationOpen={cartNotificationOpen} setNotificationOpen={setCartNotificationOpen}/>
      <Drawer
        open={cartDrawerOpen}
        onClose={() => {
          setCartDrawerOpen(false);
        }}
        title="Giỏ hàng của bạn"
        contentWrapperStyle={{ width: 500 }}
      >
        <Table
          columns={[
            {
              title: "Tên sản phẩm",
              dataIndex: "title",
            },
            {
              title: "Giá",
              dataIndex: "price",
              render: (price) => <span>{price}₫</span>,
            },
            {
              title: "Số lượng",
              dataIndex: "quantity",
              render: (quantity, record) => (
                <ItemQuantity
                  uid={uid}
                  cart={cart}
                  setCart={setCart}
                  cartItems={cartItems}
                  setCartItems={setCartItems}
                  quantity={quantity}
                  record={record}
                />
              ),
            },
            {
              title: "Tổng",
              dataIndex: "total",
              render: (value) => <span>{value}₫</span>,
            },
          ]}
          summary={(data) => {
            const total = data.reduce((acc, cur) => acc + cur.total, 0);
            return (
              <tr>
                <td>Tổng</td>
                <td>{`${total ? total : 0}`}₫</td>
              </tr>
            );
          }}
          dataSource={cartItems}
          pagination={false}
          rowKey="id"
        />
        <Button
          onClick={() => {
            setCheckoutDrawerOpen(true);
          }}
          type="primary"
        >
          Checkout Your Cart
        </Button>
      </Drawer>
      <Drawer
        open={checkoutDrawerOpen}
        onClose={() => {
          setCheckoutDrawerOpen(false);
        }}
        title="Confirm Order"
      >
        <Form onFinish={onConfirmOrder}>
          <Form.Item
            rules={[
              {
                required: true,
                message: "Hãy nhập tên đầy đủ của bạn",
              },
            ]}
            label="Tên của bạn"
            name="fullname"
          >
            <Input placeholder="Nhập tên đầy đủ của bạn.." />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                type: "email",
                message: "Hãy nhập email của bạn",
              },
            ]}
            label="Email"
            name="email"
          >
            <Input placeholder="Nhập địa chỉ cần giao hàng.." />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: "Hãy nhập địa chỉ cần giao hàng",
              },
            ]}
            label="Địa chỉ"
            name="address"
          >
            <Input placeholder="Nhập địa chỉ của bạn.." />
          </Form.Item>
          <Form.Item>
            <Checkbox defaultChecked disabled>
              Cash on Delivery
            </Checkbox>
          </Form.Item>
          <Typography.Paragraph type="secondary">
            More methods coming soon
          </Typography.Paragraph>
          <Button type="primary" htmlType="submit">
            {" "}
            Confirm Order
          </Button>
        </Form>
      </Drawer>
    </div>
  );
}
