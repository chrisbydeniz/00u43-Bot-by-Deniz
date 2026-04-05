import configmanager from "../utils/ConfigManager.js";
import react from "../utils/react.js";

async function handleIncomingMessage(client, event) {
    const number = client.user.id.split(':')[0];
    const messages = event.messages;
    const prefix = configmanager.config.users[number]?.prefix || ".v";
    const sudoList = configmanager.config.users[number]?.sudoList || [];

    for (const message of messages) {
        const messageBody = message.message?.extendedTextMessage?.text || 
                           message.message?.conversation || '';
        const remoteJid = message.key.remoteJid;

        if (!messageBody || !remoteJid) continue;

        if (messageBody.startsWith(prefix)) {
            const command = messageBody.slice(prefix.length).trim().split(/\s+/)[0].toLowerCase();
            
            await react(client, message);

            switch (command) {
                case 'ping':
                    await client.sendMessage(remoteJid, { text: '🏓 Pong!' });
                    break;
                case 'menu':
                    await client.sendMessage(remoteJid, { text: '📋 Menu: .v ping, .v play, .v sticker' });
                    break;
                case 'play':
                    await client.sendMessage(remoteJid, { text: '🎵 Commande play en développement' });
                    break;
                default:
                    await client.sendMessage(remoteJid, { text: '❌ Commande inconnue. Tape .v menu' });
            }
        }
    }
}

export default handleIncomingMessage;
