import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  type LinksFunction,
} from 'react-router';

import variables from '~/styles/variables.css?url';
import base from '~/styles/base.css?url';
import animations from '~/styles/animations.css?url';
import motion from '~/styles/motion.css?url';
import cursor from '~/styles/cursor.css?url';
import nav from '~/styles/nav.css?url';
import hero from '~/styles/hero.css?url';
import about from '~/styles/about.css?url';
import projects from '~/styles/projects.css?url';
import skills from '~/styles/skills.css?url';
import contact from '~/styles/contact.css?url';

import { Cursor } from '~/components/ui/Cursor';

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=JetBrains+Mono:wght@300;400;500&display=swap',
  },
  // Load order matters: tokens -> base/reset -> animations -> motion ->
  // cursor -> per-section styles
  { rel: 'stylesheet', href: variables },
  { rel: 'stylesheet', href: base },
  { rel: 'stylesheet', href: animations },
  { rel: 'stylesheet', href: motion },
  { rel: 'stylesheet', href: cursor },
  { rel: 'stylesheet', href: nav },
  { rel: 'stylesheet', href: hero },
  { rel: 'stylesheet', href: about },
  { rel: 'stylesheet', href: projects },
  { rel: 'stylesheet', href: skills },
  { rel: 'stylesheet', href: contact },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {/* Background layers — fixed, behind everything */}
        <div className="bg-grid" aria-hidden="true" />
        <div className="bg-glow-top" aria-hidden="true" />

        {/* Custom ring + dot cursor (desktop only) */}
        <Cursor />

        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: { error: unknown }) {
  let title = 'Unexpected Error';
  let message = 'Something went wrong while loading this page.';

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`;
    message =
      error.status === 404
        ? "The page you're looking for doesn't exist."
        : message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div
      style={{
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        textAlign: 'center',
        padding: '24px',
        fontFamily: 'var(--font-body, sans-serif)',
        background: 'var(--color-bg, #04040A)',
        color: 'var(--color-text-primary, #F0F0F0)',
      }}
    >
      <h1 style={{ fontFamily: 'var(--font-display, sans-serif)', fontSize: '2.5rem', margin: 0 }}>
        {title}
      </h1>
      <p style={{ color: 'var(--color-text-secondary, #8A8A9A)', margin: 0 }}>{message}</p>
      <a
        href="/"
        style={{
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: '0.8rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--color-accent, #FF6B35)',
          border: '1px solid var(--color-accent, #FF6B35)',
          padding: '10px 24px',
          borderRadius: '4px',
        }}
      >
        ← Back Home
      </a>
    </div>
  );
}