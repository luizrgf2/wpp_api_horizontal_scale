import { BaileysFactory } from './whatsapp/baileysFactory';

;(async ()=>{
    const baileys = await BaileysFactory.run()
    await baileys.startSession()
})()