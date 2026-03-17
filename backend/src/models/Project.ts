import mongoose, { Document, Schema } from 'mongoose';

export interface IProject {
  title: string;
  slug: string;
  description: string;
  image: string;
  techStack: string[];
  liveUrl: string;
  services: mongoose.Types.ObjectId[];
  featured: boolean;
}

export interface IProjectDocument extends IProject, Document {}

const projectSchema = new Schema<IProjectDocument>(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Project slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
    },
    image: {
      type: String,
      required: [true, 'Project image is required'],
    },
    techStack: {
      type: [String],
      default: [],
    },
    liveUrl: {
      type: String,
      default: '',
    },
    services: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Service',
      },
    ],
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model<IProjectDocument>('Project', projectSchema);

export default Project;
