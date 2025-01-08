import { authenticateToken } from './userRoutes';
import { Router } from 'express';
import {
  addStep,
  updateStep,
  getStepByMonth,
  getStepByYear,
  deleteStep,
} from '../controllers/stepController';

const router = Router();

router.post('/:id', authenticateToken, addStep);
router.put('/:id', authenticateToken, updateStep);

router.delete('/delete/:id', authenticateToken, deleteStep);

router.get('/month/:id', authenticateToken, getStepByMonth);
router.get('/year/:id', authenticateToken, getStepByYear);

export default router;
