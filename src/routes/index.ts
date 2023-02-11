import { Router } from 'express';

import HomeHandler from '@handler/homehandler';

const homeHandler = new HomeHandler();

export const router = Router();

router.get('/', homeHandler.handleGetIndex);
