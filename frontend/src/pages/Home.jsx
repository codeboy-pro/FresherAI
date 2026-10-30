import { useState } from "react";
import { motion } from "motion/react";
import { GiArtificialHive } from "react-icons/gi";
import { FaArrowRight } from "react-icons/fa6";
import {
  FiBarChart2,
  FiFileText,
  FiMap,
  FiMic,
  FiCheckCircle,
  FiStar,
  FiArrowUpRight,
} from "react-icons/fi";

import LoginModel from "../components/LoginModel";
import dashboard from "../assets/dash.png";

const Home = ({ setUser }) => {
  const [showLogin, setShowLogin] = useState(false);

  const agents = [
    {
      icon: <FiFileText />,
      title: "Resume Agent",
      desc: "Create ATS-friendly resumes, improve profile strength and maximize interview opportunities.",
      number: "01",
    },
    {
      icon: <FiMic />,
      title: "Interview Agent",
      desc: "Conduct realistic HR, Technical and Coding interviews with AI-powered simulations.",
      number: "02",
    },
    {
      icon: <FiBarChart2 />,
      title: "Feedback Agent",
      desc: "Get detailed answer analysis, scoring reports and improvement recommendations.",
      number: "03",
    },
    {
      icon: <FiMap />,
      title: "Roadmap Agent",
      desc: "Generate personalized learning roadmaps based on goals and skill performance.",
      number: "04",
    },
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-700">
      {/* NAVBAR */}
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
          onClick={() => setShowLogin(true)}
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="group inline-flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200/60 transition-colors duration-300 hover:bg-indigo-700 sm:px-6 sm:py-3 sm:text-base"
        >
          Login
          <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
        </motion.button>
      </motion.nav>
      {/* HERO SECTION */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-white via-indigo-50/50 to-violet-50/70">
        <div className="pointer-events-none absolute -left-40 top-10 -z-10 h-96 w-96 rounded-full bg-indigo-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 top-20 -z-10 h-96 w-96 rounded-full bg-violet-200/30 blur-3xl" />

        <div className="mx-auto grid max-w-[1440px] items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-10 lg:px-10 lg:py-24">
          {/* Hero Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.12 },
              },
            }}
            className="relative z-10 mx-auto w-full max-w-2xl text-center lg:mx-0 lg:text-left"
          >
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="mb-7 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-4 py-2 text-xs font-semibold text-indigo-700 shadow-sm sm:text-sm"
            >
              <FiStar className="text-base text-violet-600" />
              Multi-Agent AI Interview Platform
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </motion.div>

            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.55 }}
              className="text-4xl font-extrabold leading-[1.13] tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-[3.6rem] xl:text-7xl"
            >
              Job Interviews
              <br />
              Don&apos;t Have to
              <br />
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-500 bg-clip-text text-transparent">
                Suck Anymore!
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.55 }}
              className="mx-auto mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8 lg:mx-0"
            >
              FresherAI is an innovative AI-powered interview preparation
              platform designed to help job seekers excel in their interviews.
            </motion.p>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.55 }}
              className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-3 text-sm font-medium text-slate-600 lg:justify-start"
            >
              <span className="inline-flex items-center gap-2">
                <FiCheckCircle className="text-emerald-500" />
                AI-powered practice
              </span>
              <span className="inline-flex items-center gap-2">
                <FiCheckCircle className="text-emerald-500" />
                Personalized feedback
              </span>
            </motion.div>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.55 }}
              className="mt-9 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start"
            >
              <motion.button
                type="button"
                onClick={() => setShowLogin(true)}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="group inline-flex cursor-pointer items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-7 py-4 text-base font-bold text-white shadow-xl shadow-indigo-200/70 transition hover:shadow-indigo-300/70"
              >
                Get Started For Free
                <FaArrowRight className="text-sm transition-transform group-hover:translate-x-1" />
              </motion.button>

              <a
                href="#agents"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-7 py-4 text-base font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50/60"
              >
                Explore AI Agents
                <FiArrowUpRight className="text-lg" />
              </a>
            </motion.div>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.55 }}
              className="mt-5 text-xs text-slate-500 sm:text-sm"
            >
              Your next interview starts with better preparation.
            </motion.p>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, x: 30, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.75, delay: 0.2, ease: "easeOut" }}
            className="relative mx-auto w-full max-w-2xl lg:max-w-none"
          >
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-indigo-200/50 via-violet-100/40 to-blue-100/50 blur-2xl" />

            <motion.div
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
              className="relative overflow-hidden rounded-2xl border border-white bg-white p-2 shadow-2xl shadow-indigo-200/40 sm:rounded-3xl sm:p-3"
            >
              <div className="flex items-center justify-between border-b border-slate-100 px-3 py-3 sm:px-4">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </div>

                <span className="rounded-md bg-slate-50 px-3 py-1 text-[10px] font-medium text-slate-400 sm:text-xs">
                  FresherAI Dashboard
                </span>

                <FiStar className="text-indigo-500" />
              </div>

              <img
                src={dashboard}
                alt="FresherAI interview analytics dashboard preview"
                className="block h-auto w-full rounded-b-xl object-contain sm:rounded-b-2xl"
              />
            </motion.div>

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -bottom-5 left-2 flex items-center gap-3 rounded-2xl border border-white bg-white/95 p-3 shadow-xl shadow-indigo-200/40 sm:-bottom-6 sm:-left-6 sm:gap-4 sm:p-4"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 sm:h-12 sm:w-12">
                <FiBarChart2 className="text-xl sm:text-2xl" />
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-500">
                  Your progress
                </p>
                <p className="text-sm font-bold text-slate-900 sm:text-base">
                  Learn. Practice. Improve.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* AI AGENTS */}
      <section
        id="agents"
        className="relative overflow-hidden bg-white px-4 py-20 sm:px-6 sm:py-24 lg:px-10 lg:py-28"
      >
        <div className="mx-auto max-w-[1440px]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.12 },
              },
            }}
            className="mx-auto mb-14 max-w-3xl text-center"
          >
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-indigo-700 sm:text-sm"
            >
              <FiStar />
              AI Powered Agents
            </motion.div>

            <motion.h2
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl"
            >
              Specialized Agents For
              <span className="mt-2 block bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Every Interview Stage
              </span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8"
            >
              Fresher.AI combines multiple AI agents that work together to help
              you build your resume, practice interviews, receive detailed
              feedback, and follow a personalized roadmap to land your dream
              job.
            </motion.p>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {agents.map((agent, index) => (
              <motion.div
                key={agent.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.1 }}
                whileHover={{ y: -7 }}
                className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-shadow duration-300 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/60 sm:p-7"
              >
                <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-indigo-100/60 blur-3xl transition-colors group-hover:bg-violet-200/60" />

                <div className="relative mb-7 flex items-start justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-100 text-2xl text-indigo-600 ring-1 ring-indigo-100 transition duration-300 group-hover:scale-105 group-hover:from-indigo-600 group-hover:to-violet-600 group-hover:text-white">
                    {agent.icon}
                  </div>

                  <span className="text-sm font-bold tracking-widest text-slate-300">
                    {agent.number}
                  </span>
                </div>

                <div className="relative">
                  <h3 className="text-lg font-bold text-slate-900 transition-colors group-hover:text-indigo-700 sm:text-xl">
                    {agent.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {agent.desc}
                  </p>
                </div>

                <div className="relative mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="text-xs font-semibold text-slate-500">
                    AI-powered assistance
                  </span>

                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-all group-hover:bg-indigo-600 group-hover:text-white">
                    <FiArrowUpRight />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-violet-50 px-4 py-16 sm:px-6 sm:py-20 lg:px-10"
      >
        <div className="mx-auto grid max-w-6xl items-center gap-10 rounded-3xl border border-indigo-100/80 bg-white/80 p-7 shadow-xl shadow-indigo-100/40 backdrop-blur-sm sm:p-10 lg:grid-cols-2 lg:gap-14 lg:p-14">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-indigo-700">
              <FiStar />
              Your interview companion
            </span>

            <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">
              Turn preparation into
              <span className="block text-indigo-600">real confidence.</span>
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-600">
              Practice in a structured environment, understand your strengths,
              and discover the areas where you can improve before your next
              interview.
            </p>

            <motion.button
              type="button"
              onClick={() => setShowLogin(true)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="mt-7 inline-flex cursor-pointer items-center gap-3 rounded-xl bg-indigo-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-indigo-200/70 transition hover:bg-indigo-700"
            >
              Start Your Journey
              <FaArrowRight className="text-sm" />
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="grid gap-4 sm:grid-cols-2"
          >
            {[
              {
                icon: <FiMic />,
                title: "Practice",
                desc: "Prepare with realistic interview simulations.",
              },
              {
                icon: <FiBarChart2 />,
                title: "Analyze",
                desc: "Understand your performance and skill gaps.",
              },
              {
                icon: <FiFileText />,
                title: "Improve",
                desc: "Strengthen your resume and responses.",
              },
              {
                icon: <FiMap />,
                title: "Progress",
                desc: "Follow a learning path tailored to your goals.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-xl text-indigo-600">
                  {item.icon}
                </div>

                <h3 className="font-bold text-slate-900">{item.title}</h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {item.desc}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white px-4 py-7 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-5 sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-200/60">
              <GiArtificialHive className="text-xl" />
            </div>

            <span className="text-lg font-extrabold tracking-tight text-slate-900">
              Fresher<span className="text-indigo-600">AI</span>
            </span>
          </div>

          <p className="text-center text-xs text-slate-500 sm:text-sm">
            © {new Date().getFullYear()} FresherAI. All rights reserved.
          </p>

          <a
            href="#navi"
            className="text-sm font-semibold text-slate-500 transition hover:text-indigo-600"
          >
            Back to top ↑
          </a>
        </div>
      </footer>

      {/* LOGIN MODAL */}
      {showLogin && (
        <LoginModel onClose={() => setShowLogin(false)} setUser={setUser} />
      )}
    </div>
  );
};

export default Home;
