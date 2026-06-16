import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
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
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>RenoFebri — Game Tech & 3D Creator</title>

        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&family=JetBrains+Mono:wght@300;400;500&display=swap"
          rel="stylesheet"
        />

        {/* EmailJS SDK */}
        <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js" />

        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <>
      {/* Cursor: renders nothing in DOM, injects dot+ring directly into body via useEffect */}
      <Cursor />
      <Nav />
      <Outlet />
    </>
  );
}