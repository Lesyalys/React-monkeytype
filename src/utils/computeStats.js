export default function computeStats({ correct, incorrect, elapsed }) {
  const totalTyped = correct + incorrect;
  const wpm = elapsed > 0 ? Math.round(correct / 5 / (elapsed / 60)) : 0;
  const accuracy =
    totalTyped > 0 ? Math.round((correct / totalTyped) * 100) : 100;
  return { totalTyped, wpm, accuracy };
}
