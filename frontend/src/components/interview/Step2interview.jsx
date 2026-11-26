// import { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { AnimatePresence, motion } from "framer-motion";
// import {
//   FiArrowRight,
//   FiCamera,
//   FiCameraOff,
//   FiClock,
//   FiCode,
//   FiMessageSquare,
//   FiMic,
//   FiMicOff,
// } from "react-icons/fi";
// import { GiArtificialHive } from "react-icons/gi";

// import maleVideo from "../../assets/male-ai.mp4";
// import femaleVideo from "../../assets/female-ai.mp4";
// import CodeEditor from "./CodeEditor";
// import Timer from "./Timer";
// import { submitAnswer } from "../../apis/interview.api";

// const Step2interview = ({ interviewData, user }) => {
//   // State
//   const [question, setQuestion] = useState(interviewData.question);
//   const [currentIndex, setCurrentIndex] = useState(
//     interviewData.currentQuestion || 0,
//   );
//   const [answer, setAnswer] = useState("");
//   const [feedback, setFeedback] = useState(null);
//   const [submitError, setSubmitError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(interviewData.question.timer || 60);
//   const [timerActive, setTimerActive] = useState(true);

//   // UI toggles
//   const [micOn, setMicOn] = useState(true);
//   const [cameraOn, setCameraOn] = useState(false);
//   const [codeOpen, setCodeOpen] = useState(false);

//   // Speech
//   const [isAIPlaying, setIsAIPlaying] = useState(false);
//   const [subtitle, setSubtitle] = useState("");
//   const [selectedVoice, setSelectedVoice] = useState(null);
//   const [voiceGender, setVoiceGender] = useState("female");

//   // Refs
//   const aiVideoRef = useRef(null);
//   const userVideoRef = useRef(null);
//   const recognitionRef = useRef(null);
//   const streamRef = useRef(null);

//   // These refs prevent the welcome greeting and question speech from repeating.
//   const hasGreetedRef = useRef(false);
//   const lastSpokenQuestionRef = useRef(-1);
//   const speechCancelledRef = useRef(false);

//   const navigate = useNavigate();

//   const videoSource = voiceGender === "female" ? femaleVideo : maleVideo;

//   const showMicOn = micOn && !isAIPlaying;

//   const totalQuestions = Math.max(interviewData.totalQuestions || 1, 1);

//   const progress = Math.min(100, ((currentIndex + 1) / totalQuestions) * 100);

//   // ---------------- SPEECH RECOGNITION ----------------

//   useEffect(() => {
//     const SpeechRecognition =
//       window.SpeechRecognition || window.webkitSpeechRecognition;

//     if (!SpeechRecognition) return;

//     const rec = new SpeechRecognition();

//     rec.lang = "en-US";
//     rec.continuous = true;
//     rec.interimResults = false;

//     rec.onresult = (event) => {
//       const transcript =
//         event.results[event.results.length - 1]?.[0]?.transcript;

//       if (transcript) {
//         setAnswer((prev) =>
//           prev.trim() ? `${prev} ${transcript.trim()}` : transcript.trim(),
//         );
//       }
//     };

//     rec.onerror = (event) => {
//       console.error("Speech recognition error:", event.error);
//     };

//     recognitionRef.current = rec;

//     return () => {
//       try {
//         rec.stop();
//       } catch {
//         // Recognition may already be stopped.
//       }

//       recognitionRef.current = null;
//     };
//   }, []);

//   const startMic = () => {
//     try {
//       recognitionRef.current?.start();
//     } catch (error) {
//       if (error?.name !== "InvalidStateError") {
//         console.error("Unable to start microphone:", error);
//       }
//     }
//   };

//   const stopMic = () => {
//     try {
//       recognitionRef.current?.stop();
//     } catch {
//       // Recognition may already be stopped.
//     }
//   };

//   const toggleMic = () => {
//     if (micOn) {
//       stopMic();
//       setMicOn(false);
//     } else {
//       setMicOn(true);
//       startMic();
//     }
//   };

//   // ---------------- CAMERA ----------------

//   const toggleCamera = async () => {
//     if (cameraOn) {
//       streamRef.current?.getTracks().forEach((track) => track.stop());
//       streamRef.current = null;
//       setCameraOn(false);
//       return;
//     }

//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: {
//           width: { ideal: 1280 },
//           height: { ideal: 720 },
//           facingMode: "user",
//         },
//         audio: false,
//       });

//       streamRef.current = stream;
//       setCameraOn(true);
//     } catch (error) {
//       console.error("Unable to access camera:", error);
//       setCameraOn(false);
//     }
//   };

//   useEffect(() => {
//     if (!cameraOn || !streamRef.current || !userVideoRef.current) return;

//     const video = userVideoRef.current;
//     video.srcObject = streamRef.current;

//     video.play().catch((error) => {
//       console.error("Unable to play camera preview:", error);
//     });

//     return () => {
//       video.srcObject = null;
//     };
//   }, [cameraOn]);

//   // Stop camera and speech when the component is removed.
//   useEffect(() => {
//     return () => {
//       streamRef.current?.getTracks().forEach((track) => track.stop());
//       window.speechSynthesis?.cancel();
//     };
//   }, []);

//   // ---------------- CODE EDITOR ----------------

//   const handleSubmitCode = (code) => {
//     setAnswer((prev) => {
//       const separator = prev.trim() ? "\n\n--- Code ---\n" : "--- Code ---\n";

