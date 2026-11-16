import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiBriefcase,
  FiCheck,
  FiCheckCircle,
  FiFileText,
  FiUploadCloud,
  FiX,
  FiAlertCircle,
  FiZap,
  FiShield,
  FiTarget,
  FiMessageSquare,
  FiCode,
  FiUsers,
  FiAward,
  FiLock,
} from "react-icons/fi";
import { GiArtificialHive } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { useCoins } from "../../apis/user.api";
import api from "../../utils/axios";
import { setResume } from "../../redux/resumeSlice";
import { startInterview } from "../../apis/interview.api";

/* =========================================
   ANIMATION VARIANTS
========================================= */

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

/* =========================================
   NAVBAR — SAME AS RESUME SCORER
========================================= */

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <motion.nav
      id="navi"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-40 flex w-full items-center justify-between border-b border-slate-200/70 bg-white/90 px-5 py-4 backdrop-blur-xl sm:px-8 lg:px-16"
    >
      {/* FRESHERAI BRAND */}
      <motion.div
        whileHover={{ scale: 1.03 }}
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

      {/* CENTER LABEL */}
      <div className="hidden items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/70 px-3 py-2 sm:flex sm:px-4">
        <FiMessageSquare className="text-indigo-600" />

        <span className="text-xs font-semibold text-indigo-700 sm:text-sm">
          AI Interview
        </span>
      </div>

      {/* DASHBOARD BUTTON */}
      <motion.button
        type="button"
        onClick={() => navigate("/dashboard")}
        whileHover={{ x: -3 }}
        whileTap={{ scale: 0.96 }}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 sm:px-4 sm:text-sm"
      >
        <FiArrowLeft />
        <span className="hidden sm:inline">Dashboard</span>
      </motion.button>
    </motion.nav>
  );
};

/* =========================================
   FEATURE ITEM
========================================= */

const FeatureItem = ({ icon: Icon, title, description }) => {
  return (
    <motion.div
      variants={fadeUp}
      className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-sm transition-colors hover:bg-white/15 sm:p-4"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
        <FiCheck className="text-lg" />
      </div>

      <div className="min-w-0">
        <h3 className="text-sm font-bold text-white sm:text-base">{title}</h3>

        <p className="mt-0.5 text-xs leading-5 text-indigo-100/75">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

/* =========================================
   MAIN COMPONENT
========================================= */

const Step1Setup = ({ user, setUser, onStartInterview }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { resume } = useSelector((state) => state.resume);

  /* =========================================
     FORM STATES
  ========================================= */

  const [role, setRole] = useState("");
  const [type, setType] = useState("technical");
  const [useResume, setUseResume] = useState(!!resume);

  /* =========================================
     UPLOAD STATES
  ========================================= */

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState("");

  /* =========================================
     INTERVIEW STATES
  ========================================= */

  const [starting, setStarting] = useState(false);
  const [startError, setStartError] = useState("");

  /* =========================================
     FILE VALIDATION
  ========================================= */

  const handleFileSelection = (selectedFile) => {
    if (!selectedFile) return;

    setUploadError("");
    setUploadSuccess(false);

    const isPDF =
      selectedFile.type === "application/pdf" ||
      selectedFile.name.toLowerCase().endsWith(".pdf");

    if (!isPDF) {
      setFile(null);
      setUploadError("Please upload a PDF file only.");
      return;
    }

    if (selectedFile.size > 20 * 1024 * 1024) {
      setFile(null);
      setUploadError("File size must be less than 20MB.");
      return;
    }

    setFile(selectedFile);
  };

  /* =========================================
     DRAG AND DROP
  ========================================= */

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];

    if (droppedFile) {
      handleFileSelection(droppedFile);
    }
  };

  /* =========================================
     REMOVE SELECTED FILE
  ========================================= */

  const removeSelectedFile = () => {
    setFile(null);
    setUploadError("");
    setUploadSuccess(false);
  };

  /* =========================================
     UPLOAD RESUME
     Same API and coin logic as Resume Scorer
  ========================================= */

  const uploadResume = async () => {
    if (!file) {
      setUploadError("Please select a PDF first.");
      return;
    }

    try {
      setUploading(true);
      setUploadError("");
      setUploadSuccess(false);

      // Existing coin deduction logic
      const coinResponse = await useCoins({
        coins: 10,
        action: "resume-scorer",
      });

      if (typeof setUser === "function") {
        setUser((prev) => ({
          ...prev,
          interviewCoin: coinResponse?.interviewCoin,
        }));
      }

      const formData = new FormData();
      formData.append("resume", file);

      // Existing resume upload API
      const response = await api.post("/api/resume/upload", formData);

      const uploadedResume = response?.data?.data;

      if (!uploadedResume) {
        throw new Error("Resume upload returned no resume data.");
      }

      setUploadSuccess(true);

      // Brief success animation
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Update Redux resume state
      dispatch(setResume(uploadedResume));

      setFile(null);
    } catch (error) {
      console.error("Interview resume upload failed:", error);

      setUploadError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to upload your resume. Please try again.",
      );
    } finally {
      setUploading(false);
    }
  };

  /* =========================================
     START INTERVIEW
  ========================================= */

  const resumeReady = !useResume || (Boolean(resume) && !file && !uploading);

  const canStart = Boolean(role.trim()) && resumeReady && !starting;

