import { useEffect, useState } from "react";

const SHOW_AFTER_PX = 600;

// The app scrolls inside #root (fixed at 100vh, overflow auto - see
// index.css), not the window, so that is the element we watch and scroll.
function getScroller(): HTMLElement | null {
  return document.getElementById("root");
}

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const scroller = getScroller();
    if (!scroller) return;
    const onScroll = () => setVisible(scroller.scrollTop > SHOW_AFTER_PX);
    onScroll();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToTop() {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    getScroller()?.scrollTo({
      top: 0,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }

  return (
    <button
      type="button"
      className={`back-to-top ${visible ? "visible" : ""}`}
      onClick={scrollToTop}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 19V5" />
        <path d="M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
