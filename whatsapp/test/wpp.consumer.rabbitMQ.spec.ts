import { Channel } from "amqplib"
import { WppConsumerRabbitMQService } from "../src/consumers/wpp.consumer.rabbitMQ.service"
import { rabbitMQConfig } from "../src/config"
import { RabbitMqBaseService } from "../src/@shared/rabbitMQ.base.service"
import { IReceivedMessage } from "@src/consumers/consume.exchange.rabbitMQ.base"
import { IMessage } from "@src/interfaces/message.interface"

describe('Tests integration wppConsumerRabbitMQ', ()=>{

    let channel: Channel| undefined = undefined

    jest.setTimeout(9000)

    beforeAll(async ()=>{
        const rabbitMQBase = new RabbitMqBaseService()
        await rabbitMQBase.start(rabbitMQConfig.rabbitMQURL)
        channel = rabbitMQBase.channel
        await channel?.assertExchange(rabbitMQConfig.sessionSenderExchange, 'direct')
    })

    it('Test consumer to receive message',  (done)=>{

        const message  = {
            data: {
                to: '5534997659577',
                text: 'Ola'
            },
            sessionId: 1,
            typeReceived: 'message'
        } as IReceivedMessage<IMessage>
        
        const sut = async ()=>{
            return new Promise(async (resolve, reject)=>{
                const rabbitMQConsumer = new WppConsumerRabbitMQService({
                    sendMessageToUser: async (data)=>{
                        await rabbitMQConsumer.stop()
                        resolve(undefined)
                        done()
                    }
                })
                await rabbitMQConsumer.start(1)
                
                channel?.publish(rabbitMQConfig.sessionSenderExchange, '1', Buffer.from(JSON.stringify(message)))
                
                setTimeout(async ()=>{
                    await rabbitMQConsumer.stop()
                    reject(undefined)
                }, 5000)
            })
        }

        sut().then(()=>{
            expect(true).toBe(true)
        }).catch((e)=>{
            done.fail(e)
        })
    })

})