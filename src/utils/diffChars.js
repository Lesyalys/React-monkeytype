export default function diffChars(text, prev, next) {
  if (next.length <= prev.length) return { correct: 0, incorrect: 0 };

  const added = next.slice(prev.length);
  let correct = 0;
  let incorrect = 0;

  for (let i = 0; i < added.length; i++) {
    const pos = prev.length + i;
    if (next[pos] === text[pos]) correct++;
    else incorrect++;
  }
  return { correct, incorrect };
}
