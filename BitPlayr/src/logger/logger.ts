export enum LogLevel {
  INFO,
  WARNING,
  ERROR,
  DEBUG,
  TELEMENTRY,
}

export class SDKLogger {
  private level: LogLevel;

  constructor(level: LogLevel = LogLevel.INFO) {
    this.level = level;
  }

  private log(message: string, level: LogLevel, data?: unknown): void {
    if (level >= this.level) {
      if (data) {
        console.log(`[${LogLevel[level]}] ${message}`, data);
      } else {
        console.log(`[${LogLevel[level]}] ${message}`);
      }
    }
  }

  public info(message: string, data?: unknown): void {
    this.log(message, LogLevel.INFO, data);
  }

  public warning(message: string, data?: unknown): void {
    this.log(message, LogLevel.WARNING, data);
  }

  public error(message: string, data?: unknown): void {
    this.log(message, LogLevel.ERROR, data);
  }

  public debug(message: string, data?: unknown): void {
    this.log(message, LogLevel.DEBUG, data);
  }

  public telemetry(message: string, data?: unknown): void {
    this.log(message, LogLevel.TELEMENTRY, data);
  }

  public setLevel(level: LogLevel): void {
    this.level = level;
  }
}
