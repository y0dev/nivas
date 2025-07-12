import { Router } from 'express';
import {
  getSettings,
  updateSettings,
  updateProfile,
  updateNotifications,
  updatePreferences,
  resetSettings
} from './settings.controller';
import { protect } from '../auth/auth.controller';

const router = Router();

// Protect all routes after this middleware
router.use(protect);

router.route('/')
  .get(getSettings)
  .patch(updateSettings);

router.route('/profile')
  .patch(updateProfile);

router.route('/notifications')
  .patch(updateNotifications);

router.route('/preferences')
  .patch(updatePreferences);

router.route('/reset')
  .post(resetSettings);

export default router; 