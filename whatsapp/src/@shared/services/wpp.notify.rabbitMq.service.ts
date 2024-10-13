import { rabbitMQConfig } from "../../config"
import { IWppNotfyError, IWppNotfyProps, IWppNotfyService } from "../interfaces/wpp.notfy.interface"
import { RabbitMqBaseService } from "../rabbitMQ.base.service"

export class WppNotfyRabbitPqService implements IWppNotfyService {

    private notfyQueueName = 'notfyWpp'
    private readonly rabbitMqBase: RabbitMqBaseService

    constructor() {
        this.rabbitMqBase = new RabbitMqBaseService()
    }

    async start(rabbitMqURI?: string) {
        await  this.rabbitMqBase.start(rabbitMqURI ? rabbitMqURI : rabbitMQConfig.rabbitMQURL)
        if(!this.rabbitMqBase.channel) throw new Error("Channel not started...")
        await this.rabbitMqBase.channel.assertQueue(this.notfyQueueName, {
            durable: true
        })
    }

    async sendQrToSessionNumber(idSession: number, qrCode: string): Promise<void> {
        const content = {
            idSession: idSession,
            content: qrCode,
            type: 'qrCode'
        } as IWppNotfyProps<string>

        this.rabbitMqBase.sendToQueue(this.notfyQueueName, Buffer.from(JSON.stringify(content)))
    }

    async sendErrorToSessionNumber(idSession: number, error: IWppNotfyError): Promise<void> {
        const content = {
            idSession: idSession,
            content: error,
            type: 'error'
        } as IWppNotfyProps<IWppNotfyError>

        this.rabbitMqBase.sendToQueue(this.notfyQueueName, Buffer.from(JSON.stringify(content)))
    }

    async sendSessionStartedWithSuccessToSessionNumber(idSession: number): Promise<void> {
        const content = {
            idSession: idSession,
            content: 'Sucesso para iniciar a sessão '+idSession,
            type: 'sessionStarted'
        } as IWppNotfyProps<string>

        this.rabbitMqBase.sendToQueue(this.notfyQueueName, Buffer.from(JSON.stringify(content)))
    }
}