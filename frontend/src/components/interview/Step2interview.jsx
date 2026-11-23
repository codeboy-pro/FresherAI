import { useEffect, useRef, useState } from "react";
import maleVideo from "../../assets/male-ai.mp4";
import femaleVideo from "../../assets/female-ai.mp4";
import { AnimatePresence, motion } from "framer-motion";
import { FiArrowRight, FiCamera, FiCameraOff, FiClock, FiCode, FiMessageSquare, FiMic, FiMicOff } from "react-icons/fi";
import CodeEditor from "./CodeEditor";
import Timer from "./Timer";
import { submitAnswer } from "../../apis/interview.api";
import { useNavigate } from "react-router-dom";
const Step2interview = ({ interviewData, user }) => {
  // State
  const [question, setQuestion] = useState(interviewData.question);

  const [currentIndex, setCurrentIndex] = useState(
    interviewData.currentQuestion || 0,
  );

  const [answer, setAnswer] = useState("");

  const [feedback, setFeedback] = useState(null);

  const [loading, setLoading] = useState(false);

  const [timeLeft, setTimeLeft] = useState(interviewData.question.timer || 60);

  const [timerActive, setTimerActive] = useState(true);
  // Paused once the answer is submitted
  // UI toggles
  const [micOn, setMicOn] = useState(true);
  // User's manual preference — only changed by the mic button

  const [cameraOn, setCameraOn] = useState(false);

  const [codeOpen, setCodeOpen] = useState(false);
  // Speech
  const [isAIPlaying, setIsAIPlaying] = useState(false);

  const [subtitle, setSubtitle] = useState("");

  const [selectedVoice, setSelectedVoice] = useState(null);

  const [voiceGender, setVoiceGender] = useState("female");

  const [introSpoken, setIntroSpoken] = useState(false);

  // Refs
  const aiVideoRef = useRef(null);

  const userVideoRef = useRef(null);

  const recognitionRef = useRef(null);

  const streamRef = useRef(null);

  const videoSource = voiceGender === "female" ? femaleVideo : maleVideo;

  const showMicOn = micOn && !isAIPlaying;
  const progress= ((currentIndex + 1)/interviewData.totalQuestions) * 100;
  const navigate=useNavigate();
  // Speech recognition
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;

    const rec = new window.webkitSpeechRecognition();
    rec.lang = "en-US";
    rec.continuous = true;
    rec.intrimResults = false;
    rec.onresult = (e) => {
      const t = e.results[e.results.length - 1][0].transcript;
      setAnswer((prev) => prev + " " + t);
    };
    recognitionRef.current = rec;
  }, []);

  const startMic = () => {
    recognitionRef.current?.start();
  };

  const stopMic = () => {
    recognitionRef.current?.stop();
  };

  const toggleMic = () => {
    if (micOn) {
      stopMic();
    } else {
      startMic();
    }
    setMicOn(!micOn);
  };

  const toggleCamera = async () => {
    if (cameraOn) {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setCameraOn(false);
    } else {
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
      if (video.srcObject) {
        video.srcObject = null;
      }
    };
  }, [cameraOn]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const handleSubmitCode = (code)=>{
       setAnswer((prev)=>{

        const separator=prev.trim() ? "\n\n--- Code ---\n":"---  Code ---\n";
        return prev + separator + code;
       });
       setCodeOpen(false);
  }


  useEffect(()=>{
         if(timeLeft<=0 || !timerActive) return;

         const t=setInterval(()=>setTimeLeft((p)=>p-1),1000);
         return ()=>clearInterval(t);
  },[timeLeft,timerActive]);


  useEffect(()=>{
       const load=()=>{
        const voices=window.speechSynthesis.getVoices();
        if(!voices.length) return ;
        const female=voices.find(v=>  /zira|samantha|female/i.test(v.name));
        const male=voices.find(v=>  /david|mark|male/i.test(v.name));
        if(female)  { setSelectedVoice(female); setVoiceGender("female");}
        else if(male) { setSelectedVoice(male); setVoiceGender("male");}
        else   { setSelectedVoice(voices[0]); setVoiceGender("female");}
       }
       load();
       window.speechSynthesis.onvoiceschanged=load;
  },[]);

  const speakText = (text) =>
    new Promise((resolve) => {
      if (!window.speechSynthesis || !selectedVoice || !text?.trim()) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();

      setTimeout(() => {
        const utter = new SpeechSynthesisUtterance(
          text.replace(/,/g, ", ... ").replace(/\./g, ". ... "),
        );
        utter.voice = selectedVoice;
        utter.rate = 0.92;
        utter.pitch = 1.05;
        utter.volume = 1;
        utter.onstart = () => {
          setIsAIPlaying(true);
          stopMic();
          aiVideoRef.current?.play();
        };
        utter.onend = () => {
          aiVideoRef.current?.pause();
          setIsAIPlaying(false);
          if (micOn) startMic();
          setTimeout(() => {
            setSubtitle("");
            resolve();
          }, 300);
        };
        setSubtitle(text);
        window.speechSynthesis.speak(utter);
      }, 150);
    });


  useEffect(()=>{
    if(!selectedVoice || introSpoken) return ;
    const runIntro=async()=>{
         setIntroSpoken(true);
         await new Promise((r)=>setTimeout(r,1200));
         await speakText(
           `Welcome ${user?.name.split(" ")[0]}! Let's begin your interview.`,
         );
         await new Promise((r)=>setTimeout(r,900));

         await speakText(interviewData.question.question);
    }
    runIntro();
},[selectedVoice]);

   useEffect(() => {
     if (!selectedVoice || !introSpoken) return;
     const speakQuestion = async () => {
       await new Promise((r) => setTimeout(r, 900));
       await speakText(question.question);
     };
     speakQuestion();
   }, [question]);


     useEffect(() => {
       setQuestion(interviewData.question);
       setCurrentIndex(interviewData.currentQuestion);
       setTimeLeft(interviewData.question.timer || 60);
     }, [interviewData]);

  useEffect(() => {
    setTimeLeft(question.timer || 60);
    setTimerActive(true);
  }, [question]);

  const submit = async () => {
    if (!answer.trim()) return;

    setTimerActive(false);
    setLoading(true);

    const res = await submitAnswer({
      interviewId: interviewData.interviewId,
      answer,
    });

    if (res.completed) {
      setFeedback(res.feedback);
      await new Promise((r) => setTimeout(r, 700));
      await speakText(
        res.feedback?.feedback ||
          "Great job! Your interview is complete. Preparing your report now.",
      );
      setLoading(false);
      navigate(`/interview/${interviewData.interviewId}/report`);
      return;
    }

    setFeedback(res.feedback);
    await new Promise((r) => setTimeout(r, 700));
    await speakText(
      res.feedback?.feedback ||
        "Noted your answer. Let's move to the next question.",
    );
    setLoading(false);
    setQuestion(res.question);
    setCurrentIndex(res.currentQuestion);
    setAnswer("");
    setFeedback(null);
  };



  return (
    <div>
      {codeOpen && (
        <CodeEditor
          onClose={() => setCodeOpen(false)}
          onSubmitCode={handleSubmitCode}
        />
      )}
      <motion.div>
        {/* left  */}
        <div>
          {/* AI video  */}

          <div>
            <video
              src={videoSource}
              ref={aiVideoRef}
              muted
              playsInline
              preload="auto"
              loop
            />
            {isAIPlaying && (
              <div>
                <div className="">
                  {/* video playing 3 lines animation   */}
                  <motion.div></motion.div>
                </div>

                <span>AI Speaking</span>
              </div>
            )}
          </div>

          <div>
            {subtitle && (
              <AnimatePresence>
                <motion.div>
                  <p>{subtitle}</p>
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          <div className="">
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
                  className=""
                />
                <div>
                  <span>You</span>
                </div>
              </>
            ) : (
              <div>
                <div>
                  <span>{user?.name.charAt(0).toUpperCase()}</span>
                </div>

                <span>{user?.name.split(" ")[0]}</span>
              </div>
            )}
          </div>

          <div>
            <div className="">
              <motion.button onClick={toggleMic}>
                {showMicOn ? <FiMic /> : <FiMicOff />}
              </motion.button>
              <motion.button onClick={toggleCamera}>
                {cameraOn ? <FiCamera /> : <FiCameraOff />}
              </motion.button>

              <motion.button onClick={() => setCodeOpen(true)}>
                <FiCode />
              </motion.button>
            </div>
            <div className="">
              {micOn && isAIPlaying && <span>Mic paused - AI is speaking</span>}
            </div>

            <span>
              Coding question? Use <FiCode /> to write &amp; add code
            </span>
          </div>
        </div>

        {/* right */}

        <div>
          <div>
            <div>
              <h2>AI Interview</h2>
              <div>
                <FiClock />
                <span>{question.difficulty}</span>
              </div>
            </div>

            <div>
              <Timer timeLeft={timeLeft} totalTime={question.timer || 60} />
            </div>
          </div>

          <motion.div>
            <div />
            <div>
              <div>
                <FiMessageSquare />
              </div>
              <p>Question {currentIndex + 1}</p>
            </div>
            <p>{question.question}</p>
          </motion.div>
          <div>
            <div>
              <span>Progress</span>
              <span>
                {currentIndex + 1}/{interviewData.totalQuestions}
              </span>
            </div>
            <div>
              {/* progress line  */}
              <div style={{ width: `${progress}%`, height: '10px', backgroundColor: 'lightgray' }} />

            </div>
          </div>


  {/* ans part  */}
          <div>
      <label className="">Your answer</label>
       <textarea  onChange={(e)=>setAnswer(e.target.value)} value={answer}
       rows={5}
       onKeyDown={(e)=>{ if(e.ctrlKey && e.key==="Enter") submit()}}
       placeholder="write your answer here... or speak if mic is on"/>


          </div>
{/* feedback  */}
          <div>
            <AnimatePresence>
              {feedback &&  (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                 <p> AI Feedback</p>
                 <p>{feedback.feedback}</p>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          <div>
            <span>Press{" "}

              <span>Ctrl+Enter</span> to Submit
            </span>

            <motion.button disabled={loading || !answer.trim()}
            onClick={submit}
            >
                {
                  loading ? (<>
                  <div>Submitting...</div></>):(
                    <>Submit Answer <FiArrowRight/></>
                  )
                }
            </motion.button>

          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Step2interview;



// 9:51 
// http://localhost:5173/interview/6afb038f6e0c10e6c61eef74 