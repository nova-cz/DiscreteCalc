import logo from "./logo.svg";
import Navbar from "./components/layout/navbar/Navbar";
import "./App.css";
import Home from "./pages/Home";
import Footer from "./components/layout/footer/Footer.js";
import Calculator from "./pages/Calculator";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="calculadora/*" element={<Calculator />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
