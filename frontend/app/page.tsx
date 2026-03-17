import { getServices, getProjects, Service, Project } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import WhatWeDo from "@/components/WhatWeDo";
import Projects from "@/components/Projects";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

async function fetchData(): Promise<{
  services: Service[];
  projects: Project[];
}> {
  try {
    const [services, projects] = await Promise.all([
      getServices(),
      getProjects(),
    ]);
    return { services, projects };
  } catch {
    return { services: [], projects: [] };
  }
}

export default async function Home() {
  const { services, projects } = await fetchData();

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <WhatWeDo services={services} />
        <Projects projects={projects} services={services} />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
