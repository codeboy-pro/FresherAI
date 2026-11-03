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
  FiTarget,
  FiAward,
} from "react-icons/fi";
import { GiArtificialHive } from "react-icons/gi";
import api from "../utils/axios";
import { setResume } from "../redux/resumeSlice";
import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts";

/* ================= ANIMATION VARIANTS ================= */

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

/* ================= SCORE RING ================= */

const ScoreRing = ({ score }) => {
  const scoreValue = Math.min(100, Math.max(0, Number(score) || 0));

  const scoreColor =
    scoreValue >= 75 ? "#34d399" : scoreValue >= 50 ? "#fbbf24" : "#fb7185";

  return (
    <div className="relative flex h-[210px] w-[210px] items-center justify-center">
      <div className="absolute inset-2 rounded-full bg-white/5 blur-xl" />

      <RadialBarChart
        width={210}
        height={210}
        cx="50%"
        cy="50%"
        innerRadius={82}
        outerRadius={96}
        barSize={13}
        data={[{ value: scoreValue }]}
        startAngle={90}
        endAngle={-270}
      >
        <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />

        <RadialBar
          dataKey="value"
          cornerRadius={20}
          background={{ fill: "rgba(255,255,255,0.13)" }}
          fill={scoreColor}
          isAnimationActive
          animationDuration={1400}
        />
      </RadialBarChart>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-6xl font-extrabold tracking-tighter text-white"
        >
          {scoreValue}
        </motion.span>

        <span className="mt-1 text-xs font-bold tracking-[0.2em] text-indigo-200">
          OUT OF 100
        </span>
      </div>
    </div>
  );
};

/* ================= TAG ================= */

