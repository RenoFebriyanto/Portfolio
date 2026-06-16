// Portfolio-migrasi/app/components/sections/ProjectCard.tsx
import { useRef, useCallback } from 'react';
import type { Project } from '~/components/sections/Projects';

interface ProjectCardProps {
  project: Project;
  index:   number;
  hidden?: boolean;
}

const MAX_TILT = 7;

export function ProjectCard({ project, index, hidden = false }: ProjectCardProps) {
  const cardRef  = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  /* ── 3D Tilt (mirrors motion.js initCardTilt) ── */
  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const dx   = (e.clientX - cx) / (rect.width  / 2);
    const dy   = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `perspective(700px) rotateX(${-dy * MAX_TILT}deg) rotateY(${dx * MAX_TILT}deg) translateY(-3px)`;
    card.classList.add('tilting');
    const glow = card.querySelector<HTMLElement>('.card-tilt-glow');
    if (glow) {
      const gx = ((e.clientX - rect.left) / rect.width)  * 100;
      const gy = ((e.clientY - rect.top)  / rect.height) * 100;
      glow.style.setProperty('--glow-x', `${gx}%`);
      glow.style.setProperty('--glow-y', `${gy}%`);
    }
  }, []);

  const onMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = '';
    card.classList.remove('tilting');
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, []);

  const onMouseEnter = useCallback(() => {
    if (videoRef.current && project.previewVideo && !project.modelPath) {
      videoRef.current.play().catch(() => {});
    }
  }, [project.modelPath, project.previewVideo]);

  /* ── Derived values ── */
  const num         = String(project.id).padStart(2, '0');
  const isFeatured  = project.featured === true;
  const accentColor = project.accentColor ?? 'var(--accent-primary)';
  const revealDelay = Math.min(index + 1, 5);
  const hasImage    = !!project.previewImage;
  const hasVideo    = !!project.previewVideo;
  const statusClass = project.status ?? 'completed';

  /* ── Link logic — mirrors vanilla exactly ── */
  const hasLink    = !!(project.link ?? project.itchLink ?? project.detailPath);
  const linkHref   = project.link ?? project.itchLink ?? project.detailPath ?? '#';
  const isExternal = hasLink && (linkHref.startsWith('http') || linkHref.startsWith('//'));
  const linkLabel  = project.link
    ? 'View Project'
    : project.itchLink
      ? 'Play on itch.io'
      : project.detailPath
        ? 'Case Study'
        : 'Coming Soon';

  /* ── Card class — mirrors vanilla exactly ── */
  const cardClasses = [
    'project-card',
    'reveal',
    `reveal-delay-${revealDelay}`,
    isFeatured ? 'featured' : '',
    hidden     ? 'hidden'   : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={cardRef}
      className={cardClasses}
      data-category={project.category}
      data-project-id={project.id}
      data-has-video={String(hasVideo)}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onMouseEnter={onMouseEnter}
    >
      {/* Decorative bg number — featured only */}
      {isFeatured && (
        <span className="project-bg-num" aria-hidden="true">{num}</span>
      )}

      {/* ══ PREVIEW BLOCK ══ */}
      {hasImage || hasVideo ? (
        <div
          className="project-preview"
          style={{ '--preview-color': accentColor } as React.CSSProperties}
        >
          {/* Image */}
          {hasImage && (
            <img
              className="project-preview-img"
              src={project.previewImage}
              alt={`${project.title} preview`}
              loading="lazy"
              draggable={false}
            />
          )}

          {/* Video — only when no GLB model */}
          {hasVideo && !project.modelPath && (
            <video
              ref={videoRef}
              className="project-preview-video"
              src={project.previewVideo}
              muted
              playsInline
              loop
              preload="none"
              aria-hidden="true"
            />
          )}

          {/* Gradient overlay */}
          <div
            className="project-preview-overlay"
            style={{ '--preview-color': accentColor } as React.CSSProperties}
          />
          {/* Grain noise */}
          <div className="project-preview-noise" aria-hidden="true" />
        </div>
      ) : (
        /* ── PLACEHOLDER when no image/video ── */
        <div
          className="project-preview project-preview--placeholder"
          style={{ '--preview-color': accentColor } as React.CSSProperties}
        >
          <div className="project-preview-placeholder-inner">
            <span className="project-preview-placeholder-num">{num}</span>
            <span className="project-preview-placeholder-cat">{project.categoryLabel}</span>
          </div>
          <div className="project-preview-noise" aria-hidden="true" />
        </div>
      )}

      {/* ══ CARD BODY ══ */}
      <div className="project-card-body">

        {/* Top row: project number + status badge */}
        <div className="project-card-top">
          <span className="project-num">Project {num}</span>
          <span className={`project-status ${statusClass}`}>
            {project.statusLabel}
          </span>
        </div>

        {/* Category */}
        <div className="project-category">{project.categoryLabel}</div>

        {/* Title */}
        <h3 className="project-title">{project.title}</h3>

        {/* Description */}
        <p className="project-desc">{project.description}</p>

        {/* Tech tags */}
        <div className="project-tags">
          {project.tags.map(tag => (
            <span key={tag} className="project-tag">{tag}</span>
          ))}
        </div>

        {/* Footer: link */}
        <div className="project-card-footer">
          {hasLink ? (
            isExternal ? (
              <a
                href={linkHref}
                className="project-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                {linkLabel} <span className="project-link-arrow">&#8594;</span>
              </a>
            ) : (
              <a href={linkHref} className="project-link">
                {linkLabel} <span className="project-link-arrow">&#8594;</span>
              </a>
            )
          ) : (
            <span className="project-link disabled">
              {linkLabel} <span className="project-link-arrow">&#8594;</span>
            </span>
          )}
        </div>

      </div>{/* end .project-card-body */}

      {/* Tilt inner glow */}
      <div className="card-tilt-glow" aria-hidden="true" />

    </div>
  );
}