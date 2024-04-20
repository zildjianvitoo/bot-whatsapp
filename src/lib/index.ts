import WAWebJS, {
  Client,
  Contact,
  MessageMedia,
  GroupChat,
} from "whatsapp-web.js";
import replyGeminiChat from "./gemini";
import { removeBackgroundFromImageBase64 } from "remove.bg";
import prismadb from "./db";
import { downloadTikTokVideo } from "./tiktok";
import fs from "fs";
import https from "https";
import adminOnly from "./adminOnly";
import { convertToMp4, dateTimeToString } from "./convert";
import deleteFiles from "./deleteFiles";
import axios from "axios";

const commands = [
  {
    prefix: "*.help*",
    description: "Menampilkan command apa yang bisa digunakan botnya",
  },
  {
    prefix: "*.owner*",
    description: "Menampilkan Kontak Owner Bot",
  },
  { prefix: "*.sticker*", description: "Membuat sticker berdasarkan gambar" },
  {
    prefix: "*.sticker-removebg*",
    description: "Membuat sticker dengan background yang telah dihapus",
  },
  {
    prefix: "*.conversticker*",
    description: "Mengubah sticker menjadi gambar",
  },
  { prefix: "*.ai (promptanda)*", description: "Menggunakan ai" },
  { prefix: "*.removebg*", description: "Hapus Background" },
  {
    prefix: "*.tt (linkvideo)*",
    description:
      "Mengirim video tiktok tanpa watermark (lebih cepat dibanding .sosmed)",
  },
  {
    prefix: "*.sosmed (linkvideo)*",
    description:
      "Mengirim video sosmed(facebook, tiktok, twitter, instagram, youtube, pinterest, gdrive) tanpa watermark",
  },
  {
    prefix: "*.wek*",
    description: "Mengirim sticker wekk",
  },
  {
    prefix: "*.crypto (symbolcoin)*",
    description: "Mengirim harga coin cypto",
  },
  {
    prefix: "*.chat/(nomortujuan)/(pesan)*",
    description: "Mengirim pesan (admin only)",
  },
];

export async function handleMessage(msg: WAWebJS.Message, client: Client) {
  const { body } = msg;

  if (body === ".matikanbot" || body === ".hidupkanbot") {
    return handleBotStatus(msg, client);
  }
  const bot = await prismadb.bot.findUnique({
    where: {
      id: 1,
    },
  });

  const prefixArray = commands.map((command) => command.prefix.split("*")[1]);
  const isBodyIncluded = prefixArray.some((item) =>
    body.includes(item.split(" ")[0])
  );

  if (bot?.status === "offline" && isBodyIncluded) {
    return "Bot sedang offline,hubungi owner untuk menghidupkannya kembali";
  }

  switch (true) {
    case body === ".help":
      return handleHelp(body);
    case body.startsWith(".tt"):
      return handleTiktok(msg, client);
    case body.startsWith(".ai"):
      return handleAIChat(msg, body);
    case body.startsWith(".sosmed"):
      return handleFacebookAndIG(msg, client);
    case body.startsWith(".twt"):
      return handleTwitter(msg, client);
    case body === ".sticker":
      return handleSticker(msg, client);
    case body === ".removebg":
      return handleRemoveBG(msg, client);
    case body === ".sticker-removebg":
      return stickerRemoveBG(msg, client);
    case body === ".all":
      return handleMentionEveryone(msg, client);
    case body.startsWith(".chat"):
      return handleSendPrivateChat(msg, client);
    case body === ".izinoff":
      return handleIzinOff(msg, client);
    case body === ".convertsticker":
      return handleConvertSticker(msg, client);
    // case body.startsWith(".ktl"):
    //   const msgToSend = body.split(".ktl")[1];
    //   return `Kontolll ${msgToSend}`;
    case body === ".owner":
      return showOwnerContact(msg, client);
    case body === ".wek":
      return handleSendWek(msg, client);
    case body.startsWith(".crypto"):
      return handleSendCryptoPrice(msg, client);
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
    const prompt = body.split(".ai")[1];
    const reply = await replyGeminiChat(prompt);
    msg.react("✅");
    return reply;
  } catch (error) {
    msg.react("❌");
    return "Fitur sedang error,segera diperbaiki";
  }
}

async function handleSticker(msg: WAWebJS.Message, client: Client) {
  let media = await msg.downloadMedia();

  if (msg.hasQuotedMsg) {
    const quotedMsg = await msg.getQuotedMessage();
    media = await quotedMsg.downloadMedia();
  }
  if (!media) {
    return "Tolong upload gambar dan ketikkan ulang perintahnya";
  }
  try {
    msg.react("⏱️");
    await client.sendMessage(msg.from, media, {
      sendMediaAsSticker: true,
      stickerAuthor: "Bot V Ganteng",
    });
    msg.react("✅");
    return null;
  } catch (error) {
    console.log(error);
    msg.react("❌");
    return "Fitur sedang error";
  }
}

