import { useState } from "react";
import { Mail, Phone, Linkedin } from "lucide-react";

const contactMethods = [
  {
    icon: Mail,
    label: "Email",
    placeholder: "dynov77@yahoo.com",
    href: "mailto:dynov77@yahoo.com",
  },
  {
    icon: Phone,
    label: "Phone / WhatsApp",
    placeholder: "+63 908 730 2797",
    href: "tel:+639087302797",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    placeholder: "https://www.linkedin.com/in/dynov77",
    href: "https://www.linkedin.com/in/dynov77",
  },
];

type Status = "idle" | "submitting" | "success" | "error";

const Contact = () => {
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    const form = e.currentTarget;
    const formData = new FormData(form);
    try {
      const response = await fetch("https://formsubmit.co/ajax/dynov77@yahoo.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message"),
          _subject: "New Portfolio Contact",
          _template: "table",
        }),
      });
      if (response.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="px-5 py-20 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <span className="mb-3 inline-block text-xs font-medium uppercase tracking-[0.2em] text-primary">
            Contact
          </span>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Let's Talk
          </h2>
          <p className="mx-auto max-w-xl text-base text-muted-foreground">
            Interested in discussing a project or need help organizing your
            leads and customer management process? I'd be happy to hear from
            you.
          </p>
        </div>

        {/* Contact methods */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {contactMethods.map(({ icon: Icon, label, placeholder, href }) => (
            <a
              key={label}
              href={href}
              className="flex flex-col items-center gap-3 rounded-lg border border-border bg-card p-6 text-center transition-colors hover:border-primary/50"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-sm font-semibold text-foreground">
                {label}
              </span>
              <span className="break-all text-xs text-muted-foreground">
                {placeholder}
              </span>
            </a>
          ))}
        </div>

        {/* Contact form — FormSubmit, no backend required */}
        <form
          className="mt-10 rounded-lg border border-border bg-card p-6 sm:p-8"
          onSubmit={handleSubmit}
        >
          <h3 className="mb-5 text-lg font-semibold text-foreground">
            Send a Message
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="name"
                className="text-sm font-medium text-foreground"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                required
                placeholder="Your name"
                className="rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="your.email@example.com"
                className="rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-1.5">
            <label
              htmlFor="message"
              className="text-sm font-medium text-foreground"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={4}
              placeholder="Tell me about your project or question..."
              className="rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <button
            type="submit"
            disabled={status === "submitting"}
            className="mt-5 inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "submitting" ? "Sending..." : "Send Message"}
          </button>
          {status === "success" && (
            <p className="mt-3 text-xs text-primary">
              Thank you — your message has been sent. I'll get back to you soon.
            </p>
          )}
          {status === "error" && (
            <p className="mt-3 text-xs text-destructive">
              Something went wrong. Please try again or email me directly at
              dynov77@yahoo.com.
            </p>
          )}
          {status === "idle" && (
            <p className="mt-3 text-xs text-muted-foreground">
              Your message will be sent to my inbox. I'll reply to the email
              address you provide.
            </p>
          )}
        </form>
      </div>
    </section>
  );
};

export default Contact;