import { Router } from 'express'
import { AlertsController } from './alerts.controller'

const router = Router()

// Alert Settings Routes
router.get('/settings/:userId?', AlertsController.getAlertSettings)
router.put('/settings/:userId?', AlertsController.updateAlertSettings)
router.post('/settings/:userId?/reset', AlertsController.resetAlertSettings)

// Alert Management Routes
router.get('/:userId?', AlertsController.getUserAlerts)
router.post('/:userId?', AlertsController.createAlert)
router.get('/:alertId/details/:userId?', AlertsController.getAlertDetails)
router.put('/:alertId/:userId?', AlertsController.updateAlert)
router.delete('/:alertId/:userId?', AlertsController.deleteAlert)

// Alert History Routes
router.post('/:alertId/history/:userId?', AlertsController.addAlertHistory)

export default router 