async function handleConvertSticker(msg: WAWebJS.Message, client: Client) {
  let media = await msg.downloadMedia();

  if (msg.hasQuotedMsg) {
    const quotedMsg = await msg.getQuotedMessage();
    media = await quotedMsg.downloadMedia();
  }
  if (!media) {
    return "Tolong upload gambar dan ketikkan ulang perintahnya";
  }
  try {
    msg.react("⏱️");
    await client.sendMessage(msg.from, media);
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

  if (!media) {
    return "Tolong upload gambar dan ketikkan ulang perintahnya";
  }
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
    await client.sendMessage(msg.from, image);
    msg.react("✅");
    return null;
  } catch (error) {
    msg.react("❌");
    console.log(error);
    return "kocak";
  }
}

async function stickerRemoveBG(msg: WAWebJS.Message, client: Client) {
  let media = await msg.downloadMedia();

  if (msg.hasQuotedMsg) {
    const quotedMsg = await msg.getQuotedMessage();
    media = await quotedMsg.downloadMedia();
  }

  if (!media) {
    return "Tolong upload gambar dan ketikkan ulang perintahnya";
  }
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
    await client.sendMessage(msg.from, image, {
      sendMediaAsSticker: true,
    });
    msg.react("✅");
    return null;
  } catch (error) {
    msg.react("❌");
    console.log(error);
    return "fitur error";
  }
}
async function showOwnerContact(msg: WAWebJS.Message, client: Client) {
  try {
    msg.react("⏱️");
    const ownerContact = await client.getContactById("6285176734655@c.us");
    await client.sendMessage(msg.from, ownerContact);
    msg.react("✅");
    return null;
  } catch (error) {
    msg.react("❌");
    return "Fitur sedang dalam perbaikan";
  }
}
async function handleBotStatus(msg: WAWebJS.Message, client: Client) {
  if (!adminOnly(msg.author || msg.from)) {
    return "Hanya admin yang bisa mengupdate status bot";
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

      return "Bot dimatikan,semoga harimu menyenangkan";
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

async function handleTiktok(msg: WAWebJS.Message, client: Client) {
  const url = msg.body.split(".tt")[1];
  if (!url) {
    return "Tolong masukkan URL/Link video";
  }
  try {
    msg.react("⏱️");
    const videoUrl = await downloadTikTokVideo(url);

    const file = fs.createWriteStream("kocak.mp4");

    const request = https.get(videoUrl, function (response) {
      response.pipe(file);

      file.on("finish", async () => {
        file.close();

        await convertToMp4("kocak.mp4", "kocak2.mp4");
        const videoBuffer = fs.readFileSync("kocak2.mp4");
        const videoMedia = new MessageMedia(
          "video/mp4",
          videoBuffer.toString("base64")
        );
        await client.sendMessage(msg.from, videoMedia);
        msg.react("✅");
        deleteFiles(["kocak.mp4", "kocak2.mp4"]);
      });
    });

    msg.react("✅");
    return null;
  } catch (error) {
    msg.react("❌");
    return "Error";
  }
}

async function handleMentionEveryone(msg: WAWebJS.Message, client: Client) {
  const allowedAdminToMentions = ["6285176734655@c.us", "6282282658275@c.us"];
  msg.react("⏱️");
  try {
    const chats = await client.getChats();

    const chatObjects = chats.filter((chat) => chat.isGroup);
    const groupChats = chatObjects.map((groupChat) => {
      const groupChatObj = groupChat as GroupChat;
      return groupChatObj;
    });

    const validGroups = groupChats.filter((groupChat) => {
      return groupChat.id._serialized === msg.from;
    });

    const allNumbers = validGroups[0].participants.map(
      (participant) => participant.id._serialized
    );

    if (!allowedAdminToMentions.includes(msg.author!)) {
      return "Hanya owner yang bisa memakai fitur ini";
    }

    const messageToMention = "Gass daftar IFFEST!!!!";

    await client.sendMessage(msg.from, messageToMention, {
      mentions: allNumbers,
    });
    msg.react("✅");
    return null;
  } catch (error) {
    msg.react("❌");
    console.error(error);
    return "Terjadi error pada fitur ini,akan segera diperbaiki";
  }
}

async function handleSendPrivateChat(msg: WAWebJS.Message, client: Client) {
  const [_, numberToChat, messageToChat] = msg.body.split("/");
  if (!adminOnly(msg.author!)) {
    return "Hanya admin yang bisa memakai fitur ini";
  }
  try {
    // msg.react("⏱️");
    await client.sendMessage(numberToChat + "@c.us", messageToChat);
    msg.react("✅");
    return null;
  } catch (error) {
    msg.react("❌");
    return "Error";
  }
}

async function handleFacebookAndIG(msg: WAWebJS.Message, client: Client) {
  const url = msg.body.split(".sosmed")[1];

  // if (msg.body.startsWith(".fb")) {
  //   url = msg.body.split(".fb")[1];
  // } else {
  //   url = msg.body.split(".ig")[1];
  // }

  if (!url) {
    return "Tolong masukkan URL/Link video";
  }

  try {
    msg.react("⏱️");
    const { alldown } = await require("nayan-media-downloader");
    const { data } = await alldown(url);
    console.log(data);
    const downloadUrl = await data.high;
    msg.react("3️⃣");

    const request = https.get(downloadUrl, function (response) {
      const attachment = response.headers["content-disposition"]?.split(".");
      const fileType = attachment?.at(attachment.length - 1);
      const file = fs.createWriteStream(`kocak.${fileType}`);
      response.pipe(file);

      file.on("finish", async () => {
        file.close();
        msg.react("2️⃣");
        if (fileType === "mp4") {
          await convertToMp4(`kocak.${fileType}`, `kocak2.${fileType}`);
          const fileBuffer = fs.readFileSync(`kocak2.${fileType}`);
          msg.react("1️⃣");

          const fileMedia = new MessageMedia(
            "video/mp4",
            fileBuffer.toString("base64")
          );
          await client.sendMessage(msg.from, fileMedia);
          deleteFiles([`kocak.${fileType}`, `kocak2.${fileType}`]);
        } else {
          const fileBuffer = fs.readFileSync(`kocak.${fileType}`);
          msg.react("1️⃣");

          const fileMedia = new MessageMedia(
            `image/${fileType}`,
            fileBuffer.toString("base64")
          );
          await client.sendMessage(msg.from, fileMedia);
          deleteFiles([`kocak.${fileType}`]);
        }
        msg.react("✅");
      });
    });

    return null;
  } catch (error) {
    console.log(error);
    msg.react("❌");
    return "Error";
  }
}

async function handleTwitter(msg: WAWebJS.Message, client: Client) {
  const url = msg.body.split(".twt")[1];

  if (!url) {
    return "Tolong masukkan URL/Link video";
  }

  try {
    msg.react("⏱️");
    const { twitterdown } = require("nayan-media-downloader");
    const data = await twitterdown(url);
    console.log(data);
    const downloadUrl = await data.data.HD;
    msg.react("3️⃣");

    const request = https.get(downloadUrl, function (response) {
      const attachment = response.headers["content-disposition"]?.split(".");
      const fileType = attachment?.at(attachment.length - 1);
      const file = fs.createWriteStream(`kocak.${fileType}`);
      response.pipe(file);

      file.on("finish", async () => {
        file.close();
        msg.react("2️⃣");
        if (fileType === "mp4") {
          await convertToMp4(`kocak.${fileType}`, `kocak2.${fileType}`);
          const fileBuffer = fs.readFileSync(`kocak2.${fileType}`);
          msg.react("1️⃣");

          const fileMedia = new MessageMedia(
            "video/mp4",
            fileBuffer.toString("base64")
          );
          await client.sendMessage(msg.from, fileMedia);
          deleteFiles([`kocak.${fileType}`, `kocak2.${fileType}`]);
        } else {
          const fileBuffer = fs.readFileSync(`kocak.${fileType}`);
          msg.react("1️⃣");

          const fileMedia = new MessageMedia(
            `image/${fileType}`,
            fileBuffer.toString("base64")
          );
          await client.sendMessage(msg.from, fileMedia);
          deleteFiles([`kocak.${fileType}`]);
        }
        msg.react("✅");
      });
    });

    return null;
  } catch (error) {
    console.log(error);
    msg.react("❌");
    return "Error";
  }
}

async function handleSendWek(msg: WAWebJS.Message, client: Client) {
  try {
    client.sendMessage(
      msg.from,
      MessageMedia.fromFilePath("./images/kucing-nunjuk.webp"),
      { sendMediaAsSticker: true }
    );
    return null;
  } catch (error) {
    msg.react("❌");
    return "Error";
  }
}

async function handleSendCryptoPrice(msg: WAWebJS.Message, client: Client) {
  const coinSymbol = msg.body.split(".crypto")[1].toUpperCase().trim();

  try {
    msg.react("⏱️");
    const { data } = await axios.get(
      `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=${coinSymbol}&convert=idr`,
      {
        headers: {
          "X-CMC_PRO_API_KEY": "3f37cf0c-2f54-4d31-977f-e053101b95b2",
        },
      }
    );
    const coin = data.data[coinSymbol][0].quote.IDR;
    console.log(coin);
    msg.react("✅");
    return `
    Harga ${coinSymbol} Saat Ini Rp. ${coin.price.toLocaleString("id-ID")}\n
    Persentase perubahan 1 jam terakhir ${coin.percent_change_1h.toFixed(2)}%\n
    Persentase perubahan 24 jam terakhir ${coin.percent_change_24h.toFixed(
      2
    )}%\n
    Update terakhir: ${dateTimeToString(coin.last_updated)}
    `;
  } catch (error: any) {
    msg.react("❌");
    console.log(error);
    return "Error";
  }
}

async function handleIzinOff(msg: WAWebJS.Message, client: Client) {
  if (!adminOnly(msg.author!)) {
    return "Hanya admin yang bisa memakai fitur ini";
  }
  try {
    msg.react("⏱️");

    await client.sendMessage(
      msg.from,
      MessageMedia.fromFilePath("./images/izinoff.jpg"),
      { sendMediaAsSticker: true }
    );

    msg.react("✅");
    return null;
  } catch (error: any) {
    msg.react("❌");
    console.log(error);
    return "Error";
  }
}
