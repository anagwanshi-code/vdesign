"use client";

import { ReactLenis, useLenis } from "@studio-freight/react-lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ComponentProps, type ReactNode } from "react";

gsap.registerPlugin(ScrollTrigger);

const lenisOptions = {
  lerp: 0.05,
  duration: 1.5,
  smoothWheel: true,
  wheelMultiplier: 0.85,
  touchMultiplier: 1.5,
  infinite: false,
  orientation: "vertical" as const,
  gestureOrientation: "vertical" as const,
  autoResize: true,
};

function LenisScrollTriggerSync() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(raf);
    };
  }, [lenis]);

  return null;
}

function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const onChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", onChange);
    return () => mediaQuery.removeEventListener("change", onChange);
  }, []);

  return prefersReducedMotion;
}

type LenisChildren = ComponentProps<typeof ReactLenis>["children"];

type SmoothScrollProps = {
  children: ReactNode;
};

export function SmoothScroll({ children }: SmoothScrollProps) {
  const pathname = usePathname();
  const prefersReducedMotion = usePrefersReducedMotion();
  const isStudioRoute = pathname.startsWith("/studio");

  if (prefersReducedMotion || isStudioRoute) {
    return <>{children}</>;
  }

  return (
    <ReactLenis root options={lenisOptions}>
      <LenisScrollTriggerSync />
      {children as LenisChildren}
    </ReactLenis>
  );
}
