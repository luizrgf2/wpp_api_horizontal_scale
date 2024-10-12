import makeWASocket, { ConnectionState, DisconnectReason, isJidUser, useMultiFileAuthState } from '@whiskeysockets/baileys'
import { Boom } from '@hapi/boom'
import { IWppNotfyService } from '@src/@shared/wppNotfy/wpp.notfy.interface'
import { BaileysErrorHandler } from './errorHandler'

export class BaileysWppAPI {
    
    private sock: ReturnType<typeof makeWASocket> | undefined =  undefined;
    private numberOfSession: string | undefined
    private errorHandler: BaileysErrorHandler

    constructor(private readonly wppNotfy: IWppNotfyService) {
        this.errorHandler = new BaileysErrorHandler(wppNotfy)
    }

    private async handleConnState(update: Partial<ConnectionState>) {
        const { connection, lastDisconnect, qr } = update

        if(qr) {
            if(!this.numberOfSession) throw Error('Erro para encontrar o número da sessão!')
            await this.wppNotfy.sendQrToSessionNumber(this.numberOfSession, qr)
        }

        if(connection === 'close' && lastDisconnect) {
            const shouldReconnect = (lastDisconnect.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
            
            console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect)
            if(shouldReconnect) {
                this.startSession()
            }
        } else if(connection === 'open') {
            this.numberOfSession = this.sock?.user?.id
            console.log('opened connection')
        }
    }

    private  async startSession() {
        const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys')
        const sock = makeWASocket({
            auth: state,
            shouldIgnoreJid(jid) {
                if(isJidUser(jid)) return true
                return false
            },
        })
        sock.ev.on ('creds.update', saveCreds)
        sock.ev.on('connection.update',this.handleConnState)

        this.sock = sock
    }
}