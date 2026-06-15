/* ================================================
   PROJECT CARD — mirror 1:1 vanilla projects-render.js
   
   Struktur:
   .project-card[featured?]
     .project-preview
       img.project-preview-img
       video.project-preview-video (opsional)
       .project-preview-overlay
       .project-preview-noise
       [canvas.project3d-canvas jika ada glb]
     .project-card-body
       .project-card-top   (num + status)
       .project-category
       h3.project-title
       p.project-desc
       .project-tags
       .project-card-footer  (link)
     .card-tilt-glow
   
   Three.js canvas per-card DINONAKTIFKAN —
   diganti dengan preview image + hover overlay sederhana
   agar konsisten dengan vanilla dan tidak berat.
================================================ */

import { useEffect, useRef, useCallback } from 'react';
import type { Project } from '~/data/projects';

interface ProjectCardProps {
  project: Project;
  index:   number;
}

const MAX_TILT = 7;

export function ProjectCard({ project, index }: ProjectCardProps) {
  const cardRef  = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  /* ── 3D Tilt on hover (mirror motion.js initCardTilt) ── */
  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const dx   = (e.clientX - cx) / (rect.width  / 2);
    const dy   = (e.clientY - cy) / (rect.height / 2);
    const rotX = -dy * MAX_TILT;
    const rotY =  dx * MAX_TILT;
    card.style.transform = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-3px)`;
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
    /* Pause video saat mouse leave */
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, []);

  const onMouseEnter = useCallback(() => {
    /* Play video saat hover (jika ada, dan tidak punya GLB) */
    if (videoRef.current && !project.modelPath) {
      videoRef.current.play().catch(() => {});
    }
  }, [project.modelPath]);

  /* ── Helpers ── */
  const num         = String(index + 1).padStart(2, '0');
  const isFeatured  = project.featured === true;
  const accentColor = project.accentColor ?? 'var(--accent-primary)';
  const delay       = Math.min(index + 1, 5);
  const hasImage    = !!project.previewImage;
  const hasVideo    = !!project.previewVideo;
  const hasGlb      = !!project.modelPath;

  /* Status badge class */
  const statusClass: Record<string, string> = {
    completed: 'completed',
    wip:       'wip',
    archived:  'archived',
    concept:   'concept',
  };
  const statusCls = statusClass[project.status ?? 'completed'] ?? 'completed';

  /* Link */
  const linkHref   = project.link ?? project.itchLink ?? project.detailPath ?? '#';
  const hasLink    = !!(project.link ?? project.itchLink ?? project.detailPath);
  const linkLabel  = project.link       ? 'View Project'
                   : project.itchLink   ? 'Play on itch.io'
                   : project.detailPath ? 'Case Study'
                   : 'Coming Soon';

  return (
    <div
      ref={cardRef}
      className={[
        'project-card',
        'reveal',
        `reveal-delay-${delay}`,
        isFeatured ? 'featured' : '',
      ].filter(Boolean).join(' ')}
      data-category={project.category}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onMouseEnter={onMouseEnter}
    >
      {/* ── Decorative bg number (featured only) ── */}
      {isFeatured && (
        <span className="project-bg-num" aria-hidden="true">{num}</span>
      )}

      {/* ══════════════════════════════════════
          PREVIEW BLOCK
          Mirror persis output buildPreview() vanilla
      ══════════════════════════════════════ */}
      {hasImage || hasVideo ? (
        /* Normal preview dengan image / video */
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

          {/* Video — autoplay on hover, hidden jika ada GLB */}
          {hasVideo && !hasGlb && (
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

          {/* Noise grain */}
          <div className="project-preview-noise" aria-hidden="true" />
        </div>
      ) : (
        /* Placeholder — tidak ada image maupun video */
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

      {/* ══════════════════════════════════════
          CARD BODY
      ══════════════════════════════════════ */}
      <div className="project-card-body">

        {/* Top row: project number + status badge */}
        <div className="project-card-top">
          <span className="project-num">Project {num}</span>
          <span className={`project-status ${statusCls}`}>
            {project.statusLabel ?? project.status ?? 'Completed'}
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
          {(project.tags ?? []).map(tag => (
            <span key={tag} className="project-tag">{tag}</span>
          ))}
        </div>

        {/* Footer: link */}
        <div className="project-card-footer">
          <a
            href={linkHref}
            className={`project-link${!hasLink ? ' disabled' : ''}`}
            {...(hasLink && linkHref.startsWith('http')
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : {})}
          >
            {linkLabel} <span className="project-link-arrow">&#8594;</span>
          </a>
        </div>

      </div>{/* end .project-card-body */}

      {/* Tilt inner glow */}
      <div className="card-tilt-glow" aria-hidden="true" />

    </div>
  );
}