import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "react-router";
import Nav    from "~/components/layout/Nav";
import Cursor from "~/components/ui/Cursor";

/* ── Core styles — URUTAN PENTING ── */
import "~/styles/variables.css";
import "~/styles/base.css";
import "~/styles/animations.css";
import "~/styles/snap.css";
import "~/styles/nav.css";
import "~/styles/cursor.css";
import "~/styles/motion.css";

/* ── Section styles ── */
import "~/styles/hero.css";
import "~/styles/about.css";
import "~/styles/projects.css";
import "~/styles/skills.css";
import "~/styles/contact.css";

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  // Home page pakai snap-panel system (body harus dikunci full-viewport).
  // Project detail page (/projects/:slug) butuh scroll halaman normal.
  const isProjectPage = location.pathname.startsWith("/projects/");

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>RenoFebri — Game Tech & 3D Creator</title>

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&family=JetBrains+Mono:wght@300;400;500&display=swap"
          rel="stylesheet"
        />

        <Meta />
        <Links />
      </head>
      <body className={isProjectPage ? "route-project" : "route-home"}>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const location = useLocation();
  const isProjectPage = location.pathname.startsWith("/projects/");

  return (
    <>
      <Cursor />
      {/* Nav global hanya untuk home page.
          Project detail page (ForbiddenSpace, dll) sudah punya nav sendiri (.fs-nav),
          jadi tidak perlu Nav global yang akan numpuk di atasnya. */}
      {!isProjectPage && <Nav />}
      <Outlet />
    </>
  );
}