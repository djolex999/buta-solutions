"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Service, Project, getProjects } from "@/lib/api";

interface ServiceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
}

export default function ServiceDrawer({
  isOpen,
  onClose,
  service,
}: ServiceDrawerProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!service || !isOpen) return;

    const fetchProjects = async () => {
      setLoading(true);
      try {
        const data = await getProjects(service.slug);
        setProjects(data);
      } catch {
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [service, isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && service && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[400px] bg-surface border-l border-border overflow-y-auto"
          >
            <div className="p-6">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-text-secondary hover:text-text-primary transition-colors"
                aria-label="Close drawer"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Service info */}
              <h2 className="font-syne text-2xl font-bold text-text-primary pr-8">
                {service.name}
              </h2>
              <p className="mt-4 text-text-secondary leading-relaxed">
                {service.description}
              </p>

              {/* Projects section */}
              <div className="mt-8">
                <h3 className="font-syne text-lg font-semibold text-text-primary mb-4">
                  Related Projects
                </h3>

                {loading ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div
                        key={i}
                        className="bg-background border border-border rounded-lg p-4 animate-pulse"
                      >
                        <div className="h-4 bg-border rounded w-3/4 mb-3" />
                        <div className="h-3 bg-border rounded w-full mb-2" />
                        <div className="h-3 bg-border rounded w-2/3" />
                      </div>
                    ))}
                  </div>
                ) : projects.length > 0 ? (
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <div
                        key={project._id}
                        className="bg-background border border-border rounded-lg p-4"
                      >
                        <h4 className="font-semibold text-text-primary">
                          {project.title}
                        </h4>
                        <p className="mt-2 text-text-secondary text-sm line-clamp-2">
                          {project.description}
                        </p>
                        {project.techStack && project.techStack.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {project.techStack.map((tech) => (
                              <span
                                key={tech}
                                className="px-2 py-1 text-xs bg-surface border border-border rounded text-text-secondary"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-flex items-center gap-1 text-accent text-sm hover:text-accent-hover transition-colors"
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
                                d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                              />
                            </svg>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-text-secondary text-sm">
                    No projects to display yet. Check back soon!
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
