import { Breadcrumb, Button, Col, Divider, Form, Image, Input, InputNumber, Layout, List, Menu, message, Rate, Row, Space, Tabs, Typography } from "antd";
import { Content, Header } from "antd/lib/layout/layout";
import { signOut } from "firebase/auth";
import React, { createElement, useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../components/context/AuthProvider";
import { auth } from "../../components/firebase/conflig";

import classNames from "classnames/bind";
import styles from "./DetailPage.module.sass";

import { AppContext } from "../../components/context/AppProvider";
import { async } from "@firebase/util";
import { addComment, getDocument, getUser, updateDocument } from "../../components/firebase/services";
import AppSider from "../../components/Header/Header";
import Title from "antd/es/skeleton/Title";
import { AddToCartButton } from "../Home/components";
import { AppCart } from "../../components/AppCart/AppCart";
import TextArea from "antd/es/input/TextArea";
import { LoginRequiredNofi } from "../../components/AppCart/LoginRequiredNotification";

const cx = classNames.bind(styles);
function BookDetail() {
    const navigate = useNavigate();
    const param = useParams();
    const { TextArea } = Input;
    const [book, setBook] = useState({});
    const [cart, setCart] = useState([]);
    const [comments, setComments] = useState([]);
    const [qty, setQty] = useState(1);
    const [form] = Form.useForm();
    const [notificationOpen, setNotificationOpen] = useState(false);
    const {
        user: { uid, displayName },
    } = useContext(AuthContext);

    useEffect(()=> {
      const fetchData = async () => {
        const book = await getDocument(param?.id, 'books');
        const cart = uid ? await getDocument(uid, "carts") : [];
        // await getUser(uid, 'users');
        return [book.data(), uid ? cart.data().books : cart];
      }
      fetchData().then((res) => {
        setBook(res[0]);
        setComments(res[0].comments.reverse())
        setCart(res[1]);
      });
    },[uid, cart])

    const handleClickAddToCartBtn = async () => {
      if (uid) {
        let books = cart;
        let indexBook = books.findIndex((b) => b.id === param?.id);
        if (indexBook >= 0) {
            books[indexBook].quantity = books[indexBook].quantity + qty;
        } else {
            books.push({id: param?.id, quantity: qty});
        }
        updateDocument(uid, {books: books}, "carts");
        setCart(books);
        message.success("Đã thêm vào giỏ hàng.")
      } else {
        setNotificationOpen(true);
      }
    }
    const validateText = (value) => value && value.trim() !== "";

    const handleSubmit = (value) => {
      if (uid) {
        if (value.rate > 0 && validateText(value.textArea)) {
          addComment(String(param?.id), {
            content: value.textArea,
            rate: value.rate,
            creator: displayName,
            createDate: new Date().toLocaleDateString(),
          }, 'books');
          const len = book.comments.length;
          const rate = (len*book.rating + value.rate)/(len+1);
          updateDocument(param?.id, {rating: (Math.round(rate * 10) / 10).toFixed(1)}, 'books');
          form.resetFields();
        } else {
          message.warning("Thiếu đánh giá sản phẩm.");
        }
      } else {
        setNotificationOpen(true)
      }
    }

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
                        <div style={{display: "flex", alignItems: "center"}}>
                          <AppCart uid={uid} cart={cart} setCart={setCart}/>

                          <h2 style={{ paddingRight: "24px" }}>
                              {displayName ? (
                                  `Xin chào - ${displayName}`
                              ) : (
                                  <Link to="/login">Đăng Nhập</Link>
                              )}
                          </h2>
                        </div>
                    </Header>
                    <Breadcrumb className={styles.breadcrumbStyle}>
                      <Breadcrumb.Item>
                        <a href="/listbooks">Trang chủ</a>
                      </Breadcrumb.Item>
                      <Breadcrumb.Item>
                        <a href={`/listbooks/${book.category}`}>{book.category}</a>
                      </Breadcrumb.Item>
                      <Breadcrumb.Item>{book.title}</Breadcrumb.Item>
                    </Breadcrumb>
                    <Content
                        className={cx("site-layout-background")}
                        style={{
                            margin: "24px 24px 24px 24px",
                            padding: 24,
                            minHeight: "100vh",
                        }}
                    >
                      <div className={styles.mainContent}>
                        <div className={styles.imageWrapper}>
                          <Image height={400} src={book.url}/>
                        </div>
                        <div className={styles.rightWrapper}>
                          <div>
                          <h1>{book.title}</h1>
                          <span>{book.author}</span>
                          </div>
                            <span className={styles.rateRow}>
                                <Rate style={{fontSize: "16px"}} allowHalf disabled value={book.rating}/>
                              <span className={styles.spanText}>{book.rating}</span>
                            </span>
                          <Divider/>
                          <h1>
                            {book?.price?.toLocaleString()}₫
                          </h1>
                          <Row style={{display:"flex", width:"100%"}} align="middle">
                            <Col style={{width:"20%"}}>
                            <span>Số lượng</span>
                            </Col>
                            <Col span={4}>
                              <Space.Compact className={styles.quantityInput}>
                                <Button onClick={()=> qty === 1 ? setQty(1) : setQty(qty-1)}>-</Button>
                                <InputNumber 
                                  style={{ width: 40 }} 
                                  controls={false} 
                                  min={1} 
                                  defaultValue={1} 
                                  value={qty} 
                                  onChange={(e)=> setQty(e)}
                                />
                                <Button onClick={()=> setQty(qty + 1)}>+</Button>
                              </Space.Compact>
                            </Col>
                          </Row>
                          <Button className={styles.addButton} onClick={handleClickAddToCartBtn}>Thêm vào giỏ</Button>
                          <LoginRequiredNofi notificationOpen={notificationOpen} setNotificationOpen={setNotificationOpen}/>
                          {/* <Typography.Paragraph className={styles.descripPara} ellipsis={{row:2, expandable:true, symbol:'more'}}>{book.description}</Typography.Paragraph> */}
                        </div>
                      </div>

                      <Tabs
                        defaultActiveKey="1"
                        type="card"
                        size="small"
                        items={[
                          {
                            label: 'Mô tả',
                            key: 1,
                            children: 
                              <div>
                                <Typography.Paragraph>
                                  {book.description}
                                </Typography.Paragraph>
                                  <table className={styles.tableStyle}>
                                    <tbody>
                                      <tr>
                                        <td>Tác giả</td>
                                        <td>{book.author}</td>
                                      </tr>
                                      <tr>
                                        <td>Ngày xuất bản</td>
                                        <td>{book.releaseDate}</td>
                                      </tr>
                                      <tr>
                                        <td>Số trang</td>
                                        <td>{book.page}</td>
                                      </tr>
                                    </tbody>
                                  </table>
                              </div>
                          },
                          {
                            label: 'Nhận xét',
                            key: 2,
                            children: 
                              <div style={{padding: "20px 45px"}}>
                                <Form form={form} onFinish={handleSubmit}>
                                  <h3>Đánh giá sản phẩm</h3>
                                  <Form.Item name="rate">
                                    <Rate onChange={(e)=> console.log(e)}></Rate>
                                  </Form.Item>
                                  <h3>Bình luận</h3>
                                  <Form.Item name="textArea">
                                    <TextArea
                                      placeholder="Nhập nhận xét của bạn..."
                                      autoComplete={{}}
                                      autoSize={{
                                        minRows: 2,
                                        maxRows: 6,
                                      }}
                                    />
                                  </Form.Item>
                                  <Button htmlType="submit" style={{float: "right"}} className={styles.addButton}>Gửi</Button>
                                </Form>
                                <div className={styles.listComments}>
                                <h3>Đánh giá sách: {book.title}</h3>
                                <List
                                  itemLayout="horizontal"
                                  pagination={{
                                    pageSize: 6,
                                  }}
                                  dataSource={comments}
                                  renderItem={(item) => (
                                    <List.Item>
                                      <List.Item.Meta
                                        title={<span>{item.creator}</span>}
                                        description={
                                        <div><Row style={{width: "100%"}}>
                                          <Rate style={{fontSize: "15px"}} disabled={true} value={item.rate}></Rate>
                                          <span>{item.createDate}</span>
                                          </Row>
                                          <span>{item.content}</span>
                                        </div>}
                                      />
                                    </List.Item>
                                  )}
                                />
                                </div>
                              </div>
                          }
                        ]}
                      />
                    </Content>
                </Layout>
            </Row>
        </Layout>
    );
}

export default BookDetail;
