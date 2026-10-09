import "./ModeSelector.css";

const TIME_OPTIONS = [15, 30, 60, 120];
const WORDS_OPTIONS = [10, 25, 50, 100];

function ModeSelector({
  mode,
  timeLimit,
  wordsLimit,
  onModeChange,
  onTimeChange,
  onWordsChange,
  onStart,
}) {
  const values = mode === "time" ? TIME_OPTIONS : WORDS_OPTIONS;
  const currentValue = mode === "time" ? timeLimit : wordsLimit;
  const onChange = mode === "time" ? onTimeChange : onWordsChange;

  return (
    <div className="mode-selector">
      <div className="mode-selector__pill">
        <button
          className={`mode-selector__btn ${
            mode === "time" ? "mode-selector__btn--active" : ""
          }`}
          onClick={() => onModeChange("time")}
        >
          <img src="./png/Time.png" />
          Время
        </button>
        <button
          className={`mode-selector__btn ${
            mode === "words" ? "mode-selector__btn--active" : ""
          }`}
          onClick={() => onModeChange("words")}
        >
          <img src="./png/uil_letter-english-a.png" />
          Слова
        </button>

        <div className="mode-selector__values">
          {values.map((v) => (
            <button
              key={v}
              className={`mode-selector__value ${
                currentValue === v ? "mode-selector__value--active" : ""
              }`}
              onClick={() => onChange(v)}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <button className="mode-selector__start" onClick={onStart}>
        Начать тест <span className="mode-selector__start-arrow">›</span>
      </button>
    </div>
  );
}

export default ModeSelector;
