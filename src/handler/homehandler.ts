import { NextFunction, Request, Response } from 'express';

import BaseHandler from './basehandler';

export default class HomeHandler extends BaseHandler {
	handleGetIndex(req: Request, res: Response, _next: NextFunction) {
		this.renderView(res, 'index', { user: 'asdfasdf' });
	}
}
