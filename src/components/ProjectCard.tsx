import { useState, useEffect, useRef, useCallback } from "react";
import { ImagePlus, ArrowRight, Upload, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Project {
  id: string;
  category: string;
  title: string;
  description: string;
  skills: string;
  image?: string;
}

interface ProjectCardProps {
  project: Project;
  className?: string;
}

const STORAGE_PREFIX = "portfolio-screenshots:";

const ProjectCard = ({ project, className }: ProjectCardProps) => {
  const storageKey = `${STORAGE_PREFIX}${project.id}`;
  const [images, setImages] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load previously uploaded screenshots from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as string[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setImages(parsed);
          setCurrent(0);
        }
      }
    } catch {
      /* localStorage unavailable or corrupt — ignore */
    }
  }, [storageKey]);

  const persist = useCallback(
    (next: string[]) => {
      try {
        if (next.length > 0) {
          localStorage.setItem(storageKey, JSON.stringify(next));
        } else {
          localStorage.removeItem(storageKey);
        }
      } catch {
        /* storage full or unavailable — images still show for this session */
      }
    },
    [storageKey]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    const valid = files.filter((f) =>
      ["image/png", "image/jpeg", "image/jpg"].includes(f.type)
    );
    if (valid.length === 0) return;

    const readers = valid.map(
      (file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        })
    );

    Promise.all(readers).then((dataUrls) => {
      setImages((prev) => {
        const next = [...prev, ...dataUrls];
        persist(next);
        return next;
      });
    });

    // Reset so selecting the same file again still fires onChange
    e.target.value = "";
  };

  const triggerUpload = () => fileInputRef.current?.click();

  const removeCurrent = () => {
    setImages((prev) => {
      const next = prev.filter((_, i) => i !== current);
      persist(next);
      setCurrent((c) => Math.min(c, Math.max(0, next.length - 1)));
      return next;
    });
  };

  const goPrev = () =>
    setCurrent((c) => (images.length > 1 ? (c - 1 + images.length) % images.length : c));
  const goNext = () =>
    setCurrent((c) => (images.length > 1 ? (c + 1) % images.length : c));

  const hasImages = images.length > 0;
  const displayImage = hasImages ? images[current] : project.image;
  const showNav = images.length > 1;

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-lg border border-border bg-[hsl(var(--project-card))] transition-colors hover:border-primary/50",
        className
      )}
    >
      {/* Screenshot area — visually prominent */}
      <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-border bg-[hsl(var(--project-screenshot))] p-2">
        <div className="relative h-full w-full overflow-hidden rounded border-2 border-[hsl(var(--project-screenshot-border))] bg-[hsl(var(--project-screenshot))]">
          {displayImage ? (
            <img
              src={displayImage}
              alt={`${project.title} screenshot${showNav ? ` ${current + 1} of ${images.length}` : ""}`}
              className="h-full w-full object-contain"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-6 text-center">
              <ImagePlus className="h-10 w-10 text-muted-foreground/60" />
              <p className="text-sm font-medium uppercase tracking-[0.15em] text-muted-foreground/70">
                Your Screenshot Here
              </p>
              <p className="text-xs text-muted-foreground/50">
                Upload one or more CRM project screenshots
              </p>
            </div>
          )}

          {/* Prev / Next — only when multiple screenshots */}
          {showNav && (
            <>
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous screenshot"
                className="absolute left-2 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background/70 text-foreground backdrop-blur-sm transition-colors hover:border-primary/50 hover:text-primary"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next screenshot"
                className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background/70 text-foreground backdrop-blur-sm transition-colors hover:border-primary/50 hover:text-primary"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail indicators — only when multiple screenshots */}
        {showNav && (
          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5">
            {images.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrent(i)}
                aria-label={`View screenshot ${i + 1}`}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === current
                    ? "w-5 bg-primary"
                    : "w-1.5 bg-muted-foreground/40 hover:bg-muted-foreground/70"
                )}
              />
            ))}
          </div>
        )}

        {/* Counter badge — only when multiple screenshots */}
        {showNav && (
          <span className="absolute bottom-4 right-4 z-10 rounded bg-background/70 px-2 py-0.5 text-[10px] font-medium tabular-nums text-muted-foreground backdrop-blur-sm">
            {current + 1} / {images.length}
          </span>
        )}

        {/* Owner-only upload control (hidden input + button) */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          aria-label={`Upload screenshots for ${project.title}`}
        />
        <div className="absolute right-3 top-3 z-10 flex items-center gap-1.5">
          <button
            type="button"
            onClick={triggerUpload}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background/80 px-2.5 py-1.5 text-xs font-medium text-foreground backdrop-blur-sm transition-colors hover:border-primary/50 hover:text-primary"
            title="Add screenshot(s) (owner only)"
          >
            <Upload className="h-3.5 w-3.5" />
            Upload Screenshot
          </button>
          {hasImages && (
            <button
              type="button"
              onClick={removeCurrent}
              className="inline-flex items-center rounded-md border border-border bg-background/80 px-2 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm transition-colors hover:border-destructive/50 hover:text-destructive"
              title="Remove current screenshot (owner only)"
              aria-label="Remove current screenshot"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <span className="mb-2 text-xs font-medium uppercase tracking-wide text-primary">
          {project.category}
        </span>
        <h3 className="mb-2 text-lg font-semibold text-foreground">
          {project.title}
        </h3>
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
          {project.description}
        </p>

        {/* Skills demonstrated */}
        <div className="mt-auto border-t border-border pt-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">
            Skills Demonstrated
          </p>
          <p className="mt-1 text-sm text-foreground">{project.skills}</p>
        </div>

        {/* Optional details button */}
        <button className="mt-4 inline-flex items-center gap-1.5 self-start text-sm font-medium text-primary transition-colors hover:text-primary/80">
          View Details
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </article>
  );
};

export default ProjectCard;