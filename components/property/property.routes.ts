import { Router } from 'express';
import {
  getSavedProperties,
  getPortfolioProperties,
  getProperty,
  saveProperty,
  addToPortfolio,
  removeSavedProperty,
  removeFromPortfolio,
  updatePropertyNotes,
  deleteProperty
} from './property.controller';
import { protect } from '../auth/auth.controller';

const router = Router();

// Protect all routes after this middleware
router.use(protect);

// Saved Properties routes
router.route('/saved')
  .get(getSavedProperties);

router.route('/saved/:id')
  .delete(removeSavedProperty);

// Portfolio Properties routes
router.route('/portfolio')
  .get(getPortfolioProperties);

router.route('/portfolio/:id')
  .patch(addToPortfolio)
  .delete(removeFromPortfolio);

// General property routes
router.route('/')
  .post(saveProperty);

router.route('/:id')
  .get(getProperty)
  .patch(updatePropertyNotes)
  .delete(deleteProperty);

export default router; 