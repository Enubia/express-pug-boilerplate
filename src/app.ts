import fs from 'node:fs';
import path from 'node:path';

import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { config } from 'dotenv';
import express from 'express';
import { getClientIp } from 'request-ip';

import logger from './helper/logger';

config({
	path: path.join(__dirname, '../config/config.env'),
});

(async () => {
	const app = express();

	app.request.log = logger;

	// hot reloading in dev mode
	if (process.env.NODE_ENV === 'development') {
		// eslint-disable-next-line import/no-extraneous-dependencies, @typescript-eslint/no-var-requires
		const livereload = require('livereload');
		// eslint-disable-next-line import/no-extraneous-dependencies, @typescript-eslint/no-var-requires
		const connectLiveReload = require('connect-livereload');
		const liveReloadServer = livereload.createServer();

		liveReloadServer.server.once('connection', () => {
			setTimeout(() => {
				liveReloadServer.refresh('/');
			}, 100);
		});

		app.use(connectLiveReload());
	}

	app.use((req, res, next) => {
		const ignoredRequests = [
			'png',
			'jpg',
			'js',
			'svg',
			'jpeg',
			'woff',
			'css',
			'ico',
			'map',
			'gif',
		];

		const parts = req.originalUrl.split('.');

		if (req.originalUrl !== '/health' && !ignoredRequests.includes(parts[parts.length - 1])) {
			const clientIp = getClientIp(req);

			const logString = `[${res.statusCode}] ${req.method} ${clientIp} (${
				res.locals.user ? `USER ${String(res.locals.user.id)}` : 'GUEST'
			}) path: ${req.originalUrl}`;

			req.log.info(logString);
		}

		return next();
	});

	app.use(cors());

	app.set('views', path.join(__dirname, '../views'));
	app.set('view engine', 'pug');

	app.use(express.static('public'));

	// apply some of our environment variables to the app locals so that they can be used in the templates
	app.locals.env = {};

	app.use(
		bodyParser.urlencoded({
			extended: true,
		}),
	);

	app.use(cookieParser());

	const routes = fs.readdirSync(path.join(__dirname, './routes'));

	// dynamically mount all routes present in /routes folder
	for (const route of routes) {
		if (fs.lstatSync(path.join(__dirname, `./routes/${route}`)).isFile()) {
			const file = route.split('.')[0];
			const { router } = await import(`./routes/${file}`);
			if (file === 'index') {
				app.use('/', router);
			} else {
				app.use(`/${file}`, router);
			}
		}
	}

	app.use('/health', (_req, res, _next) => {
		res.sendStatus(200);
	});

	app.use('/robots.txt', (_req, res, _next) => {
		res.type('text/plain');
		res.sendFile(path.join(__dirname, '../public/robots.txt'));
	});

	// ERROR PAGE
	app.get('*', (_req, res) => {
		res.status(404).render('error/404');
	});

	// error handler
	app.use((err, req, res, _next) => {
		req.log.error(err);

		res.status(500).render('error/500');
	});

	app.listen(Number(process.env.PORT), () => {
		app.request.log.info(`App listening on port ${process.env.PORT}`);
	});
})();

process.on('uncaughtException', (err, source) => {
	logger.error(err, source);
});
