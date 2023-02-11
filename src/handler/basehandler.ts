import { Response } from 'express';
import { rateLimit, RateLimitRequestHandler } from 'express-rate-limit';

import logger from '@helper/logger';

type ErrorParams = {
	res: Response;
	code: number;
	error: Error | string | { statusCode: number };
	renderErrorPage: boolean;
};

export default class BaseHandler {
	public limiter: RateLimitRequestHandler;

	constructor(limitTime = 15) {
		this.limiter = rateLimit({
			windowMs: limitTime * 60 * 1000,
			max: 100,
		});

		this.bindCurrentRoutes();
	}

	/**
	 * Dynamically binds all the route handlers on the current class which start with `handle` to itself,
	 * otherwise we would lose the `this` context when we call the handle functions
	 * on the express router e.g.
	 *
	 * `router.get('/', [SomeHandlerInstance].handleGetIndex);`
	 */
	private bindCurrentRoutes() {
		const currentInstance = Object.getPrototypeOf(this);

		Object.getOwnPropertyNames(currentInstance).forEach((member) => {
			if (member.startsWith('handle') && typeof this[member] === 'function') {
				this[member] = this[member].bind(this);
			}
		});
	}

	protected renderView(
		res: Response,
		template: string,
		templateVars: Record<string, unknown> = {},
		status = 200,
	) {
		const parts = template.split('/');
		let templateString = template;
		if (parts[0] !== 'pages') {
			templateString = `pages/${template}`;
		}

		return res.status(status).render(templateString, templateVars);
	}

	protected handleError({ res, code, error, renderErrorPage = false }: ErrorParams) {
		let statusCode = 400;

		let mappedError: string | null = null;

		if (!(error instanceof Error)) {
			if (typeof error === 'object') {
				statusCode = error.statusCode;
			} else if (typeof error === 'string') {
				mappedError = error;
			}
		}

		statusCode = code || statusCode;

		logger.error(mappedError || error);

		if (renderErrorPage) {
			res.status(statusCode).render(code === 400 ? '404' : code.toString(), {
				statusCode,
				error,
			});
		} else {
			res.status(statusCode).send({
				statusCode,
				error,
			});
		}
	}
}