const start=async()=>{
  setStarting(true);
  const response=await startInterview({
       role,
       type,
       useResume,
       resume

  });

  if(response){
    const coinResponse = await useCoins({
      coins: 50,
      action: "start-interview",
    });


    if (typeof setUser === "function") {
      setUser((prev) => ({
        ...prev,
        interviewCoin: coinResponse?.interviewCoin,
      }));
    }
  }

  setStarting(false);

  navigate(`/interview/${response?.interviewId}`)
}


  /* =========================================
     RENDER
  ========================================= */

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#f4f6ff] text-slate-900">
      <Navbar />

      <main className="relative min-h-[calc(100vh-76px)] overflow-hidden px-3 py-6 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
        {/* BACKGROUND DECORATIONS */}
        <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />

        <div className="pointer-events-none absolute -right-40 top-80 h-96 w-96 rounded-full bg-violet-200/40 blur-3xl" />

        <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-sky-100/50 blur-3xl" />

        <div className="relative mx-auto max-w-6xl">
          {/* PAGE HEADING */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="mb-8 text-center sm:mb-10"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-wider text-indigo-700 shadow-sm sm:text-sm">
              <FiZap className="text-base" />
              AI Powered Mock Interview
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
              Prepare for your next
              <span className="mt-1 block bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
                Big Opportunity.
              </span>
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
              Configure your interview, choose your target role, and practice
              with personalized AI-generated questions and feedback.
            </p>
          </motion.div>

          {/* MAIN SETUP CARD */}
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid overflow-hidden rounded-[2rem] border border-indigo-100 bg-white shadow-2xl shadow-indigo-100/70 lg:grid-cols-[0.82fr_1.18fr]"
          >
            {/* =====================================
                LEFT INFORMATION PANEL
            ===================================== */}
            <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 p-6 text-white sm:p-8 lg:p-10">
              {/* Decorative circles */}
              <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full border border-white/10" />

              <div className="pointer-events-none absolute -right-10 -top-10 h-52 w-52 rounded-full border border-white/10" />

              <div className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />

              <div className="relative">
                {/* BACK BUTTON */}
                

                {/* WELCOME */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-amber-300 ring-1 ring-white/15">
                    <FiAward className="text-3xl" />
                  </div>

                  <h2 className="text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
                    Welcome back,
                    <span className="mt-1 block break-words text-indigo-200">
                      {user?.name || "Candidate"}
                    </span>
                  </h2>

                  <p className="mt-4 max-w-md text-sm leading-7 text-indigo-100/75 sm:text-base">
                    Practice realistic AI interviews, receive instant feedback,
                    and improve your performance before your next job interview.
                  </p>
                </motion.div>

                {/* FEATURES */}
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="mt-8 space-y-3 sm:mt-10"
                >
                  <FeatureItem
                    icon={FiMessageSquare}
                    title="Personalized AI Questions"
                    description="Questions based on your target role."
                  />

                  <FeatureItem
                    icon={FiFileText}
                    title="Resume Based Interview"
                    description="Use your experience to personalize practice."
                  />

                  <FeatureItem
                    icon={FiTarget}
                    title="Detailed Performance Report"
                    description="Understand your strengths and improvement areas."
                  />

                  <FeatureItem
                    icon={FiUsers}
                    title="Real Interview Experience"
                    description="Practice in a realistic interview flow."
                  />
                </motion.div>

                {/* BOTTOM SECURITY INFORMATION */}
                <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-white/15 pt-6 text-xs font-medium text-indigo-100/70">
                  <span className="flex items-center gap-2">
                    <FiShield className="text-emerald-300" />
                    AI-powered practice
                  </span>

                  <span className="flex items-center gap-2">
                    <FiLock className="text-indigo-200" />
                    Secure experience
                  </span>
                </div>
              </div>
            </section>

            {/* =====================================
                RIGHT SETUP PANEL
            ===================================== */}
            <section className="min-w-0 bg-white p-5 sm:p-8 lg:p-10">
              {/* FORM HEADER */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mb-8"
              >
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700">
                  <span className="h-2 w-2 rounded-full bg-indigo-500" />
                  INTERVIEW SETUP
                </div>

                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                  Start Interview
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Configure your interview preferences before getting started.
                </p>
              </motion.div>

              <div className="space-y-7">
                {/* =================================
                    TARGET ROLE
                ================================= */}
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                >
                  <label
                    htmlFor="target-role"
                    className="mb-2.5 block text-sm font-bold text-slate-700"
                  >
                    Target Role
                  </label>

                  <div className="group flex min-h-14 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 px-4 transition-all duration-200 focus-within:border-indigo-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-50">
                    <FiBriefcase className="shrink-0 text-lg text-slate-400 transition-colors group-focus-within:text-indigo-600" />

                    <input
                      id="target-role"
                      type="text"
                      value={role}
                      onChange={(e) => {
                        setRole(e.target.value);
                        setStartError("");
                      }}
                      placeholder="e.g. Backend Developer"
                      autoComplete="off"
                      className="w-full min-w-0 bg-transparent py-4 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 sm:text-base"
                    />
                  </div>

                  <p className="mt-2 text-xs text-slate-400">
                    Enter the position you are preparing to interview for.
                  </p>
                </motion.div>

                {/* =================================
                    INTERVIEW TYPE
                ================================= */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label className="mb-2.5 block text-sm font-bold text-slate-700">
                    Interview Type
                  </label>

                  <div className="grid grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-slate-100/80 p-1.5">
                    <motion.button
                      type="button"
                      onClick={() => setType("technical")}
                      whileTap={{ scale: 0.98 }}
                      aria-pressed={type === "technical"}
                      className={`flex min-h-12 items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-bold transition-all duration-200 ${
                        type === "technical"
                          ? "bg-white text-indigo-700 shadow-md shadow-slate-200/70"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <FiCode className="text-base" />
                      Technical
                    </motion.button>

                    <motion.button
                      type="button"
                      onClick={() => setType("hr")}
                      whileTap={{ scale: 0.98 }}
                      aria-pressed={type === "hr"}
                      className={`flex min-h-12 items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-bold transition-all duration-200 ${
                        type === "hr"
                          ? "bg-white text-indigo-700 shadow-md shadow-slate-200/70"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <FiUsers className="text-base" />
                      HR
                    </motion.button>
                  </div>
                </motion.div>

                {/* =================================
                    USE RESUME TOGGLE
                ================================= */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:border-indigo-100 sm:p-5"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                        <FiFileText className="text-lg" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-sm font-extrabold text-slate-800 sm:text-base">
                          Use Resume
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          AI will personalize questions using your resume.
                        </p>
                      </div>
                    </div>

                    {/* TOGGLE */}
                    <button
                      type="button"
                      role="switch"
                      aria-checked={useResume}
                      aria-label="Use resume for interview"
                      onClick={() => {
                        setUseResume((previous) => !previous);
                        setUploadError("");
                        setStartError("");
                      }}
                      className={`relative flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition-colors duration-300 ${
                        useResume ? "bg-indigo-600" : "bg-slate-300"
                      }`}
                    >
                      <motion.span
                        layout
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                        className="h-5 w-5 rounded-full bg-white shadow-md"
                        style={{
                          marginLeft: useResume ? "auto" : "0",
                        }}
                      />
                    </button>
                  </div>
                </motion.div>

                {/* =================================
                    RESUME UPLOAD SECTION
                ================================= */}
                <AnimatePresence initial={false}>
                  {useResume && (
                    <motion.div
                      key="resume-upload"
                      initial={{ opacity: 0, height: 0, y: 12 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0, y: 12 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-4">
                        {/* EXISTING RESUME STATUS */}
                        {resume && !file && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4"
                          >
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-sm shadow-emerald-200">
                              <FiFileText className="text-xl" />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className="text-sm font-extrabold text-emerald-800">
                                  Resume Ready
                                </h4>

                                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                                  Saved
                                </span>
                              </div>

                              <p className="mt-1 truncate text-xs text-emerald-700/80">
                                {resume?.name || "Resume detected successfully"}
                              </p>

                              {resume?.suggestedRole && (
                                <p className="mt-1 truncate text-[11px] text-emerald-700/70">
                                  Suggested role: {resume.suggestedRole}
                                </p>
                              )}
                            </div>

                            <FiCheckCircle className="h-5 w-5 shrink-0 text-emerald-500" />
                          </motion.div>
                        )}

                        {/* UPLOAD DROPZONE */}
                        <div>
                          <motion.div
                            onDragOver={handleDragOver}
                            onDragEnter={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            animate={{
                              scale: isDragging ? 1.01 : 1,
                              borderColor: isDragging
                                ? "#6366f1"
                                : file
                                  ? "#818cf8"
                                  : "#c7d2fe",
                            }}
                            transition={{ duration: 0.2 }}
                            className={`relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 ${
                              isDragging
                                ? "bg-indigo-100/80 shadow-lg shadow-indigo-100"
                                : file
                                  ? "bg-gradient-to-br from-indigo-50 to-violet-50"
                                  : "bg-gradient-to-br from-indigo-50/60 via-white to-violet-50/60 hover:bg-indigo-50"
                            }`}
                          >
                            {/* DRAG OVERLAY */}
                            <AnimatePresence>
                              {isDragging && (
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-2xl bg-indigo-600/10 backdrop-blur-sm"
                                >
                                  <motion.div
                                    initial={{ scale: 0.7, y: 15 }}
                                    animate={{ scale: 1, y: 0 }}
                                    transition={{
                                      type: "spring",
                                      stiffness: 250,
                                      damping: 16,
                                    }}
                                    className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-xl"
                                  >
                                    <FiUploadCloud className="text-3xl" />
                                  </motion.div>

                                  <p className="mt-4 text-lg font-extrabold text-indigo-700">
                                    Drop your PDF here!
                                  </p>

                                  <p className="mt-1 text-xs font-medium text-indigo-500">
                                    Release to select your resume
                                  </p>
                                </motion.div>
                              )}
                            </AnimatePresence>

                            {/* SELECT FILE LABEL */}
                            <label
                              htmlFor="interview-resume-upload"
                              className="group flex min-h-[190px] cursor-pointer flex-col items-center justify-center px-4 py-7 text-center sm:min-h-[210px]"
                            >
                              <motion.div
                                animate={
                                  isDragging
                                    ? { y: [0, -7, 0], scale: 1.08 }
                                    : { y: 0, scale: 1 }
                                }
                                transition={{
                                  duration: 0.8,
                                  repeat: isDragging ? Infinity : 0,
                                }}
                                className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl shadow-md transition-all sm:h-16 sm:w-16 ${
                                  file
                                    ? "bg-gradient-to-br from-indigo-600 to-violet-600 text-white"
                                    : "bg-white text-indigo-600 shadow-indigo-100 group-hover:-translate-y-1"
                                }`}
                              >
                                {file ? (
                                  <FiFileText className="text-3xl" />
                                ) : (
                                  <FiUploadCloud className="text-3xl" />
                                )}
                              </motion.div>

                              {file ? (
                                <>
                                  <p className="max-w-full truncate text-sm font-extrabold text-indigo-700 sm:text-base">
                                    {file.name}
                                  </p>

                                  <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-emerald-700">
                                    <FiCheckCircle />
                                    PDF selected
                                  </span>

                                  <p className="mt-2 text-xs text-slate-500">
                                    Select another file to replace it.
                                  </p>
                                </>
                              ) : (
                                <>
                                  <p className="text-sm font-extrabold text-slate-800 sm:text-base">
                                    {resume
                                      ? "Upload a new resume"
                                      : "Upload your resume"}
                                  </p>

                                  <p className="mt-2 max-w-sm text-xs leading-5 text-slate-500 sm:text-sm">
                                    Drag and drop your PDF here, or{" "}
                                    <span className="font-bold text-indigo-600 underline underline-offset-4">
                                      browse files
                                    </span>
                                  </p>
                                </>
                              )}

                              <p className="mt-4 text-[11px] font-medium text-slate-400">
                                PDF format only · Maximum file size 20MB
                              </p>
                            </label>

                            {/* HIDDEN INPUT */}
                            <input
                              id="interview-resume-upload"
                              type="file"
                              accept=".pdf,application/pdf"
                              className="hidden"
                              onChange={(e) => {
                                handleFileSelection(e.target.files?.[0]);
                                e.target.value = "";
                              }}
                            />
                          </motion.div>

                          {/* SELECTED FILE DETAILS */}
                          <AnimatePresence>
                            {file && (
                              <motion.div
                                initial={{ opacity: 0, height: 0, y: 10 }}
                                animate={{ opacity: 1, height: "auto", y: 0 }}
                                exit={{ opacity: 0, height: 0, y: 10 }}
                                className="overflow-hidden"
                              >
                                <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-indigo-100 bg-indigo-50/70 p-3">
                                  <div className="flex min-w-0 items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600">
                                      <FiFileText className="text-lg" />
                                    </div>

                                    <div className="min-w-0">
                                      <p className="truncate text-xs font-bold text-slate-800">
                                        {file.name}
                                      </p>

                                      <p className="mt-1 text-[11px] text-slate-400">
                                        {(file.size / (1024 * 1024)).toFixed(2)}{" "}
                                        MB
                                      </p>
                                    </div>
                                  </div>

                                  <motion.button
                                    type="button"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={removeSelectedFile}
                                    disabled={uploading}
                                    aria-label="Remove selected resume"
                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-rose-100 hover:text-rose-600 disabled:opacity-50"
                                  >
                                    <FiX />
                                  </motion.button>
                                </div>

                                {/* UPLOAD BUTTON */}
                                <motion.button
                                  type="button"
                                  onClick={uploadResume}
                                  disabled={uploading}
                                  whileHover={!uploading ? { y: -2 } : {}}
                                  whileTap={{ scale: 0.98 }}
                                  className={`mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                                    uploadSuccess
                                      ? "bg-emerald-500 text-white"
                                      : uploading
                                        ? "cursor-wait bg-slate-200 text-slate-500"
                                        : "bg-indigo-600 text-white shadow-md shadow-indigo-200/70 hover:bg-indigo-700 hover:shadow-lg"
                                  }`}
                                >
                                  {uploadSuccess ? (
                                    <>
                                      <FiCheckCircle className="text-lg" />
                                      Resume Uploaded Successfully
                                    </>
                                  ) : uploading ? (
                                    <>
                                      <motion.span
                                        animate={{ rotate: 360 }}
                                        transition={{
                                          duration: 1,
                                          repeat: Infinity,
                                          ease: "linear",
                                        }}
                                        className="h-4 w-4 rounded-full border-2 border-current border-t-transparent"
                                      />
                                      Uploading Resume...
                                    </>
                                  ) : (
                                    <>
                                      <FiUploadCloud className="text-lg" />
                                      Upload Resume
                                      <FiArrowRight />
                                    </>
                                  )}
                                </motion.button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* UPLOAD ERROR */}
                        <AnimatePresence>
                          {uploadError && (
                            <motion.div
                              initial={{ opacity: 0, y: -8, height: 0 }}
                              animate={{ opacity: 1, y: 0, height: "auto" }}
                              exit={{ opacity: 0, y: -8, height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="flex items-start gap-2 rounded-xl border border-rose-100 bg-rose-50 p-3.5 text-xs font-medium leading-5 text-rose-600">
                                <FiAlertCircle className="mt-0.5 shrink-0" />
                                {uploadError}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* UPLOAD HELPER */}
                        {!resume && !file && (
                          <p className="flex items-center gap-2 text-xs leading-5 text-slate-400">
                            <FiShield className="shrink-0 text-emerald-500" />
                            Upload your resume to enable personalized interview
                            questions.
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* RESUME DISABLED MESSAGE */}
                <AnimatePresence>
                  {!useResume && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="flex items-start gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                        <FiZap />
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-slate-800">
                          General Interview Mode
                        </h4>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          Resume-based personalization is disabled. Questions
                          will be generated using your target role and interview
                          type.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* START ERROR */}
                <AnimatePresence>
                  {startError && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="flex items-start gap-2 rounded-xl border border-rose-100 bg-rose-50 p-3.5 text-xs font-medium leading-5 text-rose-600"
                    >
                      <FiAlertCircle className="mt-0.5 shrink-0" />
                      {startError}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* =================================
                    START INTERVIEW BUTTON
                ================================= */}
                <motion.button
                  type="button"
                  onClick={start}
                //   onClick={handleStartInterview}
                  disabled={!canStart}
                  whileHover={canStart ? { y: -3 } : {}}
                  whileTap={canStart ? { scale: 0.98 } : {}}
                  className={`group flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl px-5 py-4 text-sm font-extrabold transition-all duration-300 sm:text-base ${
                    canStart
                      ? "bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200/70 hover:shadow-xl hover:shadow-indigo-300/70"
                      : "cursor-not-allowed bg-slate-200 text-slate-400"
                  }`}
                >
                  {starting ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="h-5 w-5 rounded-full border-2 border-current border-t-transparent"
                      />
                      Starting Interview...
                    </>
                  ) : (
                    <>
                      Start Interview
                      <FiArrowRight className="text-lg transition-transform duration-200 group-hover:translate-x-1" />
                    </>
                  )}
                </motion.button>

                {/* FOOTER INFORMATION */}
                <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-slate-100 pt-5 text-[11px] font-medium text-slate-400 sm:text-xs">
                  <span className="flex items-center gap-1.5">
                    <FiCheckCircle className="text-emerald-500" />
                    Personalized practice
                  </span>

                  <span className="flex items-center gap-1.5">
                    <FiShield className="text-indigo-500" />
                    Secure experience
                  </span>
                </div>
              </div>
            </section>
          </motion.div>

          {/* BOTTOM INFORMATION */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mt-7 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-center text-xs font-medium text-slate-400"
          >
            <span className="flex items-center gap-2">
              <FiCheckCircle className="text-emerald-500" />
              Technical and HR interviews
            </span>

            <span className="flex items-center gap-2">
              <FiCheckCircle className="text-emerald-500" />
              Resume-based questions
            </span>

            <span className="flex items-center gap-2">
              <FiCheckCircle className="text-emerald-500" />
              AI-powered feedback
            </span>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Step1Setup;
