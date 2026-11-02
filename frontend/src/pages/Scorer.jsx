
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import {
  FiUploadCloud,
  FiFileText,
  FiShield,
  FiCheckCircle,
  FiArrowLeft,
  FiArrowRight,
  FiLock,
  FiX,
} from "react-icons/fi";
import { GiArtificialHive } from "react-icons/gi";
import api from "../utils/axios";

const Navbar = ({ label }) => {
  const navigate = useNavigate();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-40 w-full border-b border-slate-200/70 bg-white/85 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-10">

        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          onClick={() => navigate("/dashboard")}
          className="flex cursor-pointer items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200/70">
            <GiArtificialHive className="text-2xl" />
          </div>

          <span className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
            Fresher<span className="text-indigo-600">AI</span>
          </span>
        </motion.div>

        {/* Current Page */}
        <div className="flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/70 px-3 py-2 sm:px-4">
          <FiFileText className="text-indigo-600" />
          <span className="text-xs font-semibold text-indigo-700 sm:text-sm">
            {label}
          </span>
        </div>

        {/* Dashboard Button */}
        <motion.button
          type="button"
          onClick={() => navigate("/dashboard")}
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.96 }}
          className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 sm:inline-flex"
        >
          <FiArrowLeft />
          Dashboard
        </motion.button>

      </div>
    </motion.nav>
  );
};

