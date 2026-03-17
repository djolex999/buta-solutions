import mongoose, { Document, Schema } from 'mongoose';

export interface ILead {
  name: string;
  email: string;
  message: string;
  createdAt: Date;
  status: 'new' | 'contacted' | 'closed';
}

export interface ILeadDocument extends ILead, Document {}

const leadSchema = new Schema<ILeadDocument>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'closed'],
      default: 'new',
    },
  },
  {
    timestamps: true,
  }
);

const Lead = mongoose.model<ILeadDocument>('Lead', leadSchema);

export default Lead;
