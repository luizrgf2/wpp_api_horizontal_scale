import { IWppNotfyService } from "shared/interfaces/wpp.notfy.interface";

export class BaileysErrorHandler {
    constructor(
        private readonly wppNotfy: IWppNotfyService
    ) {}

    async sendErrorQrCode(idSession: number) {
        await this.wppNotfy.sendErrorToSessionNumber(idSession, {
            messageError: 'Erro para pegar o qr code, tente novamente!',
            typeError: 'startSession'
        })
    }
}