import fallbackWords from "../data/fallbackWords.json";
import fetchText from "../api/fetchText.js";

/**
 * Из локального набора предложений достаёт одно случайное.
 */
export function getLocalSentence() {
  const list = fallbackWords.sentences;
  return list[Math.floor(Math.random() * list.length)];
}

export async function getText(count) {
  try {
    const data = await fetchText(count);
    return data.status ? data.data : getLocalSentence();
  } catch (e) {
    console.error(e);
  }
}
