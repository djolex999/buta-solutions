import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Resend } from 'resend';
import Lead from '../models/Lead';

export const createLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { name, email, message } = req.body as {
      name: string;
      email: string;
      message: string;
    };

    const lead = await Lead.create({ name, email, message });

    // Send email notification via Resend (non-blocking)
    try {
      const resendApiKey = process.env.RESEND_API_KEY;
      const fromEmail = process.env.RESEND_FROM_EMAIL;

      if (resendApiKey && fromEmail) {
        const resend = new Resend(resendApiKey);

        await resend.emails.send({
          from: fromEmail,
          to: fromEmail,
          subject: `New Lead: ${name}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
          `,
        });
      }
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // Email failure should not fail the request
    }

    res.status(201).json(lead);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to create lead', details: message });
  }
};

export const getLeads = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.query;
    const filter: Record<string, string> = {};

    if (typeof status === 'string' && ['new', 'contacted', 'closed'].includes(status)) {
      filter['status'] = status;
    }

    const leads = await Lead.find(filter).sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to fetch leads', details: message });
  }
};

export const deleteLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const lead = await Lead.findByIdAndDelete(id);

    if (!lead) {
      res.status(404).json({ error: 'Lead not found' });
      return;
    }

    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to delete lead', details: message });
  }
};

export const updateLeadStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body as { status?: unknown };

    if (typeof status !== 'string' || !['new', 'contacted', 'closed'].includes(status)) {
      res.status(400).json({ error: 'Invalid status. Must be one of: new, contacted, closed' });
      return;
    }

    const lead = await Lead.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });

    if (!lead) {
      res.status(404).json({ error: 'Lead not found' });
      return;
    }

    res.json(lead);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to update lead status', details: message });
  }
};

export const getLeadStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [total, newCount, contacted, closed] = await Promise.all([
      Lead.countDocuments(),
      Lead.countDocuments({ status: 'new' }),
      Lead.countDocuments({ status: 'contacted' }),
      Lead.countDocuments({ status: 'closed' }),
    ]);

    res.json({ total, new: newCount, contacted, closed });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to fetch lead stats', details: message });
  }
};
