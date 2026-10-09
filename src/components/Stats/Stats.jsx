import "./Stats.css";

function Stats({ mode, timeLeft, currentIndex, totalLength }) {
  return (
    <div className="stats">
      <span className="stats__counter">
        <span className="stats__counter-current">{currentIndex}</span>
        <span className="stats__counter-sep">/</span>
        <span className="stats__counter-total">{totalLength}</span>
      </span>
      {mode === "time" && (
        <span className="stats__timer">{Math.ceil(timeLeft)}s</span>
      )}
    </div>
  );
}

export default Stats;
