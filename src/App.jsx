import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Dog from "./Dog";
import Cat from "./Cat";
import Login from "./Login";
import './App.css'; // Import custom CSS file

const App = () => {
  // Check if user is logged in by verifying localStorage
  const isLoggedIn = localStorage.getItem("username") && localStorage.getItem("password");

  return (
    <Router>
      <Routes>
        {/* If not logged in, redirect to login page */}
        <Route path="/" element={isLoggedIn ? <Navigate to="/app" /> : <Login />} />
        {/* App page with pet selection */}
        <Route
          path="/app"
          element={
            <div className="app-container">
              <h1 className="title">Pet Information</h1>
              <div className="button-container">
                <a href="/dog">
                  <button className="btn">Dog</button>
                </a>
                <a href="/cat">
                  <button className="btn">Cat</button>
                </a>
              </div>
            </div>
          }
        />
        {/* Dog and Cat routes */}
        <Route path="/dog" element={<Dog />} />
        <Route path="/cat" element={<Cat />} />
      </Routes>
    </Router>
  );
};

export default App;