const Scorer = ({ user, setUser }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadResume = async () => {
    if (!file) {
      alert("Please select a PDF");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("resume", file);

      const response = await api.post(
        "/api/resume/upload",
        formData
      );

      console.log(response.data);

      setLoading(false);
    } catch (error) {
      console.error("Resume upload failed:", error);
      alert(error.response?.data?.message || "Error uploading resume");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50/50 text-slate-900">

      {/* ================= NAVBAR ================= */}
      <Navbar label="Resume Scorer" />

      {/* ================= MAIN SECTION ================= */}
      <main className="relative min-h-[calc(100vh-76px)] overflow-hidden px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16">

        {/* Background Decorations */}
        <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-indigo-200/30 blur-3xl" />

        <div className="pointer-events-none absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-violet-200/30 blur-3xl" />

        <div className="relative mx-auto max-w-3xl">

          {/* ================= PAGE HEADING ================= */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="mb-9 text-center"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-wider text-indigo-700 shadow-sm sm:text-sm">
              <FiFileText className="text-base" />
              AI Resume Analysis
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
              Make Your Resume
              <span className="mt-2 block bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-500 bg-clip-text text-transparent">
                Stand Out!
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-500 sm:text-base sm:leading-8">
              Upload your resume and let AI analyze its strengths,
              identify improvement areas, and help you build a
              stronger professional profile.
            </p>
          </motion.div>

          {/* ================= UPLOAD CARD ================= */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative overflow-hidden rounded-3xl border border-indigo-100/80 bg-white/90 p-5 shadow-xl shadow-indigo-100/50 backdrop-blur-xl sm:p-8 md:p-10"
          >

            {/* Top Accent */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-400" />

            {/* ================= STEP INDICATOR ================= */}
            <div className="mb-9">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Step 1 of 2
                </span>

                <span className="text-xs font-medium text-slate-400">
                  Resume Upload
                </span>
              </div>

              <div className="flex items-center gap-3">

                {/* Step 1 */}
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-sm font-bold text-white shadow-md shadow-indigo-200">
                    1
                  </div>

                  <span className="hidden text-sm font-semibold text-indigo-700 sm:block">
                    Upload Resume
                  </span>
                </div>

                {/* Progress Line */}
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "50%" }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-violet-600"
                  />
                </div>

                {/* Step 2 */}
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-slate-200 bg-white text-sm font-bold text-slate-400">
                    2
                  </div>

                  <span className="hidden text-sm font-medium text-slate-400 sm:block">
                    Analysis
                  </span>
                </div>

              </div>
            </div>

            {/* ================= UPLOAD HEADING ================= */}
            <div className="mb-7 text-center">
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                Upload Your Resume
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
                Let's take a closer look at your professional profile.
              </p>
            </div>

            {/* ================= UPLOAD AREA ================= */}
            <label
              htmlFor="resume-upload"
              className={`group relative flex min-h-[230px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed px-4 py-8 text-center transition-all duration-300 sm:min-h-[260px] ${
                file
                  ? "border-indigo-400 bg-indigo-50/50"
                  : "border-indigo-200 bg-gradient-to-br from-indigo-50/50 via-white to-violet-50/50 hover:border-indigo-400 hover:bg-indigo-50/70"
              }`}
            >

              {/* Decorative Background */}
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-indigo-100/60 blur-3xl transition-all group-hover:bg-violet-200/60" />

              {/* Upload Icon */}
              <motion.div
                whileHover={{ scale: 1.08, y: -4 }}
                className={`relative mb-5 flex h-16 w-16 items-center justify-center rounded-2xl shadow-md transition-all duration-300 sm:h-20 sm:w-20 ${
                  file
                    ? "bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-indigo-200"
                    : "bg-white text-indigo-600 shadow-indigo-100 group-hover:text-violet-600"
                }`}
              >
                {file ? (
                  <FiFileText className="text-3xl sm:text-4xl" />
                ) : (
                  <FiUploadCloud className="text-3xl sm:text-4xl" />
                )}
              </motion.div>

              {/* Upload Text */}
              <div className="relative max-w-full px-2">
                <AnimatePresence mode="wait">
                  {file ? (
                    <motion.div
                      key="selected"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="flex flex-col items-center"
                    >
                      <p className="max-w-full truncate text-base font-bold text-indigo-700 sm:text-lg">
                        {file.name}
                      </p>

                      <p className="mt-2 text-xs font-medium text-emerald-600">
                        <FiCheckCircle className="mr-1 inline" />
                        Resume selected successfully
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                    >
                      <p className="text-base font-bold text-slate-800 sm:text-lg">
                        Click to browse your resume
                      </p>

                      <p className="mt-2 text-sm text-slate-500">
                        Select your PDF file from your device
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <p className="mt-4 text-xs font-medium text-slate-400">
                  PDF format only · Maximum file size 20MB
                </p>
              </div>

              <input
                id="resume-upload"
                type="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
              />
            </label>

            {/* ================= FILE SELECTED INFO ================= */}
            <AnimatePresence>
              {file && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: 10 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: 10 }}
                  className="mt-4 overflow-hidden"
                >
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-indigo-100 bg-indigo-50/50 p-3 sm:p-4">

                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                        <FiFileText className="text-xl" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-800">
                          {file.name}
                        </p>

                        <p className="text-xs text-slate-400">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>

                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setFile(null)}
                      aria-label="Remove selected file"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                    >
                      <FiX />
                    </motion.button>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ================= ANALYZE BUTTON ================= */}
            <motion.button
              type="button"
              onClick={uploadResume}
              disabled={!file || loading}
              whileHover={file && !loading ? { y: -2 } : {}}
              whileTap={file && !loading ? { scale: 0.98 } : {}}
              className={`mt-7 flex w-full items-center justify-center gap-3 rounded-xl px-6 py-4 text-sm font-bold transition-all duration-300 sm:text-base ${
                !file || loading
                  ? "cursor-not-allowed bg-slate-100 text-slate-400"
                  : "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200/70 hover:shadow-xl hover:shadow-indigo-300/70"
              }`}
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="h-5 w-5 rounded-full border-2 border-current border-t-transparent"
                  />

                  Analyzing Resume...
                </>
              ) : (
                <>
                  Analyze Resume
                  <FiArrowRight className="text-lg" />
                </>
              )}
            </motion.button>

            {/* ================= SECURITY FOOTER ================= */}
            <div className="mt-6 flex flex-col items-center justify-center gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:gap-6">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <FiShield className="text-emerald-500" />
                Secure Resume Upload
              </div>

              <div className="hidden h-4 w-px bg-slate-200 sm:block" />

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <FiLock className="text-indigo-500" />
                Protected Processing
              </div>
            </div>

          </motion.div>

          {/* ================= BOTTOM INFORMATION ================= */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-center text-xs text-slate-400"
          >
            <span className="flex items-center gap-2">
              <FiCheckCircle className="text-emerald-500" />
              Simple upload process
            </span>

            <span className="flex items-center gap-2">
              <FiCheckCircle className="text-emerald-500" />
              AI-powered resume insights
            </span>
          </motion.div>

        </div>
      </main>
    </div>
  );
};

export default Scorer;
