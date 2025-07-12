import { Router } from 'express';
import {
  protect,
  userCount,
  premiumUserCount,
  newUserCount,
  searchCount,
} from '../auth/auth.controller';

const router = Router({ mergeParams: true });

// Routes that only logged in user can access
router.use(protect);

router.get('/count/users', userCount);
router.get('/count/newUsers', newUserCount);
router.get('/count/premiumUsers', premiumUserCount);
router.get('/count/searches', searchCount);

export default router; 