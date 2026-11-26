import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { GiArtificialHive } from "react-icons/gi";

import { getInterview } from "../apis/interview.api";
import Step2interview from "../components/interview/Step2interview";

const InterviewPage = ({ user, setUser }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [interview, setInterview] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchInterview = async () => {
      try {
        setLoading(true);

        const response = await getInterview(id);
        const data = response?.interview;

        if (cancelled) return;

        if (!data) {
          setInterview(null);
          return;
        }

        if (data.status === "completed") {
          navigate(`/interview/${id}/report`, { replace: true });
          return;
        }

        setInterview(data);
      } catch (error) {
        console.error("Unable to load interview:", error);

        if (!cancelled) {
          setInterview(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchInterview();

    return () => {
      cancelled = true;
    };
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#f5f6fc]">
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-violet-200/40 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative flex flex-col items-center"
        >
          <motion.div
            animate={{
              scale: [1, 1.08, 1],
              rotate: [0, 4, -4, 0],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-xl shadow-indigo-200/70"
          >
            <GiArtificialHive className="text-4xl" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-5 text-center"
          >
            <h2 className="text-lg font-extrabold tracking-tight text-slate-800">
              Fresher<span className="text-indigo-600">AI</span>
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Preparing your interview...
            </p>
          </motion.div>

          <div className="mt-5 h-1 w-32 overflow-hidden rounded-full bg-indigo-100">
            <motion.div
              animate={{ x: [-128, 128] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="h-full w-1/2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600"
            />
          </div>
        </motion.div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f6fc] px-5">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200/70">
            <GiArtificialHive className="text-3xl" />
          </div>

          <h2 className="mt-4 text-lg font-bold text-slate-800">
            Interview unavailable
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            We couldn't load this interview.
          </p>

          <button
            onClick={() => navigate("/dashboard")}
            className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <Step2interview
      interviewData={{
        interviewId: interview?._id,
        currentQuestion: interview?.currentQuestion,
        totalQuestions: interview?.questions?.length,
        question: interview?.questions?.[interview?.currentQuestion],
      }}
      user={user}
    />
  );
};

export default InterviewPage;