//       return prev + separator + code;
//     });

//     setCodeOpen(false);
//   };

//   // ---------------- TIMER ----------------

//   useEffect(() => {
//     if (timeLeft <= 0 || !timerActive) return;

//     const timer = setInterval(() => {
//       setTimeLeft((previous) => Math.max(0, previous - 1));
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [timeLeft, timerActive]);

//   // ---------------- VOICE SELECTION ----------------

//   useEffect(() => {
//     if (!window.speechSynthesis) return;

//     const loadVoices = () => {
//       const voices = window.speechSynthesis.getVoices();

//       if (!voices.length) return;

//       const female = voices.find((voice) =>
//         /zira|samantha|female/i.test(voice.name),
//       );

//       const male = voices.find((voice) => /david|mark|male/i.test(voice.name));

//       if (female) {
//         setSelectedVoice(female);
//         setVoiceGender("female");
//       } else if (male) {
//         setSelectedVoice(male);
//         setVoiceGender("male");
//       } else {
//         const englishVoice = voices.find((voice) =>
//           voice.lang?.toLowerCase().startsWith("en"),
//         );

//         setSelectedVoice(englishVoice || voices[0]);
//       }
//     };

//     loadVoices();

//     window.speechSynthesis.addEventListener("voiceschanged", loadVoices);

//     return () => {
//       window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
//     };
//   }, []);

//   // ---------------- AI SPEECH ----------------

//   const speakText = (text) =>
//     new Promise((resolve) => {
//       if (!window.speechSynthesis || !selectedVoice || !text?.trim()) {
//         resolve();
//         return;
//       }

//       window.speechSynthesis.cancel();

//       const utterance = new SpeechSynthesisUtterance(text);

//       utterance.voice = selectedVoice;
//       utterance.lang = selectedVoice.lang || "en-US";

//       // Natural speech settings; avoid artificial pauses and harsh pitch.
//       utterance.rate = 0.95;
//       utterance.pitch = 1;
//       utterance.volume = 1;

//       let resolved = false;

//       const finishSpeech = () => {
//         if (resolved) return;
//         resolved = true;

//         aiVideoRef.current?.pause();
//         setIsAIPlaying(false);
//         setSubtitle("");

//         if (micOn) startMic();

//         resolve();
//       };

//       utterance.onstart = () => {
//         setIsAIPlaying(true);
//         stopMic();

//         aiVideoRef.current?.play().catch((error) => {
//           console.warn("AI video playback was blocked:", error);
//         });
//       };

//       utterance.onend = finishSpeech;

//       utterance.onerror = (event) => {
//         console.error("Speech synthesis error:", event.error);
//         finishSpeech();
//       };

//       setSubtitle(text);
//       window.speechSynthesis.speak(utterance);
//     });

//   // ---------------- FIRST QUESTION GREETING ----------------

//   useEffect(() => {
//     if (!selectedVoice || hasGreetedRef.current) return;

//     let cancelled = false;

//     const startInterview = async () => {
//       // Mark this immediately so another render cannot trigger a second greeting.
//       hasGreetedRef.current = true;
//       lastSpokenQuestionRef.current = 0;

//       await new Promise((resolve) => setTimeout(resolve, 900));

//       if (cancelled) return;

//       const firstName = user?.name?.split(" ")[0] || "there";

//       // Welcome is spoken only once, at the beginning of the interview.
//       await speakText(`Welcome ${firstName}! Let's begin your interview.`);

//       if (cancelled) return;

//       await new Promise((resolve) => setTimeout(resolve, 500));

//       if (cancelled) return;

//       await speakText(interviewData.question.question);
//     };

//     startInterview();

//     return () => {
//       cancelled = true;
//     };
//   }, [selectedVoice]);

//   // ---------------- INTERVIEW QUESTION SYNCHRONIZATION ----------------

//   useEffect(() => {
//     setQuestion(interviewData.question);
//     setCurrentIndex(interviewData.currentQuestion || 0);
//     setTimeLeft(interviewData.question.timer || 60);
//   }, [interviewData]);

//   // Speak subsequent questions, but never repeat the welcome greeting.
//   useEffect(() => {
//     if (!selectedVoice || !hasGreetedRef.current) return;

//     if (lastSpokenQuestionRef.current === currentIndex) return;

//     // Record the question before speaking to prevent duplicate calls.
//     lastSpokenQuestionRef.current = currentIndex;

//     if (currentIndex === 0) return;

//     let cancelled = false;

//     const speakNextQuestion = async () => {
//       await new Promise((resolve) => setTimeout(resolve, 700));

//       if (cancelled) return;

//       await speakText(question.question);
//     };

//     speakNextQuestion();

//     return () => {
//       cancelled = true;
//     };
//   }, [question, currentIndex, selectedVoice]);

//   useEffect(() => {
//     setTimeLeft(question.timer || 60);
//     setTimerActive(true);
//   }, [question]);

//   // ---------------- SUBMIT ANSWER ----------------

//   const submit = async () => {
//     if (!answer.trim() || loading) return;

//     setTimerActive(false);
//     stopMic();
//     setLoading(true);
//     setSubmitError("");

//     try {
//       const res = await submitAnswer({
//         interviewId: interviewData.interviewId,
//         answer,
//       });

//       if (!res?.success) {
//         setSubmitError(
//           res?.message || "Could not submit your answer. Please try again.",
//         );

//         setLoading(false);
//         setTimerActive(true);

