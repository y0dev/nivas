
// Configuration for allowed searches per subscription plan
const subscriptionPlans = {
  basic: {
    allowedSearches: 5,
  },
  premium: {
    allowedSearches: 30,
  },
  vip: {
    allowedSearches: 100,
  },
};

module.exports = { subscriptionPlans };