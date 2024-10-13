import { BaileysFactory } from './whatsapp/baileysFactory';
import {WppConsumerRabbitMQService} from './consumers/wpp.consumer.rabbitMQ.service'

;(async ()=>{
    const baileys = await BaileysFactory.run()
    await baileys.startSession()

    const wppConsumerRabbitMqService = new WppConsumerRabbitMQService({
        sendMessageToUser: async (data) => await baileys.sendTextMessage(data.text as string, data.to)
    })

    await wppConsumerRabbitMqService.start(1)

})()