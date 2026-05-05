import { useEffect, useRef } from "react";

export function Background() {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let frame;
    let t = 0;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function draw() {
      const { width: W, height: H } = canvas;
      ctx.clearRect(0, 0, W, H);

      // Base
      ctx.fillStyle = "#161618";
      ctx.fillRect(0, 0, W, H);

      // Left cyan glow (very subtle)
      const gl = ctx.createRadialGradient(W * 0.18, H * 0.45, 0, W * 0.18, H * 0.45, W * 0.42);
      gl.addColorStop(0, "rgba(0,180,220,0.045)");
      gl.addColorStop(1, "transparent");
      ctx.fillStyle = gl;
      ctx.fillRect(0, 0, W, H);

      // Right purple glow
      const gr = ctx.createRadialGradient(W * 0.82, H * 0.45, 0, W * 0.82, H * 0.45, W * 0.42);
      gr.addColorStop(0, "rgba(180,0,220,0.045)");
      gr.addColorStop(1, "transparent");
      ctx.fillStyle = gr;
      ctx.fillRect(0, 0, W, H);

      // Center subtle vignette
      const gv = ctx.createRadialGradient(W/2, H/2, W*0.3, W/2, H/2, W*0.85);
      gv.addColorStop(0, "transparent");
      gv.addColorStop(1, "rgba(0,0,0,0.6)");
      ctx.fillStyle = gv;
      ctx.fillRect(0, 0, W, H);

      // Floating particles
      t += 0.003;
      ctx.save();
      for (let i = 0; i < 38; i++) {
        const seed = i * 137.508;
        const x = ((Math.sin(seed) * 0.5 + 0.5 + t * 0.012 * (i % 3 === 0 ? 1 : -0.5)) % 1) * W;
        const y = ((Math.cos(seed * 0.7) * 0.5 + 0.5 + t * 0.007) % 1) * H;
        const r = 0.8 + (i % 4) * 0.4;
        const alpha = 0.08 + Math.sin(t * 1.2 + i) * 0.04;
        const isLeft = i % 2 === 0;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = isLeft
          ? `rgba(0,229,255,${alpha})`
          : `rgba(212,0,255,${alpha})`;
        ctx.fill();
      }
      ctx.restore();

      frame = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}
    />
  );
}
