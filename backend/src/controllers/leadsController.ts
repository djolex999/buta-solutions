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
