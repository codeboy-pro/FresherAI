
import { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";


const Dashboard = ({ user, setUser }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await api.get("/api/auth/logout");

      if (response.data.success) {
        setUser(null);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden bg-slate-50">

      {/* SIDEBAR */}
      <Sidebar
        user={user}
        onNewInterview={() => navigate("/interview")}
        onLogout={handleLogout}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* MAIN DASHBOARD AREA */}
      <motion.main className="min-h-screen min-w-0 flex-1 bg-slate-50 transition-all duration-300">

        {/* TOP AREA */}
        <div className="w-full px-5 pb-8 pt-6 sm:px-8 sm:pt-8 lg:px-10">

          <div className="flex min-h-[90px] items-center justify-between border-b border-slate-200/80 pb-6">

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="min-w-0 pl-12 md:pl-0"
            >
              <p className="mb-2 text-sm font-medium tracking-wide text-slate-500">
                Overview
              </p>

              <h2 className="truncate text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                Hello, {user?.name?.split(" ")[0] ?? "User"}{" "}
                <span>👋</span>
              </h2>
            </motion.div>

          </div>

        </div>

      </motion.main>
    </div>
  );
};

export default Dashboard;

