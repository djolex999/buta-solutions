import { Request, Response } from 'express';
import Service from '../models/Service';
import Project from '../models/Project';

export const getServices = async (_req: Request, res: Response): Promise<void> => {
  try {
    const services = await Service.find().sort({ order: 1 });
    res.json(services);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to fetch services', details: message });
  }
};

export const getServiceBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const service = await Service.findOne({ slug });

    if (!service) {
      res.status(404).json({ error: 'Service not found' });
      return;
    }

    const projects = await Project.find({ services: service._id }).populate('services');

    res.json({ service, projects });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to fetch service', details: message });
  }
};
