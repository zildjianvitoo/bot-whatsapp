import WAWebJS, { Client, MessageMedia } from "whatsapp-web.js";
import replyGeminiChat from "./gemini";
import { removeBackgroundFromImageBase64 } from "remove.bg";

const commands = [
  {
    prefix: ".help",
    description: "Menampilkan command apa yang bisa digunakan botnya",
  },
  { prefix: ".sticker", description: "Membuat sticker" },
  {
    prefix: ".sticker-removebg",
    description: "Membuat sticker dengan background yang telah dihapus",
  },
  { prefix: ".ai <prompt>", description: "Menggunakan ai" },
  { prefix: ".removebg", description: "Hapus Background" },
];

export function handleMessage(msg: WAWebJS.Message, client: Client) {
  const { body, type } = msg;

  switch (true) {
    case body === ".help":
      return handleHelp(body);
    case body.startsWith(".ai"):
      return handleAIChat(msg, body);
    case body === "sticker" && type === "image":
      return handleSticker(msg, client);
    case body === ".removebg" && type === "image":
      return handleRemoveBG(msg, client);
    case body === ".sticker-removebg" && type === "image":
      return stickerRemoveBG(msg, client);
    case body === ".bagas":
      return "Bagas Kontolll";
    case body === ".dimas":
      return "Dimas Kontolll";
    default:
      return null;
  }
}

function handleHelp(msg: string) {
  let messageBody = `**Daftar Perintah Bot:**\n\n`;
  for (const command of commands) {
    messageBody += `* ${command.prefix}: ${command.description}\n`;
  }
  return messageBody;
}

async function handleAIChat(msg: WAWebJS.Message, body: string) {
  try {
    msg.react("⏱️");
    const prompt = body.slice(3).trim();
    const reply = await replyGeminiChat(prompt);
    msg.react("✅");
    return reply;
  } catch (error) {
    msg.react("❌");
    return "Fitur sedang error,segera diperbaiki";
  }
}

async function handleSticker(msg: WAWebJS.Message, client: Client) {
  try {
    const media = await msg.downloadMedia();
    msg.react("⏱️");
    client.sendMessage(msg.from, media, { sendMediaAsSticker: true });
    msg.react("✅");
    return null;
  } catch (error) {
    console.log(error);
    msg.react("❌");
    return "Fitur sedang error";
  }
}

async function handleRemoveBG(msg: WAWebJS.Message, client: Client) {
  const media = await msg.downloadMedia();
  try {
    msg.react("⏱️");
    const result = await removeBackgroundFromImageBase64({
      base64img: media.data,
      apiKey: "bMYzahfNbWuSPRMpbGqvgdzu",
      size: "regular",
      type: "product",
    });

    const { base64img } = result;

    const image = new MessageMedia(
      result.detectedType,
      base64img,
      "convert.png"
    );
    msg.react("✅");
    client.sendMessage(msg.from, image);
    return null;
  } catch (error) {
    msg.react("❌");
    console.log(error);
    return "kocak";
  }
}

async function stickerRemoveBG(msg: WAWebJS.Message, client: Client) {
  const media = await msg.downloadMedia();
  try {
    msg.react("⏱️");
    const result = await removeBackgroundFromImageBase64({
      base64img: media.data,
      apiKey: "bMYzahfNbWuSPRMpbGqvgdzu",
      size: "regular",
      type: "product",
    });

    const { base64img } = result;

    const image = new MessageMedia("image/png", base64img, "convert.png");
    msg.react("✅");
    client.sendMessage(msg.from, image, {
      sendMediaAsSticker: true,
    });
    return null;
  } catch (error) {
    msg.react("❌");
    console.log(error);
    return "kocak";
  }
}
