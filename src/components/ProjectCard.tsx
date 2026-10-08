import { useState, useEffect, useRef, useCallback } from "react";
import {
  ImagePlus,
  ArrowRight,
  Upload,
  ChevronLeft,
  ChevronRight,
  Trash2,
  ZoomIn,
  X,
} from "lucide-react";
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

// Published screenshots are real files inside:
// src/assets/project-screenshots/<project-id>/
const publishedImages = import.meta.glob(
  "../assets/project-screenshots/**/*.{png,jpg,jpeg,webp}",
  {
    eager: true,
    query: "?url",
    import: "default",
  }
) as Record<string, string>;

const getPublishedImages = (projectId: string): string[] => {
  const folderMarker = `project-screenshots/${projectId}/`;

  return Object.entries(publishedImages)
    .filter(([path]) => path.includes(folderMarker))
    .sort(([pathA], [pathB]) =>
      pathA.localeCompare(pathB, undefined, {
        numeric: true,
        sensitivity: "base",
      })
    )
    .map(([, url]) => url);
};

const ProjectCard = ({ project, className }: ProjectCardProps) => {
  const storageKey = `${STORAGE_PREFIX}${project.id}`;

  const permanentImages = getPublishedImages(project.id);

  const [draftImages, setDraftImages] = useState<string[]>([]);
  const [previewDrafts, setPreviewDrafts] = useState(
    permanentImages.length === 0
  );
  const [current, setCurrent] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load browser-only draft screenshots
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);

      if (stored) {
        const parsed = JSON.parse(stored) as string[];

        if (Array.isArray(parsed) && parsed.length > 0) {
          setDraftImages(parsed);

          // If there are no published screenshots yet,
          // drafts are useful as the initial display.
          if (permanentImages.length === 0) {
            setPreviewDrafts(true);
          }
        }
      }
    } catch {
      /* localStorage unavailable or corrupt — ignore */
    }
  }, [storageKey, permanentImages.length]);

  const persistDrafts = useCallback(
    (next: string[]) => {
      try {
        if (next.length > 0) {
          localStorage.setItem(storageKey, JSON.stringify(next));
        } else {
          localStorage.removeItem(storageKey);
        }
      } catch {
        /* storage full or unavailable */
      }
    },
    [storageKey]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);

    if (files.length === 0) return;

    const valid = files.filter((file) =>
      ["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(
        file.type
      )
    );

    if (valid.length === 0) return;

    const readers = valid.map(
      (file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader();

          reader.onload = () => {
            resolve(reader.result as string);
          };

          reader.readAsDataURL(file);
        })
    );

    Promise.all(readers).then((dataUrls) => {
      setDraftImages((prev) => {
        const next = [...prev, ...dataUrls];

        persistDrafts(next);

        return next;
      });

      // Immediately preview the newly uploaded drafts.
      setPreviewDrafts(true);
      setCurrent(0);
    });

    // Allow selecting the same file again later.
    e.target.value = "";
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const removeCurrentDraft = () => {
    setDraftImages((prev) => {
      const next = prev.filter((_, i) => i !== current);

      persistDrafts(next);

      setCurrent((c) => Math.min(c, Math.max(0, next.length - 1)));

      if (next.length === 0 && permanentImages.length > 0) {
        setPreviewDrafts(false);
        setCurrent(0);
      }

      return next;
    });
  };

  // Published images are the normal/default view.
  // Drafts become the display only when explicitly previewing them.
  const displayedImages =
    previewDrafts && draftImages.length > 0
      ? draftImages
      : permanentImages;

  const hasImages = displayedImages.length > 0;
  const showNav = displayedImages.length > 1;

  const displayImage = hasImages ? displayedImages[current] : project.image;

  const isShowingDrafts =
    previewDrafts && draftImages.length > 0;

  const hasPublishedImages = permanentImages.length > 0;
  const hasDraftImages = draftImages.length > 0;

  const goPrev = () =>
    setCurrent((c) =>
      displayedImages.length > 1
        ? (c - 1 + displayedImages.length) % displayedImages.length
        : c
    );

  const goNext = () =>
    setCurrent((c) =>
      displayedImages.length > 1
        ? (c + 1) % displayedImages.length
        : c
    );

  // When switching between Draft and Published,
  // always start at the first image.
  const showPublished = () => {
    setPreviewDrafts(false);
    setCurrent(0);
  };

  const showDrafts = () => {
    if (draftImages.length === 0) return;

    setPreviewDrafts(true);
    setCurrent(0);
  };

  return (
    <>
      <article
        className={cn(
          "group flex flex-col overflow-hidden rounded-lg border border-border bg-[hsl(var(--project-card))] transition-colors hover:border-primary/50",
          className
        )}
      >
        {/* Screenshot area */}
        <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-border bg-[hsl(var(--project-screenshot))] p-2">
          <div className="relative h-full w-full overflow-hidden rounded border-2 border-[hsl(var(--project-screenshot-border))] bg-[hsl(var(--project-screenshot))]">
            {displayImage ? (
              <div className="group/screenshot relative h-full w-full">
                <img
                  src={displayImage}
                  alt={`${project.title} screenshot${
                    showNav
                      ? ` ${current + 1} of ${displayedImages.length}`
                      : ""
                  }`}
                  className="h-full w-full cursor-zoom-in object-contain"
                  loading="lazy"
                  onClick={() => setIsViewerOpen(true)}
                />

                <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover/screenshot:opacity-100">
                  <span className="inline-flex items-center gap-2 rounded-md bg-background/90 px-3 py-2 text-sm font-medium text-foreground shadow-lg">
                    <ZoomIn className="h-4 w-4" />
                    Click to enlarge
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-6 text-center">
                <ImagePlus className="h-10 w-10 text-muted-foreground/60" />

                <p className="text-sm font-medium uppercase tracking-[0.15em] text-muted-foreground/70">
                  Your Screenshot Here
                </p>

                <p className="text-xs text-muted-foreground/50">
                  Upload one or more GoHighLevel project screenshots
                </p>
              </div>
            )}

            {/* Draft / Published status */}
            {isShowingDrafts && (
              <span className="absolute left-3 top-3 z-10 rounded-md border border-amber-500/30 bg-background/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-600 shadow-sm backdrop-blur-sm">
                Draft Preview
              </span>
            )}

            {/* Previous / Next */}
            {showNav && (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="Previous screenshot"
                  className="absolute left-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/70 text-foreground backdrop-blur-sm transition-colors hover:border-primary/50 hover:text-primary"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Next screenshot"
                  className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/70 text-foreground backdrop-blur-sm transition-colors hover:border-primary/50 hover:text-primary"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail indicators */}
          {showNav && (
            <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5">
              {displayedImages.map((_, i) => (
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

          {/* Counter */}
          {showNav && (
            <span className="absolute bottom-4 right-4 z-10 rounded bg-background/70 px-2 py-0.5 text-[10px] font-medium tabular-nums text-muted-foreground backdrop-blur-sm">
              {current + 1} / {displayedImages.length}
            </span>
          )}

          {/* Upload */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            aria-label={`Upload screenshots for ${project.title}`}
          />

          <div className="absolute right-3 top-3 z-10 flex flex-wrap items-center justify-end gap-1.5">
            <button
              type="button"
              onClick={triggerUpload}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background/80 px-2.5 py-1.5 text-xs font-medium text-foreground backdrop-blur-sm transition-colors hover:border-primary/50 hover:text-primary"
              title="Add draft screenshot(s)"
            >
              <Upload className="h-3.5 w-3.5" />
              Upload Screenshot
            </button>

            {/* Switch between Draft and Published */}
            {hasPublishedImages && hasDraftImages && (
              <>
                {isShowingDrafts ? (
                  <button
                    type="button"
                    onClick={showPublished}
                    className="inline-flex items-center rounded-md border border-border bg-background/80 px-2.5 py-1.5 text-xs font-medium text-foreground backdrop-blur-sm transition-colors hover:border-primary/50 hover:text-primary"
                  >
                    View Published
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={showDrafts}
                    className="inline-flex items-center rounded-md border border-amber-500/30 bg-background/80 px-2.5 py-1.5 text-xs font-medium text-amber-600 backdrop-blur-sm transition-colors hover:border-amber-500/60"
                  >
                    Preview Draft
                  </button>
                )}
              </>
            )}

            {/* Delete only affects drafts */}
            {isShowingDrafts && hasDraftImages && (
              <button
                type="button"
                onClick={removeCurrentDraft}
                className="inline-flex items-center rounded-md border border-border bg-background/80 px-2 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm transition-colors hover:border-destructive/50 hover:text-destructive"
                title="Remove current draft screenshot"
                aria-label="Remove current draft screenshot"
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

            <p className="mt-1 text-sm text-foreground">
              {project.skills}
            </p>
          </div>

          {/* Optional details button */}
          <button className="mt-4 inline-flex items-center gap-1.5 self-start text-sm font-medium text-primary transition-colors hover:text-primary/80">
            View Details
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </article>

      {/* Screenshot lightbox / viewer */}
      {isViewerOpen && displayImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} screenshot viewer`}
          onClick={() => setIsViewerOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsViewerOpen(false)}
            aria-label="Close screenshot viewer"
            className="absolute right-4 top-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full bg-background/90 text-foreground shadow-lg transition-colors hover:bg-background"
          >
            <X className="h-5 w-5" />
          </button>

          {showNav && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                aria-label="Previous screenshot"
                className="absolute left-4 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-foreground shadow-lg transition-colors hover:bg-background"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                aria-label="Next screenshot"
                className="absolute right-4 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-foreground shadow-lg transition-colors hover:bg-background"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <img
            src={displayImage}
            alt={`${project.title} enlarged screenshot${
              showNav
                ? ` ${current + 1} of ${displayedImages.length}`
                : ""
            }`}
            className="max-h-[90vh] max-w-[92vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {showNav && (
            <span className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded bg-background/90 px-3 py-1 text-xs font-medium tabular-nums text-foreground shadow-lg">
              {current + 1} / {displayedImages.length}
            </span>
          )}
        </div>
      )}
    </>
  );
};

export default ProjectCard;