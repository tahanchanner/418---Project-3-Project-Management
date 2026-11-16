
import { useState } from "react";
import Signup from "./components/Signup.jsx";
import Login from "./components/Login.jsx";
import ProjectDashboard from "./components/ProjectDashboard.jsx";

export default function App() {
  const [view, setView] = useState("login");
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    setUser(null);
    setView("login");
  };

  if (user) {
    return (
      <ProjectDashboard
        user={user}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="container">
      <div className="tabs">
        <button
          className={view === "login" ? "active" : ""}
          onClick={() => setView("login")}
        >
          Login
        </button>

        <button
          className={view === "signup" ? "active" : ""}
          onClick={() => setView("signup")}
        >
          Signup
        </button>
      </div>

      {view === "login" ? (
        <Login onLogin={setUser} />
      ) : (
        <Signup />
      )}
    </div>
  );
}

