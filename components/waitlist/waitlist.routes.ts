import { Router } from 'express';
import {
  addToWaitlist,
  getWaitlistStats,
  getAllWaitlist,
  removeFromWaitlist
} from './waitlist.controller';

const router = Router();

// Public routes
router.post('/add', addToWaitlist);
router.get('/stats', getWaitlistStats);

// Admin routes (should be protected in production)
router.get('/', getAllWaitlist);
router.delete('/:email', removeFromWaitlist);

export default router; 