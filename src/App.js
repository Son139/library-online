import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/AdminHome";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";

// import AuthProvider from "./components/Context/AuthProvider";
import View from "./pages/View/View";
import AddBook from "./pages/AddBook/AddBook";
import AppContext from "./components/context/AppProvider";
import AppSider from "./components/Header/Header";
import { Layout, Row } from "antd";
import AuthProvider from "./components/context/AuthProvider";
import UserHome from "./pages/Home/UserHome";
import BookDetail from "./pages/View/BookDetail";

function App() {
    return (
        <div className="App">
            <Router>
                <AuthProvider>
                    <AppContext>
                        <Routes>
                            <Route path="/addBook" element={<AddBook />} />
                            <Route path="/view/:id" element={<View />} />
                            <Route path="listbooks/book/:id" element={<BookDetail />} />

                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/listbooks" element={<UserHome />} />
                            <Route path="/listbooks/:category" element={<UserHome />} />
                        </Routes>
                    </AppContext>
                </AuthProvider>
            </Router>
        </div>
    );
}

export default App;
