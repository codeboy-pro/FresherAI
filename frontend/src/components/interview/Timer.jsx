
import React from "react";
import {
  buildStyles,
  CircularProgressbar,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const Timer = ({ timeLeft, totalTime }) => {
  const percentage = Math.max(
    0,
    Math.min(100, (timeLeft / totalTime) * 100),
  );

  const timerColor =
    timeLeft <= 10
      ? "#f87171"
      : timeLeft <= 20
        ? "#fbbf24"
        : "#10b981";

  return (
    <div className="h-full w-full">
      <CircularProgressbar
        value={percentage}
        text={`${timeLeft}s`}
        strokeWidth={8}
        styles={buildStyles({
          textColor: timerColor,
          pathColor: timerColor,
          trailColor: "#292d36",
          textSize: "23px",
          pathTransitionDuration: 0.5,
          strokeLinecap: "round",
        })}
      />
    </div>
  );
};

export default Timer;
