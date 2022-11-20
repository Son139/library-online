import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";

import AuthProvider from "./components/Context/AuthProvider";
import View from "./pages/View/View";
import AddBook from "./pages/AddBook/AddBook";
import AppContext from "./components/Context/AppProvider";

function App() {
    return (
        <div className="App">
            <Router>
                <AuthProvider>
                    <AppContext>
                        <Routes>
                            <Route path="/addBook" element={<AddBook />} />
                            <Route path="/view/:id" element={<View />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/" element={<Home />} />
                        </Routes>
                    </AppContext>
                </AuthProvider>
            </Router>
        </div>
    );
}

export default App;
