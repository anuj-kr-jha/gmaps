import { Router } from 'express';
import * as m from './middleware.js';
import * as c from './controller.js';

const router = Router();

/* prefix: /user */

router.post('/register', m.register, c.register);
router.post('/login', m.login, c.login);

export default router;
