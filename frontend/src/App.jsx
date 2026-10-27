import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import { useEffect, useState } from "react";
import { getCurrentUser } from "./apis/user.api.js";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getuser = async () => {
      try {
        const data = await getCurrentUser();
        setUser(data?.user || null);
      } finally {
        setLoading(false);
      }
    };
    getuser();
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] bg-white">
        {/* Top Loading Bar */}
        <div className="absolute left-0 top-0 h-1 w-full overflow-hidden bg-indigo-100">
          <div className="h-full w-1/3 animate-loading-bar rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-600 shadow-md shadow-indigo-300" />
        </div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/" element={
          user?
          <Navigate to="/dashboard" replace/> :
          <Home setUser={setUser} />} />
        <Route path="/dashboard" element={
          user?
          <Dashboard user={user} />:
          <Navigate to="/" replace/>
          } />
      </Routes>
    </>
  );
};

export default App;
