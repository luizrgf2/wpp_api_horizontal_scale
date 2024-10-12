import { IWppNotfyService } from "@src/@shared/wppNotfy/wpp.notfy.interface";

export class BaileysErrorHandler {
    constructor(
        private readonly wppNotfy: IWppNotfyService
    ) {}

    async sendErrorQrCode(sessionNumber: string) {
        await this.wppNotfy.sendErrorToSessionNumber(sessionNumber, {
            messageError: 'Erro para pegar o qr code, tente novamente!',
            typeError: 'startSession'
        })
    }
}