export default async function fetchText(count) {
  console.log(count);
  try {
    const res = await fetch(
      `https://random-word-api.herokuapp.com/word?number=${count}`,
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("Пустой ответ API");
    }
    // Собираем слова в предложение с заглавной буквы и точкой
    const sentence =
      data.join(" ").charAt(0).toUpperCase() + data.join(" ").slice(1) + ".";
    return { status: true, data: sentence };
  } catch (e) {
    console.warn("API недоступен, используем локальный текст:", e.message);
    return { status: false, data: e };
  }
}
