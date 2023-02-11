import path from 'node:path';

import { config } from 'dotenv';

config({
	path: path.join(__dirname, '../../config.env'),
});

export default {
	ENVIRONMENT: process.env.NODE_ENV,
	PORT: process.env.PORT,
	LOG_LEVEL: process.env.LOG_LEVEL || 'info',
};
