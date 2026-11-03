import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useDispatch, useSelector } from "react-redux";
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
  FiUser,
  FiAlertCircle,
  FiZap,
  FiTrendingUp,
  FiRefreshCw,
} from "react-icons/fi";
import { GiArtificialHive } from "react-icons/gi";
import api from "../utils/axios";
import { setResume } from "../redux/resumeSlice";
import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

/* ================= SCORE RING ================= */

const ScoreRing = ({ score }) => {
  const scoreValue = Math.min(100, Math.max(0, Number(score) || 0));

  const scoreColor =
    scoreValue >= 75
      ? "#10b981"
      : scoreValue >= 50
        ? "#f59e0b"
        : "#ef4444";

  return (
    <div className="relative flex h-[190px] w-[190px] items-center justify-center">
      <RadialBarChart
        width={190}
        height={190}
        cx="50%"
        cy="50%"
        innerRadius={76}
        outerRadius={88}
        barSize={12}
        data={[{ value: scoreValue }]}
        startAngle={90}
        endAngle={-270}
      >
        <PolarAngleAxis
          type="number"
          domain={[0, 100]}
          tick={false}
        />

        <RadialBar
          dataKey="value"
          cornerRadius={20}
          background={{ fill: "#e2e8f0" }}
          fill={scoreColor}
        />
      </RadialBarChart>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-extrabold tracking-tight text-slate-900">
          {scoreValue}
        </span>

        <span className="mt-1 text-sm font-semibold text-slate-400">
          OUT OF 100
        </span>
      </div>
    </div>
  );
};

/* ================= TAG ================= */

const Tag = ({ text, color }) => {
  const styles = {
    green: "border-emerald-100 bg-emerald-50 text-emerald-700",
    yellow: "border-amber-100 bg-amber-50 text-amber-700",
    red: "border-rose-100 bg-rose-50 text-rose-700",
    blue: "border-blue-100 bg-blue-50 text-blue-700",
  };

  return (
    <motion.span
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`inline-flex max-w-full items-center rounded-lg border px-3 py-2 text-xs font-semibold leading-relaxed sm:text-sm ${
        styles[color] || styles.blue
      }`}
    >
      {text}
    </motion.span>
  );
};

/* ================= INSIGHT CARD ================= */

