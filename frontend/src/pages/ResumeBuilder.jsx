import { useState } from "react"
import ResumeForm from "../components/resume/ResumeForm"
import initialData from "../components/resume/initialData";


const ResumeBuilder = ({user,setUser}) => {
    const [currentStep, setCurrentStep]=useState(6);
    const [data,setData] = useState(initialData);
  return (
    <div>
        <ResumeForm step={currentStep} data={data} setData={setData}/>
    </div>
  )
}

export default ResumeBuilder