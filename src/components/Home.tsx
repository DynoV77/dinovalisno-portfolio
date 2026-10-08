import { ArrowRight, Mail } from "lucide-react";

const scrollTo = (id: string) => {
  const el = document.querySelector(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const Home = () => {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center px-5 pt-20"
    >
      <div className="mx-auto max-w-3xl text-center">
        {/* Unobtrusive label */}
        <span className="mb-6 inline-block rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          GOHIGHLEVEL / CRM
        </span>

        {/* Name — intentionally restrained */}
        <p className="mb-3 text-base font-medium text-muted-foreground">
          Dino Valisno
        </p>

        {/* Main visual heading */}
        <h1 className="mb-6 text-4xl font-medium leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl">
          GoHighLevel / CRM Portfolio
        </h1>

        <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-muted-foreground">
          A collection of GoHighLevel CRM practice projects documenting the
          systems, workflows, and processes I have learned and built along the way.
        </p>

        {/* Buttons */}
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            onClick={() => scrollTo("#projects")}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto"
          >
            View My Work
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => scrollTo("#contact")}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-border bg-secondary px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary sm:w-auto"
          >
            <Mail className="h-4 w-4" />
            Contact Me
          </button>
        </div>
      </div>
    </section>
  );
};

export default Home;