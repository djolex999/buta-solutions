"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Project, Service } from "@/lib/api";

interface ProjectsProps {
  projects: Project[];
  services: Service[];
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

const gradientColors = [
  "from-amber-500/20 to-orange-600/20",
  "from-blue-500/20 to-cyan-600/20",
  "from-emerald-500/20 to-teal-600/20",
  "from-purple-500/20 to-pink-600/20",
  "from-red-500/20 to-rose-600/20",
  "from-indigo-500/20 to-violet-600/20",
];

export default function Projects({ projects, services }: ProjectsProps) {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredProjects =
    activeFilter === "all"
      ? projects
      : projects.filter((p) =>
          p.services?.some((s) => s.slug === activeFilter)
        );

  return (
    <section id="projects" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-syne text-3xl md:text-5xl font-bold text-text-primary">
            Our Work
          </h2>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-4 py-2 text-sm rounded-lg border transition-all duration-200 ${
              activeFilter === "all"
                ? "bg-accent text-background border-accent font-semibold"
                : "border-border text-text-secondary hover:border-accent hover:text-accent"
            }`}
          >
            All
          </button>
          {services.map((service) => (
            <button
              key={service._id}
              onClick={() => setActiveFilter(service.slug)}
              className={`px-4 py-2 text-sm rounded-lg border transition-all duration-200 ${
                activeFilter === service.slug
                  ? "bg-accent text-background border-accent font-semibold"
                  : "border-border text-text-secondary hover:border-accent hover:text-accent"
              }`}
            >
              {service.name}
            </button>
          ))}
        </motion.div>

        {/* Project grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project._id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
                className="bg-surface border border-border rounded-xl overflow-hidden group hover:border-accent/50 transition-colors duration-300"
              >
                {/* Image placeholder */}
                <div
                  className={`aspect-video bg-gradient-to-br ${
                    gradientColors[index % gradientColors.length]
                  } flex items-center justify-center`}
                >
                  <span className="font-syne text-4xl font-bold text-text-primary/30">
                    {project.title.charAt(0)}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="font-syne text-lg font-semibold text-text-primary">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-text-secondary text-sm line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Tech stack tags */}
                  {project.techStack && project.techStack.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 text-xs bg-background border border-border rounded text-text-secondary"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* View project link */}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-1.5 text-accent text-sm font-medium hover:text-accent-hover transition-colors"
                    >
                      View Project
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                        />
                      </svg>
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProjects.length === 0 && (
          <p className="text-center text-text-secondary mt-12">
            No projects found for this category.
          </p>
        )}
      </div>
    </section>
  );
}
