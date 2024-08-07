import { Client, GroupNotification, LocalAuth } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import { handleMessage } from "./lib";
import { allowedGroups } from "./lib/allowedGroups";

const client = new Client({
  authStrategy: new LocalAuth(),
  webVersionCache: {
    type: "remote",
    remotePath:
      "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
  },
  puppeteer: {
    executablePath: "/usr/bin/google-chrome-stable"
    // "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Bot Siap !");
});

client.on("group_join", async (notification) => {
  if (notification.chatId === "120363320654299029@g.us") {
  const chatId = notification.chatId;

  const welcomeMessage = `Selamat datang di grup Volunteer SRIFOTON 2024!!,
semoga betah!!`;

  client.sendMessage(chatId, welcomeMessage);

   }
});

client.on("message_create", async (msg) => {
  if (allowedGroups.includes(msg.from)) {
    const reply = await handleMessage(msg, client);
    if (reply !== null) {
      await msg.reply(reply);
    }
  }
});

client.initialize();
