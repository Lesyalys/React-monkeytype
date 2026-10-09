import { useState, useEffect, useCallback } from "react";
import Header from "./components/Header/Header";
import ModeSelector from "./components/ModeSelector/ModeSelector";
import TypingArea from "./components/TypingArea/TypingArea";
import Stats from "./components/Stats/Stats";
import Controls from "./components/Controls/Controls";
import Results from "./components/Results/Results";
import { getText } from "./utils/words";
import diffChars from "./utils/diffChars";
import computeStats from "./utils/computeStats";
import "./App.css";

const DEFAULT_MODE = "time";
const DEFAULT_TIME = 15;
const DEFAULT_WORDS = 50;
const DEFAULT_COUNT_WORDS = 40;

function App() {
  const [mode, setMode] = useState(DEFAULT_MODE);
  const [timeLimit, setTimeLimit] = useState(DEFAULT_TIME);
  const [wordsLimit, setWordsLimit] = useState(DEFAULT_WORDS);

  const [phase, setPhase] = useState("setup"); // 'setup' | 'running' | 'finished'

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");

  const [startTime, setStartTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIME);
  const [, setTick] = useState(0);

  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalIncorrect, setTotalIncorrect] = useState(0);

  const resetProgress = useCallback(() => {
    setInput("");
    setTotalCorrect(0);
    setTotalIncorrect(0);
    setStartTime(null);
    setTimeLeft(timeLimit);
  }, [timeLimit]);

  const startTest = useCallback(() => {
    resetProgress();
    setPhase("running");
  }, [resetProgress]);

  const goToSetup = useCallback(
    ({ keepText } = { keepText: true }) => {
      resetProgress();
      if (!keepText) setText("");
      setPhase("setup");
    },
    [resetProgress],
  );

  const handleNext = useCallback(() => {
    goToSetup({ keepText: false });
  }, [goToSetup]);

  const handleFinish = useCallback(() => {
    goToSetup({ keepText: true });
  }, [goToSetup]);

  const handleModeChange = useCallback(
    (newMode) => {
      setMode(newMode);
      goToSetup({ keepText: false });
    },
    [goToSetup],
  );

  const handleTimeChange = useCallback(
    (t) => {
      setTimeLimit(t);
      setTimeLeft(t);
      goToSetup({ keepText: true });
    },
    [goToSetup],
  );

  const handleWordsChange = useCallback(
    (w) => {
      setWordsLimit(w);
      goToSetup({ keepText: false });
    },
    [goToSetup],
  );

  useEffect(() => {
    if (phase !== "setup") return;
    if (text) return;

    let cancelled = false;
    setLoading(true);

    const count = mode === "words" ? wordsLimit : DEFAULT_COUNT_WORDS;

    getText(count).then((t) => {
      if (cancelled) return;
      setText(t);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [phase, mode, wordsLimit]);

  useEffect(() => {
    if (phase !== "running") return;
    if (mode !== "time") return;
    if (!startTime) return;

    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const left = Math.max(0, timeLimit - elapsed);
      setTimeLeft(left);
      setTick((x) => x + 1);
      if (left <= 0) setPhase("finished");
    }, 100);

    return () => clearInterval(interval);
  }, [phase, mode, startTime, timeLimit]);

  useEffect(() => {
    if (phase !== "running") return;
    if (mode !== "words") return;
    if (text.length > 0 && input.length >= text.length) setPhase("finished");
  }, [input, phase, mode, text.length]);

  const handleInput = useCallback(
    (e) => {
      if (phase !== "running") return;
      const value = e.target.value;
      const prev = input;

      if (!startTime) setStartTime(Date.now());

      if (mode === "words" && value.length > text.length) return;

      if (value.length <= prev.length) {
        setInput(value);
        return;
      }

      const { correct, incorrect } = diffChars(text, prev, value);
      if (correct) setTotalCorrect((x) => x + correct);
      if (incorrect) setTotalIncorrect((x) => x + incorrect);

      setInput(value);
    },
    [phase, input, startTime, mode, text],
  );

  const elapsed = startTime
    ? mode === "time"
      ? Math.min(timeLimit, (Date.now() - startTime) / 1000)
      : (Date.now() - startTime) / 1000
    : 0;

  const { totalTyped, wpm, accuracy } = computeStats({
    correct: totalCorrect,
    incorrect: totalIncorrect,
    elapsed,
  });

  if (loading && !text) {
    return <div className="app__loading">Загрузка текста...</div>;
  }

  return (
    <div className="app">
      <Header />

      <main className="app__main">
        {phase === "setup" && (
          <ModeSelector
            mode={mode}
            timeLimit={timeLimit}
            wordsLimit={wordsLimit}
            onModeChange={handleModeChange}
            onTimeChange={handleTimeChange}
            onWordsChange={handleWordsChange}
            onStart={startTest}
          />
        )}

        {phase === "running" && (
          <>
            <Stats
              mode={mode}
              timeLeft={timeLeft}
              currentIndex={input.length}
              totalLength={text.length}
            />
            <TypingArea text={text} input={input} onInput={handleInput} />
            <Controls onRestart={startTest} onFinish={handleFinish} />
          </>
        )}

        {phase === "finished" && (
          <>
            <Results
              mode={mode}
              timeLimit={timeLimit}
              wordsLimit={wordsLimit}
              elapsed={elapsed}
              correct={totalCorrect}
              incorrect={totalIncorrect}
              totalTyped={totalTyped}
              wpm={wpm}
              accuracy={accuracy}
            />
            <Controls onRestart={startTest} onNext={handleNext} />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
