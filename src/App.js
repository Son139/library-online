import './App.css';
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Home from './component/home/Home';
import Signup from './component/signup/Signup';
import Login from './component/login/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Login/>} path="/login"></Route>
        <Route element={<Signup/>} path="/signup"></Route>
        <Route element={<Home/>} path="/"></Route>
      </Routes>
    </Router>
  );
}

export default App;
