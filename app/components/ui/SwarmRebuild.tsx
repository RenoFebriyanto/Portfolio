import { useEffect, useRef } from "react";

type TargetKind = "text" | "box" | "object";

interface BuildTarget {
  element: HTMLElement;
  kind: TargetKind;
}

interface BuildTask {
  target: BuildTarget;
  startsAt: number;
  duration: number;
  released: boolean;
}

interface SwarmAgent {
  x: number;
  y: number;
  angle: number;
  speed: number;
  radius: number;
  tasks: BuildTask[];
}

const AGENT_COUNT = 12;
const TASK_DURATION = 460;
const TASK_STAGGER = 55;
const TASK_GAP = 70;
const TEXT_SELECTOR = [
  "h1",
  "h2",
  "h3",
  "h4",
  "p",
  "li",
  "blockquote",
  "figcaption",
  ".about-identity-name",
  ".about-identity-role",
  ".about-identity-meta-label",
  ".about-identity-meta-val",
  ".stat-num",
  ".stat-label",
  ".about-status-text",
  ".about-status-tag",
  ".hero-status-text",
  ".section-label-text",
  ".contact-eyebrow",
  ".fs-eyebrow",
  ".fs-story__heading",
  ".fs-story__p",
  ".fs-video-caption",
  ".fs-contrib-card__title",
  ".fs-contrib-card__desc",
  ".fs-team-card__name",
  ".fs-team-card__role",
].join(",");
const INLINE_TEXT_SELECTOR = "span,strong,em,small,label";
const BOX_SELECTOR = [
  "a",
  "button",
  "img",
  "svg",
  "video",
  "canvas#hero-3d-canvas",
  ".hero-object",
  ".hero-scene-background",
  ".reveal",
  ".hero-status",
  ".section-label",
  ".tag",
  ".project-card",
  ".stat-card",
  ".skill-group",
  ".about-identity",
  ".about-doing-chip",
  ".about-status",
  ".contact-form-wrap",
  ".fs-reveal",
  ".fs-contrib-card",
  ".fs-team-grid",
].join(",");
const TARGET_SELECTOR = `${TEXT_SELECTOR},${BOX_SELECTOR}`;
const BUILD_CONTAINER_SELECTOR = [
  ".reveal",
  ".hero-status",
  ".section-label",
  ".tag",
  ".project-card",
  ".stat-card",
  ".skill-group",
  ".about-identity",
  ".about-doing-chip",
  ".about-status",
  ".contact-form-wrap",
  ".fs-reveal",
  ".fs-contrib-card",
  ".fs-team-grid",
  "a",
  "button",
].join(",");

const getPanel = (panelId: string | null) =>
  panelId ? document.getElementById(panelId) : null;

const getTargetKind = (element: HTMLElement): TargetKind => {
  if (element.matches(TEXT_SELECTOR)) return "text";
  if (
    element.matches(
      "img,svg,video,canvas,.hero-object,.hero-scene-background",
    )
  ) {
    return "object";
  }
  if (element.matches(BOX_SELECTOR)) return "box";
  return "object";
};

const getBuildRoots = (root: HTMLElement) => {
  const candidates = Array.from(root.querySelectorAll<HTMLElement>(TARGET_SELECTOR));
  const candidateSet = new Set(candidates);
  return candidates.filter((element) => {
    const buildContainer = element.parentElement?.closest(BUILD_CONTAINER_SELECTOR);
    return !(buildContainer instanceof HTMLElement && candidateSet.has(buildContainer));
  });
};

