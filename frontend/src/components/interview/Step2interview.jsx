import { useState } from "react";
import maleVideo from "../../assets/male-ai.mp4";
import femaleVideo from "../../assets/female-ai.mp4";

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
  return <div></div>;
};

export default Step2interview



// http://localhost:5173/interview/6afb038f6e0c10e6c61eef74 