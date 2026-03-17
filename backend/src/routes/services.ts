import { Router } from 'express';
import {
  getServices,
  getServiceBySlug,
  createService,
  updateService,
  deleteService,
} from '../controllers/servicesController';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();

router.get('/', getServices);
router.get('/:slug', getServiceBySlug);
router.post('/', authMiddleware, createService);
router.put('/:id', authMiddleware, updateService);
router.delete('/:id', authMiddleware, deleteService);

export default router;
