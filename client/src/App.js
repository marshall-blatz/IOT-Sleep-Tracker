import { React } from "react";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="home"/>}/>
        <Route path="signup" element={<Signup />}/>
        <Route path="login" element={<Login />}/>
        <Route path="home" element={<Home />}/>
      </Routes>
    </>
  );
}

export default App;