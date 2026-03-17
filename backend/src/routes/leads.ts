import { Router } from 'express';
import { body } from 'express-validator';
import {
  createLead,
  getLeads,
  deleteLead,
  updateLeadStatus,
  getLeadStats,
} from '../controllers/leadsController';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').trim().isEmail().withMessage('Valid email is required'),
    body('message').trim().notEmpty().withMessage('Message is required'),
  ],
  createLead
);
router.get('/', getLeads);

// Protected routes
router.get('/stats', authMiddleware, getLeadStats);
router.delete('/:id', authMiddleware, deleteLead);
router.patch('/:id/status', authMiddleware, updateLeadStatus);

export default router;
