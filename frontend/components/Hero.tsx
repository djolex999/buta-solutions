"use client";

import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function Hero() {
  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Subtle grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Subtle gradient accent */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl mx-auto px-6 text-center"
      >
        <motion.h1
          variants={itemVariants}
          className="font-syne text-5xl md:text-7xl font-bold leading-tight tracking-tight text-text-primary"
        >
          We build applications that drive growth.
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mt-6 text-lg md:text-xl text-text-secondary max-w-2xl mx-auto font-inter leading-relaxed"
        >
          Buta Solutions — venture building, product development, and digital
          solutions from Gracanica to the world.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={() => scrollTo("#projects")}
            className="px-8 py-3.5 bg-accent text-background font-semibold rounded-lg hover:bg-accent-hover transition-colors duration-200 text-sm"
          >
            See Our Work
          </button>
          <button
            onClick={() => scrollTo("#contact")}
            className="px-8 py-3.5 border border-accent text-accent font-semibold rounded-lg hover:bg-accent/10 transition-colors duration-200 text-sm"
          >
            Get In Touch
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
