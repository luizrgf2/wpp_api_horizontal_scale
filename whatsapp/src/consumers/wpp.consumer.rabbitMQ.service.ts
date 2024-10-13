import { IMessage } from '../interfaces/message.interface';
import { IReceivedMessage, RabbitMQExchangeConsumerBase } from './consume.exchange.rabbitMQ.base';

interface IOnReceive {
    sendMessageToUser: (data: IMessage) => Promise<void>
}

export class WppConsumerRabbitMQService {

    private rabbitExchangeConsumerMQBase: RabbitMQExchangeConsumerBase;
    private onMessageFunc: IOnReceive

    constructor(onMessage: IOnReceive) {
        this.onMessageFunc = onMessage
        this.rabbitExchangeConsumerMQBase = new RabbitMQExchangeConsumerBase()
    }

    async start(sessionId: number) {
        await this.rabbitExchangeConsumerMQBase.start(sessionId)
        await this.rabbitExchangeConsumerMQBase.consume({
            consumerFunc: async (data) => {
                this.consume(data)
            }
        })
    }

    async stop() {
        await this.rabbitExchangeConsumerMQBase.rabbitMQBase.channel?.close()
        await this.rabbitExchangeConsumerMQBase.rabbitMQBase.connection?.close()
    }

    private async consume(consume: IReceivedMessage<any>) {
        if(consume.typeReceived === "message"){
            const data = consume.data as IMessage
            await this.onMessageFunc.sendMessageToUser(data)
        }
    }

}