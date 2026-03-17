import { Router } from 'express';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectsController';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();

router.get('/', getProjects);
router.get('/:id', getProjectById);
router.post('/', authMiddleware, createProject);
router.put('/:id', authMiddleware, updateProject);
router.delete('/:id', authMiddleware, deleteProject);

export default router;
