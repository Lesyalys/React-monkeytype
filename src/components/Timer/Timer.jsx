import "./Timer.css";

function Timer({ timeLeft, total, active }) {
  const progress = total > 0 ? (timeLeft / total) * 100 : 0;
  const seconds = Math.ceil(timeLeft);

  return (
    <div className="timer">
      <div className="timer__bar">
        <div className="timer__bar-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className={`timer__text ${active ? "timer__text--active" : ""}`}>
        {seconds}s
      </div>
    </div>
  );
}

export default Timer;
