class Logger {
  constructor(loggerName) {
    this.loggerName = loggerName;
    this.CONSTANTS = {
      HEADERS: {
        INFO: '[INFO]',
        WARN: '[WARN]',
        ERROR: '[ERROR]',
      }
    };
  }

  getTimestamp() {
    const date = new Date();
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };
    return date.toLocaleTimeString('en-us', options);
  }

  formatMessage(...msgs) {
    const timestamp = this.getTimestamp();
    let msgString = '';
    for (const [i, msg] of msgs.entries()) {
      if (typeof msg === 'object') {
        if (msg instanceof Error) {
          msgString += `${msg?.stack}`;
        } else {
          msgString += JSON.stringify(msg, null, 2);
        }
      } else {
        msgString += msg;
      }
      if (i < msgs.length-1) msgString += ', ';
    }
    const message = `[${timestamp}] ${msgString}`;
    return message;
  }

  info(...msgs) {
    const header = this.CONSTANTS.HEADERS.INFO;
    console.info(`${header}${this.formatMessage(...msgs)}`);
  }

  warn(...msgs) {
    const header = this.CONSTANTS.HEADERS.WARN;
    console.warn(`${header}${this.formatMessage(...msgs)}`);
  }

  error(...msgs) {
    const header = this.CONSTANTS.HEADERS.ERROR;
    console.error(`${header}${this.formatMessage(...msgs)}`);
  }
}

let instance;
export const getInstance = () => {
  if (!instance) instance = new Logger();
  return instance;
};