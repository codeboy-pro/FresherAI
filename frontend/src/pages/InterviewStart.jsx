import React from 'react'
import Step1Setup from '../components/interview/Step1Setup'

const InterviewStart = ({user,setUser}) => {
  return (
    <Step1Setup user={user} setUser={setUser}/>
  )
}

export default InterviewStart