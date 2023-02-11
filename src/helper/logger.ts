import { pino } from 'pino';

import config from '@config/index';

const logger = pino({
	transport: {
		target: 'pino-pretty',
		options: {
			colorize: true,
		},
	},
});

logger.level = config.LOG_LEVEL;

export default logger;
