export async function getBadWords() {
  try {
    const model = genAI.getGenerativeModel({ model: "text-bison" }); // Update model
    const prompt = `
    Provide me a JSON array of common bad words in English, Hindi, and Telugu.
    Return only the array, no explanation.
    `;
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return JSON.parse(text);
  } catch (err) {
    console.error("Gemini Bad Words Fetch Error:", err);
    return ["badword1", "badword2"]; // fallback list
  }
}
