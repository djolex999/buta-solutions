import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin';
import { AuthRequest } from '../middleware/authMiddleware';

const COOKIE_NAME = 'token';
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as { email?: unknown; password?: unknown };

  if (typeof email !== 'string' || !email.trim()) {
    res.status(400).json({ error: 'Email is required' });
    return;
  }

  if (typeof password !== 'string' || !password) {
    res.status(400).json({ error: 'Password is required' });
    return;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    res.status(500).json({ error: 'Server configuration error' });
    return;
  }

  try {
    const admin = await Admin.findOne({ email: email.trim().toLowerCase() });

    if (!admin) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const adminId = (admin._id as unknown as { toString(): string }).toString();

    const token = jwt.sign({ id: adminId, email: admin.email }, secret, {
      expiresIn: '7d',
    });

    res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: COOKIE_MAX_AGE });

    res.json({
      message: 'Login successful',
      admin: { id: adminId, email: admin.email },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Login failed', details: message });
  }
};

export const logout = (_req: Request, res: Response): void => {
  res.clearCookie(COOKIE_NAME, cookieOptions);
  res.json({ message: 'Logged out' });
};

export const me = (req: AuthRequest, res: Response): void => {
  res.json(req.admin);
};
