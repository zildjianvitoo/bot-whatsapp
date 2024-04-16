import WAWebJS, { Client, MessageMedia } from "whatsapp-web.js";
import replyGeminiChat from "./gemini";
import { removeBackgroundFromImageBase64 } from "remove.bg";
import prismadb from "./db";

const commands = [
  {
    prefix: ".help",
    description: "Menampilkan command apa yang bisa digunakan botnya",
  },
  {
    prefix: ".owner",
    description: "Menampilkan Kontak Owner Bot",
  },
  { prefix: ".sticker", description: "Membuat sticker" },
  {
    prefix: ".sticker-removebg",
    description: "Membuat sticker dengan background yang telah dihapus",
  },
  { prefix: ".ai <prompt>", description: "Menggunakan ai" },
  { prefix: ".removebg", description: "Hapus Background" },
];

export async function handleMessage(msg: WAWebJS.Message, client: Client) {
  const { body, type } = msg;

  if (body === ".matikanbot" || body === ".hidupkanbot") {
    return handleBotStatus(msg, client);
  }
  const bot = await prismadb.bot.findUnique({
    where: {
      id: 1,
    },
  });

  if (bot?.status === "offline") {
    return "Bot sedang offline,hubungi owner untuk menghidupkannya kembali";
  }

  switch (true) {
    case body === ".help":
      return handleHelp(body);
    case body.startsWith(".ai"):
      return handleAIChat(msg, body);
    case body === ".sticker" && type === "image":
      return handleSticker(msg, client);
    case body === ".removebg" && type === "image":
      return handleRemoveBG(msg, client);
    case body === ".sticker-removebg" && type === "image":
      return stickerRemoveBG(msg, client);
    case body === ".owner":
      return showOwnerContact(msg, client);
    case body === ".terimakasih":
      return "Sama sama mas";
    case body === ".patul":
      const patulContact = await client.getContactById("6289502709130@c.us");
      client.sendMessage(msg.from, patulContact);
      return "Patul KontolllLLLLLLLLLLL";
    case body === ".bagas":
      const bagasContact = await client.getContactById("6282177111713@c.us");
      client.sendMessage(msg.from, bagasContact);
      return "Bagas Kontolll";
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
async function showOwnerContact(msg: WAWebJS.Message, client: Client) {
  try {
    msg.react("⏱️");
    const ownerContact = await client.getContactById("6285176734655@c.us");
    client.sendMessage(msg.from, ownerContact);
    msg.react("✅");
    return null;
  } catch (error) {
    msg.react("❌");
    return "Fitur sedang dalam perbaikan";
  }
}
async function handleBotStatus(msg: WAWebJS.Message, client: Client) {
  if (msg.from !== "6285176734655@c.us") {
    return "Anda bukan admin,hanya Admin yang bisa mengupdate status Bot";
  }
  try {
    if (msg.body === ".matikanbot") {
      await prismadb.bot.update({
        where: {
          id: 1,
        },
        data: {
          status: "offline",
        },
      });

      client.sendMessage(msg.from, "Bot dimatikan,semoga harimu menyenangkan");
      return null;
    } else {
      await prismadb.bot.update({
        where: {
          id: 1,
        },
        data: {
          status: "online",
        },
      });
      return "Bot dihidupkan,Silahkan gunakan fiturnya sesuka hati";
    }
  } catch (error) {
    msg.react("❌");
    return "Fitur sedang dalam perbaikan";
  }
}
