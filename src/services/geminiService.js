import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export default async function gerarDescricaoComGemini(imageBuffer) {
  const promptDescription =
    "Gere uma descrição curta de um parágrafo em português do Brasil para a seguinte imagem e retorne apenas a descrição, sem sugestões ou recomendações ou bullet points";
  const promptAlt = 
    "Gere um texto alternativo curto em português do Brasil para a seguinte imagem e retorne apenas o texto";

  try {
    const image = {
      inlineData: {
        data: imageBuffer.toString("base64"),
        mimeType: "image/png",
      },
    };
    const resDescription = await model.generateContent([promptDescription, image]);
    const resAlt = await model.generateContent([promptAlt, image]);
    return { description: resDescription.response.text().trim(), alt: resAlt.response.text().trim() } || "Alt-text não disponível.";
  } catch (erro) {
    console.error("Erro ao obter alt-text:", erro.message, erro);
    throw new Error("Erro ao obter o alt-text do Gemini.");
  }
}