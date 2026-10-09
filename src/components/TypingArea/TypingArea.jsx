import { useRef, useEffect } from "react";
import "./TypingArea.css";

function TypingArea({ text, input, onInput, preview, readOnly }) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (!readOnly) inputRef.current?.focus();
  }, [readOnly]);

  // Разбиваем на слова с сохранением пробелов (по границам слов)
  // Для простоты — рендерим посимвольно, пробел отображаем как обычный пробел.
  function renderChar(ch, i) {
    let className = "typing__char";

    if (i < input.length) {
      if (input[i] === ch) {
        className += " typing__char--correct";
      } else if (i >= text.length) {
        className += " typing__char--extra";
      } else {
        className += " typing__char--incorrect";
      }
    } else if (i === input.length && !readOnly) {
      className += " typing__char--active";
    }

    return (
      <span key={i} className={className}>
        {ch}
      </span>
    );
  }

  return (
    <div
      className={`typing ${preview ? "typing--preview" : ""}`}
      onClick={() => !readOnly && inputRef.current?.focus()}
    >
      <div className="typing__text">
        {text.split("").map((ch, i) => renderChar(ch, i))}

        {/* Лишние символы сверх длины текста */}
        {input.length > text.length &&
          input
            .slice(text.length)
            .split("")
            .map((ch, i) => (
              <span
                key={`extra-${i}`}
                className="typing__char typing__char--extra"
              >
                {ch}
              </span>
            ))}
      </div>

      {!readOnly && (
        <input
          ref={inputRef}
          className="typing__input"
          type="text"
          value={input}
          onChange={onInput}
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
      )}
    </div>
  );
}

export default TypingArea;
