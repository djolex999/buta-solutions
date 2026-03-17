import mongoose, { Document, Schema } from 'mongoose';

export interface IAdmin {
  email: string;
  password: string;
  createdAt: Date;
}

export interface IAdminDocument extends IAdmin, Document {}

const adminSchema = new Schema<IAdminDocument>(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const Admin = mongoose.model<IAdminDocument>('Admin', adminSchema);
export default Admin;
