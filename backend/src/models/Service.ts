import mongoose, { Document, Schema } from 'mongoose';

export interface IService {
  name: string;
  slug: string;
  description: string;
  icon: string;
  order: number;
}

export interface IServiceDocument extends IService, Document {}

const serviceSchema = new Schema<IServiceDocument>(
  {
    name: {
      type: String,
      required: [true, 'Service name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Service slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Service description is required'],
    },
    icon: {
      type: String,
      required: [true, 'Service icon is required'],
    },
    order: {
      type: Number,
      required: [true, 'Service order is required'],
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Service = mongoose.model<IServiceDocument>('Service', serviceSchema);

export default Service;
