import { Request, Response } from 'express';
import Project from '../models/Project';
import Service from '../models/Service';

export const getProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const { service } = req.query;

    if (typeof service === 'string' && service.length > 0) {
      const serviceDoc = await Service.findOne({ slug: service });

      if (!serviceDoc) {
        res.status(404).json({ error: 'Service not found' });
        return;
      }

      const projects = await Project.find({ services: serviceDoc._id }).populate('services');
      res.json(projects);
      return;
    }

    const projects = await Project.find().populate('services');
    res.json(projects);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to fetch projects', details: message });
  }
};

export const getProjectById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id).populate('services');

    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    res.json(project);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to fetch project', details: message });
  }
};
