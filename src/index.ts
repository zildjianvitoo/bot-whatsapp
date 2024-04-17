import { Client, LocalAuth } from "whatsapp-web.js";
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
    executablePath:
      "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Bot Siap!");
});

client.on("message_create", async (msg) => {
  try {
    if (allowedGroups.includes(msg.from)) {
      const reply = await handleMessage(msg, client);
      if (reply !== null) {
        await msg.reply(reply);
      }
    }
  } catch (error) {
    msg.reply("Bentar bang lagi tahap development");
  }
});

client.initialize();
