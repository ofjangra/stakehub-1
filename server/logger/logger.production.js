import {format, transports, createLogger} from 'winston'


const { combine, timestamp, printf } = format



const logFormat = printf(({ level, message, timestamp }) => {
    return `${level} ${timestamp}: ${message}`;
  });

export const productionLogger = createLogger({
    level:'info',
    format:combine(
        timestamp(), 
        logFormat
    ),
    transports:[
        new transports.Console(),
        new transports.File({filename:'error.log', level:'error'}),
        new transports.File({filename:'logs.log'})
    ]
})

