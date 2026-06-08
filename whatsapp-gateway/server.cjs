const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore
} = require("@whiskeysockets/baileys");
const { Boom } = require("@hapi/boom");
const P = require("pino");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const qrcode = require("qrcode");
const cors = require("cors");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3002;
let sock;
let qrCode = null;
let connectionStatus = "connecting";

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState(path.join(__dirname, 'auth_info_baileys'));
    const { version } = await fetchLatestBaileysVersion();

    sock = makeWASocket({
        version,
        logger: P({ level: "silent" }),
        printQRInTerminal: true,
        auth: state,
        browser: ["Idrisiyyah Net", "Chrome", "1.0.0"],
    });

    sock.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (qr) {
            qrCode = await qrcode.toDataURL(qr);
            io.emit("qr", qrCode);
            connectionStatus = "qr";
        }

        if (connection === "close") {
            const shouldReconnect = (lastDisconnect.error instanceof Boom) ? lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut : true;
            connectionStatus = "disconnected";
            io.emit("status", "disconnected");
            if (shouldReconnect) {
                connectToWhatsApp();
            }
        } else if (connection === "open") {
            qrCode = null;
            connectionStatus = "connected";
            console.log("WA Connected!");
            io.emit("status", "connected");
            io.emit("qr", null);
        }
    });

    sock.ev.on("creds.update", saveCreds);
}

// API to Send Message
app.post("/send-message", async (req, res) => {
    const { number, message } = req.body;
    
    if (!sock || connectionStatus !== "connected") {
        return res.status(500).json({ status: false, message: "WhatsApp not connected" });
    }

    try {
        const formattedNumber = number.startsWith('0') ? '62' + number.slice(1) : number;
        const jid = formattedNumber + "@s.whatsapp.net";
        
        await sock.sendMessage(jid, { text: message });
        res.json({ status: true, message: "Message sent" });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});

// API to check status
app.get("/status", (req, res) => {
    res.json({ status: connectionStatus, qr: qrCode });
});

io.on("connection", (socket) => {
    socket.emit("status", connectionStatus);
    if (qrCode) socket.emit("qr", qrCode);
});

server.listen(PORT, () => {
    console.log(`WA Gateway running on port ${PORT}`);
    connectToWhatsApp();
});
