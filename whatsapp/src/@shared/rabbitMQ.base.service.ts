import amqp, {Channel, Connection} from 'amqplib'

export class RabbitMqBaseService {
    private _channel?: Channel = undefined
    private _connection?: Connection = undefined

    async start(rabbitURI: string) {
        this._connection = await amqp.connect(rabbitURI)
        this._channel = await this._connection.createChannel()
    }

    get channel() {
        return  this._channel
    }

    get connection() {
        return this._connection
    }

    sendToQueue(queueName: string ,content: Buffer) {
        if(!this._channel) throw new Error('Channel not started..')
        try{    
            this._channel.sendToQueue(queueName, Buffer.from(JSON.stringify(content)))
        }catch(e){
            console.log(e)
            throw new Error('RabbitMQ error')
        }
    }

 }