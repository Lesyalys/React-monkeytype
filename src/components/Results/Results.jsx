import "./Results.css";

function Results({
  mode,
  timeLimit,
  wordsLimit,
  elapsed,
  correct,
  incorrect,
  totalTyped,
}) {
  const wpm = elapsed > 0 ? Math.round(correct / 5 / (elapsed / 60)) : 0;
  const accuracy =
    totalTyped > 0 ? Math.round((correct / totalTyped) * 100) : 100;

  // «Тип теста» — как на скриншоте: «время 15» / «слова 50»
  const typeLabel = mode === "time" ? "время" : "слова";
  const typeValue = mode === "time" ? timeLimit : wordsLimit;

  return (
    <div className="results">
      <div className="results__row">
        <div className="results__col">
          <div className="results__label">тип теста</div>
          <div className="results__value">
            <span className="results__value-accent">{typeLabel}</span>{" "}
            {typeValue}
          </div>
        </div>

        <div className="results__col">
          <div className="results__label">сpm</div>
          <div className="results__value results__value--accent">{wpm}</div>
        </div>

        <div className="results__col">
          <div className="results__label">точность</div>
          <div className="results__value">{accuracy}%</div>
        </div>

        <div className="results__col">
          <div className="results__label">символы</div>
          <div className="results__value">{correct}</div>
        </div>

        <div className="results__col">
          <div className="results__label">ошибки</div>
          <div className="results__value">{incorrect}</div>
        </div>
      </div>
    </div>
  );
}

export default Results;
