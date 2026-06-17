import type { Config } from '@react-router/dev/config';

export default {
  // Portfolio bersifat konten-statis & berat di Three.js/canvas client-side,
  // jadi SSR dimatikan -> build sebagai SPA (lebih cocok untuk Vercel static
  // atau Cloudflare Pages, dan menghindari mismatch saat hydration WebGL).
  ssr: false,
} satisfies Config;