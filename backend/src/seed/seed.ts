import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import connectDB from '../config/db';
import Service from '../models/Service';
import Project from '../models/Project';
import Lead from '../models/Lead';

interface ServiceSeed {
  name: string;
  slug: string;
  description: string;
  icon: string;
  order: number;
}

interface ProjectSeed {
  title: string;
  slug: string;
  description: string;
  image: string;
  techStack: string[];
  liveUrl: string;
  serviceSlugs: string[];
  featured: boolean;
}

const services: ServiceSeed[] = [
  {
    name: 'Mobile App Development',
    slug: 'mobile-app-development',
    description:
      'End-to-end mobile application development for iOS and Android. From concept to App Store, we build performant, user-friendly mobile experiences.',
    icon: 'smartphone',
    order: 1,
  },
  {
    name: 'Web Development',
    slug: 'web-development',
    description:
      'Full-stack web applications built with modern frameworks. Scalable, secure, and designed to convert.',
    icon: 'globe',
    order: 2,
  },
  {
    name: 'Custom Solutions',
    slug: 'custom-solutions',
    description:
      "Tailored software solutions for unique business challenges. If off-the-shelf doesn't cut it, we build it from scratch.",
    icon: 'settings',
    order: 3,
  },
  {
    name: 'Graphic Design & Print',
    slug: 'graphic-design-print',
    description:
      'Brand identity, marketing materials, and print design that makes your business stand out.',
    icon: 'palette',
    order: 4,
  },
  {
    name: '3D Design & Print',
    slug: '3d-design-print',
    description:
      'Product visualization, 3D modeling, and printing services for prototyping and production.',
    icon: 'cube',
    order: 5,
  },
  {
    name: 'Virtual Tours',
    slug: 'virtual-tours',
    description:
      'Immersive 360° virtual tours for real estate, hospitality, and retail spaces.',
    icon: 'eye',
    order: 6,
  },
];

const projects: ProjectSeed[] = [
  {
    title: 'AutoMio',
    slug: 'automio',
    description:
      'A comprehensive automotive marketplace platform connecting buyers and sellers in Switzerland. Features real-time listings, advanced search filters, and integrated communication.',
    image: '/projects/automio.jpg',
    techStack: ['Node.js', 'React', 'MongoDB', 'Cloudinary', 'SendGrid', 'Heroku'],
    liveUrl: 'https://automio.ch',
    serviceSlugs: ['web-development'],
    featured: true,
  },
  {
    title: 'RecycleCap',
    slug: 'recyclecap',
    description:
      'Gamified recycling platform that rewards users for sustainable behavior. Track recycling habits, earn points, and redeem rewards.',
    image: '/projects/recyclecap.jpg',
    techStack: ['Node.js', 'React', 'MongoDB', 'Cloudinary', 'SendGrid', 'Render'],
    liveUrl: 'https://demo-capcoin-fe.onrender.com/',
    serviceSlugs: ['web-development'],
    featured: true,
  },
  {
    title: 'Bacchus Drinks',
    slug: 'bacchus-drinks',
    description:
      'Premium drinks e-commerce platform with integrated payment processing, inventory management, and order tracking.',
    image: '/projects/bacchus.jpg',
    techStack: ['Java', 'React', 'PostgreSQL', 'Stripe', 'SendGrid'],
    liveUrl: 'https://bacchus-shop.vercel.app/',
    serviceSlugs: ['web-development'],
    featured: true,
  },
  {
    title: 'Mini Brocki',
    slug: 'mini-brocki',
    description:
      'Second-hand marketplace platform for a Swiss thrift store. Browse, purchase, and manage inventory with ease.',
    image: '/projects/minibrocki.jpg',
    techStack: ['Java', 'React', 'PostgreSQL', 'Stripe', 'SendGrid'],
    liveUrl: 'https://www.facebook.com/minibrocki.ch',
    serviceSlugs: ['web-development'],
    featured: false,
  },
  {
    title: 'OrderMio',
    slug: 'ordermio',
    description:
      'Mobile application digitizing the ordering process between customers and sellers. Streamlined workflows, real-time updates, and seamless communication.',
    image: '/projects/ordermio.jpg',
    techStack: ['React Native', 'Node.js', 'MongoDB', 'Push Notifications'],
    liveUrl: '',
    serviceSlugs: ['mobile-app-development'],
    featured: true,
  },
  {
    title: 'NegotiateWind',
    slug: 'negotiatewind',
    description:
      'Multilingual football contract negotiation platform. Facilitates communication between agents, clubs, and players across languages and legal frameworks.',
    image: '/projects/negotiatewind.jpg',
    techStack: ['Next.js', 'Node.js', 'PostgreSQL', 'i18n'],
    liveUrl: 'https://negotiatewind.com/',
    serviceSlugs: ['custom-solutions'],
    featured: true,
  },
];

const seed = async (): Promise<void> => {
  try {
    await connectDB();
    console.log('Clearing existing data...');

    await Service.deleteMany({});
    await Project.deleteMany({});
    await Lead.deleteMany({});

    console.log('Seeding services...');
    const createdServices = await Service.insertMany(services);

    const serviceMap = new Map<string, mongoose.Types.ObjectId>();
    for (const service of createdServices) {
      serviceMap.set(service.slug, service._id as mongoose.Types.ObjectId);
    }

    console.log('Seeding projects...');
    const projectDocs = projects.map((project) => ({
      title: project.title,
      slug: project.slug,
      description: project.description,
      image: project.image,
      techStack: project.techStack,
      liveUrl: project.liveUrl,
      featured: project.featured,
      services: project.serviceSlugs
        .map((slug) => serviceMap.get(slug))
        .filter((id): id is mongoose.Types.ObjectId => id !== undefined),
    }));

    await Project.insertMany(projectDocs);

    console.log('Seed completed successfully!');
    console.log(`  - ${createdServices.length} services created`);
    console.log(`  - ${projectDocs.length} projects created`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seed();
