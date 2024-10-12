import amqp, {Channel, Connection} from 'amqplib'
import { rabbitMQConfig } from '../config'

export class RabbitMqBaseService {
    private _channel: Channel
    private _connection: Connection

    async start() {
        this._connection = await amqp.connect(rabbitMQConfig.amqpURI)
        this._channel = await this._connection.createChannel()
    }

    get channel() {
        return  this._channel
    }

    get connection() {
        return this.connection
    }

    sendToQueue(queueName: string ,content: Buffer) {
        try{    
            this.channel.sendToQueue(queueName, Buffer.from(JSON.stringify(content)))
        }catch(e){
            console.log(e)
            throw new Error('RabbitMQ error')
        }
    }

 }