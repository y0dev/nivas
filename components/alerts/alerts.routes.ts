import { Router } from 'express';
import {
  getAlerts,
  getAlert,
  createAlert,
  updateAlert,
  deleteAlert,
  toggleAlertStatus,
  getRecentAlerts,
  triggerAlert
} from './alerts.controller';
import { protect } from '../auth/auth.controller';

const router = Router();

// Protect all routes after this middleware
router.use(protect);

router.route('/')
  .get(getAlerts)
  .post(createAlert);

router.route('/recent')
  .get(getRecentAlerts);

router.route('/:id')
  .get(getAlert)
  .patch(updateAlert)
  .delete(deleteAlert);

router.route('/:id/toggle')
  .patch(toggleAlertStatus);

router.route('/:id/trigger')
  .post(triggerAlert);

export default router; 