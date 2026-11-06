import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";

import { GiArtificialHive } from "react-icons/gi";
import { FiFileText, FiArrowLeft, FiEye, FiArrowRight } from "react-icons/fi";

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
  {
    step: 3,
    title: "Skills",
    subtitle: "Your technical skills",
  },
  {
    step: 4,
    title: "Work Experience",
    subtitle: "Your past jobs & internships",
  },
  {
    step: 5,
    title: "Projects",
    subtitle: "Projects you have built",
  },
  {
    step: 6,
    title: "Education",
    subtitle: "Your academic background",
  },
];
const total_steps = STEPS.length;


const ResumeBuilder = ({ user, setUser }) => {
  const navigate = useNavigate();
   const [showPriview, setShowPriview] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState(initialData);

  const label = `Step ${currentStep}: ${
    STEPS.find((item) => item.step === currentStep)?.title
  }`;
const progressPct=(currentStep/total_steps)*100;

const activeStep=STEPS.find((s)=>s.step===currentStep);
const goPrev=()=>{
  if(currentStep>1){
    setCurrentStep(currentStep-1);

  }
};
const goNext = () => {
  if (currentStep < total_steps) {
    setCurrentStep(currentStep + 1);
  }
};
const isLastStep=currentStep===STEPS.length;

if(showPriview){
  return <PriviewResume data={data} user={user} setUser={setUser} onBack={()=>setShowPriview(false)}/>
}
  return (
    <div className="min-h-screen bg-slate-50">
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
            Resume Builder
          </span>
        </div>

        <motion.button onClick={() => setShowPriview(true)}>
          <FiEye />
        </motion.button>
      </motion.nav>

      {/* main container  */}
      <div>
        <div>
          <div>
            <div>
              <p>
                STEP {currentStep} of {total_steps}
              </p>
              <p>{Math.round(progressPct)}% completed</p>
            </div>
            <div>
              <div className="" style={{ width: `${progressPct}` }} />
            </div>
            <div>
              <h2>{activeStep?.title}</h2>
              <p>{activeStep?.subtitle}</p>
            </div>
          </div>

          <div className="" />
          <ResumeForm step={currentStep} data={data} setData={setData} />

          {/* Navigation buttons */}

          <div className="" />
          <button onClick={goPrev} disabled={currentStep === 1}>
            <FiArrowLeft />
            <span className="ml-2">Previous</span>
          </button>
          <div>
            {STEPS.map((s) => (
              <button
                onClick={() => setCurrentStep(s.step)}
                key={s.step}
                type="button"
                className={`rounded-full ${s.step === currentStep ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-500"}`}
              >
                {/* dot  */}
              </button>
            ))}
          </div>

          {isLastStep ? (
            <button onClick={() => setShowPriview(true)}>
              <FiEye />
              <span className="hidden sm:block">Priview Resume</span>
            </button>
          ) : (
            <button onClick={goNext}>
              <span>Next</span>
              <FiArrowRight />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
