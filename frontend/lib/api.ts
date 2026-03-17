const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface Service {
  _id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  _id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  liveUrl: string;
  techStack: string[];
  services: Service[];
  featured: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Lead {
  name: string;
  email: string;
  message: string;
}

export interface LeadResponse {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface LeadItem {
  _id: string;
  name: string;
  email: string;
  message: string;
  status: 'new' | 'contacted' | 'closed';
  createdAt: string;
}

export async function getServices(): Promise<Service[]> {
  const res = await fetch(`${BASE_URL}/api/services`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch services");
  }
  return res.json();
}

export async function getServiceBySlug(slug: string): Promise<Service> {
  const res = await fetch(`${BASE_URL}/api/services/${slug}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch service: ${slug}`);
  }
  return res.json();
}

export async function getProjects(serviceSlug?: string): Promise<Project[]> {
  const url = serviceSlug
    ? `${BASE_URL}/api/projects?service=${serviceSlug}`
    : `${BASE_URL}/api/projects`;
  const res = await fetch(url, {
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch projects");
  }
  return res.json();
}

export async function createLead(data: Lead): Promise<LeadResponse> {
  const res = await fetch(`${BASE_URL}/api/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Failed to submit lead");
  }
  return res.json();
}
