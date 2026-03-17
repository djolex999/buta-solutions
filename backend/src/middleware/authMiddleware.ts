import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  admin?: { id: string; email: string };
}

interface JwtPayload {
  id: string;
  email: string;
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    res.status(500).json({ error: 'Server configuration error' });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    req.admin = { id: decoded.id, email: decoded.email };
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

export default authMiddleware;
