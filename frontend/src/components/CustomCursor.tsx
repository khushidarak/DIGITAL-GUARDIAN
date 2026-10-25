import { useEffect, useRef } from "react";

const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let isHoveringLink = false;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      isHoveringLink = !!(
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[role='button']") ||
        target.closest(".tilt-card")
      );
    };

    const loop = () => {
      if (dotRef.current) {
        dotRef.current.style.left = `${mouseX - 5}px`;
        dotRef.current.style.top = `${mouseY - 5}px`;
        dotRef.current.style.opacity = isHoveringLink ? "0.4" : "1";
      }
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      const size = isHoveringLink ? 44 : 32;
      if (ringRef.current) {
        ringRef.current.style.left = `${ringX - size / 2}px`;
        ringRef.current.style.top = `${ringY - size / 2}px`;
        ringRef.current.style.width = `${size}px`;
        ringRef.current.style.height = `${size}px`;
      }
      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", onMouseOver);
    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="fixed z-[9999] pointer-events-none rounded-full hidden md:block"
        style={{
          width: 10,
          height: 10,
          background: "#4ade80",
          boxShadow: "0 0 10px rgba(74,222,128,0.6)",
        }}
      />
      <div
        ref={ringRef}
        className="fixed z-[9998] pointer-events-none rounded-full hidden md:block"
        style={{
          width: 32,
          height: 32,
          border: "1px solid rgba(74,222,128,0.45)",
          transition: "width 0.25s ease, height 0.25s ease",
        }}
      />
    </>
  );
};

export default CustomCursor;
