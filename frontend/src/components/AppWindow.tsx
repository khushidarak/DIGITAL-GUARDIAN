import { useEffect, useRef, ReactNode } from "react";

interface AppWindowProps {
  children: ReactNode;
}

const AppWindow = ({ children }: AppWindowProps) => {
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll reveal
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );

    const reveals = document.querySelectorAll(".reveal");
    reveals.forEach((el) => observer.observe(el));

    // Parallax system
    let currentScroll = 0;
    let targetScroll = 0;
    const isMobile = window.innerWidth < 768;
    const multiplier = isMobile ? 0.5 : 1.0;

    const onScroll = () => {
      targetScroll = window.pageYOffset;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    let rafId: number;
    const parallaxLoop = () => {
      currentScroll += (targetScroll - currentScroll) * 0.072;
      document.querySelectorAll("[data-parallax]").forEach((el) => {
        const speed = parseFloat((el as HTMLElement).dataset.parallax || "0") * multiplier;
        (el as HTMLElement).style.transform = `translateZ(0) translateY(${currentScroll * speed * -1}px)`;
      });
      rafId = requestAnimationFrame(parallaxLoop);
    };
    rafId = requestAnimationFrame(parallaxLoop);

    // Tilt cards
    const cards = document.querySelectorAll(".tilt-card");
    const cardHandlers: Array<{ el: Element; move: (e: MouseEvent) => void; enter: () => void; leave: () => void }> = [];

    cards.forEach((card) => {
      let tRX = 0, tRY = 0, cRX = 0, cRY = 0;
      let animId: number | null = null;

      const move = (e: MouseEvent) => {
        const rect = (card as HTMLElement).getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        tRX = ((y - rect.height / 2) / rect.height) * -7;
        tRY = ((x - rect.width / 2) / rect.width) * 7;
      };

      const animate = () => {
        cRX += (tRX - cRX) * 0.10;
        cRY += (tRY - cRY) * 0.10;
        (card as HTMLElement).style.transform = `perspective(900px) rotateX(${cRX}deg) rotateY(${cRY}deg) translateZ(8px)`;
        animId = requestAnimationFrame(animate);
      };

      const enter = () => { animate(); };
      const leave = () => {
        if (animId) cancelAnimationFrame(animId);
        tRX = 0; tRY = 0;
        (card as HTMLElement).style.transition = "transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)";
        (card as HTMLElement).style.transform = "perspective(900px) rotateX(0) rotateY(0) translateZ(0)";
        setTimeout(() => { (card as HTMLElement).style.transition = ""; }, 550);
      };

      card.addEventListener("mousemove", move as EventListener);
      card.addEventListener("mouseenter", enter);
      card.addEventListener("mouseleave", leave);
      cardHandlers.push({ el: card, move: move as (e: MouseEvent) => void, enter, leave });
    });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
      cardHandlers.forEach(({ el, move, enter, leave }) => {
        el.removeEventListener("mousemove", move as EventListener);
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
      });
    };
  }, []);

  return (
    <div className="p-2 md:p-5 flex justify-center min-h-screen">
      <div ref={windowRef} className="app-window">
        {children}
      </div>
    </div>
  );
};

export default AppWindow;
