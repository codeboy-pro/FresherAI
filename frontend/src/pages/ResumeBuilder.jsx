import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

import { GiArtificialHive } from "react-icons/gi";
import {
  FiFileText,
  FiArrowLeft,
  FiEye,
  FiArrowRight,
  FiCheck,
  FiStar,
} from "react-icons/fi";

import ResumeForm from "../components/resume/ResumeForm";
import initialData from "../components/resume/initialData";
import PriviewResume from "../components/resume/PriviewResume";

const STEPS = [
  {
    step: 1,
    title: "Personal Information",
    subtitle: "Your basic contact details",
  },
  {
    step: 2,
    title: "Professional Summary",
    subtitle: "A quick intro about yourself",
  },
  { step: 3, title: "Skills", subtitle: "Your technical skills" },
  {
    step: 4,
    title: "Work Experience",
    subtitle: "Your past jobs & internships",
  },
  { step: 5, title: "Projects", subtitle: "Projects you have built" },
  { step: 6, title: "Education", subtitle: "Your academic background" },
];

const ResumeBuilder = ({ user, setUser }) => {
  const navigate = useNavigate();

  const [showPreview, setShowPreview] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState(() => ({
    ...initialData,
    experience: [],
    projects: [],
    education: [],
  }));

  const totalSteps = STEPS.length;
  const progressPct = (currentStep / totalSteps) * 100;
  const activeStep = STEPS.find((item) => item.step === currentStep);
  const isLastStep = currentStep === totalSteps;

  const goPrev = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const goNext = () => {
    setCurrentStep((prev) => Math.min(totalSteps, prev + 1));
  };

  if (showPreview) {
    return (
      <PriviewResume
        data={data}
        user={user}
        setUser={setUser}
        onBack={() => setShowPreview(false)}
      />
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f5f6ff] text-slate-900">
      {/* NAVBAR */}
      <motion.nav
        id="navi"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 flex w-full items-center justify-between gap-2 border-b border-slate-200/70 bg-white/90 px-3 py-3 backdrop-blur-xl sm:px-6 sm:py-4 lg:px-16"
      >
        <motion.div
          whileHover={{ scale: 1.03 }}
          onClick={() => navigate("/dashboard")}
          className="flex min-w-0 cursor-pointer items-center gap-2 sm:gap-3"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200/70 sm:h-11 sm:w-11 sm:rounded-2xl">
            <GiArtificialHive className="text-xl sm:text-2xl" />
          </div>

          <span className="truncate text-lg font-extrabold tracking-tight text-slate-900 sm:text-2xl">
            Fresher<span className="text-indigo-600">AI</span>
          </span>
        </motion.div>

        <div className="hidden items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/70 px-4 py-2 sm:flex">
          <FiFileText className="text-indigo-600" />
          <span className="text-sm font-semibold text-indigo-700">
            Resume Builder
          </span>
        </div>

        <motion.button
          type="button"
          onClick={() => setShowPreview(true)}
          whileTap={{ scale: 0.96 }}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-200/70 transition hover:bg-indigo-700 sm:gap-2 sm:rounded-xl sm:px-5 sm:py-3 sm:text-sm"
        >
          <FiEye className="text-sm sm:text-base" />
          <span className="hidden xs:inline sm:inline">Preview</span>
        </motion.button>
      </motion.nav>

      <main className="relative min-h-screen px-3 py-6 sm:px-6 sm:py-9 lg:px-10">
        {/* BACKGROUND */}
        <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-indigo-200/40 blur-3xl sm:h-96 sm:w-96" />
        <div className="pointer-events-none absolute -right-40 top-96 h-80 w-80 rounded-full bg-violet-200/40 blur-3xl sm:h-96 sm:w-96" />

        <div className="relative mx-auto max-w-7xl">
          {/* HEADING */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 sm:mb-8"
          >
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600 shadow-sm sm:text-xs">
              <FiStar />
              Smart Resume Builder
            </div>

            <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              Build a resume that
              <span className="block bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent sm:inline">
                {" "}
                gets noticed.
              </span>
            </h1>

            <p className="mt-2 max-w-2xl text-xs leading-6 text-slate-500 sm:text-sm sm:leading-7">
              Complete each section, preview your professional resume, and
              download it as a PDF when you're ready.
            </p>
          </motion.div>

          {/* PROGRESS CARD */}
          <div className="mb-5 rounded-2xl border border-indigo-100 bg-white p-4 shadow-sm sm:mb-7 sm:p-6">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 sm:text-xs">
                  Your progress
                </p>
                <p className="mt-1 text-xs font-bold text-slate-800 sm:text-sm">
                  Step {currentStep} of {totalSteps}
                </p>
              </div>

              <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-extrabold text-indigo-700 sm:text-sm">
                {Math.round(progressPct)}%
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-violet-600"
                initial={false}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>

          {/* MAIN BUILDER */}
          <div className="grid items-start gap-5 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-6">
            {/* STEP NAVIGATION */}
            <aside className="min-w-0 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm lg:sticky lg:top-28 lg:p-4">
              <div className="mb-3 hidden px-2 lg:block">
                <h2 className="text-sm font-extrabold text-slate-800">
                  Resume Sections
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Move through each step
                </p>
              </div>

              {/* Horizontal on mobile, vertical on desktop */}
              <div className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-2 scrollbar-thin lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0">
                {STEPS.map((item) => {
                  const active = item.step === currentStep;
                  const completed = item.step < currentStep;

                  return (
                    <motion.button
                      key={item.step}
                      type="button"
                      onClick={() => setCurrentStep(item.step)}
                      whileTap={{ scale: 0.97 }}
                      className={`flex min-w-[112px] shrink-0 snap-start flex-col items-center gap-2 rounded-xl p-3 text-center transition-all duration-200 sm:min-w-[135px] lg:min-w-0 lg:flex-row lg:gap-3 lg:p-3 lg:text-left ${
                        active
                          ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200/60"
                          : completed
                            ? "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                            : "bg-slate-50 text-slate-500 hover:bg-slate-100 lg:bg-white"
                      }`}
                    >
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-extrabold sm:h-9 sm:w-9 ${
                          active
                            ? "bg-white/15 text-white"
                            : completed
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {completed ? <FiCheck /> : item.step}
                      </span>

                      <span className="min-w-0">
                        <span className="block text-[10px] font-extrabold leading-tight sm:text-xs lg:text-sm">
                          {item.title}
                        </span>

                        <span
                          className={`mt-1 hidden text-[11px] lg:block ${
                            active
                              ? "text-indigo-100"
                              : completed
                                ? "text-emerald-700/70"
                                : "text-slate-400"
                          }`}
                        >
                          {item.subtitle}
                        </span>
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              <div className="mt-5 hidden rounded-xl bg-indigo-50 p-4 lg:block">
                <div className="flex items-center gap-2 text-indigo-700">
                  <FiStar />
                  <span className="text-xs font-extrabold">Pro tip</span>
                </div>
                <p className="mt-2 text-xs leading-5 text-indigo-700/75">
                  Use action verbs and measurable achievements to make your
                  resume more impactful.
                </p>
              </div>
            </aside>

            {/* FORM PANEL */}
            <motion.section
              key={currentStep}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full min-w-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm"
            >
              <div className="border-b border-slate-100 bg-gradient-to-r from-indigo-50/80 via-white to-violet-50/70 px-4 py-5 sm:px-7 sm:py-6">
                <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-indigo-600 sm:text-xs">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-100">
                    {currentStep}
                  </span>
                  Section {currentStep}
                </div>

                <h2 className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                  {activeStep?.title}
                </h2>

                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  {activeStep?.subtitle}
                </p>
              </div>

              <div className="p-4 sm:p-7 lg:p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ResumeForm
                      step={currentStep}
                      data={data}
                      setData={setData}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* NAVIGATION FOOTER */}
              <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/70 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-5">
                <motion.button
                  type="button"
                  onClick={goPrev}
                  disabled={currentStep === 1}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:px-5 sm:text-sm"
                >
                  <FiArrowLeft />
                  Previous
                </motion.button>

                <div className="hidden items-center justify-center gap-1.5 sm:flex">
                  {STEPS.map((item) => (
                    <button
                      key={item.step}
                      type="button"
                      aria-label={`Go to ${item.title}`}
                      onClick={() => setCurrentStep(item.step)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        item.step === currentStep
                          ? "w-7 bg-indigo-600"
                          : item.step < currentStep
                            ? "w-2 bg-emerald-400"
                            : "w-2 bg-slate-300 hover:bg-indigo-300"
                      }`}
                    />
                  ))}
                </div>

                {isLastStep ? (
                  <motion.button
                    type="button"
                    onClick={() => setShowPreview(true)}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-200/70 transition hover:shadow-xl sm:w-auto sm:text-sm"
                  >
                    <FiEye />
                    Preview Resume
                  </motion.button>
                ) : (
                  <motion.button
                    type="button"
                    onClick={goNext}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-200/70 transition hover:shadow-xl sm:w-auto sm:text-sm"
                  >
                    Next Step
                    <FiArrowRight />
                  </motion.button>
                )}
              </div>
            </motion.section>
          </div>

          <p className="mt-6 text-center text-[10px] font-medium text-slate-400 sm:text-xs">
            Your resume can be previewed and downloaded after completing the
            sections.
          </p>
        </div>
      </main>
    </div>
  );
};

export default ResumeBuilder;
