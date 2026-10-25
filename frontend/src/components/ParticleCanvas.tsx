import { useEffect, useRef } from "react";

const ParticleCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: { x: number; y: number; r: number; o: number; sx: number; sy: number }[] = [];
    let w = 0, h = 0;
    let rafId: number;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      w = canvas.width = parent.offsetWidth;
      h = canvas.height = parent.offsetHeight;
    };

    const init = () => {
      resize();
      particles = Array.from({ length: 110 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.4 + Math.random() * 1.4,
        o: 0.08 + Math.random() * 0.42,
        sx: (Math.random() - 0.5) * 0.5,
        sy: (Math.random() - 0.5) * 0.5,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.x += p.sx;
        p.y += p.sy;
        if (p.x < 0 || p.x > w) p.sx *= -1;
        if (p.y < 0 || p.y > h) p.sy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(74, 222, 128, ${p.o})`;
        ctx.fill();
      });
      rafId = requestAnimationFrame(draw);
    };

    init();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
      style={{ width: "100%", height: "100%" }}
    />
  );
};

export default ParticleCanvas;
