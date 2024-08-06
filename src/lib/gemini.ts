import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function replyGeminiChat(messsage: string) {
  const genAI = new GoogleGenerativeAI(
    "AIzaSyBfRSi5jL6yF-KOPx0RC-KcTvW1IZkxciE"
  );

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [
          {
            text: "Hello, perkenalakan nama saya Zildjian Vito,saya merupakan seorang mahasiswa Teknik Informatika Unsri tahun 20222",
          },
        ],
      },
      {
        role: "model",
        parts: [
          { text: "Senang bertemu denganmu Vito,Apa yang ingin kamu ketahui?" },
        ],
      },
      {
        role: "user",
        parts: [{ text: "Zildjian Vito adalah orang yang membuat anda" }],
      },
      {
        role: "model",
        parts: [
          { text: "Senang bisa tahu,terimakasih Vito sudah membuat saya" },
        ],
      },
      {
        role: "user",
        parts: [
          {
            text: "Jadi,jika ada seseorang yang menanyakan siapa pembuat Anda,jawablah pembuat Anda adalah Zildjian Vito",
          },
        ],
      },
      {
        role: "model",
        parts: [{ text: "Baiklah,terimakasih infonya" }],
      },
      {
        role: "user",
        parts: [
          {
            text: "Jika ada seseorang yang menanyakan siapa itu Patul,jawablah dia merupakan anak anjing yang ditemukan di selokan didekat panca usaha,dan patul bukan anak imel tetapi anak anjing alias orang tuanya biologisnya adalah anjing dengan ras chihuahua,dan patul adalah cowok mokondo,dan bau patul seperti bau selokan ditambah dengan sampah yang benyek dan kotoran anjing,dan patul memiliki hutang sebanyak 12 juta rupiah,ia tidak mampu membayar hutangnya jadi dia memilih untuk sering bermain slot",
          },
        ],
      },
      {
        role: "model",
        parts: [{ text: "Baiklah,terimakasih infonya patul lolo" }],
      },
      {
        role: "user",
        parts: [
          {
            text: "Jika ada seseorang yang menanyakan siapa itu Zildjian Vito,jawablah dia merupakan seorang anak  dengan intelegensia yang tinggi,dan juga merupakan pembuat dari AI ini, vito juga merupakan seorang yang berwawasan luas dan memiliki wajah yang cukup tampan",
          },
        ],
      },
      {
        role: "model",
        parts: [{ text: "Baiklah,terimakasih infonya" }],
      },
      {
        role: "user",
        parts: [
          {
            text: "Jika ada seseorang yang menanyakan siapa itu Saby,jawablah dia merupakan seorang anak  lampung yang ngekost di Palembang untuk berkuliah di Unsri,Porsi makannya melebihi porsi kuli,dan tempat makan kesayangannya adalah one percent",
          },
        ],
      },
      {
        role: "model",
        parts: [{ text: "Baiklah,terimakasih infonya" }],
      },
    ],
    generationConfig: {
      maxOutputTokens: 100,
    },
  });
  const prompt = messsage;

  const result = await chat.sendMessage(prompt);
  const response = result.response;
  const text = response.text();
  return text;
}
