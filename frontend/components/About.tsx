"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface StatProps {
  value: number;
  suffix: string;
  label: string;
  delay: number;
}

function StatCard({ value, suffix, label, delay }: StatProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    const timeout = setTimeout(() => {
      let start = 0;
      const duration = 1500;
      const step = duration / value;

      const interval = setInterval(() => {
        start += 1;
        setCount(start);
        if (start >= value) clearInterval(interval);
      }, step);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [isInView, value, delay]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: delay / 1000 }}
      className="bg-surface border border-border rounded-xl p-6 text-center"
    >
      <div className="font-syne text-4xl font-bold text-accent">
        {count}
        {suffix}
      </div>
      <div className="mt-2 text-text-secondary text-sm">{label}</div>
    </motion.div>
  );
}

export default function About() {
  return (
    <section id="about" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left column - text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-syne text-3xl md:text-5xl font-bold leading-tight text-text-primary">
              We don&apos;t just build software. We build ventures.
            </h2>
            <p className="mt-6 text-text-secondary leading-relaxed">
              Buta Solutions is a software agency rooted in Gracanica, Serbia,
              with a global reach. We partner with startups and businesses to
              transform ideas into market-ready products — from mobile apps and
              web platforms to custom enterprise solutions.
            </p>
            <p className="mt-4 text-text-secondary leading-relaxed">
              We&apos;re not just developers. We&apos;re builders, strategists,
              and problem solvers who care about the outcome as much as you do.
              Every line of code we write is in service of your growth.
            </p>
          </motion.div>

          {/* Right column - stats */}
          <div className="grid gap-4">
            <StatCard value={15} suffix="+" label="Projects Shipped" delay={0} />
            <StatCard
              value={4}
              suffix="+"
              label="Years of Experience"
              delay={200}
            />
            <StatCard value={10} suffix="+" label="Happy Clients" delay={400} />
          </div>
        </div>
      </div>
    </section>
  );
}
