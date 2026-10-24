import { motion } from "motion/react";
import { GiArtificialHive } from "react-icons/gi";
import { FaArrowRight } from "react-icons/fa6";
import LoginModel from "../components/LoginModel";
import { useState } from "react";

const Home = () => {
    const [showLogin, setShowLogin] = useState(false);
    
  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50/60 text-slate-900">
      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="sticky top-0 z-40 flex w-full items-center justify-between border-b border-slate-200/70 bg-white/80 px-5 py-4 backdrop-blur-xl sm:px-8 lg:px-16"
      >
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="flex cursor-pointer items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200/70">
            <GiArtificialHive className="text-2xl" />
          </div>

          <span className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
            Fresher<span className="text-indigo-600">AI</span>
          </span>
        </motion.div>

        {/* Login Button */}
        <motion.button
          type="button"
          onClick={()=>setShowLogin(true)}
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="group inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200/60 transition-colors duration-300 hover:bg-indigo-700 sm:px-6 sm:py-3 sm:text-base"
        >
          Login
          <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
        </motion.button>
      </motion.nav>

      {/* Main Area */}
      <section className="relative min-h-[calc(100vh-76px)]">
        {/* Soft decorative backgrounds */}
        <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 top-40 h-80 w-80 rounded-full bg-violet-200/30 blur-3xl" />

        {/* Your main content can go here */}
      </section>

     { showLogin && <LoginModel onClose={() => setShowLogin(false)} /> }
    </div>
  );
};

export default Home;

