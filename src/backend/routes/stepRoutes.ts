import { authenticateToken } from './userRoutes';
import { Router } from 'express';
import { addStep, updateStep } from '../controllers/stepController';

const router = Router();

router.post('/:id', authenticateToken, addStep);
router.put('/:id', authenticateToken, updateStep);

export default router;
