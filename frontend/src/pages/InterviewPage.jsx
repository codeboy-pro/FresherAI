import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getInterview } from '../apis/interview.api';
import Step2interview from '../components/interview/Step2interview';

const InterviewPage = ({user,setUser}) => {

  const {id}=useParams();
  const [loading,setLoading]=useState(false);

  const [interview,setInterview]=useState(null);
  const navigate=useNavigate();
  useEffect(()=>{
   const fetchInterview=async()=>{
      const response=await getInterview(id);
      const data=response?.interview;
      if(data.status==="completed"){
         navigate(`/interview/${id}/report`,{replace:true});
         return;
      }
      setInterview(data);
      setLoading(false);

   }
   fetchInterview();
  },[id,navigate]);

  if(loading){

    return (

      <div>
         {/* loading animation */}
        <div/>
      </div>
    )
  }

  if(!interview) return null;
  return (
       <Step2interview  interviewData={{
        interviewId:interview?.id,
        currentQuestion:interview?.currentQuestion,
        totalQuestions:interview?.questions.length,
        question:interview?.questions[interview?.currentQuestion],
       }}   user={user}/>
  )
}

export default InterviewPage