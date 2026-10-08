const About = () => {
  return (
    <section id="about" className="px-5 py-20 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <span className="mb-3 inline-block text-xs font-medium uppercase tracking-[0.2em] text-primary">
            About
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            About Me
          </h2>
        </div>

        <div className="rounded-lg border border-border bg-card p-8">
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            My background is in{" "}
            <span className="font-medium text-foreground">Graphic Design</span>,
            with experience in print and digital production. I am currently
            expanding my skills into{" "}
            <span className="font-medium text-foreground">
              CRM and GoHighLevel systems
            </span>
            , with a focus on practical lead management, pipelines, forms,
            workflows, and follow-up processes.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-border pt-6 sm:grid-cols-4">
            {[
              "Lead Management",
              "Pipelines",
              "Forms",
              "Workflows",
            ].map((focus) => (
              <div
                key={focus}
                className="rounded-md bg-secondary/40 px-3 py-3 text-center text-sm font-medium text-foreground"
              >
                {focus}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;