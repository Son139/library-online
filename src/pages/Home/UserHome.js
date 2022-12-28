import { Card, Image, Layout, List, Menu, Rate, Row, Typography } from "antd";
import { Content, Header } from "antd/lib/layout/layout";
import { signOut } from "firebase/auth";
import React, {useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../components/context/AuthProvider";
import { auth } from "../../components/firebase/conflig";

import classNames from "classnames/bind";
import styles from "./Home.module.sass";

import { AppContext } from "../../components/context/AppProvider";
import AppSider from "../../components/Header/Header";
import { getDocument, updateDocument } from "../../components/firebase/services";
import { AppCart } from "../../components/AppCart/AppCart";
import { AddToCartButton } from "./components";

const cx = classNames.bind(styles);
function UserHome() {
    const [cart, setCart] = useState([]);
    const [items, setItems] = useState();
    const navigate = useNavigate();
    const { books } = useContext(AppContext);
    const {
        user: { uid, displayName },
    } = useContext(AuthContext);
    const param = useParams();


    const handleLogOut = () => {
        signOut(auth);
    };
    const fetchData = async () => {
        const cart = await getDocument(uid, "carts");
        return cart.data().books;
    }
    const onClick = (e) => {
        navigate(`/listbooks/${e.key}`);
        // setCurrent(e.key);
      };
    useEffect(()=>{
        fetchData().then(books=>{setCart(books)})
        param?.category ? setItems(books.filter(b => b.category === param.category)) : setItems(books);
    },[books, param, uid])

    const addToCart = async (book) => {
        if (uid !== null) {
            const cart = await getDocument(uid, "carts");
            let books = cart.data().books;
            let indexBook = books.findIndex((b) => b.id === book.id);
            if (indexBook >= 0) {
                books[indexBook].quantity = books[indexBook].quantity + 1;
            } else {
                books.push({id: book.id, quantity: 1});
            }
            updateDocument(uid, {books: books}, "carts");
            setCart(books);
            
        } else {
            console.log("uid is null");
        }
    }

    return (
        <Layout className={styles.layoutStyle}>
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
                        <div style={{ display: "flex" }}>
                        
                        <h2 style={{ paddingLeft: "24px" }}>
                            THƯ VIỆN SÁCH ONLINE
                        </h2>
                        <Menu
                            mode="horizontal"
                            items={[
                                {
                                    label:"Thể loại",
                                    key: "categories",
                                    children:[
                                        {
                                            label: "Hài hước",
                                            key: "Hài hước"
                                        },
                                        {
                                            label: "Trinh thám",
                                            key: "Trinh thám"
                                        },
                                        {
                                            label: "Kì bí",
                                            key: "Kì bí"
                                        },
                                        {
                                            label: "Viễn tưởng",
                                            key: "Viễn tưởng"
                                        }
                                    ]
                                }
                            ]}
                            onClick={onClick}>
                        </Menu>
                        </div>
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
                    <Content
                        className={cx("site-layout-background")}
                        style={{
                            margin: "24px 24px 24px 24px",
                            padding: 24,
                            minHeight: "100vh",
                        }}
                    >
                        <List 
                        grid={{column:3}}
                        renderItem={(book, index) => {
                            return <Card className="itemCard"
                                    onClick={(e)=> navigate(`/listbooks/book/${book.id}`)}
                                    title={book.title} 
                                    key={index} 
                                    cover={<Image className="itemCardImage" height="150px" src={book.url}/>}
                                    actions={[
                                        <Rate allowHalf disabled value={book.rating}/>,
                                        <AddToCartButton item={book} addToCart={addToCart}/>
                                    ]}
                                    >
                                    
                                        <Card.Meta 
                                        title={
                                            <Typography.Paragraph>
                                              Giá: {book.price}₫
                                            </Typography.Paragraph>
                                          }
                                        description={<Typography.Paragraph ellipsis={{row:2, expandable:true, symbol:'more'}}>{book.description}</Typography.Paragraph>}>

                                        </Card.Meta>
                                    </Card>
                        }} 
                        dataSource={items}
                        pagination={{
                            onChange: (page) => {
                              console.log(page);
                            },
                            pageSize: 6,
                          }}
                          >

                        </List>
                        </Content>
                </Layout>
            </Row>
        </Layout>
    );
}


export default UserHome;
