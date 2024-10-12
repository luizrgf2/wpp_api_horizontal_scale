import dotenv from 'dotenv'

dotenv.config()


export const rabbitMQConfig = {
    amqpURI: process.env.RABBIT_URI as string
}



if(!rabbitMQConfig.amqpURI) throw new Error("Error rabbitMQ uri not be is empty!")