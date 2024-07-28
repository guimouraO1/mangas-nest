export interface Alert {
  type: AlertType;
  message: string;
}

export enum AlertType {
  Success = 'Success',
  Error = 'Error',
  Info = 'Info',
  Warning = 'Warning',
}
