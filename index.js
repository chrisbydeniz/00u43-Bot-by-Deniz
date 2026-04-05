import connectToWhatsapp from './events/messageHandler.js'
import handleIncomingMessage from './events/messageHandler.js'

(async() => {
    await connectToWhatsapp(handleIncomingMessage)
    console.log('✅ 00u43 byDeniz established !')
})()
