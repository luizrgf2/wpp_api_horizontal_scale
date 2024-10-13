import { BaileysWppAPI } from "./baileys/baileys";
import {WppNotfyRabbitPqService} from "shared/dist/services/wpp.notify.rabbitMq.service"

export class BaileysFactory {
    static async run() {
        const wppNotfyRabbitMQ = new WppNotfyRabbitPqService()
        await wppNotfyRabbitMQ.start(process.env.RABBIT_URI)

        const baileysWpp = new BaileysWppAPI(wppNotfyRabbitMQ)
        return baileysWpp
    }
}