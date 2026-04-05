import configmanager from "../utils/ConfigManager.js";
import react from "../utils/react.js";

async function handleIncomingMessage(client, event) {
    // Attendre que client.user existe
    if (!client.user) {
        console.log("⏳ Waiting for client to be ready...");
        setTimeout(() => handleIncomingMessage(client, event), 1000);
        return;
    }

    const number = client.user.id?.split(':')[0] || "33753191305";
    const messages = event.messages;
    
    // Récupérer le préfixe depuis la config
    const prefix = configmanager.config.users[number]?.prefix || ".v";
    const sudoList = configmanager.config.users[number]?.sudoList || [];

    for (const message of messages) {
        const messageBody = message.message?.extendedTextMessage?.text || 
                           message.message?.conversation || '';
        const remoteJid = message.key.remoteJid;

        if (!messageBody || !remoteJid) continue;

        if (messageBody.startsWith(prefix)) {
            const command = messageBody.slice(prefix.length).trim().split(/\s+/)[0].toLowerCase();
            
            try {
                await react(client, message);
            } catch (e) {
                console.log("React error:", e.message);
            }

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
