import logger from './src/helper/logger';

declare module 'express-serve-static-core' {
	export interface Request {
		log: typeof logger;
	}
}

export {};
