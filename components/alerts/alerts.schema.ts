import { z } from 'zod'

// Alert Settings Schema
export const AlertSettingsSchema = z.object({
  userId: z.string(),
  notifications: z.object({
    email: z.object({
      enabled: z.boolean().default(true),
      frequency: z.enum(['immediate', 'hourly', 'daily', 'weekly']).default('immediate'),
      digest: z.boolean().default(false)
    }),
    push: z.object({
      enabled: z.boolean().default(true),
      frequency: z.enum(['immediate', 'batched', 'hourly']).default('immediate')
    }),
    sms: z.object({
      enabled: z.boolean().default(false),
      frequency: z.enum(['immediate', 'daily', 'weekly']).default('daily')
    })
  }),
  preferences: z.object({
    quietHours: z.object({
      enabled: z.boolean().default(true),
      start: z.string().default('22:00'),
      end: z.string().default('08:00')
    }),
    timezone: z.string().default('America/Chicago'),
    language: z.enum(['en', 'es', 'fr', 'de']).default('en')
  }),
  privacy: z.object({
    shareData: z.boolean().default(false),
    analytics: z.boolean().default(true),
    marketing: z.boolean().default(false)
  }),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date())
})

export type AlertSettings = z.infer<typeof AlertSettingsSchema>

// Alert Schema
export const AlertSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  name: z.string().min(1, 'Alert name is required'),
  type: z.enum(['price', 'roi', 'market', 'property']),
  location: z.string().min(1, 'Location is required'),
  condition: z.string().min(1, 'Condition is required'),
  status: z.enum(['active', 'inactive']).default('active'),
  frequency: z.enum(['immediate', 'daily', 'weekly', 'monthly']).default('daily'),
  criteria: z.object({
    minPrice: z.number().optional(),
    maxPrice: z.number().optional(),
    propertyType: z.string().optional(),
    beds: z.string().optional(),
    baths: z.string().optional(),
    sqft: z.string().optional()
  }).optional(),
  lastTriggered: z.date().optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date())
})

export type Alert = z.infer<typeof AlertSchema>

// Alert History Schema
export const AlertHistorySchema = z.object({
  id: z.string().optional(),
  alertId: z.string(),
  event: z.string(),
  details: z.string(),
  action: z.string().optional(),
  timestamp: z.date().default(() => new Date())
})

export type AlertHistory = z.infer<typeof AlertHistorySchema>

// Default Alert Settings
export const defaultAlertSettings: AlertSettings = {
  userId: '',
  notifications: {
    email: {
      enabled: true,
      frequency: 'immediate',
      digest: false
    },
    push: {
      enabled: true,
      frequency: 'immediate'
    },
    sms: {
      enabled: false,
      frequency: 'daily'
    }
  },
  preferences: {
    quietHours: {
      enabled: true,
      start: '22:00',
      end: '08:00'
    },
    timezone: 'America/Chicago',
    language: 'en'
  },
  privacy: {
    shareData: false,
    analytics: true,
    marketing: false
  },
  createdAt: new Date(),
  updatedAt: new Date()
} 