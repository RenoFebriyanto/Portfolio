import { useParams } from 'react-router';
import { projects }  from '~/data/projects';

/* Per-project detail components */
import { ForbiddenSpaceDetail } from '~/components/project-pages/ForbiddenSpace';
import { BiographHorizonDetail } from '~/components/project-pages/BiographHorizon';

const PROJECT_PAGES: Record<string, React.ComponentType> = {
  'forbidden-space': ForbiddenSpaceDetail,
  'biographhorizon':  BiographHorizonDetail,
};

export default function ProjectSlug() {
  const { slug } = useParams<{ slug: string }>();
  const project  = projects.find(p => p.slug === slug);

  if (!project) {
    return (
      <div style={{ padding: '120px 40px', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', letterSpacing: '0.1em' }}>
          PROJECT NOT FOUND
        </p>
        <a href="/" style={{ color: 'var(--accent-primary)', marginTop: '24px', display: 'inline-block' }}>
          ← Back to Portfolio
        </a>
      </div>
    );
  }

  const DetailComponent = slug ? PROJECT_PAGES[slug] : undefined;

  if (DetailComponent) return <DetailComponent />;

  // Generic fallback detail page
  return (
    <div style={{ padding: '120px 40px 60px', maxWidth: '800px', margin: '0 auto' }}>
      <a
        href="/"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          letterSpacing: '0.08em',
          color: 'var(--color-text-muted)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '40px',
          transition: 'color 0.2s',
        }}
      >
        ← Back to Portfolio
      </a>

      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.12em', color: 'var(--accent-primary)', marginBottom: '12px' }}>
        {project.categoryLabel.toUpperCase()}
      </p>

      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(3rem, 8vw, 6rem)',
        fontWeight: 800,
        textTransform: 'uppercase',
        lineHeight: 0.95,
        marginBottom: '32px',
        color: 'var(--text-primary)',
      }}>
        {project.title}
      </h1>

      <p style={{ fontSize: '1.1rem', fontWeight: 300, lineHeight: 1.75, color: 'var(--text-secondary)', marginBottom: '40px' }}>
        {project.description}
      </p>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '48px' }}>
        {project.tags.map(tag => (
          <span
            key={tag}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              letterSpacing: '0.08em',
              color: 'var(--color-text-muted)',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              padding: '4px 12px',
              borderRadius: '3px',
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {project.link && (
          <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn-primary">
            View Project ↗
          </a>
        )}
        {project.itchLink && (
          <a href={project.itchLink} target="_blank" rel="noopener noreferrer" className="btn-primary">
            Play on itch.io ↗
          </a>
        )}
        {project.githubLink && (
          <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="btn-secondary">
            GitHub →
          </a>
        )}
      </div>
    </div>
  );
}
