export interface Logger {
  logRequest: (message: string) => void;
  logError: (message: string) => void;
}
