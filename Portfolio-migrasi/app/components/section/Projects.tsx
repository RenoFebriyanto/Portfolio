import { useState } from 'react';
import { projects, categories } from '~/data/projects';
import { ProjectScene } from '~/components/three/ProjectScene';

export function Projects() {
  const [active, setActive] = useState<string>('all');

  const filtered = active === 'all'
    ? projects
    : projects.filter(p => p.category === active);

  return (
    <section className="section scrollable projects" id="projects">
      <div className="container">
        <div className="projects__inner">

          <div className="projects__header">
            <div>
              <p className="section-label">02 — Work</p>
              <h2 className="section-heading">Projects</h2>
            </div>

            {/* Filter tabs */}
            <div className="projects__filters">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`projects__filter${active === cat ? ' active' : ''}`}
                  onClick={() => setActive(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="projects__grid reveal-stagger">
            {filtered.map(project => (
              <article className="project-card" key={project.slug}>

                {/* Three.js preview */}
                <div className="project-card__preview">
                  <ProjectScene
                    sceneType={project.sceneType}
                    className="project-card__canvas"
                  />

                  {/* Hover overlay */}
                  <div className="project-card__overlay">
                    {project.link && (
                      <a
                        className="project-card__action"
                        href={project.link}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Live ↗
                      </a>
                    )}
                    {project.githubLink && (
                      <a
                        className="project-card__action"
                        href={project.githubLink}
                        target="_blank"
                        rel="noreferrer"
                      >
                        GitHub ↗
                      </a>
                    )}
                    {project.itchLink && (
                      <a
                        className="project-card__action"
                        href={project.itchLink}
                        target="_blank"
                        rel="noreferrer"
                      >
                        itch.io ↗
                      </a>
                    )}
                    {/* Fallback if no links yet */}
                    {!project.link && !project.githubLink && !project.itchLink && (
                      <span className="project-card__action">Coming Soon</span>
                    )}
                  </div>
                </div>

                {/* Body */}
                <div className="project-card__body">
                  <p className="project-card__category">{project.category}</p>
                  <h3 className="project-card__title">{project.title}</h3>
                  <p className="project-card__desc">{project.description}</p>
                  <div className="project-card__tags">
                    {project.tags.map(tag => (
                      <span className="project-card__tag" key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>

              </article>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}