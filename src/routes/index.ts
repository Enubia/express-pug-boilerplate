import { NextFunction, Request, Response, Router } from 'express';

export const router = Router();

router.get('/', (_req: Request, res: Response, _next: NextFunction) => {
	return res.render('pages/index');
});
