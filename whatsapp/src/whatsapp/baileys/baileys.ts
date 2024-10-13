import makeWASocket, { ConnectionState, DisconnectReason, isJidUser, useMultiFileAuthState } from '@whiskeysockets/baileys'
import { Boom } from '@hapi/boom'
import { BaileysErrorHandler } from './errorHandler'
import { IMessageManipulation } from '../../interfaces/message.manipulation.interface';
import { IWppNotfyService } from '../../@shared/interfaces/wpp.notfy.interface';


export class BaileysWppAPI implements IMessageManipulation {
    
    private sock: ReturnType<typeof makeWASocket> | undefined =  undefined;
    private numberOfSession: string | undefined
    private errorHandler: BaileysErrorHandler

    constructor(private readonly wppNotfy: IWppNotfyService) {
        this.errorHandler = new BaileysErrorHandler(wppNotfy)
    }

    private async handleConnState(update: Partial<ConnectionState>) {
        const { connection, lastDisconnect, qr } = update

        if(qr) {
            await this.wppNotfy.sendQrToSessionNumber(1, qr)
        }

        if(connection === 'close' && lastDisconnect) {
            const shouldReconnect = (lastDisconnect.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
            
            console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect)
            if(shouldReconnect) {
                this.startSession()
            }
        } else if(connection === 'open') {

            this.numberOfSession = this.sock?.user?.id
            if(!this.numberOfSession) throw Error('Erro para encontrar o número da sessão!')
            
            await this.wppNotfy.sendSessionStartedWithSuccessToSessionNumber(1)
        }
    }

    async editMessage(newTextMessage: string, to: string): Promise<void> {
        throw new Error('Method not implemented.');
    }

    async sendTextMessage(textMessage: string, to: string) {
        const toModify = to+"@s.whatsapp.net"
        await this.sock?.sendMessage(toModify, {text: textMessage})
    }

    async startSession() {
        const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys')
        const sock = makeWASocket({
            printQRInTerminal:  true,
            auth: state,
            shouldIgnoreJid(jid) {
                if(isJidUser(jid)) return true
                return false
            },
        })
        sock.ev.on ('creds.update', saveCreds)
        sock.ev.on('connection.update',(arg)=>this.handleConnState(arg))

        this.sock = sock
    }
}