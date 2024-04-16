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
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Bot Siap!");
});

client.on("message_create", async (message) => {
  try {
    if (allowedGroups.includes(message.from)) {
      const reply = await handleMessage(message, client);
      if (reply !== null) {
        await message.reply(reply);
      }
    }
  } catch (error) {
    message.reply("Bentar bang lagi tahap development");
  }
});

client.initialize();
