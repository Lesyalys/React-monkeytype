import { useState, useEffect, useCallback } from "react";
import Header from "./components/Header/Header";
import ModeSelector from "./components/ModeSelector/ModeSelector";
import TypingArea from "./components/TypingArea/TypingArea";
import Stats from "./components/Stats/Stats";
import Controls from "./components/Controls/Controls";
import Results from "./components/Results/Results";
import { getText } from "./utils/words";
import "./App.css";

const DEFAULT_MODE = "time";
const DEFAULT_TIME = 15;
const DEFAULT_WORDS = 50;
const DEFAULT_COUNT_WORDS = 40;

function App() {
  const [mode, setMode] = useState(DEFAULT_MODE);
  const [timeLimit, setTimeLimit] = useState(DEFAULT_TIME);
  const [wordsLimit, setWordsLimit] = useState(DEFAULT_WORDS);
  const [phase, setPhase] = useState("setup");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIME);
  const [, setTick] = useState(0);

  // ← после всех useState
  const wordsTyped = input.trim() === "" ? 0 : input.trim().split(/\s+/).length;

  // ---- Загрузка текста ----
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, mode, wordsLimit]);

  // ---- Таймер ----
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

  // ---- Завершение в words (по словам) ----
  useEffect(() => {
    if (phase !== "running") return;
    if (mode !== "words") return;
    if (wordsTyped >= wordsLimit) setPhase("finished");
  }, [wordsTyped, phase, mode, wordsLimit]);

  // ---- Ввод ----
  function handleInput(e) {
    if (phase !== "running") return;
    const value = e.target.value;

    if (!startTime) setStartTime(Date.now());

    if (mode === "words") {
      const typedNow =
        value.trim() === "" ? 0 : value.trim().split(/\s+/).length;
      if (typedNow > wordsLimit) return;
    }
    setInput(value);
  }

  const handleStart = useCallback(() => {
    setInput("");
    setStartTime(null);
    setTimeLeft(timeLimit);
    setPhase("running");
  }, [timeLimit]);

  const handleRestart = useCallback(() => {
    setInput("");
    setStartTime(null);
    setTimeLeft(timeLimit);
    setPhase("running");
  }, [timeLimit]);

  // ← не грузим текст вручную, только сбрасываем и переключаем фазу
  const handleNext = useCallback(() => {
    setInput("");
    setStartTime(null);
    setTimeLeft(timeLimit);
    setText(""); // → useEffect перезагрузит
    setPhase("setup");
  }, [timeLimit]);

  const handleFinish = useCallback(() => {
    setInput("");
    setStartTime(null);
    setTimeLeft(timeLimit);
    setPhase("setup");
  }, [timeLimit]);

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setPhase("setup");
    setInput("");
    setStartTime(null);
    setText(""); // ← сброс, чтобы текст перезагрузился
  };

  const handleTimeChange = (t) => {
    setTimeLimit(t);
    setTimeLeft(t);
    setPhase("setup");
    setInput("");
    setStartTime(null);
  };

  const handleWordsChange = (w) => {
    setWordsLimit(w);
    setPhase("setup");
    setInput("");
    setStartTime(null);
    setText(""); // ← сброс, чтобы текст перезагрузился
  };

  const { correct, incorrect } = countChars(text, input);
  const elapsed = startTime
    ? mode === "time"
      ? Math.min(timeLimit, (Date.now() - startTime) / 1000)
      : (Date.now() - startTime) / 1000
    : 0;
  const totalTyped = input.length;

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
            onStart={handleStart}
          />
        )}

        {phase === "running" && (
          <>
            <Stats
              mode={mode}
              timeLeft={timeLeft}
              currentIndex={mode === "words" ? wordsTyped : input.length}
              totalLength={mode === "words" ? wordsLimit : text.length}
            />
            <TypingArea text={text} input={input} onInput={handleInput} />
            <Controls onRestart={handleRestart} onFinish={handleFinish} />
          </>
        )}

        {phase === "finished" && (
          <>
            <Results
              mode={mode}
              timeLimit={timeLimit}
              wordsLimit={wordsLimit}
              elapsed={mode === "time" ? timeLimit : elapsed}
              correct={correct}
              incorrect={incorrect}
              totalTyped={totalTyped}
            />
            <Controls onRestart={handleRestart} onNext={handleNext} />
          </>
        )}
      </main>
    </div>
  );
}

function countChars(text, input) {
  const min = Math.min(text.length, input.length);
  let correct = 0;
  let incorrect = 0;
  for (let i = 0; i < min; i++) {
    if (input[i] === text[i]) correct++;
    else incorrect++;
  }
  if (input.length > text.length) {
    incorrect += input.length - text.length;
  }
  return { correct, incorrect };
}

export default App;
