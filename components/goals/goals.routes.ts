import { Router } from 'express';
import {
  getGoals,
  getGoal,
  createGoal,
  updateGoal,
  deleteGoal,
  updateGoalProgress
} from './goals.controller';
import { protect } from '../auth/auth.controller';

const router = Router();

// Protect all routes after this middleware
router.use(protect);

router.route('/')
  .get(getGoals)
  .post(createGoal);

router.route('/:id')
  .get(getGoal)
  .patch(updateGoal)
  .delete(deleteGoal);

router.route('/:id/progress')
  .patch(updateGoalProgress);

export default router; 