import { useEffect, useRef, useState } from "react";
import maleVideo from "../../assets/male-ai.mp4";
import femaleVideo from "../../assets/female-ai.mp4";
import { AnimatePresence, motion } from "framer-motion";
import { FiCamera, FiCameraOff, FiClock, FiCode, FiMessageSquare, FiMic, FiMicOff } from "react-icons/fi";
import CodeEditor from "./CodeEditor";
import Timer from "./Timer";
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
       onKeyDown={(e)=>{ if(e.ctrlKey && e.key==="Enter") alert("Submit answer")}}
       placeholder="write your answer here... or speak if mic is on"/>


          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Step2interview;
