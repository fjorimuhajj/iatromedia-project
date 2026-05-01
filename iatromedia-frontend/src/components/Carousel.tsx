"use client";

import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";

type CarouselProps = {
  ariaLabel: string;
  itemWidthClassName?: string;
  /** Extra classes on outer wrapper (e.g. horizontal padding for flanking arrows). */
  className?: string;
  /** Hide prev/next arrow buttons (scroll still works via trackpad/touch). */
  hideArrows?: boolean;
  /** Show arrows only on hover/focus (desktop-friendly). */
  showArrowsOnHover?: boolean;
  /** Lock carousel height to the tallest item (prevents layout jumps). */
  lockHeight?: boolean;
  /** Where to place prev/next controls relative to the track. */
  controls?: "inset" | "flank";
  /** Visual style for prev/next buttons. */
  buttonVariant?: "blue" | "white";
  /** If set, auto-scrolls every N milliseconds. */
  autoScrollMs?: number;
  children: React.ReactNode[];
};

export function Carousel({
  ariaLabel,
  itemWidthClassName = "w-[290px] md:w-[320px]",
  className,
  hideArrows = false,
  showArrowsOnHover = false,
  lockHeight = false,
  controls = "inset",
  buttonVariant = "blue",
  autoScrollMs,
  children,
}: CarouselProps) {
  const items = useMemo(() => children.filter(Boolean), [children]);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const [lockedHeight, setLockedHeight] = useState<number | null>(null);

  useEffect(() => {
    if (!lockHeight) {
      setLockedHeight(null);
      return;
    }

    const el = scrollerRef.current;
    if (!el) return;

    const measure = () => {
      const itemEls = Array.from(
        el.querySelectorAll<HTMLElement>("[data-carousel-item]")
      );
      let max = 0;
      for (const it of itemEls) {
        const h = it.offsetHeight;
        if (h > max) max = h;
      }
      setLockedHeight(max > 0 ? max : null);
    };

    // initial measure (after layout)
    const raf = window.requestAnimationFrame(measure);

    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    Array.from(el.querySelectorAll<HTMLElement>("[data-carousel-item]")).forEach((n) =>
      ro.observe(n)
    );

    return () => {
      window.cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [items.length, itemWidthClassName, lockHeight]);

  useEffect(() => {
    if (!autoScrollMs || autoScrollMs < 800) return;
    if (isInteracting) return;
    if (items.length <= 1) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (prefersReducedMotion) return;

    const id = window.setInterval(() => {
      const el = scrollerRef.current;
      if (!el) return;

      const firstItem = el.querySelector<HTMLElement>("[data-carousel-item]");
      const itemWidth = firstItem?.offsetWidth || 320;
      const gap = 24;
      const maxLeft = el.scrollWidth - el.clientWidth;
      const nextLeft = Math.min(el.scrollLeft + itemWidth + gap, maxLeft);

      if (maxLeft <= 0) return;

      if (el.scrollLeft >= maxLeft - 2) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollTo({ left: nextLeft, behavior: "smooth" });
      }
    }, autoScrollMs);

    return () => window.clearInterval(id);
  }, [autoScrollMs, isInteracting, items.length]);

  function scrollByOne(direction: "prev" | "next") {
    const el = scrollerRef.current;
    if (!el) return;

    const firstItem = el.querySelector<HTMLElement>("[data-carousel-item]");
    const itemWidth = firstItem?.offsetWidth || 320;
    const gap = 24; // gap-6
    const delta = direction === "prev" ? -(itemWidth + gap) : itemWidth + gap;

    el.scrollBy({ left: delta, behavior: "smooth" });
  }

  const prevBtnPos =
    controls === "flank"
      ? "left-0 top-1/2 -translate-y-1/2 -translate-x-1/2"
      : "left-2 top-1/2 -translate-y-1/2";

  const nextBtnPos =
    controls === "flank"
      ? "right-0 top-1/2 -translate-y-1/2 translate-x-1/2"
      : "right-2 top-1/2 -translate-y-1/2";

  const buttonBase =
    buttonVariant === "white"
      ? [
          "h-9 w-9 rounded-full bg-white/95 text-gray-800",
          "shadow-sm ring-1 ring-black/15 hover:bg-white active:bg-white",
        ].join(" ")
      : [
          "h-10 w-10 rounded-full bg-[#1ea7d7] text-white",
          "shadow-sm ring-1 ring-black/10 hover:brightness-95 active:brightness-90",
        ].join(" ");

  const arrowVisibility =
    showArrowsOnHover
      ? [
          "opacity-0 pointer-events-none",
          "group-hover:opacity-100 group-hover:pointer-events-auto",
          "focus-visible:opacity-100 focus-visible:pointer-events-auto",
        ].join(" ")
      : "";

  return (
    <div
      aria-label={ariaLabel}
      className={["group relative", className || ""].join(" ")}
    >
      <div
        ref={scrollerRef}
        onMouseEnter={() => setIsInteracting(true)}
        onMouseLeave={() => setIsInteracting(false)}
        onFocusCapture={() => setIsInteracting(true)}
        onBlurCapture={() => setIsInteracting(false)}
        className="snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        style={lockedHeight ? { height: lockedHeight } : undefined}
      >
        <div className="flex items-stretch gap-6">
          {items.map((child, i) => (
            <div
              key={i}
              data-carousel-item
              className={["shrink-0 snap-start h-full", itemWidthClassName].join(" ")}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {!hideArrows && items.length > 1 ? (
        <button
          type="button"
          onClick={() => scrollByOne("prev")}
          aria-label="Më parë"
          className={[
            "absolute",
            prevBtnPos,
            "z-10",
            buttonBase,
            "flex items-center justify-center text-lg leading-none transition-opacity",
            arrowVisibility,
          ].join(" ")}
        >
          ‹
        </button>
      ) : null}

      {!hideArrows && items.length > 1 ? (
        <button
          type="button"
          onClick={() => scrollByOne("next")}
          aria-label="Më pas"
          className={[
            "absolute",
            nextBtnPos,
            "z-10",
            buttonBase,
            "flex items-center justify-center text-lg leading-none transition-opacity",
            arrowVisibility,
          ].join(" ")}
        >
          ›
        </button>
      ) : null}
    </div>
  );
}

