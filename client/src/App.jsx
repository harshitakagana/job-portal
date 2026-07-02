import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Jobs from "./pages/Jobs";
import MyApplications from "./pages/MyApplications";
import EmployerDashboard from "./pages/EmployerDashboard";

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav style={{ padding: 16, borderBottom: "1px solid #ccc", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <span style={{ fontWeight: "bold", fontSize: 20, color: "#2563eb", marginRight: 24 }}>
          Careerhub
        </span>
        <Link to="/jobs" style={{ marginRight: 16 }}>Jobs</Link>
        {user?.role === "jobseeker" && (
          <Link to="/my-applications" style={{ marginRight: 16 }}>My Applications</Link>
        )}
        {user?.role === "employer" && (
          <Link to="/employer" style={{ marginRight: 16 }}>Employer Dashboard</Link>
        )}
      </div>
      <div>
        {user ? (
          <>
            <span style={{ marginRight: 16 }}>Hi, {user.name}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ marginRight: 16 }}>Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/jobs" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/my-applications" element={<MyApplications />} />
        <Route path="/employer" element={<EmployerDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
