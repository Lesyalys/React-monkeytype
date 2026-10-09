import "./Controls.css";

function Controls({ onRestart, onNext, onFinish }) {
  return (
    <div className="controls">
      {onRestart && (
        <button className="controls__btn" onClick={onRestart}>
          Заново <span className="controls__icon">↻</span>
        </button>
      )}

      {onFinish && (
        <button className="controls__btn" onClick={onFinish}>
          Закончить <span className="controls__icon">■</span>
        </button>
      )}

      {onNext && (
        <button
          className="controls__btn controls__btn--primary"
          onClick={onNext}
        >
          Следующий тест <span className="controls__icon">›</span>
        </button>
      )}
    </div>
  );
}

export default Controls;
