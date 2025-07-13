import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Alert, { IAlert } from './alerts.schema';
import APIFeatures from '../../utils/apiFeatures';
import AppError from '../../utils/appError';
import catchAsync from '../../utils/catchAsync';
import { logger } from '../../utils/logger';

// Extend Request interface to include user
interface AuthRequest extends Request {
  user?: {
    _id: mongoose.Types.ObjectId;
    email: string;
  };
}

// Mock data storage (in real app, this would be a database)
let alertSettings: any[] = []
let alerts: any[] = []
let alertHistory: any[] = []

export class AlertsController {
  // Get user's alert settings
  static async getAlertSettings(req: Request, res: Response) {
    try {
      const userId = req.params.userId || req.user?.id
      
      if (!userId) {
        return res.status(400).json({ 
          success: false, 
          message: 'User ID is required' 
        })
      }

      // Find existing settings or return defaults
      let settings = alertSettings.find(s => s.userId === userId)
      
      if (!settings) {
        // Create default settings for new user
        settings = {
          ...defaultAlertSettings,
          userId,
          id: `settings_${Date.now()}`
        }
        alertSettings.push(settings)
      }

      res.status(200).json({
        success: true,
        data: settings
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get alert settings',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  // Update user's alert settings
  static async updateAlertSettings(req: Request, res: Response) {
    try {
      const userId = req.params.userId || req.user?.id
      
      if (!userId) {
        return res.status(400).json({ 
          success: false, 
          message: 'User ID is required' 
        })
      }

      const updateData = req.body
      
      // Validate the update data
      const validationResult = AlertSettingsSchema.safeParse({
        userId,
        ...updateData
      })

      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          message: 'Invalid alert settings data',
          errors: validationResult.error.errors
        })
      }

      // Find existing settings or create new ones
      let settingsIndex = alertSettings.findIndex(s => s.userId === userId)
      
      if (settingsIndex === -1) {
        // Create new settings
        const newSettings = {
          ...defaultAlertSettings,
          ...updateData,
          userId,
          id: `settings_${Date.now()}`,
          updatedAt: new Date()
        }
        alertSettings.push(newSettings)
        
        res.status(201).json({
          success: true,
          message: 'Alert settings created successfully',
          data: newSettings
        })
      } else {
        // Update existing settings
        alertSettings[settingsIndex] = {
          ...alertSettings[settingsIndex],
          ...updateData,
          updatedAt: new Date()
        }
        
        res.status(200).json({
          success: true,
          message: 'Alert settings updated successfully',
          data: alertSettings[settingsIndex]
        })
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update alert settings',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  // Reset user's alert settings to defaults
  static async resetAlertSettings(req: Request, res: Response) {
    try {
      const userId = req.params.userId || req.user?.id
      
      if (!userId) {
        return res.status(400).json({ 
          success: false, 
          message: 'User ID is required' 
        })
      }

      // Remove existing settings
      alertSettings = alertSettings.filter(s => s.userId !== userId)
      
      // Create new default settings
      const defaultSettings = {
        ...defaultAlertSettings,
        userId,
        id: `settings_${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      alertSettings.push(defaultSettings)

      res.status(200).json({
        success: true,
        message: 'Alert settings reset to defaults successfully',
        data: defaultSettings
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to reset alert settings',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  // Get user's alerts
  static async getUserAlerts(req: Request, res: Response) {
    try {
      const userId = req.params.userId || req.user?.id
      
      if (!userId) {
        return res.status(400).json({ 
          success: false, 
          message: 'User ID is required' 
        })
      }

      const userAlerts = alerts.filter(alert => alert.userId === userId)

      res.status(200).json({
        success: true,
        data: userAlerts
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get user alerts',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  // Create new alert
  static async createAlert(req: Request, res: Response) {
    try {
      const userId = req.params.userId || req.user?.id
      
      if (!userId) {
        return res.status(400).json({ 
          success: false, 
          message: 'User ID is required' 
        })
      }

      const alertData = req.body
      
      // Validate the alert data
      const validationResult = AlertSchema.safeParse({
        userId,
        ...alertData
      })

      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          message: 'Invalid alert data',
          errors: validationResult.error.errors
        })
      }

      const newAlert = {
        ...validationResult.data,
        id: `alert_${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      alerts.push(newAlert)

      res.status(201).json({
        success: true,
        message: 'Alert created successfully',
        data: newAlert
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to create alert',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  // Update alert
  static async updateAlert(req: Request, res: Response) {
    try {
      const { alertId } = req.params
      const userId = req.params.userId || req.user?.id
      
      if (!alertId || !userId) {
        return res.status(400).json({ 
          success: false, 
          message: 'Alert ID and User ID are required' 
        })
      }

      const alertIndex = alerts.findIndex(alert => alert.id === alertId && alert.userId === userId)
      
      if (alertIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Alert not found'
        })
      }

      const updateData = req.body
      
      // Validate the update data
      const validationResult = AlertSchema.safeParse({
        ...alerts[alertIndex],
        ...updateData,
        updatedAt: new Date()
      })

      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          message: 'Invalid alert data',
          errors: validationResult.error.errors
        })
      }

      alerts[alertIndex] = {
        ...alerts[alertIndex],
        ...updateData,
        updatedAt: new Date()
      }

      res.status(200).json({
        success: true,
        message: 'Alert updated successfully',
        data: alerts[alertIndex]
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update alert',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  // Delete alert
  static async deleteAlert(req: Request, res: Response) {
    try {
      const { alertId } = req.params
      const userId = req.params.userId || req.user?.id
      
      if (!alertId || !userId) {
        return res.status(400).json({ 
          success: false, 
          message: 'Alert ID and User ID are required' 
        })
      }

      const alertIndex = alerts.findIndex(alert => alert.id === alertId && alert.userId === userId)
      
      if (alertIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Alert not found'
        })
      }

      const deletedAlert = alerts.splice(alertIndex, 1)[0]

      res.status(200).json({
        success: true,
        message: 'Alert deleted successfully',
        data: deletedAlert
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete alert',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  // Get alert details with history
  static async getAlertDetails(req: Request, res: Response) {
    try {
      const { alertId } = req.params
      const userId = req.params.userId || req.user?.id
      
      if (!alertId || !userId) {
        return res.status(400).json({ 
          success: false, 
          message: 'Alert ID and User ID are required' 
        })
      }

      const alert = alerts.find(a => a.id === alertId && a.userId === userId)
      
      if (!alert) {
        return res.status(404).json({
          success: false,
          message: 'Alert not found'
        })
      }

      // Get alert history
      const history = alertHistory.filter(h => h.alertId === alertId)

      res.status(200).json({
        success: true,
        data: {
          ...alert,
          history
        }
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get alert details',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  // Add alert history entry
  static async addAlertHistory(req: Request, res: Response) {
    try {
      const { alertId } = req.params
      const userId = req.params.userId || req.user?.id
      
      if (!alertId || !userId) {
        return res.status(400).json({ 
          success: false, 
          message: 'Alert ID and User ID are required' 
        })
      }

      const historyData = req.body
      
      // Validate the history data
      const validationResult = AlertHistorySchema.safeParse({
        alertId,
        ...historyData
      })

      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          message: 'Invalid history data',
          errors: validationResult.error.errors
        })
      }

      const newHistoryEntry = {
        ...validationResult.data,
        id: `history_${Date.now()}`,
        timestamp: new Date()
      }
      
      alertHistory.push(newHistoryEntry)

      res.status(201).json({
        success: true,
        message: 'Alert history added successfully',
        data: newHistoryEntry
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to add alert history',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
} 