
export interface IWppNotfyError {
    typeError: 'sendMessage' | 'startSession' 
    messageError: string
}

export interface IWppNotfyProps<T> {
    sessionNumber: string,
    type: 'error' | 'qrCode' | 'sessionStarted' | 'menssageSended' | 'sessionStoped',
    content: T
}

export interface IWppNotfyService {
    sendQrToSessionNumber(sessionNumber: string, qrCode: string): Promise<void>
    sendErrorToSessionNumber(sessionNumber: string, error: IWppNotfyError): Promise<void>
    sendSessionStartedWithSuccessToSessionNumber(sessionNumber: string) : Promise<void>
}