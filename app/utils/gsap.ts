/* ============================================================
   GSAP SETUP — single source of truth
   Semua komponen import gsap/useGSAP dari sini, bukan dari 'gsap' langsung.
   ============================================================ */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// ScrollTrigger didaftarkan sekarang walau belum dipakai —
// nanti kalau mau bikin efek scroll-linked di dalam panel
// About/Projects (yang scrollable), tinggal pakai aja.
gsap.registerPlugin(ScrollTrigger, useGSAP);

export { gsap, ScrollTrigger, useGSAP };