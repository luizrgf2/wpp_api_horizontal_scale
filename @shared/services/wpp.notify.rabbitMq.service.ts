import { IWppNotfyError, IWppNotfyProps, IWppNotfyService } from "../interfaces";
import { RabbitMqBaseService } from "../utils/rabbitMq.base.service";

export class WppNotfyRabbitPqService implements IWppNotfyService {

    private notfyQueueName = 'notfyWpp'
    constructor(private readonly rabbitMqBase: RabbitMqBaseService) {
        this.rabbitMqBase.channel.assertQueue(this.notfyQueueName, {
            durable: true
        })
    }

    async sendQrToSessionNumber(sessionNumber: string, qrCode: string): Promise<void> {
        const content = {
            sessionNumber: sessionNumber,
            content: qrCode,
            type: 'qrCode'
        } as IWppNotfyProps<string>

        this.rabbitMqBase.sendToQueue(this.notfyQueueName, Buffer.from(JSON.stringify(content)))
    }

    async sendErrorToSessionNumber(sessionNumber: string, error: IWppNotfyError): Promise<void> {
        const content = {
            sessionNumber: sessionNumber,
            content: error,
            type: 'error'
        } as IWppNotfyProps<IWppNotfyError>

        this.rabbitMqBase.sendToQueue(this.notfyQueueName, Buffer.from(JSON.stringify(content)))
    }
    
    async sendSessionStartedWithSuccessToSessionNumber(sessionNumber: string): Promise<void> {
        const content = {
            sessionNumber: sessionNumber,
            content: 'Sucesso para iniciar a sessão '+sessionNumber,
            type: 'sessionStarted'
        } as IWppNotfyProps<string>

        this.rabbitMqBase.sendToQueue(this.notfyQueueName, Buffer.from(JSON.stringify(content)))
    }
}