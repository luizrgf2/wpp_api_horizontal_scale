
export interface IWppNotfyError {
    typeError: 'sendMessage' | 'startSession' 
    messageError: string
}

export interface IWppNotfyProps<T> {
    idSession: number,
    type: 'error' | 'qrCode' | 'sessionStarted' | 'menssageSended' | 'sessionStoped',
    content: T
}

export interface IWppNotfyService {
    sendQrToSessionNumber(idSession: number, qrCode: string): Promise<void>
    sendErrorToSessionNumber(idSession: number, error: IWppNotfyError): Promise<void>
    sendSessionStartedWithSuccessToSessionNumber(idSession: number) : Promise<void>
}