import { WppNotfyRabbitPqService } from "../@shared/services/wpp.notify.rabbitMq.service";
import { BaileysWppAPI } from "./baileys/baileys";

export class BaileysFactory {
    static async run() {
        const wppNotfyRabbitMQ = new WppNotfyRabbitPqService()
        await wppNotfyRabbitMQ.start(process.env.RABBIT_URI)

        const baileysWpp = new BaileysWppAPI(wppNotfyRabbitMQ)
        return baileysWpp
    }
}