const collectTargets = (
  panelId: string | null,
  builtElements: WeakSet<HTMLElement>,
  force: boolean,
) => {
  const root = getPanel(panelId) ?? document.body;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  return getBuildRoots(root)
    .filter((element) => {
      if (builtElements.has(element) && !force) return false;
      if (element.closest("[hidden], [aria-hidden='true']")) return false;

      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      const opacity = Number.parseFloat(style.opacity);
      const waitingForReveal =
        element.matches(".reveal, .fs-reveal") ||
        element.classList.contains("swarm-unbuilt");
      return (
        rect.width > 2 &&
        rect.height > 2 &&
        rect.right > 0 &&
        rect.bottom > 0 &&
        rect.left < viewportWidth &&
        rect.top < viewportHeight &&
        style.display !== "none" &&
        (style.visibility !== "hidden" || element.classList.contains("swarm-unbuilt")) &&
        (waitingForReveal || opacity > 0.02)
      );
    })
    .map((element) => ({ element, kind: getTargetKind(element) }))
    .sort((left, right) => {
      const leftRect = left.element.getBoundingClientRect();
      const rightRect = right.element.getBoundingClientRect();
      return leftRect.top - rightRect.top || leftRect.left - rightRect.left;
    });
};

export function SwarmRebuild() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reducedMotion.matches) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    let frameId = 0;
    let pointerInside = true;
    let pointerX = width / 2;
    let pointerY = height / 2;
    let panelId =
      document.querySelector<HTMLElement>("[data-panel-id][data-visible='true']")
        ?.dataset.panelId ?? "hero";
    let scrollTimer = 0;
    let sectionTimer = 0;
    let initialTimer = 0;
    let runEndsAt = 0;
    let activeRun = false;
    let runNotifiesSection = false;
    const builtElements = new WeakSet<HTMLElement>();
    const pendingElements = new Set<HTMLElement>();
    const pendingVisibility = new Map<HTMLElement, boolean>();
    const typingListeners = new Map<HTMLElement, (event: AnimationEvent) => void>();
    const agents: SwarmAgent[] = Array.from({ length: AGENT_COUNT }, (_, index) => ({
      x: pointerX,
      y: pointerY,
      angle: (Math.PI * 2 * index) / AGENT_COUNT,
      speed: 0.00055 + Math.random() * 0.00018,
      radius: 25 + Math.random() * 26,
      tasks: [],
    }));

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const animateTypedText = (element: HTMLElement, delay = 0) => {
      const textLength = (element.textContent ?? "").trim().length;
      if (!textLength) return;

      const previousListener = typingListeners.get(element);
      if (previousListener) element.removeEventListener("animationend", previousListener);
      element.style.setProperty("--swarm-type-steps", String(textLength));
      element.style.setProperty(
        "--swarm-type-duration",
        `${Math.min(900, Math.max(220, textLength * 15))}ms`,
      );
      element.style.animationDelay = `${delay}ms`;
      const onTypeEnd = (event: AnimationEvent) => {
        if (event.target !== element || event.animationName !== "swarm-text-type") return;
        element.classList.remove("swarm-type-text");
        element.style.removeProperty("--swarm-type-steps");
        element.style.removeProperty("--swarm-type-duration");
        element.style.animationDelay = "";
        element.removeEventListener("animationend", onTypeEnd);
        typingListeners.delete(element);
      };
      typingListeners.set(element, onTypeEnd);
      element.addEventListener("animationend", onTypeEnd);
      element.classList.remove("swarm-type-text");
      void element.offsetWidth;
      element.classList.add("swarm-type-text");
    };

    const animateBoxText = (element: HTMLElement) => {
      const blockText = Array.from(
        element.querySelectorAll<HTMLElement>(TEXT_SELECTOR),
      );
      blockText.forEach((text, index) => {
        animateTypedText(text, Math.min(index * 28, 180));
      });

      const inlineText = Array.from(
        element.querySelectorAll<HTMLElement>(INLINE_TEXT_SELECTOR),
      ).filter(
        (text) =>
          !text.parentElement?.closest(INLINE_TEXT_SELECTOR) &&
          !text.closest(TEXT_SELECTOR),
      );
      if (blockText.length === 0 && inlineText.length === 0) {
        animateTypedText(element);
        return;
      }
      inlineText.forEach((text, index) => {
        animateTypedText(text, Math.min((blockText.length + index) * 28, 180));
      });
    };

    const finishTarget = (target: BuildTarget) => {
      const { element, kind } = target;
      element.classList.remove("swarm-build-pending");
      element.classList.remove("swarm-unbuilt");
      pendingElements.delete(element);
      pendingVisibility.delete(element);
      builtElements.add(element);
      element.classList.add("swarm-built");
      if (element.matches(".reveal")) element.classList.add("visible");
      element.querySelectorAll<HTMLElement>(".reveal").forEach((child) => {
        child.classList.add("swarm-built", "visible");
      });

      if (kind === "text") {
        animateTypedText(element);
      } else {
        animateBoxText(element);
      }
      element.dispatchEvent(new CustomEvent("swarm:built", { bubbles: true }));
    };

    const clearPending = () => {
      pendingElements.forEach((element) => {
        element.classList.remove("swarm-build-pending");
        element.classList.remove("swarm-built");
        if (pendingVisibility.get(element)) element.classList.add("visible");
      });
      pendingElements.clear();
      pendingVisibility.clear();
      agents.forEach((agent) => {
        agent.tasks = [];
      });
    };

    const startBuild = (
      nextPanelId: string | null,
      force: boolean,
      notifySection: boolean,
    ) => {
      const shouldNotifySection =
        notifySection ||
        (activeRun && runNotifiesSection && (!nextPanelId || nextPanelId === panelId));
      panelId = nextPanelId ?? panelId;
      clearPending();
      activeRun = false;

      if (panelId === "hero") {
        runNotifiesSection = false;
        window.dispatchEvent(
          new CustomEvent("swarm:buildcomplete", { detail: { id: panelId } }),
        );
        if (shouldNotifySection) {
          window.dispatchEvent(
            new CustomEvent("swarm:sectionbuilt", { detail: { id: panelId } }),
          );
        }
        return;
      }

      const panel = getPanel(panelId);
      if (force && panel) {
        getBuildRoots(panel).forEach((element) => {
          element.classList.add("swarm-unbuilt");
          element.classList.remove("swarm-built");
        });
      }

      const targets = collectTargets(panelId, builtElements, force);
      runNotifiesSection = shouldNotifySection;
      if (!targets.length) {
        window.dispatchEvent(
          new CustomEvent("swarm:buildcomplete", { detail: { id: panelId } }),
        );
        if (shouldNotifySection) {
          window.dispatchEvent(
            new CustomEvent("swarm:sectionbuilt", { detail: { id: panelId } }),
          );
        }
        return;
      }

      const now = performance.now();
      activeRun = true;
      targets.forEach((target, index) => {
        const agentIndex = index % AGENT_COUNT;
        const round = Math.floor(index / AGENT_COUNT);
        pendingVisibility.set(
          target.element,
          target.element.classList.contains("visible"),
        );
        target.element.classList.remove("visible", "swarm-built");
        pendingElements.add(target.element);
        target.element.classList.add("swarm-build-pending");
        agents[agentIndex].tasks.push({
          target,
          startsAt: now + 90 + round * (TASK_DURATION + TASK_GAP) + agentIndex * TASK_STAGGER,
          duration: TASK_DURATION,
          released: false,
        });
      });

      const latestTaskStart = Math.max(
        ...agents.flatMap((agent) => agent.tasks.map((task) => task.startsAt)),
      );
      runEndsAt = latestTaskStart + TASK_DURATION + 260;
      requestFrame();
    };

    const easeInOut = (value: number) =>
      value < 0.5
        ? 4 * value * value * value
        : 1 - Math.pow(-2 * value + 2, 3) / 2;

    const drawRoundedRect = (rect: DOMRect, radius: number) => {
      const r = Math.min(radius, rect.width / 2, rect.height / 2);
      context.beginPath();
      context.moveTo(rect.left + r, rect.top);
      context.lineTo(rect.right - r, rect.top);
      context.quadraticCurveTo(rect.right, rect.top, rect.right, rect.top + r);
      context.lineTo(rect.right, rect.bottom - r);
      context.quadraticCurveTo(rect.right, rect.bottom, rect.right - r, rect.bottom);
      context.lineTo(rect.left + r, rect.bottom);
      context.quadraticCurveTo(rect.left, rect.bottom, rect.left, rect.bottom - r);
      context.lineTo(rect.left, rect.top + r);
      context.quadraticCurveTo(rect.left, rect.top, rect.left + r, rect.top);
      context.closePath();
    };

    const drawAgent = (agent: SwarmAgent, time: number) => {
      context.save();
      context.translate(agent.x, agent.y);
      context.rotate(agent.angle + Math.PI / 2);
      context.strokeStyle = "rgba(255, 138, 76, 0.86)";
      context.fillStyle = "rgba(255, 183, 132, 0.98)";
      context.lineWidth = 1.15;
      context.beginPath();
      context.moveTo(0, -5.5);
      context.lineTo(3.3, 4);
      context.lineTo(0, 2.1);
      context.lineTo(-3.3, 4);
      context.closePath();
      context.fill();
      context.stroke();
      context.restore();

      const task = agent.tasks.find(
        (candidate) =>
          !candidate.released &&
          time >= candidate.startsAt &&
          time <= candidate.startsAt + candidate.duration,
      );
      if (!task) return;

      const progress = Math.min((time - task.startsAt) / task.duration, 1);
      const travelProgress = easeInOut(Math.min(progress / 0.54, 1));
      const rect = task.target.element.getBoundingClientRect();
      const targetX = rect.left + rect.width / 2;
      const targetY = rect.top + rect.height / 2;
      const orbitX = pointerX + Math.cos(agent.angle) * agent.radius;
      const orbitY = pointerY + Math.sin(agent.angle) * agent.radius;
      agent.x = orbitX + (targetX - orbitX) * travelProgress;
      agent.y = orbitY + (targetY - orbitY) * travelProgress;

      if (progress >= 0.54) {
        const scanProgress = Math.min((progress - 0.54) / 0.46, 1);
        const scanY = rect.top + rect.height * scanProgress;
        const styles = window.getComputedStyle(task.target.element);
        const parsedRadius = Number.parseFloat(styles.borderTopLeftRadius) || 0;
        const shapeRect = rect;
        const perimeter = Math.max(1, (shapeRect.width + shapeRect.height) * 2);
        const revealLength = perimeter * scanProgress;

        context.save();
        context.strokeStyle = `rgba(255, 170, 113, ${0.88 - scanProgress * 0.32})`;
        context.lineWidth = task.target.kind === "text" ? 1 : 1.5;
        context.setLineDash([revealLength, perimeter]);
        context.lineDashOffset = 0;
        drawRoundedRect(shapeRect, parsedRadius);
        context.stroke();
        context.setLineDash([]);

        context.strokeStyle = `rgba(255, 193, 145, ${0.82 * (1 - scanProgress * 0.4)})`;
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(rect.left, scanY);
        context.lineTo(rect.right, scanY);
        context.stroke();
        context.restore();
      }

      if (progress >= 1 && !task.released) {
        task.released = true;
        task.target.element.classList.remove("swarm-build-pending");
        pendingElements.delete(task.target.element);
        finishTarget(task.target);
      }
    };

    const tick = (time: number) => {
      context.clearRect(0, 0, width, height);
      agents.forEach((agent) => {
        agent.angle += agent.speed * 16;
        agent.tasks.forEach((task) => {
          if (!task.released && time >= task.startsAt + task.duration) {
            task.released = true;
            finishTarget(task.target);
          }
        });
        const activeTask = agent.tasks.find(
          (task) =>
            !task.released &&
            time >= task.startsAt &&
            time <= task.startsAt + task.duration,
        );
        if (!activeTask) {
          const orbitX = pointerX + Math.cos(agent.angle) * agent.radius;
          const orbitY = pointerY + Math.sin(agent.angle) * agent.radius;
          agent.x += (orbitX - agent.x) * 0.1;
          agent.y += (orbitY - agent.y) * 0.1;
        } else if (!pendingElements.has(activeTask.target.element)) {
          pendingVisibility.set(
            activeTask.target.element,
            activeTask.target.element.classList.contains("visible"),
          );
          activeTask.target.element.classList.remove("visible", "swarm-built");
          activeTask.target.element.classList.add("swarm-build-pending");
          pendingElements.add(activeTask.target.element);
        }
        drawAgent(agent, time);
      });

      if (activeRun && time >= runEndsAt) {
        activeRun = false;
        pendingElements.forEach((element) => {
          element.classList.remove("swarm-build-pending");
        });
        pendingElements.clear();
        agents.forEach((agent) => {
          agent.tasks = [];
        });
        window.dispatchEvent(
          new CustomEvent("swarm:buildcomplete", { detail: { id: panelId } }),
        );
        if (runNotifiesSection) {
          window.dispatchEvent(
            new CustomEvent("swarm:sectionbuilt", { detail: { id: panelId } }),
          );
        }
      }

      if (activeRun || pointerInside) {
        frameId = window.requestAnimationFrame(tick);
      } else {
        context.clearRect(0, 0, width, height);
        frameId = 0;
      }
    };

    function requestFrame() {
      if (!frameId) frameId = window.requestAnimationFrame(tick);
    }

    const handlePointerMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      pointerInside = true;
      requestFrame();
    };
    const handlePointerEnter = () => {
      pointerInside = true;
      requestFrame();
    };
    const handlePointerLeave = () => {
      pointerInside = false;
      if (!activeRun && frameId) {
        window.cancelAnimationFrame(frameId);
        frameId = 0;
        context.clearRect(0, 0, width, height);
      }
    };

    const handleSectionEnter = (event: Event) => {
      const detail = (event as CustomEvent<{ id?: string }>).detail;
      const nextPanelId = detail?.id ?? null;
      window.clearTimeout(initialTimer);
      window.clearTimeout(sectionTimer);
      sectionTimer = window.setTimeout(
        () => startBuild(nextPanelId, true, true),
        80,
      );
    };

    const handleSectionLeave = () => {
      window.clearTimeout(sectionTimer);
      if (activeRun) {
        window.dispatchEvent(
          new CustomEvent("swarm:buildcancelled", { detail: { id: panelId } }),
        );
      }
      clearPending();
      activeRun = false;
      runNotifiesSection = false;
    };

    const handleContentChange = (event: Event) => {
      const detail = (event as CustomEvent<{ id?: string }>).detail;
      if (!detail?.id) return;
      startBuild(detail.id, false, false);
    };

    const triggerScrollBuild = () => {
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(() => {
        startBuild(panelId, false, false);
      }, 140);
    };

    const onVisibilityChange = () => {
      if (!document.hidden && pointerInside) requestFrame();
    };

    resize();
    agents.forEach((agent) => {
      agent.x = pointerX;
      agent.y = pointerY;
    });

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerenter", handlePointerEnter, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave, { passive: true });
    window.addEventListener("scroll", triggerScrollBuild, { passive: true, capture: true });
    window.addEventListener("wheel", triggerScrollBuild, { passive: true });
    window.addEventListener("sectionenter", handleSectionEnter);
    window.addEventListener("projectenter", handleSectionEnter);
    window.addEventListener("sectionleave", handleSectionLeave);
    window.addEventListener("projectleave", handleSectionLeave);
    window.addEventListener("swarm:contentchange", handleContentChange);
    document.addEventListener("visibilitychange", onVisibilityChange);
    initialTimer = window.setTimeout(
      () => startBuild(panelId, true, true),
      260,
    );

    return () => {
      window.clearTimeout(initialTimer);
      window.clearTimeout(scrollTimer);
      window.clearTimeout(sectionTimer);
      window.cancelAnimationFrame(frameId);
      clearPending();
      typingListeners.forEach((listener, element) => {
        element.removeEventListener("animationend", listener);
      });
      typingListeners.clear();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerenter", handlePointerEnter);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("scroll", triggerScrollBuild, true);
      window.removeEventListener("wheel", triggerScrollBuild);
      window.removeEventListener("sectionenter", handleSectionEnter);
      window.removeEventListener("projectenter", handleSectionEnter);
      window.removeEventListener("sectionleave", handleSectionLeave);
      window.removeEventListener("projectleave", handleSectionLeave);
      window.removeEventListener("swarm:contentchange", handleContentChange);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      context.clearRect(0, 0, width, height);
    };
  }, []);

  return <canvas aria-hidden="true" className="swarm-cursor-canvas" ref={canvasRef} />;
}
