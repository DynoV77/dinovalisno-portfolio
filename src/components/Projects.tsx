import ProjectCard, { type Project } from "./ProjectCard";

const projects: Project[] = [
  {
    id: "contact-management",
    category: "CRM · GoHighLevel",
    title: "Contact Management",
    description:
      "Practiced organizing contacts, adding relevant information, applying tags, and using contact records to keep customer information organized.",
    skills: "Contact Management · Tags · Custom Fields · Contact Organization",
  },
  {
    id: "lead-capture-form",
    category: "CRM · GoHighLevel",
    title: "Lead Capture Form",
    description:
      "Created and configured a lead capture form and practiced connecting submitted information with contact records inside GoHighLevel.",
    skills: "Forms · Contact Creation · Field Mapping",
  },
  {
    id: "sales-pipeline",
    category: "CRM · GoHighLevel",
    title: "Sales Pipeline Setup",
    description:
      "Created and organized a sample sales pipeline with defined opportunity stages to practice tracking leads through a sales process.",
    skills: "Pipelines · Opportunities · Pipeline Stages",
  },
  {
    id: "follow-up-workflow",
    category: "CRM · Automation",
    title: "Basic Follow-Up Workflow",
    description:
      "Practiced creating a basic automated follow-up process using triggers and actions within GoHighLevel.",
    skills: "Workflows · Triggers · Actions · Follow-Up Automation",
  },
];

const Projects = () => {
  return (
    <section id="projects" className="px-5 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <span className="mb-3 inline-block text-xs font-medium uppercase tracking-[0.2em] text-primary">
            Practice Projects
          </span>
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Projects
          </h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground">
            A selection of GoHighLevel CRM practice projects. Screenshots will be added
            as each project is documented.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;