import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { FiArrowLeft, FiDownload, FiZoomIn } from "react-icons/fi";
import { GiArtificialHive } from "react-icons/gi";

import DownloadBtn from "./DownloadBtn";
import ATSTemplate from "./ATStemplate";
import { useNavigate } from "react-router-dom";

const PAGE_WIDTH = 794;
const MIN_PAGE_HEIGHT = 1123;

const PriviewResume = ({ data, onBack }) => {
  const resumeRef = useRef(null);
  const previewAreaRef = useRef(null);

  const [scale, setScale] = useState(1);
  const [documentHeight, setDocumentHeight] = useState(MIN_PAGE_HEIGHT);

  // Responsive preview scaling
  const calculateScale = useCallback(() => {
    if (!previewAreaRef.current) return;

    const availableWidth = previewAreaRef.current.clientWidth;

    const newScale = Math.min(1, availableWidth / PAGE_WIDTH);

    setScale(Math.max(0.1, newScale));
  }, []);

  useEffect(() => {
    calculateScale();

    const observer = new ResizeObserver(calculateScale);

    if (previewAreaRef.current) {
      observer.observe(previewAreaRef.current);
    }

    window.addEventListener("resize", calculateScale);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", calculateScale);
    };
  }, [calculateScale]);

  // Measure complete resume height
  const measureDocument = useCallback(() => {
    const element = resumeRef.current?.querySelector("#resume-document");

    if (!element) return;

    const height = Math.max(
      element.scrollHeight,
      element.offsetHeight,
      MIN_PAGE_HEIGHT,
    );

    setDocumentHeight((previous) => (previous === height ? previous : height));
  }, []);
  const navigate = useNavigate();

  useEffect(() => {
    const element = resumeRef.current?.querySelector("#resume-document");

    if (!element) return;

    measureDocument();

    const observer = new ResizeObserver(measureDocument);
    observer.observe(element);

    const frame = requestAnimationFrame(measureDocument);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [data, measureDocument]);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#f4f6ff] text-slate-900">
      {/* NAVBAR */}

      <motion.nav
        id="navi"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-40 flex w-full items-center justify-between gap-2 border-b border-slate-200/70 bg-white/90 px-5 py-3 backdrop-blur-xl sm:px-8 sm:py-4 lg:px-16"
      >
        <div className="mx-auto grid min-h-[76px] w-full max-w-none grid-cols-2 items-center gap-x-3 gap-y-3 sm:grid-cols-[1fr_auto_1fr]">
          {/* FRESHERAI BRAND */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            onClick={() => navigate("/dashboard")}
            className="flex min-w-0 cursor-pointer items-center gap-3"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200/70">
              <GiArtificialHive className="text-2xl" />
            </div>

            <span className="truncate text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
              Fresher<span className="text-indigo-600">AI</span>
            </span>
          </motion.div>

          {/* CENTER TITLE */}
          <div className="flex items-center justify-end sm:justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/70 px-3 py-2 text-xs font-bold text-indigo-700 sm:px-5 sm:py-2.5 sm:text-sm">
              <FiDownload className="h-4 w-4 shrink-0" />
              <span className="whitespace-nowrap">Resume Builder</span>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="col-span-2 flex w-full items-center justify-end gap-2 sm:col-span-1">
            <motion.button
              type="button"
              onClick={onBack}
              whileTap={{ scale: 0.96 }}
              aria-label="Back to edit"
              className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 sm:flex-none sm:px-4 sm:py-2.5 sm:text-sm"
            >
              <FiArrowLeft className="h-4 w-4 shrink-0" />
              <span className="whitespace-nowrap">Back to Edit</span>
            </motion.button>

            <div className="min-w-0 flex-1 sm:flex-none">
              <DownloadBtn docRef={resumeRef} />
            </div>
          </div>
        </div>
      </motion.nav>

      {/* PREVIEW WORKSPACE */}
      <main className="relative min-h-[calc(100vh-76px)] w-full px-3 py-6 sm:px-6 sm:py-9 lg:px-10">
        {/* BACKGROUND DECORATION */}
        <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-indigo-200/40 blur-3xl" />

        <div className="pointer-events-none absolute -right-40 bottom-10 h-80 w-80 rounded-full bg-violet-200/40 blur-3xl" />

        <div className="relative mx-auto w-full max-w-7xl">
          {/* PREVIEW DETAILS */}
          <div className="mb-5 flex flex-col items-center justify-between gap-3 sm:flex-row">
            <div className="text-center sm:text-left">
              <h2 className="text-base font-extrabold text-slate-800 sm:text-lg">
                Your professional resume
              </h2>

              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                Review your details, formatting and section order.
              </p>
            </div>

            {/* ZOOM INDICATOR */}
            <div className="inline-flex shrink-0 items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 text-xs font-semibold text-indigo-700 shadow-sm">
              <FiZoomIn className="h-4 w-4" />
              <span>{Math.round(scale * 100)}% Preview</span>
            </div>
          </div>

          {/* RESUME DOCUMENT PANEL */}
          <div className="w-full rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-100/70 via-slate-100 to-violet-100/70 p-2 shadow-inner sm:p-5 lg:p-8">
            <div ref={previewAreaRef} className="flex w-full justify-center">
              {/* DYNAMIC DOCUMENT WRAPPER */}
              <div
                className="relative shrink-0"
                style={{
                  width: `${PAGE_WIDTH * scale}px`,
                  height: `${documentHeight * scale}px`,
                }}
              >
                {/* ACTUAL A4 RESUME */}
                <div
                  className="absolute left-0 top-0 bg-white"
                  style={{
                    width: `${PAGE_WIDTH}px`,
                    minHeight: `${MIN_PAGE_HEIGHT}px`,
                    height: "auto",
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                    boxShadow: "0 12px 40px rgba(15, 23, 42, 0.18)",
                  }}
                >
                  <div ref={resumeRef}>
                    <ATSTemplate data={data} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 px-2 text-center text-[10px] font-medium text-slate-400 sm:text-xs">
            <span>Single-column layout</span>

            <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />

            <span>ATS-conscious formatting</span>

            <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />

            <span>PDF-ready document</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PriviewResume;
