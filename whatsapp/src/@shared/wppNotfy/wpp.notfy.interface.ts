
export interface IWppNotfyError {
    typeError: 'sendMessage' | 'startSession' 
    messageError: string
}

export interface IWppNotfyService {
    sendQrToSessionNumber(sessionNumber: string, qrCode: string): Promise<void>
    sendErrorToSessionNumber(sessionNumber: string, error: IWppNotfyError): Promise<void>
}