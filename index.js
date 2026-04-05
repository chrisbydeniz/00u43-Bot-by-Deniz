import { makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } from 'baileys';
import pino from 'pino';
import handleIncomingMessage from './events/messageHandler.js';
import fs from 'fs';

const data = 'sessionData';

async function connectToWhatsapp() {
    const { version } = await fetchLatestBaileysVersion();
    const { state, saveCreds } = await useMultiFileAuthState(data);

    const sock = makeWASocket({
        version: version,
        auth: state,
        printQRInTerminal: false,
        logger: pino({ level: 'silent' }),
        browser: ['00u43 byDeniz', 'Chrome', '1.0.0']
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            console.log('📱 Scanne ce QR code avec WhatsApp:');
            console.log(qr);
        }

        if (connection === 'open') {
            console.log('✅ 00u43 byDeniz connecté !');
            console.log('📝 Préfixe: .v');
            console.log('👑 Owner: 33753191305');
        }

        if (connection === 'close') {
            const statusCode = lastDisconnect?.error?.output?.statusCode;
            if (statusCode !== DisconnectReason.loggedOut) {
                console.log('🔄 Reconnexion...');
                connectToWhatsapp();
            } else {
                console.log('❌ Déconnecté. Redémarre le bot.');
            }
        }
    });

    sock.ev.on('messages.upsert', async (msg) => {
        if (msg.messages && msg.messages[0]) {
            await handleIncomingMessage(sock, { messages: msg.messages });
        }
    });

    // Demander le code de paire après 5 secondes
    setTimeout(async () => {
        const number = "33753191305";
        try {
            const code = await sock.requestPairingCode(number);
            console.log(`📲 Code de paire: ${code}`);
            console.log(`👉 Entre ce code dans WhatsApp → Paramètres → Appareils liés → Lier un appareil`);
        } catch (e) {
            console.log("⚠️ Utilise le QR code ci-dessus si le code ne marche pas");
        }
    }, 5000);
}

connectToWhatsapp();
