import { productionLogger } from "./logger.production.js";
import { devLogger } from "./logger.dev.js";

let logger;


logger = process.env.NODE_ENV === 'production' ? productionLogger : devLogger


export default logger