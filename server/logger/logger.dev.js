import {format, transports, createLogger} from 'winston'


const { combine, timestamp, printf } = format



const logFormat = printf(({ level, message, timestamp }) => {
    return `${level} ${timestamp}: ${message}`;
  });

export const devLogger = createLogger({
    level:'info',
    format:combine(
        format.colorize(), 
        timestamp({format:"HH:mm:ss"}), 
        logFormat
    ),
    transports:[
        new transports.Console()
    ]
})