const InsightCard = ({
  title,
  description,
  icon: Icon,
  items,
  color,
  tagColor,
  index = 0,
}) => {
  const accentStyles = {
    green: "bg-emerald-50 text-emerald-600",
    yellow: "bg-amber-50 text-amber-600",
    red: "bg-rose-50 text-rose-600",
    blue: "bg-indigo-50 text-indigo-600",
  };

  const values = Array.isArray(items) ? items : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-100/40 sm:p-6"
    >
      <div
        className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl ${
          accentStyles[color] || accentStyles.blue
        }`}
      >
        <Icon className="text-xl" />
      </div>

      <h3 className="text-lg font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-1 text-sm text-slate-400">
        {description}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {values.length > 0 ? (
          values.map((item, i) => (
            <Tag
              key={`${item}-${i}`}
              text={item}
              color={tagColor}
            />
          ))
        ) : (
          <p className="text-sm text-slate-400">
            No information available.
          </p>
        )}
      </div>
    </motion.div>
  );
};

/* ================= NAVBAR ================= */

const Navbar = ({ label }) => {
  const navigate = useNavigate();

  return (
    <motion.nav
      id="navi"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-40 flex w-full items-center justify-between border-b border-slate-200/70 bg-white/80 px-5 py-4 backdrop-blur-xl sm:px-8 lg:px-16"
    >
      {/* Logo */}
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

      {/* Current Page */}
      <div className="hidden items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/70 px-3 py-2 sm:flex sm:px-4">
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
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 sm:px-4 sm:text-sm"
      >
        <FiArrowLeft />
        <span className="hidden sm:inline">Dashboard</span>
      </motion.button>
    </motion.nav>
  );
};

/* ================= MAIN SCORER ================= */

const Scorer = ({ user, setUser }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const dispatch = useDispatch();
  const { resume } = useSelector((state) => state.resume);

  /* ================= FILE VALIDATION ================= */

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

  /* ================= DRAG AND DROP ================= */

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

  /* ================= UPLOAD RESUME ================= */

  const uploadResume = async () => {
    if (!file) {
      setUploadError("Please select a PDF first.");
      return;
    }

    try {
      setLoading(true);
      setUploadError("");
      setUploadSuccess(false);

      const formData = new FormData();
      formData.append("resume", file);

      const response = await api.post(
        "/api/resume/upload",
        formData
      );

      // Show success state briefly before displaying analysis.
      setUploadSuccess(true);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      dispatch(setResume(response?.data?.data));
    } catch (error) {
      console.error("Resume upload failed:", error);

      setUploadError(
        error?.response?.data?.message ||
          "Unable to analyze your resume. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= ANALYSIS RESULT PAGE ================= */

  if (resume) {
    const score = Number(resume.score) || 0;

    const scoreLabel =
      score >= 75
        ? "Strong Resume"
        : score >= 50
          ? "Average Resume"
          : "Needs Improvement";

    const scoreBadge =
      score >= 75
        ? "border-emerald-100 bg-emerald-50 text-emerald-700"
        : score >= 50
          ? "border-amber-100 bg-amber-50 text-amber-700"
          : "border-rose-100 bg-rose-50 text-rose-700";

    return (
      <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 text-slate-900">
        <Navbar label="Resume Scorer" />

        <main className="relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
          {/* Background decorations */}
          <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-indigo-200/30 blur-3xl" />
          <div className="pointer-events-none absolute -right-32 top-96 h-96 w-96 rounded-full bg-violet-200/30 blur-3xl" />

          <div className="relative mx-auto max-w-6xl">

            {/* Result Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center"
            >
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 shadow-sm">
                  <FiCheckCircle />
                  Analysis Completed
                </div>

                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                  Resume Analysis
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                  Here's your AI-powered resume evaluation and
                  personalized feedback.
                </p>
              </div>

              <motion.button
                type="button"
                onClick={() => {
                  dispatch(setResume(null));
                  setFile(null);
                  setUploadError("");
                  setUploadSuccess(false);
                }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex w-fit items-center gap-2 rounded-xl border border-indigo-100 bg-white px-4 py-3 text-sm font-semibold text-indigo-600 shadow-sm transition hover:bg-indigo-50"
              >
                <FiRefreshCw />
                Re-upload Resume
              </motion.button>
            </motion.div>

            {/* Resume Name */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-6 flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <FiFileText className="text-xl" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Analyzed Resume
                </p>

                <h2 className="mt-1 truncate text-sm font-bold text-slate-800 sm:text-base">
                  {resume.name || "Your Resume"}
                </h2>
              </div>

              <div className="ml-auto hidden shrink-0 items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 sm:flex">
                <FiCheckCircle />
                Successfully analyzed
              </div>
            </motion.div>

            {/* Score Overview */}
            <motion.section
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.15 }}
              className="relative mb-7 overflow-hidden rounded-3xl border border-indigo-100/80 bg-white p-5 shadow-xl shadow-indigo-100/40 sm:p-8"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-400" />

              <div className="grid items-center gap-7 md:grid-cols-[1fr_1.2fr] md:gap-10">
                {/* Score Chart */}
                <div className="flex flex-col items-center justify-center border-b border-slate-100 pb-7 md:border-b-0 md:border-r md:pb-0 md:pr-8">
                  <ScoreRing score={score} />

                  <div className="mt-3 text-center">
                    <span className="text-sm font-semibold text-slate-500">
                      Overall Resume Score
                    </span>

                    <div className="mt-3">
                      <span
                        className={`rounded-full border px-4 py-2 text-xs font-bold ${scoreBadge}`}
                      >
                        {scoreLabel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Score Information */}
                <div>
                  <div className="mb-5">
                    <p className="text-sm font-semibold text-indigo-600">
                      Your Resume Performance
                    </p>

                    <h2 className="mt-2 text-2xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-3xl">
                      {score >= 75
                        ? "Great work! Keep it up."
                        : score >= 50
                          ? "You're on the right track."
                          : "Let's make your resume stronger."}
                    </h2>

                    <p className="mt-3 text-sm leading-7 text-slate-500">
                      Your resume has been evaluated by AI. Review
                      the insights below to understand what's working
                      and what you can improve.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4 sm:p-5">
                    <div className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
                      <FiUser className="text-indigo-600" />
                      Suggested Role
                    </div>

                    <p className="text-lg font-extrabold text-indigo-700">
                      {resume?.suggestedRole || "Not specified"}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      AI-recommended career role based on your resume
                    </p>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Strengths and Weaknesses */}
            <section className="mb-7 grid gap-5 md:grid-cols-2">
              <InsightCard
                index={0}
                title="Strengths"
                description="What your resume is doing well"
                icon={FiCheckCircle}
                items={resume?.strengths}
                color="green"
                tagColor="green"
              />

              <InsightCard
                index={1}
                title="Weaknesses"
                description="Areas that need your attention"
                icon={FiAlertCircle}
                items={resume?.weaknesses}
                color="yellow"
                tagColor="yellow"
              />
            </section>

            {/* Missing Skills and Recommendations */}
            <section className="grid gap-5 md:grid-cols-2">
              <InsightCard
                index={2}
                title="Missing Skills"
                description="Skills you should consider learning"
                icon={FiZap}
                items={resume?.missingSkills}
                color="red"
                tagColor="red"
              />

              <InsightCard
                index={3}
                title="Recommendations"
                description="Suggestions to improve your resume"
                icon={FiTrendingUp}
                items={resume?.recommendations}
                color="blue"
                tagColor="blue"
              />
            </section>

            {/* Bottom Note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 flex flex-col items-center justify-center gap-2 text-center"
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                <FiShield className="text-emerald-500" />
                AI-powered resume insights
              </div>

              <p className="text-xs text-slate-400">
                Use these suggestions to improve your professional profile.
              </p>
            </motion.div>
          </div>
        </main>
      </div>
    );
  }

  /* ================= UPLOAD PAGE ================= */

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50/50 text-slate-900">
      <Navbar label="Resume Scorer" />

      <main className="relative min-h-[calc(100vh-76px)] overflow-hidden px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16">

        {/* Background Decorations */}
        <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-indigo-200/30 blur-3xl" />

        <div className="pointer-events-none absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-violet-200/30 blur-3xl" />

        <div className="relative mx-auto max-w-3xl">

          {/* Page Heading */}
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

          {/* Upload Card */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative overflow-hidden rounded-3xl border border-indigo-100/80 bg-white/90 p-5 shadow-xl shadow-indigo-100/50 backdrop-blur-xl sm:p-8 md:p-10"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-400" />

            {/* Step Indicator */}
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
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-sm font-bold text-white shadow-md shadow-indigo-200">
                    1
                  </div>

                  <span className="hidden text-sm font-semibold text-indigo-700 sm:block">
                    Upload Resume
                  </span>
                </div>

                <div className="h-1 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "50%" }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-violet-600"
                  />
                </div>

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

            {/* Upload Heading */}
            <div className="mb-7 text-center">
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                Upload Your Resume
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
                Let's take a closer look at your professional profile.
              </p>
            </div>

            {/* Drag and Drop Upload Area */}
            <motion.label
              htmlFor="resume-upload"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              animate={{
                scale: isDragging ? 1.015 : 1,
                borderColor: isDragging
                  ? "#6366f1"
                  : file
                    ? "#818cf8"
                    : "#c7d2fe",
              }}
              transition={{ duration: 0.2 }}
              className={`group relative flex min-h-[230px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed px-4 py-8 text-center transition-all duration-300 sm:min-h-[260px] ${
                isDragging
                  ? "bg-indigo-100/80 shadow-lg shadow-indigo-100"
                  : file
                    ? "bg-indigo-50/50"
                    : "bg-gradient-to-br from-indigo-50/50 via-white to-violet-50/50 hover:bg-indigo-50/70"
              }`}
            >
              {/* Drag Overlay */}
              <AnimatePresence>
                {isDragging && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-indigo-600/10 backdrop-blur-[2px]"
                  >
                    <motion.div
                      initial={{ scale: 0.7, y: 12 }}
                      animate={{ scale: 1, y: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 250,
                        damping: 16,
                      }}
                      className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-xl shadow-indigo-300/60"
                    >
                      <FiUploadCloud className="text-4xl" />
                    </motion.div>

                    <p className="mt-5 text-lg font-extrabold text-indigo-700">
                      Drop your PDF here
                    </p>

                    <p className="mt-2 text-sm font-medium text-indigo-500">
                      Release to select your resume
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Decorative Background */}
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-indigo-100/60 blur-3xl transition-all group-hover:bg-violet-200/60" />

              {/* Upload Icon */}
              <motion.div
                animate={
                  isDragging
                    ? { y: [0, -8, 0], scale: 1.08 }
                    : { y: 0, scale: 1 }
                }
                transition={{
                  duration: 0.8,
                  repeat: isDragging ? Infinity : 0,
                }}
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
                        Drag and drop your resume here
                      </p>

                      <p className="mt-2 text-sm text-slate-500">
                        or click to browse your device
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
                accept=".pdf,application/pdf"
                onChange={(e) => {
                  handleFileSelection(e.target.files?.[0]);
                  e.target.value = "";
                }}
                className="hidden"
              />
            </motion.label>

            {/* File Information */}
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
                      onClick={() => {
                        setFile(null);
                        setUploadError("");
                        setUploadSuccess(false);
                      }}
                      aria-label="Remove selected file"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                    >
                      <FiX />
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Upload Error */}
            <AnimatePresence>
              {uploadError && (
                <motion.div
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  className="mt-4 overflow-hidden"
                >
                  <div className="flex items-start gap-2 rounded-xl border border-rose-100 bg-rose-50 p-3 text-sm font-medium text-rose-600">
                    <FiAlertCircle className="mt-0.5 shrink-0" />
                    {uploadError}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Analyze Button */}
            <motion.button
              type="button"
              onClick={uploadResume}
              disabled={!file || loading || uploadSuccess}
              whileHover={file && !loading ? { y: -2 } : {}}
              whileTap={file && !loading ? { scale: 0.98 } : {}}
              animate={
                uploadSuccess
                  ? { scale: [1, 1.02, 1] }
                  : { scale: 1 }
              }
              className={`mt-7 flex w-full items-center justify-center gap-3 rounded-xl px-6 py-4 text-sm font-bold transition-all duration-300 sm:text-base ${
                uploadSuccess
                  ? "cursor-default bg-emerald-500 text-white shadow-lg shadow-emerald-200/70"
                  : !file || loading
                    ? "cursor-not-allowed bg-slate-100 text-slate-400"
                    : "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200/70 hover:shadow-xl hover:shadow-indigo-300/70"
              }`}
            >
              <AnimatePresence mode="wait">
                {uploadSuccess ? (
                  <motion.span
                    key="success"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex items-center gap-2"
                  >
                    <FiCheckCircle className="text-lg" />
                    Analysis Complete
                  </motion.span>
                ) : loading ? (
                  <motion.span
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-3"
                  >
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
                  </motion.span>
                ) : (
                  <motion.span
                    key="default"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-3"
                  >
                    Analyze Resume
                    <FiArrowRight className="text-lg" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Security Footer */}
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

          {/* Bottom Information */}
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