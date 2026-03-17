const quickLinks = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Logo + tagline */}
          <div>
            <span className="font-syne text-2xl font-bold tracking-tight">
              BUT<span className="text-accent">A</span>
            </span>
            <p className="mt-4 text-text-secondary text-sm leading-relaxed max-w-xs">
              Software agency building venture-grade digital products. From
              Gracanica to the world.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-syne font-semibold text-text-primary mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-text-secondary text-sm hover:text-accent transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="font-syne font-semibold text-text-primary mb-4">
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li>
                <a
                  href="mailto:solutionbuta@gmail.com"
                  className="hover:text-accent transition-colors"
                >
                  solutionbuta@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+38345697686"
                  className="hover:text-accent transition-colors"
                >
                  +383 45 697 686
                </a>
              </li>
              <li>Momcila Sekulica, Gracanica</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <p className="text-text-secondary text-sm text-center">
            &copy; 2024 Buta Solutions. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