//         if (micOn) startMic();

//         return;
//       }

//       if (res.completed) {
//         setFeedback(res.feedback);

//         await new Promise((resolve) => setTimeout(resolve, 700));

//         await speakText(
//           res.feedback?.feedback ||
//             "Great job! Your interview is complete. Preparing your report now.",
//         );

//         setLoading(false);

//         navigate(`/interview/${interviewData.interviewId}/report`);
//         return;
//       }

//       setFeedback(res.feedback);

//       await new Promise((resolve) => setTimeout(resolve, 700));

//       await speakText(
//         res.feedback?.feedback ||
//           "Noted your answer. Let's move to the next question.",
//       );

//       setLoading(false);
//       setQuestion(res.question);
//       setCurrentIndex(res.currentQuestion);
//       setAnswer("");
//       setFeedback(null);
//     } catch (error) {
//       console.error("Answer submission failed:", error);

//       setSubmitError(
//         error?.response?.data?.message ||
//           "Could not submit your answer. Please try again.",
//       );

//       setLoading(false);
//       setTimerActive(true);

//       if (micOn) startMic();
//     }
//   };

//   // ---------------- UI ----------------

//   return (
//     <div className="relative h-[100dvh] w-full overflow-x-hidden bg-[#f5f6fc] font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-700 lg:overflow-hidden">
//       {/* Ambient background */}
//       <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />
//       <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-violet-200/40 blur-3xl" />

//       <main className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-[1800px] flex-col p-2.5 sm:p-4 lg:h-[100dvh] lg:min-h-0 lg:p-5">
//         <motion.div
//           initial={{ opacity: 0, y: 14, scale: 0.995 }}
//           animate={{ opacity: 1, y: 0, scale: 1 }}
//           transition={{ duration: 0.45, ease: "easeOut" }}
//           className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden rounded-[1.6rem] border border-slate-200/80 bg-white shadow-2xl shadow-indigo-200/30 sm:rounded-[2rem] lg:grid-cols-[minmax(280px,0.76fr)_minmax(0,1.24fr)]"
//         >
//           {/* LEFT: AI + CANDIDATE */}

//           <aside className="flex min-h-0 flex-col gap-3 border-b border-slate-200/80 bg-slate-50/80 p-3 sm:gap-4 sm:p-5 lg:border-b-0 lg:border-r lg:p-5 xl:p-6">
//             {/* AI video */}
//             <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 shadow-sm">
//               <video
//                 src={videoSource}
//                 ref={aiVideoRef}
//                 muted
//                 playsInline
//                 preload="auto"
//                 loop
//                 className="h-full w-full object-cover"
//               />

//               <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full border border-white/15 bg-slate-950/60 px-3 py-1.5 text-[10px] font-semibold text-white shadow-sm backdrop-blur-md">
//                 <span
//                   className={`h-2 w-2 rounded-full ${
//                     isAIPlaying
//                       ? "animate-pulse bg-emerald-400"
//                       : "bg-slate-300"
//                   }`}
//                 />
//                 {isAIPlaying ? "Speaking" : "AI Interviewer"}
//               </div>

//               <AnimatePresence>
//                 {subtitle && (
//                   <motion.div
//                     initial={{ opacity: 0, y: 8 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: 8 }}
//                     className="absolute bottom-3 left-1/2 w-[92%] -translate-x-1/2 rounded-xl border border-white/15 bg-slate-950/75 px-3 py-2 text-center text-xs font-medium leading-relaxed text-white shadow-lg backdrop-blur-md"
//                   >
//                     {subtitle}
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>

//             {/* Candidate preview */}
//             <div className="relative flex min-h-[170px] flex-1 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:min-h-[190px] lg:min-h-0">
//               {cameraOn ? (
//                 <>
//                   <video
//                     ref={userVideoRef}
//                     autoPlay
//                     muted
//                     playsInline
//                     onLoadedMetadata={(event) =>
//                       event.currentTarget.play().catch(console.error)
//                     }
//                     className="absolute inset-0 h-full w-full object-cover"
//                   />

//                   <span className="absolute bottom-3 left-3 rounded-lg bg-slate-950/65 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
//                     {user?.name?.split(" ")[0] || "You"}
//                   </span>

//                   <span className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-rose-500/90 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
//                     <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
//                     LIVE
//                   </span>
//                 </>
//               ) : (
//                 <motion.div
//                   initial={{ opacity: 0, scale: 0.94 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   className="flex flex-col items-center justify-center p-5"
//                 >
//                   <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-2xl font-extrabold text-white shadow-lg shadow-indigo-200/70 ring-4 ring-indigo-50 sm:h-[76px] sm:w-[76px] sm:text-3xl">
//                     {user?.name?.charAt(0)?.toUpperCase() || "U"}
//                   </div>

//                   <p className="mt-3 text-sm font-bold text-slate-700">
//                     {user?.name?.split(" ")[0] || "Candidate"}
//                   </p>
//                   <span className="mt-1 text-[11px] text-slate-400">
//                     Camera is off
//                   </span>
//                 </motion.div>
//               )}
//             </div>

//             {/* Controls */}
//             <div className="flex shrink-0 flex-col items-center gap-3 pt-1">
//               <div className="flex items-center justify-center gap-3">
//                 <ControlButton
//                   active={micOn}
//                   danger={!micOn}
//                   onClick={toggleMic}
//                   label={micOn ? "Turn microphone off" : "Turn microphone on"}
//                 >
//                   {showMicOn ? <FiMic /> : <FiMicOff />}
//                 </ControlButton>

