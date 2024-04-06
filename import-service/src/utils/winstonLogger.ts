import { format, transports, createLogger } from 'winston';

interface Logger {
  logRequest: (message: string) => void;
  logError: (message: string) => void;
}

class WinstonLogger implements Logger {
  private readonly logger: any;
  private readonly format: any;

  constructor() {
    this.format = format.combine(
      format.colorize(),
      format.timestamp(),
      format.align(),
      format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
    );

    this.logger = createLogger({
      level: process.env.ENV_STAGE === 'prod' ? 'error' : 'info',
      transports: [
        new transports.Console({
          format: this.format,
        }),
      ],
    });
  }
  logRequest(message: string) {
    this.logger.info(message);
  }

  logError(message: string) {
    this.logger.error(message);
  }
}

const winstonLogger = new WinstonLogger();

export { winstonLogger };
