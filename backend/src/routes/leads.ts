import { Router } from 'express';
import { body } from 'express-validator';
import { createLead } from '../controllers/leadsController';

const router = Router();

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').trim().isEmail().withMessage('Valid email is required'),
    body('message').trim().notEmpty().withMessage('Message is required'),
  ],
  createLead
);

export default router;
