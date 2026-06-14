import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { useEffect } from "react";
import Nav from "~/components/layout/Nav";
import Footer from "~/components/layout/Footer";
import Cursor from "~/components/ui/Cursor";
import { useCursor } from "~/hooks/useCursor";

import "~/styles/variables.css";
import "~/styles/base.css";
import "~/styles/nav.css";
import "~/styles/cursor.css";
import "~/styles/motion.css";
import "~/styles/animations.css";

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
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { cursorPos, cursorVariant } = useCursor();

  return (
    <>
      <Cursor position={cursorPos} variant={cursorVariant} />
      <Nav />
      <main className="scroll-container">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}