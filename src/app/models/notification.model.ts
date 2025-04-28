export interface Alert {
    type: AlertType;
    message: string;
    duration?: number;
}

export enum AlertType {
    Success = 'Success',
    Error = 'Error',
    Info = 'Info',
    Warning = 'Warning',
}
