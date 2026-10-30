import { useState } from "react"
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar"
import { useNavigate } from "react-router-dom"
import api from "../utils/axios";
const Dashboard = ({user,setUser}) => {
  const [sidebarOpen, setSidebarOpen]=useState(true);
  const [mobileOpen, setMobileOpen]=useState(false);
  const navigate=useNavigate();

  const handleLogout=async()=>{
    try{
       const response=await api.get("/api/auth/logout");
       if(response.data.success){
        setUser(null);
        navigate("/");
        
       }
    }catch(error){
  console.log(error);
  
    }
  }
  return (
    <div className="">
        <Sidebar
        user={user}
        onNewInterview={()=>navigate("/interview")}
        onLogout={handleLogout}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        />
   <motion.main className="">

    {/* top area  */}
    <div>
      <div>
      
      </div>
      </div>

   </motion.main>
    </div>
  )
}

export default Dashboard