//                 <ControlButton
//                   active={cameraOn}
//                   onClick={toggleCamera}
//                   label={cameraOn ? "Turn camera off" : "Turn camera on"}
//                 >
//                   {cameraOn ? <FiCamera /> : <FiCameraOff />}
//                 </ControlButton>

//                 <ControlButton
//                   active={codeOpen}
//                   onClick={() => setCodeOpen(true)}
//                   label="Open code editor"
//                 >
//                   <FiCode />
//                 </ControlButton>
//               </div>

//               <AnimatePresence>
//                 {micOn && isAIPlaying && (
//                   <motion.span
//                     initial={{ opacity: 0, y: 4 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: 4 }}
//                     className="rounded-full bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-700"
//                   >
//                     Microphone paused while AI speaks
//                   </motion.span>
//                 )}
//               </AnimatePresence>

//               <p className="flex items-center gap-1.5 text-[11px] text-slate-400">
//                 <FiCode className="text-indigo-500" />
//                 Use the code editor for coding questions
//               </p>
//             </div>
//           </aside>

//           {/* RIGHT: INTERVIEW CONTENT */}

//           <section className="relative flex min-h-[560px] flex-col gap-4 bg-white p-4 sm:gap-5 sm:p-6 lg:min-h-0 lg:p-7 xl:p-8">
//             {/* Heading and timer */}
//             <div className="flex shrink-0 items-center justify-between gap-4">
//               <div>
//                 <div className="flex items-center gap-2">
//                   <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-200/70">
//                     <GiArtificialHive className="text-xl" />
//                   </div>
//                   <h1 className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
//                     AI Interview
//                   </h1>
//                 </div>

//                 <div className="mt-2 flex items-center gap-1.5 text-xs font-medium capitalize text-slate-500">
//                   <FiClock className="text-indigo-500" />
//                   {question.difficulty || "General"}
//                 </div>
//               </div>

//               <div className="h-[68px] w-[68px] shrink-0 sm:h-[78px] sm:w-[78px]">
//                 <Timer timeLeft={timeLeft} totalTime={question.timer || 60} />
//               </div>
//             </div>

//             {/* Question card */}
//             <AnimatePresence mode="wait">
//               <motion.div
//                 key={currentIndex}
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -8 }}
//                 transition={{ duration: 0.28 }}
//                 className="shrink-0 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 via-white to-violet-50/60 p-4 shadow-sm sm:p-5"
//               >
//                 <div className="mb-3 flex items-center gap-2.5">
//                   <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm ring-1 ring-indigo-100">
//                     <FiMessageSquare className="text-base" />
//                   </div>

//                   <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
//                     Question {currentIndex + 1}
//                   </span>
//                 </div>

//                 <p className="text-base font-semibold leading-relaxed text-slate-800 sm:text-lg">
//                   {question.question}
//                 </p>
//               </motion.div>
//             </AnimatePresence>

//             {/* Progress */}
//             <div className="shrink-0">
//               <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-500">
//                 <span>Progress</span>
//                 <span className="tabular-nums text-indigo-600">
//                   {currentIndex + 1} / {totalQuestions}
//                 </span>
//               </div>

//               <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
//                 <motion.div
//                   initial={{ width: 0 }}
//                   animate={{ width: `${progress}%` }}
//                   transition={{ duration: 0.5, ease: "easeOut" }}
//                   className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-violet-600"
//                 />
//               </div>
//             </div>

//             {/* Answer */}
//             <div className="flex min-h-[190px] flex-1 flex-col">
//               <label
//                 htmlFor="interview-answer"
//                 className="mb-2 shrink-0 text-sm font-bold text-slate-800"
//               >
//                 Your Answer
//               </label>

//               <textarea
//                 id="interview-answer"
//                 value={answer}
//                 onChange={(event) => setAnswer(event.target.value)}
//                 onKeyDown={(event) => {
//                   if (event.ctrlKey && event.key === "Enter") submit();
//                 }}
//                 placeholder="Write your answer here..."
//                 className="min-h-[170px] w-full flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-sm leading-7 text-slate-800 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50 sm:p-5"
//               />

//               {submitError && (
//                 <p
//                   role="alert"
//                   className="mt-2 text-xs font-semibold text-rose-600"
//                 >
//                   {submitError}
//                 </p>
//               )}
//             </div>

//             {/* Feedback */}
//             <AnimatePresence>
//               {feedback && (
//                 <motion.div
//                   initial={{ opacity: 0, y: 8 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -5 }}
//                   className="shrink-0 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-relaxed text-emerald-900"
//                 >
//                   <span className="mr-1 font-bold text-emerald-700">
//                     Feedback:
//                   </span>
//                   {feedback.feedback}
//                 </motion.div>
//               )}
//             </AnimatePresence>

//             {/* Submit */}
//             <div className="flex shrink-0 flex-col-reverse items-center justify-between gap-3 border-t border-slate-100 pt-4 sm:flex-row">
//               <p className="hidden text-xs text-slate-400 sm:block">
//                 Press{" "}
//                 <kbd className="rounded-md border border-slate-200 bg-slate-100 px-1.5 py-1 font-mono text-[11px] font-bold text-slate-600">
//                   Ctrl + Enter
//                 </kbd>{" "}
//                 to submit
//               </p>

