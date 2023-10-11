import { Router } from 'express';
import userRoute from '../modules/user/route.js';

const router = Router();
router.use('/user', userRoute);
router.use('*', (req, res) => res.status(404).json({ message: 'Not Found' }));

export default router;
