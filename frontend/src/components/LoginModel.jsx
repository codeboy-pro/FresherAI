import { motion } from "motion/react";
import { FiX } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { GiArtificialHive } from "react-icons/gi";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";
import api from "../utils/axios";

const LoginModel = ({ onClose, setUser }) => {
  const handleGoogleAuth = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      const response = await api.post("/api/auth/login", { token });
      setUser(response?.data?.user);
      onClose();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 px-4 py-6 backdrop-blur-md sm:px-6">
      {/* Background overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-100/30 via-white/20 to-violet-200/30" />

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/80 bg-white/95 p-7 shadow-2xl shadow-indigo-900/15 sm:p-10"
      >
        {/* Close button */}
        <motion.button
          type="button"
          onClick={onClose}
          whileHover={{ rotate: 90 }}
          whileTap={{ scale: 0.92 }}
          aria-label="Close login modal"
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-500"
        >
          <FiX className="text-xl" />
        </motion.button>

        {/* Brand */}
        <div className="mb-7 flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200/70">
            <GiArtificialHive className="text-3xl" />
          </div>

          <span className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
            Fresher<span className="text-indigo-600">AI</span>
          </span>
        </div>

        {/* Heading */}
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Welcome back!
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
            Sign in to continue your AI interview journey and prepare for your
            dream career.
          </p>
        </div>

        {/* Google sign-in */}
        <div className="mt-8">
          <motion.button
            type="button"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleAuth}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-indigo-300 hover:bg-indigo-50/50 hover:shadow-md sm:text-base"
          >
            <FcGoogle className="text-xl" />
            <span>Continue with Google</span>
          </motion.button>
        </div>

        {/* Security footer */}
        <div className="mt-7 flex items-center justify-center gap-2 border-t border-slate-100 pt-5 text-xs text-slate-500 sm:text-sm">
          <span className="font-semibold text-emerald-600">✓</span>
          <span>Secure authentication powered by Firebase</span>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginModel;
