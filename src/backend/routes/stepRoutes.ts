import { authenticateToken } from './userRoutes';
import { Router } from 'express';
import {
  addStep,
  updateStep,
  getStepByMonth,
  getStepByYear,
} from '../controllers/stepController';

const router = Router();

router.post('/:id', authenticateToken, addStep);
router.put('/:id', authenticateToken, updateStep);

router.get('/month/:id', authenticateToken, getStepByMonth);
router.get('/year/:id', authenticateToken, getStepByYear);

export default router;
