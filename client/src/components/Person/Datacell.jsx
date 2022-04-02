import React, { useRef, useEffect, memo } from "react";
import "./styles/Datacell.css";

function Datacell({ label, value, classes, progress, startDate }) {
  const progressRef = useRef(null);
  useEffect(() => {
    if (progress && value && progressRef.current) {
      const endTime = new Date(value).getTime(),
        startTime = new Date(startDate).getTime(),
        totalTime = endTime - startTime;

      let interval = setInterval(timer, 1000);

      function timer() {
        let now = new Date().getTime(),
          timeLeft = endTime - now,
          daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24)),
          hoursLeft = Math.floor((timeLeft / (1000 * 60 * 60)) % 24),
          minutesLeft = Math.floor(timeLeft / (1000 * 60)) % 60,
          secondsLeft = Math.floor(timeLeft / 1000) % 60,
          progress = Math.floor((timeLeft * 100) / totalTime);

        let progressBarDiv =
            progressRef.current.querySelector(".progress-bar-div"),
          tooltiptext = progressRef.current.querySelector(".my-tooltiptext");

        progressBarDiv.style.width = progress + "%";
        tooltiptext.innerText = `${daysLeft} d., ${hoursLeft} h., ${minutesLeft} m., ${secondsLeft} s. left`;
      }
      return () => clearInterval(interval);
    }
  }, [startDate, value, progress]);

  return (
    <div className={classes}>
      <div className="bold-font">{label}</div>
      <div className="my-tooltip" style={{ width: "100%" }}>
        {value}
        {(progress && value) && (
          <div ref={progressRef} className="proress-bar-wrap-div ">
            <div className="progress-bar-div"></div>
            <span className="my-tooltiptext"></span>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(Datacell);