const Tag = ({ text, color }) => {
  const styles = {
    green: "border-emerald-200 bg-emerald-50 text-emerald-700",
    yellow: "border-amber-200 bg-amber-50 text-amber-700",
    red: "border-rose-200 bg-rose-50 text-rose-700",
    blue: "border-indigo-200 bg-indigo-50 text-indigo-700",
  };

  return (
    <motion.span
      variants={fadeUp}
      className={`inline-flex max-w-full items-center rounded-xl border px-3.5 py-2.5 text-xs font-semibold leading-relaxed sm:text-sm ${
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
  fullWidth = false,
}) => {
  const styles = {
    green: {
      icon: "bg-emerald-100 text-emerald-700",
      accent: "from-emerald-400 to-teal-500",
      glow: "bg-emerald-100/70",
      label: "text-emerald-700",
      background:
        "bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/60",
    },
    yellow: {
      icon: "bg-amber-100 text-amber-700",
      accent: "from-amber-400 to-orange-500",
      glow: "bg-amber-100/70",
      label: "text-amber-700",
      background:
        "bg-gradient-to-br from-amber-50/80 via-white to-orange-50/60",
    },
    red: {
      icon: "bg-rose-100 text-rose-700",
      accent: "from-rose-400 to-pink-500",
      glow: "bg-rose-100/70",
      label: "text-rose-700",
      background: "bg-gradient-to-br from-rose-50/80 via-white to-pink-50/60",
    },
    blue: {
      icon: "bg-indigo-100 text-indigo-700",
      accent: "from-indigo-400 to-violet-500",
      glow: "bg-indigo-100/70",
      label: "text-indigo-700",
      background:
        "bg-gradient-to-br from-indigo-50/80 via-white to-violet-50/60",
    },
  };

  const theme = styles[color] || styles.blue;
  const values = Array.isArray(items) ? items : [];

  return (
    <motion.div
      variants={fadeUp}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4 }}
      className={`group relative overflow-hidden rounded-3xl border border-slate-200/80 ${theme.background} p-5 shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-slate-200/60 sm:p-7 ${
        fullWidth ? "w-full" : ""
      }`}
    >
      {/* Top accent */}
      <div
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${theme.accent}`}
      />

      {/* Decorative glow */}
      <div
        className={`pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full ${theme.glow} opacity-50 blur-3xl transition-opacity duration-500 group-hover:opacity-90`}
      />

      <div className="relative">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${theme.icon} shadow-sm`}
            >
              <Icon className="text-2xl" />
            </div>

            <div>
              <h3 className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
                {title}
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                {description}
              </p>
            </div>
          </div>

          <span
            className={`w-fit rounded-full border border-white/80 bg-white/80 px-3 py-1.5 text-xs font-bold ${theme.label} shadow-sm`}
          >
            {values.length} {values.length === 1 ? "item" : "items"}
          </span>
        </div>

        <div className="my-6 h-px bg-slate-200/70" />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap gap-2.5"
        >
          {values.length > 0 ? (
            values.map((item, i) => (
              <Tag key={`${item}-${i}`} text={item} color={tagColor} />
            ))
          ) : (
            <div className="flex w-full items-center gap-3 rounded-xl border border-slate-200/70 bg-white/70 p-4">
              <FiCheckCircle className="shrink-0 text-emerald-500" />
              <p className="text-sm font-medium text-slate-500">
                No information available.
              </p>
            </div>
          )}
        </motion.div>
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

      <div className="hidden items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/70 px-3 py-2 sm:flex sm:px-4">
        <FiFileText className="text-indigo-600" />
        <span className="text-xs font-semibold text-indigo-700 sm:text-sm">
          {label}
        </span>
      </div>

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

      const response = await api.post("/api/resume/upload", formData);

      setUploadSuccess(true);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      dispatch(setResume(response?.data?.data));
    } catch (error) {
      console.error("Resume upload failed:", error);

      setUploadError(
        error?.response?.data?.message ||
          "Unable to analyze your resume. Please try again.",
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
        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
        : score >= 50
          ? "border-amber-200 bg-amber-50 text-amber-700"
          : "border-rose-200 bg-rose-50 text-rose-700";

    return (
      <div className="min-h-screen overflow-x-hidden bg-[#f4f6ff] text-slate-900">
        <Navbar label="Resume Scorer" />

        <main className="relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
          {/* Background decoration */}
          <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />
          <div className="pointer-events-none absolute -right-40 top-[500px] h-96 w-96 rounded-full bg-violet-200/40 blur-3xl" />
          <div className="pointer-events-none absolute left-1/3 top-[900px] h-72 w-72 rounded-full bg-sky-100/50 blur-3xl" />

          <div className="relative mx-auto max-w-6xl">
            {/* HEADER */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center"
            >
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/80 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 shadow-sm">
                  <FiCheckCircle />
                  Analysis Completed
                </div>

                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
                  Your Resume Insights
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                  Discover your strengths, identify skill gaps, and take the
                  next step toward your career goals.
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
                className="inline-flex w-fit items-center gap-2 rounded-xl border border-indigo-200 bg-white px-4 py-3 text-sm font-semibold text-indigo-600 shadow-sm transition hover:bg-indigo-50 hover:shadow-md"
              >
                <FiRefreshCw />
                Re-upload Resume
              </motion.button>
            </motion.div>

            {/* RESUME FILE INFORMATION */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-7 flex items-center gap-3 rounded-2xl border border-indigo-100 bg-white/80 p-4 shadow-sm backdrop-blur sm:p-5"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 text-indigo-600">
                <FiFileText className="text-xl" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Analyzed Resume
                </p>
                <h2 className="mt-1 truncate text-sm font-bold text-slate-800 sm:text-base">
                  {resume.name || "Your Resume"}
                </h2>
              </div>

              <div className="ml-auto hidden shrink-0 items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 sm:flex">
                <FiCheckCircle />
                Successfully analyzed
              </div>
            </motion.div>

            {/* SCORE OVERVIEW */}
            <motion.section
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="relative mb-8 overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 p-6 shadow-2xl shadow-indigo-200/70 sm:p-9 lg:p-10"
            >
              {/* Decorative elements */}
              <div className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full border border-white/10" />
              <div className="pointer-events-none absolute -right-10 -top-16 h-60 w-60 rounded-full border border-white/10" />
              <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
              <div className="pointer-events-none absolute -left-20 bottom-0 h-60 w-60 rounded-full bg-indigo-500/20 blur-3xl" />

              <div className="relative grid items-center gap-8 md:grid-cols-[0.9fr_1.1fr] md:gap-12">
                {/* SCORE */}
                <div className="flex flex-col items-center justify-center border-b border-white/10 pb-7 md:border-b-0 md:border-r md:pb-0 md:pr-10">
                  <div className="mb-2 flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-indigo-100">
                    <FiAward className="text-amber-300" />
                    Overall Score
                  </div>

                  <ScoreRing score={score} />

                  <span
                    className={`mt-3 rounded-full border px-4 py-2 text-xs font-bold ${scoreBadge}`}
                  >
                    {scoreLabel}
                  </span>
                </div>

                {/* SCORE DETAILS */}
                <div className="text-center md:text-left">
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-indigo-300">
                    Your Resume Performance
                  </p>

                  <h2 className="mt-3 text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">
                    {score >= 75
                      ? "You're making a strong impression!"
                      : score >= 50
                        ? "You're on the right track!"
                        : "Let's build a stronger resume!"}
                  </h2>

                  <p className="mt-4 max-w-lg text-sm leading-7 text-indigo-100/75 sm:text-base">
                    Your resume has been evaluated by AI. Explore the detailed
                    feedback below to understand your strengths and discover
                    opportunities to improve.
                  </p>

                  <div className="mt-7 rounded-2xl border border-white/10 bg-white/10 p-4 text-left backdrop-blur-md sm:p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-indigo-200">
                        <FiTarget className="text-xl" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-indigo-200">
                          AI Suggested Role
                        </p>
                        <p className="mt-1 truncate text-lg font-extrabold text-white">
                          {resume?.suggestedRole || "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* STRENGTHS AND WEAKNESSES */}
            <motion.section
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="mb-8 grid gap-5 md:grid-cols-2"
            >
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
            </motion.section>

            {/* MISSING SKILLS - FULL WIDTH */}
            <section className="mb-8">
              <InsightCard
                index={2}
                title="Missing Skills"
                description="Important skills you should consider learning to strengthen your professional profile"
                icon={FiZap}
                items={resume?.missingSkills}
                color="red"
                tagColor="red"
                fullWidth
              />
            </section>

            {/* RECOMMENDATIONS - FULL WIDTH */}
            <section className="mb-8">
              <InsightCard
                index={3}
                title="Recommendations"
                description="Actionable suggestions to improve your resume and make it more impactful"
                icon={FiTrendingUp}
                items={resume?.recommendations}
                color="blue"
                tagColor="blue"
                fullWidth
              />
            </section>

            {/* FOOTER */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-10 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-violet-50 p-5 text-center sm:p-6"
            >
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                <FiTrendingUp className="text-xl" />
              </div>

              <h3 className="text-base font-extrabold text-slate-800">
                Small improvements make a big difference.
              </h3>

              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
                Use these AI-powered insights as a guide to improve your resume
                and move closer to your career goals.
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-2">
                  <FiShield className="text-emerald-500" />
                  AI-powered insights
                </span>

                <span className="flex items-center gap-2">
                  <FiCheckCircle className="text-indigo-500" />
                  Personalized feedback
                </span>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    );
  }

  /* ================= UPLOAD PAGE ================= */

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f4f6ff] text-slate-900">
      <Navbar label="Resume Scorer" />

      <main className="relative min-h-[calc(100vh-76px)] overflow-hidden px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16">
        {/* BACKGROUND DECORATIONS */}
        <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-40 top-80 h-96 w-96 rounded-full bg-violet-200/40 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-sky-100/50 blur-3xl" />

        <div className="relative mx-auto max-w-5xl">
          {/* PAGE HEADING */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10 text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-wider text-indigo-700 shadow-sm sm:text-sm"
            >
              <FiFileText className="text-base" />
              AI Powered Resume Scorer
            </motion.div>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl lg:text-[3.5rem]">
              Your Next Opportunity
              <span className="mt-2 block bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
                Starts With Your Resume.
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base sm:leading-8">
              Get a deeper understanding of your resume with AI. Discover your
              strengths, identify skill gaps, and receive actionable
              recommendations to stand out.
            </p>
          </motion.div>

          {/* MAIN UPLOAD LAYOUT */}
          <div className="grid items-stretch gap-6 lg:grid-cols-[1fr_280px]">
            {/* UPLOAD CARD */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.65, delay: 0.15 }}
              className="relative overflow-hidden rounded-[2rem] border border-indigo-100 bg-white/90 p-5 shadow-xl shadow-indigo-100/60 backdrop-blur-xl sm:p-8 lg:p-9"
            >
              {/* TOP ACCENT */}
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500" />

              {/* STEP INDICATOR */}
              <div className="mb-9">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600">
                    Your Progress
                  </span>

                  <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-600">
                    Step 1 of 2
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* STEP 1 */}
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-sm font-bold text-white shadow-lg shadow-indigo-200">
                      1
                    </div>

                    <span className="hidden text-sm font-bold text-indigo-700 sm:block">
                      Upload Resume
                    </span>
                  </div>

                  {/* PROGRESS */}
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "50%" }}
                      transition={{ duration: 1, delay: 0.4 }}
                      className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-violet-600"
                    />
                  </div>

                  {/* STEP 2 */}
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

              {/* UPLOAD HEADING */}
              <div className="mb-7">
                <h2 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                  Upload your resume
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Choose your resume and let our AI do the analysis.
                </p>
              </div>

              {/* DRAG AND DROP AREA */}
              <motion.label
                htmlFor="resume-upload"
                onDragOver={handleDragOver}
                onDragEnter={handleDragOver}
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
                className={`group relative flex min-h-[260px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed px-4 py-9 text-center transition-all duration-300 sm:min-h-[290px] ${
                  isDragging
                    ? "bg-indigo-100/80 shadow-xl shadow-indigo-100"
                    : file
                      ? "bg-gradient-to-br from-indigo-50 to-violet-50"
                      : "bg-gradient-to-br from-indigo-50/70 via-white to-violet-50/70 hover:bg-indigo-50"
                }`}
              >
                {/* DECORATIVE BACKGROUND */}
                <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-indigo-200/40 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-violet-200/40 blur-3xl" />

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
                        className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-xl shadow-indigo-300/60"
                      >
                        <FiUploadCloud className="text-4xl" />
                      </motion.div>

                      <p className="mt-5 text-xl font-extrabold text-indigo-700">
                        Drop your PDF here!
                      </p>

                      <p className="mt-2 text-sm font-medium text-indigo-500">
                        Release to select your resume
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* UPLOAD ICON */}
                <motion.div
                  animate={
                    isDragging
                      ? { y: [0, -8, 0], scale: 1.1 }
                      : { y: 0, scale: 1 }
                  }
                  transition={{
                    duration: 0.8,
                    repeat: isDragging ? Infinity : 0,
                  }}
                  className={`relative mb-5 flex h-[76px] w-[76px] items-center justify-center rounded-2xl shadow-lg transition-all duration-300 sm:h-[88px] sm:w-[88px] ${
                    file
                      ? "bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-indigo-200"
                      : "bg-white text-indigo-600 shadow-indigo-100 group-hover:-translate-y-1 group-hover:text-violet-600"
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {file ? (
                      <motion.div
                        key="file-icon"
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.6 }}
                      >
                        <FiFileText className="text-4xl" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="upload-icon"
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.6 }}
                      >
                        <FiUploadCloud className="text-4xl" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* UPLOAD TEXT */}
                <div className="relative z-10 max-w-full px-2">
                  <AnimatePresence mode="wait">
                    {file ? (
                      <motion.div
                        key="selected"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex flex-col items-center"
                      >
                        <p className="max-w-full truncate text-base font-extrabold text-indigo-700 sm:text-lg">
                          {file.name}
                        </p>

                        <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                          <FiCheckCircle />
                          PDF selected successfully
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <p className="text-base font-extrabold text-slate-800 sm:text-lg">
                          Drag and drop your resume here
                        </p>

                        <p className="mt-2 text-sm text-slate-500">
                          or{" "}
                          <span className="font-bold text-indigo-600 underline underline-offset-4">
                            browse files
                          </span>{" "}
                          from your device
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <p className="mt-5 text-xs font-medium text-slate-400">
                    PDF format only · Maximum file size 20MB
                  </p>
                </div>

                {/* FILE INPUT */}
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

              {/* SELECTED FILE DETAILS */}
              <AnimatePresence>
                {file && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: 12 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: 12 }}
                    className="mt-4 overflow-hidden"
                  >
                    <div className="flex items-center justify-between gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-3 sm:p-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                          <FiFileText className="text-xl" />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-slate-800">
                            {file.name}
                          </p>

                          <p className="mt-1 text-xs font-medium text-slate-400">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>

                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setFile(null);
                          setUploadError("");
                          setUploadSuccess(false);
                        }}
                        disabled={loading}
                        aria-label="Remove selected file"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-rose-100 hover:text-rose-600 disabled:opacity-50"
                      >
                        <FiX />
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ERROR MESSAGE */}
              <AnimatePresence>
                {uploadError && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -8, height: 0 }}
                    className="mt-4 overflow-hidden"
                  >
                    <div className="flex items-start gap-2 rounded-xl border border-rose-100 bg-rose-50 p-3.5 text-sm font-medium text-rose-600">
                      <FiAlertCircle className="mt-0.5 shrink-0" />
                      {uploadError}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ANALYZE BUTTON */}
              <motion.button
                type="button"
                onClick={uploadResume}
                disabled={!file || loading || uploadSuccess}
                whileHover={file && !loading && !uploadSuccess ? { y: -3 } : {}}
                whileTap={file && !loading ? { scale: 0.98 } : {}}
                animate={uploadSuccess ? { scale: [1, 1.02, 1] } : { scale: 1 }}
                className={`mt-7 flex w-full items-center justify-center gap-3 rounded-xl px-6 py-4 text-sm font-bold transition-all duration-300 sm:py-[18px] sm:text-base ${
                  uploadSuccess
                    ? "cursor-default bg-emerald-500 text-white shadow-lg shadow-emerald-200/70"
                    : !file || loading
                      ? "cursor-not-allowed bg-slate-100 text-slate-400"
                      : "bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200/70 hover:shadow-xl hover:shadow-indigo-300/70"
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
                      Analyze My Resume
                      <FiArrowRight className="text-lg transition-transform group-hover:translate-x-1" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* SECURITY FOOTER */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t border-slate-100 pt-5">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                  <FiShield className="text-emerald-500" />
                  Secure Resume Upload
                </div>

                <div className="hidden h-4 w-px bg-slate-200 sm:block" />

                <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                  <FiLock className="text-indigo-500" />
                  Protected Processing
                </div>
              </div>
            </motion.div>

            {/* RIGHT SIDE INFORMATION PANEL */}
            <motion.aside
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col gap-4"
            >
              {/* BENEFIT CARD */}
              <div className="relative flex-1 overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 p-6 text-white shadow-xl shadow-indigo-200/60 sm:p-7">
                <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full border border-white/10" />
                <div className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full border border-white/10" />
                <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-violet-500/20 blur-3xl" />

                <div className="relative">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-amber-300 ring-1 ring-white/15">
                    <FiZap className="text-2xl" />
                  </div>

                  <h3 className="text-xl font-extrabold leading-snug sm:text-2xl">
                    Make every application count.
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-indigo-100/75">
                    Understand how your resume presents your skills and
                    experience before sending it to recruiters.
                  </p>

                  <div className="my-7 h-px bg-white/15" />

                  <div className="space-y-5">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-300">
                        <FiCheckCircle />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-white">
                          Discover your strengths
                        </p>
                        <p className="mt-1 text-xs leading-5 text-indigo-200/70">
                          Identify what makes your profile stand out.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-400/15 text-amber-300">
                        <FiTarget />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-white">
                          Find skill gaps
                        </p>
                        <p className="mt-1 text-xs leading-5 text-indigo-200/70">
                          Discover skills worth developing.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-400/15 text-sky-300">
                        <FiTrendingUp />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-white">
                          Get actionable feedback
                        </p>
                        <p className="mt-1 text-xs leading-5 text-indigo-200/70">
                          Improve your resume with AI suggestions.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* PROCESS CARD */}
              <div className="rounded-[2rem] border border-indigo-100 bg-white/80 p-6 shadow-sm backdrop-blur-xl sm:p-7">
                <h3 className="text-sm font-extrabold text-slate-800">
                  Simple 2-step process
                </h3>

                <div className="mt-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-extrabold text-indigo-700">
                      1
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-700">
                        Upload your PDF
                      </p>
                      <p className="text-xs text-slate-400">
                        Select your resume
                      </p>
                    </div>
                  </div>

                  <div className="ml-4 h-5 border-l-2 border-dashed border-indigo-200" />

                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-sm font-extrabold text-violet-700">
                      2
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-700">
                        Get your analysis
                      </p>
                      <p className="text-xs text-slate-400">
                        Review your personalized insights
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.aside>
          </div>

          {/* BOTTOM INFORMATION */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-center text-xs font-medium text-slate-400"
          >
            <span className="flex items-center gap-2">
              <FiCheckCircle className="text-emerald-500" />
              PDF support
            </span>

            <span className="flex items-center gap-2">
              <FiCheckCircle className="text-emerald-500" />
              AI-powered analysis
            </span>

            <span className="flex items-center gap-2">
              <FiCheckCircle className="text-emerald-500" />
              Personalized insights
            </span>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Scorer;
