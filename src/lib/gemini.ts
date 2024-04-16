import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function replyGeminiChat(messsage: string) {
  const genAI = new GoogleGenerativeAI(
    "AIzaSyAQkv-a8gP-A4Dn7nOGRdX-nArRNRHJ8Tc"
  );

  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = messsage;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  return text;
}