//               <motion.button
//                 type="button"
//                 whileHover={!loading && answer.trim() ? { y: -2 } : {}}
//                 whileTap={!loading && answer.trim() ? { scale: 0.97 } : {}}
//                 disabled={loading || !answer.trim()}
//                 onClick={submit}
//                 className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 text-sm font-bold text-white shadow-lg shadow-indigo-200/70 transition-all hover:shadow-indigo-300/70 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none sm:w-auto sm:min-w-[180px]"
//               >
//                 {loading ? (
//                   <>
//                     <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
//                     Evaluating...
//                   </>
//                 ) : (
//                   <>
//                     Submit Answer
//                     <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
//                   </>
//                 )}
//               </motion.button>
//             </div>

//             {/* Evaluating overlay */}
//             <AnimatePresence>
//               {loading && !feedback && (
//                 <motion.div
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   exit={{ opacity: 0 }}
//                   className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-white/85 backdrop-blur-sm"
//                 >
//                   <motion.div
//                     animate={{ scale: [1, 1.08, 1], rotate: [0, 4, -4, 0] }}
//                     transition={{
//                       duration: 1.6,
//                       repeat: Infinity,
//                       ease: "easeInOut",
//                     }}
//                     className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200/70"
//                   >
//                     <GiArtificialHive className="text-3xl" />
//                   </motion.div>

//                   <p className="text-sm font-bold text-slate-700">
//                     Evaluating your response...
//                   </p>

//                   <div className="h-1 w-28 overflow-hidden rounded-full bg-indigo-100">
//                     <motion.div
//                       animate={{ x: [-112, 112] }}
//                       transition={{
//                         duration: 1.1,
//                         repeat: Infinity,
//                         ease: "easeInOut",
//                       }}
//                       className="h-full w-1/2 rounded-full bg-indigo-600"
//                     />
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </section>
//         </motion.div>
//       </main>

//       {/* Code editor */}
//       <AnimatePresence>
//         {codeOpen && (
//           <CodeEditor
//             onClose={() => setCodeOpen(false)}
//             onSubmitCode={handleSubmitCode}
//           />
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// // Reusable controls
// const ControlButton = ({ children, onClick, active, danger, label }) => (
//   <motion.button
//     type="button"
//     whileHover={{ y: -2, scale: 1.04 }}
//     whileTap={{ scale: 0.94 }}
//     onClick={onClick}
//     aria-label={label}
//     title={label}
//     className={`flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl border text-lg transition-all sm:h-[50px] sm:w-[50px] ${
//       danger
//         ? "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100"
//         : active
//           ? "border-indigo-200 bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
//           : "border-slate-200 bg-white text-slate-500 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
//     }`}
//   >
//     {children}
//   </motion.button>
// );

// export default Step2interview;




import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiArrowRight,
  FiCamera,
  FiCameraOff,
  FiClock,
  FiCode,
  FiMessageSquare,
  FiMic,
  FiMicOff,
} from "react-icons/fi";
import { GiArtificialHive } from "react-icons/gi";

import maleVideo from "../../assets/male-ai.mp4";
import femaleVideo from "../../assets/female-ai.mp4";
import CodeEditor from "./CodeEditor";
import Timer from "./Timer";
import { submitAnswer } from "../../apis/interview.api";

