export interface IMessageMedia {
    data: Buffer,
    mimetype: string,
    fromMe?: boolean
}

export interface IMessage {
    to: string,
    text?: string,
    media?: IMessageMedia
}