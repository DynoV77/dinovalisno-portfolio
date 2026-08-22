const Footer = () => {
  const handleClick = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <footer className="border-t border-border px-5 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-muted-foreground">
          Dino Valisno — CRM / CRM Practice Portfolio
        </p>
        <nav className="flex gap-6">
          {[
            { label: "Home", href: "#home" },
            { label: "Projects", href: "#projects" },
            { label: "About", href: "#about" },
            { label: "Contact", href: "#contact" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleClick(link.href);
              }}
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <p className="text-xs text-muted-foreground/70">
          © {new Date().getFullYear()} Dino Valisno
        </p>
      </div>
    </footer>
  );
};

export default Footer;