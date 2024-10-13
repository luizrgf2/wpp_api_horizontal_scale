export interface IMessageManipulation {
    sendTextMessage(text: string, to: string) : Promise<void>
    editMessage(newTextMessage: string, to: string) : Promise<void>
}