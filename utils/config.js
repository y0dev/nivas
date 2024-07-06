const PERCENTAGE = 0.15; // 15%
const PERCENTAGE_OFF = 1 - PERCENTAGE;

const TRIAL_PERIOD_DAYS = 7; // Define trial period duration

// Configuration for allowed searches per subscription plan
const subscriptionPlans = {
  basic: {
    name: 'Basic',
    description: 'Free plan with limited features',
    monthly: {
      price: 0,
      allowedSearches: 10,
    },
    annual: {
      price: 0,
      allowedSearches: 120,
    },
    support: 'Community Support',
    features: ['Basic Analytics', 'Access to Standard Content'],
    trialPeriod: 0, // No trial period for free plan
  },
  pro: {
    name: 'Pro',
    description: 'Advanced plan with additional features',
    monthly: {
      price: 25,
      allowedSearches: 30,
    },
    annual: {
      price: Math.round(25 * 12 * PERCENTAGE_OFF),
      allowedSearches: 360,
    },
    support: 'Priority Email Support',
    features: ['Advanced Analytics', 'Access to Premium Content', 'API Access'],
    trialPeriod: TRIAL_PERIOD_DAYS, // in days
  },
  elite: {
    name: 'Elite',
    description: 'All-inclusive plan with premium features',
    monthly: {
      price: 50,
      allowedSearches: 100,
    },
    annual: {
      price: Math.round(50 * 12 * PERCENTAGE_OFF),
      allowedSearches: 1200,
    },
    support: '24/7 Phone Support',
    features: ['Advanced Analytics', 'Access to Premium Content', 'API Access', 'Data Export'],
    trialPeriod: TRIAL_PERIOD_DAYS, // in days
  },
};

module.exports = { subscriptionPlans, TRIAL_PERIOD_DAYS };