const Step2interview = ({ interviewData, user }) => {
  // State
  const [question, setQuestion] = useState(interviewData.question);
  const [currentIndex, setCurrentIndex] = useState(
    interviewData.currentQuestion || 0,
  );
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(interviewData.question.timer || 60);
  const [timerActive, setTimerActive] = useState(true);

  // UI toggles
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(false);
  const [codeOpen, setCodeOpen] = useState(false);

  // Speech
  const [isAIPlaying, setIsAIPlaying] = useState(false);
  const [subtitle, setSubtitle] = useState("");
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [voiceGender, setVoiceGender] = useState("female");

  // Refs
  const aiVideoRef = useRef(null);
  const userVideoRef = useRef(null);
  const recognitionRef = useRef(null);
  const streamRef = useRef(null);

  // Prevent repeated greeting and question speech
  const hasGreetedRef = useRef(false);
  const lastSpokenQuestionRef = useRef(-1);

  const navigate = useNavigate();

  const videoSource = voiceGender === "female" ? femaleVideo : maleVideo;
  const showMicOn = micOn && !isAIPlaying;

  const totalQuestions = Math.max(interviewData.totalQuestions || 1, 1);
  const progress = Math.min(
    100,
    ((currentIndex + 1) / totalQuestions) * 100,
  );

  // ---------------- SPEECH RECOGNITION ----------------

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const rec = new SpeechRecognition();

    rec.lang = "en-US";
    rec.continuous = true;
    rec.interimResults = false;

    rec.onresult = (event) => {
      const transcript =
        event.results[event.results.length - 1]?.[0]?.transcript;

      if (transcript) {
        setAnswer((prev) =>
          prev.trim() ? `${prev} ${transcript.trim()}` : transcript.trim(),
        );
      }
    };

    rec.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognitionRef.current = rec;

    return () => {
      try {
        rec.stop();
      } catch {
        // Recognition may already be stopped.
      }

      recognitionRef.current = null;
    };
  }, []);

  const startMic = () => {
    try {
      recognitionRef.current?.start();
    } catch (error) {
      if (error?.name !== "InvalidStateError") {
        console.error("Unable to start microphone:", error);
      }
    }
  };

  const stopMic = () => {
    try {
      recognitionRef.current?.stop();
    } catch {
      // Recognition may already be stopped.
    }
  };

  const toggleMic = () => {
    if (micOn) {
      stopMic();
      setMicOn(false);
    } else {
      setMicOn(true);
      startMic();
    }
  };

  // ---------------- CAMERA ----------------

  const toggleCamera = async () => {
    if (cameraOn) {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setCameraOn(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
        audio: false,
      });

      streamRef.current = stream;
      setCameraOn(true);
    } catch (error) {
      console.error("Unable to access camera:", error);
      setCameraOn(false);
    }
  };

  useEffect(() => {
    if (!cameraOn || !streamRef.current || !userVideoRef.current) return;

    const video = userVideoRef.current;
    video.srcObject = streamRef.current;

    video.play().catch((error) => {
      console.error("Unable to play camera preview:", error);
    });

    return () => {
      video.srcObject = null;
    };
  }, [cameraOn]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      window.speechSynthesis?.cancel();
    };
  }, []);

  // ---------------- CODE EDITOR ----------------

  const handleSubmitCode = (code) => {
    setAnswer((prev) => {
      const separator = prev.trim() ? "\n\n--- Code ---\n" : "--- Code ---\n";
      return prev + separator + code;
    });

    setCodeOpen(false);
  };

  // ---------------- TIMER ----------------

  useEffect(() => {
    if (timeLeft <= 0 || !timerActive) return;

    const timer = setInterval(() => {
      setTimeLeft((previous) => Math.max(0, previous - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, timerActive]);

  // ---------------- VOICE SELECTION ----------------

  useEffect(() => {
    if (!window.speechSynthesis) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();

      if (!voices.length) return;

      const female = voices.find((voice) =>
        /zira|samantha|female/i.test(voice.name),
      );

      const male = voices.find((voice) => /david|mark|male/i.test(voice.name));

      if (female) {
        setSelectedVoice(female);
        setVoiceGender("female");
      } else if (male) {
        setSelectedVoice(male);
        setVoiceGender("male");
      } else {
        const englishVoice = voices.find((voice) =>
          voice.lang?.toLowerCase().startsWith("en"),
        );

        setSelectedVoice(englishVoice || voices[0]);
      }
    };

    loadVoices();

    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
    };
  }, []);

  // ---------------- AI SPEECH ----------------

  const speakText = (text) =>
    new Promise((resolve) => {
      if (!window.speechSynthesis || !selectedVoice || !text?.trim()) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang || "en-US";
      utterance.rate = 0.95;
      utterance.pitch = 1;
      utterance.volume = 1;

      let resolved = false;

      const finishSpeech = () => {
        if (resolved) return;
        resolved = true;

        aiVideoRef.current?.pause();
        setIsAIPlaying(false);
        setSubtitle("");

        if (micOn) startMic();

        resolve();
      };

      utterance.onstart = () => {
        setIsAIPlaying(true);
        stopMic();

        aiVideoRef.current?.play().catch((error) => {
          console.warn("AI video playback was blocked:", error);
        });
      };

      utterance.onend = finishSpeech;

      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event.error);
        finishSpeech();
      };

      setSubtitle(text);
      window.speechSynthesis.speak(utterance);
    });

  // ---------------- FIRST QUESTION GREETING ----------------

  useEffect(() => {
    if (!selectedVoice || hasGreetedRef.current) return;

    let cancelled = false;

    const startInterview = async () => {
      hasGreetedRef.current = true;
      lastSpokenQuestionRef.current = 0;

      await new Promise((resolve) => setTimeout(resolve, 900));

      if (cancelled) return;

      const firstName = user?.name?.split(" ")[0] || "there";

      // Greeting is spoken only once, at the beginning.
      await speakText(`Welcome ${firstName}! Let's begin your interview.`);

      if (cancelled) return;

      await new Promise((resolve) => setTimeout(resolve, 500));

      if (cancelled) return;

      await speakText(interviewData.question.question);
    };

    startInterview();

    return () => {
      cancelled = true;
    };
  }, [selectedVoice]);

  // ---------------- INTERVIEW QUESTION SYNCHRONIZATION ----------------

  useEffect(() => {
    setQuestion(interviewData.question);
    setCurrentIndex(interviewData.currentQuestion || 0);
    setTimeLeft(interviewData.question.timer || 60);
  }, [interviewData]);

  // Speak subsequent questions without repeating the greeting.
  useEffect(() => {
    if (!selectedVoice || !hasGreetedRef.current) return;

    if (lastSpokenQuestionRef.current === currentIndex) return;

    lastSpokenQuestionRef.current = currentIndex;

    if (currentIndex === 0) return;

    let cancelled = false;

    const speakNextQuestion = async () => {
      await new Promise((resolve) => setTimeout(resolve, 700));

      if (cancelled) return;

      await speakText(question.question);
    };

    speakNextQuestion();

    return () => {
      cancelled = true;
    };
  }, [question, currentIndex, selectedVoice]);

  useEffect(() => {
    setTimeLeft(question.timer || 60);
    setTimerActive(true);
  }, [question]);

  // ---------------- SUBMIT ANSWER ----------------

  const submit = async () => {
    if (!answer.trim() || loading) return;

    setTimerActive(false);
    stopMic();
    setLoading(true);
    setSubmitError("");

    try {
      const res = await submitAnswer({
        interviewId: interviewData.interviewId,
        answer,
      });

      if (!res?.success) {
        setSubmitError(
          res?.message || "Could not submit your answer. Please try again.",
        );

        setLoading(false);
        setTimerActive(true);

        if (micOn) startMic();

        return;
      }

      if (res.completed) {
        setFeedback(res.feedback);

        await new Promise((resolve) => setTimeout(resolve, 700));

        await speakText(
          res.feedback?.feedback ||
            "Great job! Your interview is complete. Preparing your report now.",
        );

        setLoading(false);

        navigate(`/interview/${interviewData.interviewId}/report`);
        return;
      }

      setFeedback(res.feedback);

      await new Promise((resolve) => setTimeout(resolve, 700));

      await speakText(
        res.feedback?.feedback ||
          "Noted your answer. Let's move to the next question.",
      );

      setLoading(false);
      setQuestion(res.question);
      setCurrentIndex(res.currentQuestion);
      setAnswer("");
      setFeedback(null);
    } catch (error) {
      console.error("Answer submission failed:", error);

      setSubmitError(
        error?.response?.data?.message ||
          "Could not submit your answer. Please try again.",
      );

      setLoading(false);
      setTimerActive(true);

      if (micOn) startMic();
    }
  };

  // ---------------- UI ----------------

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-[#1b1e24] p-2 font-sans text-slate-100 selection:bg-indigo-500/30 sm:p-3 lg:p-5">
      {/* Subtle background lighting */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[120px]" />

      <main className="relative z-10 mx-auto h-full w-full max-w-[1800px]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="grid h-full min-h-0 grid-cols-1 overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-[#0e1015] shadow-2xl shadow-black/30 lg:grid-cols-[minmax(280px,0.72fr)_minmax(0,1.28fr)]"
        >
          {/* LEFT PANEL */}
          <aside className="flex min-h-0 flex-col gap-4 border-b border-white/[0.08] bg-[#111319] p-4 sm:p-5 lg:border-b-0 lg:border-r lg:p-5 xl:p-6">

            {/* AI VIDEO */}
            <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#1a1d25] shadow-lg shadow-black/20">
              <video
                src={videoSource}
                ref={aiVideoRef}
                muted
                playsInline
                preload="auto"
                loop
                className="h-full w-full object-cover"
              />

              <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-[10px] font-semibold text-white backdrop-blur-md">
                <span
                  className={`h-2 w-2 rounded-full ${
                    isAIPlaying ? "animate-pulse bg-emerald-400" : "bg-slate-400"
                  }`}
                />
                {isAIPlaying ? "Speaking" : "AI Interviewer"}
              </div>

              <AnimatePresence>
                {subtitle && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute bottom-3 left-1/2 w-[92%] -translate-x-1/2 rounded-xl border border-white/10 bg-black/75 px-3 py-2 text-center text-xs font-medium leading-relaxed text-white shadow-lg backdrop-blur-md"
                  >
                    {subtitle}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CANDIDATE PREVIEW */}
            <div className="relative flex min-h-[170px] flex-1 items-center justify-center overflow-hidden rounded-2xl border border-white/[0.08] bg-[#171920] shadow-inner shadow-black/20 lg:min-h-0">
              {cameraOn ? (
                <>
                  <video
                    ref={userVideoRef}
                    autoPlay
                    muted
                    playsInline
                    onLoadedMetadata={(event) =>
                      event.currentTarget.play().catch(console.error)
                    }
                    className="absolute inset-0 h-full w-full object-cover"
                  />

                  <span className="absolute bottom-3 left-3 rounded-lg bg-black/65 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                    {user?.name?.split(" ")[0] || "You"}
                  </span>

                  <span className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-rose-500/90 px-2.5 py-1 text-[10px] font-bold text-white">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                    LIVE
                  </span>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center p-5"
                >
                  <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full border border-white/10 bg-[#292d36] text-2xl font-bold text-white shadow-lg sm:h-[76px] sm:w-[76px] sm:text-3xl">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>

                  <p className="mt-3 text-sm font-semibold text-slate-300">
                    {user?.name?.split(" ")[0] || "Candidate"}
                  </p>
                </motion.div>
              )}
            </div>

            {/* CONTROLS */}
            <div className="flex shrink-0 flex-col items-center gap-3 pt-1">
              <div className="flex items-center justify-center gap-3">
                <ControlButton
                  active={micOn}
                  danger={!micOn}
                  onClick={toggleMic}
                  label={micOn ? "Turn microphone off" : "Turn microphone on"}
                >
                  {showMicOn ? <FiMic /> : <FiMicOff />}
                </ControlButton>

                <ControlButton
                  active={cameraOn}
                  onClick={toggleCamera}
                  label={cameraOn ? "Turn camera off" : "Turn camera on"}
                >
                  {cameraOn ? <FiCamera /> : <FiCameraOff />}
                </ControlButton>

                <ControlButton
                  active={codeOpen}
                  onClick={() => setCodeOpen(true)}
                  label="Open code editor"
                >
                  <FiCode />
                </ControlButton>
              </div>

              <AnimatePresence>
                {micOn && isAIPlaying && (
                  <motion.span
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="rounded-full border border-amber-400/10 bg-amber-400/10 px-3 py-1 text-[11px] font-medium text-amber-300"
                  >
                    Microphone paused while AI speaks
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </aside>

          {/* RIGHT PANEL */}
          <section className="relative flex min-h-[600px] flex-col gap-4 bg-[#0e1015] p-4 sm:gap-5 sm:p-6 lg:min-h-0 lg:p-6 xl:p-7">

            {/* HEADER + TIMER */}
            <div className="flex shrink-0 items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                  AI Interview
                </h1>

                <div className="mt-1.5 flex items-center gap-1.5 text-xs font-medium capitalize text-slate-400">
                  <FiClock className="text-slate-500" />
                  {question.difficulty || "General"}
                </div>
              </div>

              <div className="h-[68px] w-[68px] shrink-0 sm:h-[82px] sm:w-[82px]">
                <Timer
                  timeLeft={timeLeft}
                  totalTime={question.timer || 60}
                />
              </div>
            </div>

            {/* QUESTION CARD */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28 }}
                className="shrink-0 rounded-2xl border border-white/[0.08] bg-[#181a21] p-4 shadow-sm sm:p-5"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-900">
                    <FiMessageSquare className="text-base" />
                  </div>

                  <span className="text-xs font-semibold text-slate-400">
                    Question {currentIndex + 1}
                  </span>
                </div>

                <p className="text-base font-medium leading-relaxed text-slate-100 sm:text-lg">
                  {question.question}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* PROGRESS */}
            <div className="shrink-0">
              <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-400">
                <span>Progress</span>
                <span className="tabular-nums text-slate-400">
                  {currentIndex + 1}/{totalQuestions}
                </span>
              </div>

              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#292c34]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                />
              </div>
            </div>

            {/* ANSWER */}
            <div className="flex min-h-[190px] flex-1 flex-col">
              <label
                htmlFor="interview-answer"
                className="mb-2 shrink-0 text-sm font-semibold text-slate-300"
              >
                Your Answer
              </label>

              <textarea
                id="interview-answer"
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                onKeyDown={(event) => {
                  if (event.ctrlKey && event.key === "Enter") submit();
                }}
                placeholder="Write your answer here..."
                className="min-h-[170px] w-full flex-1 resize-none rounded-2xl border border-white/[0.08] bg-[#181a21] p-4 text-sm leading-7 text-slate-100 outline-none transition-all placeholder:text-slate-600 hover:border-white/15 focus:border-indigo-500/60 focus:bg-[#1b1e27] focus:ring-4 focus:ring-indigo-500/10 sm:p-5"
              />

              {submitError && (
                <p
                  role="alert"
                  className="mt-2 text-xs font-medium text-rose-400"
                >
                  {submitError}
                </p>
              )}
            </div>

            {/* FEEDBACK */}
            <AnimatePresence>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="shrink-0 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm leading-relaxed text-emerald-200"
                >
                  <span className="mr-1 font-bold text-emerald-300">
                    Feedback:
                  </span>
                  {feedback.feedback}
                </motion.div>
              )}
            </AnimatePresence>

            {/* SUBMIT */}
            <div className="flex shrink-0 flex-col-reverse items-center justify-between gap-3 border-t border-white/[0.07] pt-4 sm:flex-row">
              <p className="hidden text-xs text-slate-500 sm:block">
                Press{" "}
                <kbd className="rounded-md border border-white/10 bg-[#1c1f27] px-1.5 py-1 font-mono text-[11px] font-semibold text-slate-300">
                  Ctrl + Enter
                </kbd>{" "}
                to submit
              </p>

              <motion.button
                type="button"
                whileHover={!loading && answer.trim() ? { y: -2 } : {}}
                whileTap={!loading && answer.trim() ? { scale: 0.97 } : {}}
                disabled={loading || !answer.trim()}
                onClick={submit}
                className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 text-sm font-bold text-white shadow-lg shadow-indigo-950/30 transition-all hover:from-indigo-500 hover:to-violet-500 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none sm:w-auto sm:min-w-[180px]"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Evaluating...
                  </>
                ) : (
                  <>
                    Submit Answer
                    <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
                  </>
                )}
              </motion.button>
            </div>

            {/* EVALUATING OVERLAY */}
            <AnimatePresence>
              {loading && !feedback && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-[#0e1015]/90 backdrop-blur-md"
                >
                  <motion.div
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-950/40"
                  >
                    <GiArtificialHive className="text-3xl" />
                  </motion.div>

                  <p className="text-sm font-semibold text-slate-300">
                    Evaluating your response...
                  </p>

                  <div className="h-1 w-28 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      animate={{ x: [-112, 112] }}
                      transition={{
                        duration: 1.1,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="h-full w-1/2 rounded-full bg-indigo-500"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </motion.div>
      </main>

      {/* CODE EDITOR */}
      <AnimatePresence>
        {codeOpen && (
          <CodeEditor
            onClose={() => setCodeOpen(false)}
            onSubmitCode={handleSubmitCode}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Reusable controls
const ControlButton = ({ children, onClick, active, danger, label }) => (
  <motion.button
    type="button"
    whileHover={{ y: -2, scale: 1.04 }}
    whileTap={{ scale: 0.94 }}
    onClick={onClick}
    aria-label={label}
    title={label}
    className={`flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl border text-lg transition-all sm:h-[50px] sm:w-[50px] ${
      danger
        ? "border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
        : active
          ? "border-indigo-500/30 bg-indigo-500/15 text-indigo-300 hover:bg-indigo-500/25"
          : "border-white/10 bg-[#1b1e26] text-slate-400 hover:border-indigo-500/30 hover:bg-indigo-500/10 hover:text-indigo-300"
    }`}
  >
    {children}
  </motion.button>
);

export default Step2interview;
