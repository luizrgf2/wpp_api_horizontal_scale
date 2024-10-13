import dotenv from 'dotenv'

dotenv.config()

export const rabbitMQConfig = {
    rabbitMQURL: process.env.RABBIT_URI as string,
    sessionSenderExchange: process.env.EXCHANGE_SESSIONS_WPP as string
}

if(!rabbitMQConfig.rabbitMQURL) throw new Error("Erro RABBIT_URI not be is empty!")
if(!rabbitMQConfig.rabbitMQURL) throw new Error("Erro EXCHANGE_SESSIONS_WPP not be is empty!")