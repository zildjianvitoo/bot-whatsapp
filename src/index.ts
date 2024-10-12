import { Client, GroupNotification, LocalAuth } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import { handleMessage } from "./lib";
import { allowedGroups } from "./lib/allowedGroups";
import express from "express";
import cors from "cors";
const port = 3005;

const app = express();
app.use(
  cors({
    credentials: true,
    origin: "https://srifoton.hmifunsri.con",
  })
);
app.use(express.json());

const client = new Client({
  authStrategy: new LocalAuth(),
  webVersionCache: {
    type: "remote",
    remotePath:
      "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
  },
  puppeteer: {
    executablePath: "/usr/bin/google-chrome-stable",
    // "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

app.post("/event-srifoton", (req, res) => {
  const { eventName, name, paymentType } = req.body;

  const messsage = `${name} mendaftar di *${eventName}*,
dengan jenis pembayaran *${paymentType}*,
tolong cek bukti pembayarannya di website!!`;

  client.sendMessage("120363347050088299@g.us", messsage);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
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
  console.log(msg.from);
  if (allowedGroups.includes(msg.from)) {
    const reply = await handleMessage(msg, client);
    if (reply !== null) {
      await msg.reply(reply);
    }
  }
});

client.initialize();
