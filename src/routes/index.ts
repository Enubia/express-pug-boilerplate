import { Router } from 'express';

export const router = Router();

router.get('/', (req, res, _next) => {
	req.log.info('---- we got a request ----');
	return res.render('pages/index');
});
