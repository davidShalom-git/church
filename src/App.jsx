import React from "react";
import Home from "./Component/Home";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Video from "./Component/Video";



export default function App() {
  return (
    <>
      <Router>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/video" element={<Video />} />
          
        </Routes>
  
      </Router>
    </>
  );
}