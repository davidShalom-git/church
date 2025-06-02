import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Component/Home";
import Video from "./Component/Video";
import Images from "./Component/Images";

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/video" element={<Video />} />
                <Route path="/images" element={<Images />} />
            </Routes>
        </Router>
    );
}