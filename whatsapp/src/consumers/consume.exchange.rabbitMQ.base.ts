import { RabbitMqBaseService } from "../@shared/rabbitMQ.base.service";
import { rabbitMQConfig } from "../config";

export interface IReceivedMessage<T=any> {
    typeReceived: 'message' | 'validateContact',
    sessionId: number,
    data: T
}

interface IConsumerProps {
    consumerFunc: (data: IReceivedMessage) => Promise<void>
}

export class RabbitMQExchangeConsumerBase {
    rabbitMQBase: RabbitMqBaseService;
    queueName = ''

    constructor(){
        this.rabbitMQBase = new RabbitMqBaseService()
    }

    async start(sessionId: number) {
        await this.rabbitMQBase.start(rabbitMQConfig.rabbitMQURL)
        await this.rabbitMQBase.channel?.assertExchange(rabbitMQConfig.sessionSenderExchange,"direct")
        const queue = await this.rabbitMQBase.channel?.assertQueue(`${sessionId}-session`, {
            autoDelete: true,
            durable: false,
            exclusive: true
        })
        await this.rabbitMQBase.channel?.bindQueue(queue?.queue as string, rabbitMQConfig.sessionSenderExchange, sessionId.toString())
        this.queueName = queue?.queue as string
        console.log('Consumindo a fila', queue?.queue)
    }

    async consume(props: IConsumerProps) {
        await this.rabbitMQBase.channel?.consume(this.queueName, async (msg)=>{
            if(!msg) return
            
            const messageDecoded: IReceivedMessage = JSON.parse(msg.content.toString()) as any
            await props.consumerFunc(messageDecoded)

        })
    }

}