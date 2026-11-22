import React from 'react'
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
const Timer = ({timeLeft,totalTime}) => {
   const  percentage=(timeLeft/totalTime)*100;

  return (
    <div>
        <CircularProgressbar value={percentage} text={`${timeLeft}s`} styles={buildStyles({

        })}/>

    </div>
  )
}

export default Timer