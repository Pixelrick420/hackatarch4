import { useEffect, useRef, useState } from "react";

const C = {
  teal: "#3aae95",
  amber: "#E5AD58",
  red: "#e74c3c",
  green: "#2ecc71",
  purple: "#9b59b6",
  blue: "#3498db",
  orange: "#e67e22",
  navy: "#0A3248",
};

// ── HACKQUEST ─────────────────────────────────────────────────────────────────
// Theme: deep teal/navy
// Progress = time elapsed in the 18h hackathon (0→1)
interface ScreenProps {
  isPlaying: boolean;
  onProgressUpdate: (p: number) => void;
  progress: number; // controlled from outside when scrubbing
}

const HQ_DURATION = 18 * 60; // seconds (fast-forwarded display)

export function HackQuestScreen({
  isPlaying,
  onProgressUpdate,
  progress,
}: ScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(progress);
  const playingRef = useRef(isPlaying);
  const lastTsRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  // Keep refs in sync
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);
  useEffect(() => {
    playingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();

    const palette = [
      C.teal,
      C.amber,
      C.purple,
      C.blue,
      C.green,
      C.red,
      C.orange,
    ];
    const shapes = Array.from({ length: 16 }, (_, i) => ({
      x: Math.random() * 300,
      y: Math.random() * 200,
      vx: (Math.random() - 0.5) * 0.9,
      vy: (Math.random() - 0.5) * 0.9,
      size: Math.random() * 13 + 5,
      type: i % 3,
      color: palette[i % palette.length],
      rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.04,
      baseSpeed: Math.random() * 0.9 + 0.3,
    }));

    const mutateId = setInterval(() => {
      if (!playingRef.current) return;
      const s = shapes[Math.floor(Math.random() * shapes.length)];
      s.color = palette[Math.floor(Math.random() * palette.length)];
      s.type = Math.floor(Math.random() * 3);
    }, 900);

    const W = () => canvas.width,
      H = () => canvas.height;

    const tick = (ts: number) => {
      const speed = playingRef.current ? 1 : 0;

      if (playingRef.current) {
        if (lastTsRef.current === null) lastTsRef.current = ts;
        const dt = (ts - lastTsRef.current) / 1000;
        lastTsRef.current = ts;
        // TOTAL_DURATION for progress: 30 seconds real time = full loop
        const newP = Math.min(progressRef.current + dt / 30, 1);
        progressRef.current = newP >= 1 ? 0 : newP; // loop
        onProgressUpdate(progressRef.current);
      } else {
        lastTsRef.current = null;
      }

      ctx.clearRect(0, 0, W(), H());
      shapes.forEach((s) => {
        s.x += s.vx * s.baseSpeed * speed;
        s.y += s.vy * s.baseSpeed * speed;
        s.rot += s.rotV * speed;
        if (s.x < 0) s.x = W();
        if (s.x > W()) s.x = 0;
        if (s.y < 0) s.y = H();
        if (s.y > H()) s.y = 0;
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rot);
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = s.color;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 8;
        if (s.type === 0) {
          ctx.beginPath();
          ctx.arc(0, 0, s.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (s.type === 1) {
          ctx.fillRect(-s.size / 2, -s.size / 2, s.size, s.size);
        } else {
          ctx.beginPath();
          ctx.moveTo(0, -s.size);
          ctx.lineTo(s.size, s.size);
          ctx.lineTo(-s.size, s.size);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      });
      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      clearInterval(mutateId);
    };
  }, []); // eslint-disable-line

  const timeLeft = Math.round((1 - progress) * HQ_DURATION);
  const hrs = Math.floor(timeLeft / 3600)
    .toString()
    .padStart(2, "0");
  const mins = Math.floor((timeLeft % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const secs = (timeLeft % 60).toString().padStart(2, "0");
  const filled = Math.round(progress * 10);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#05131f",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          padding: "8px 10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontFamily: "'American Captain',monospace",
            fontSize: "13px",
            color: C.amber,
            letterSpacing: "0.1em",
          }}
        >
          {hrs}:{mins}:{secs}
        </div>
        <div style={{ display: "flex", gap: "2px" }}>
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "1px",
                backgroundColor: i < filled ? C.teal : "#0a1a24",
                boxShadow: i < filled ? `0 0 4px ${C.teal}` : "none",
              }}
            />
          ))}
        </div>
        <div
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: isPlaying ? C.red : "#300",
            boxShadow: isPlaying ? `0 0 6px ${C.red}` : "none",
          }}
        />
      </div>
    </div>
  );
}

// ── WAR ROOM ─────────────────────────────────────────────────────────────────
// Theme: deep amber/brown
export function WarRoomScreen({
  isPlaying,
  onProgressUpdate,
  progress,
}: ScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playingRef = useRef(isPlaying);
  const progressRef = useRef(progress);
  const lastTsRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);
  const [bars, setBars] = useState([40, 65, 30, 80, 55, 70, 45, 60]);

  useEffect(() => {
    playingRef.current = isPlaying;
  }, [isPlaying]);
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  // Bars animate only when playing
  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => {
      setBars((prev) =>
        prev.map((b) =>
          Math.max(10, Math.min(95, b + (Math.random() - 0.5) * 16)),
        ),
      );
    }, 700);
    return () => clearInterval(id);
  }, [isPlaying]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();

    const palette = [C.amber, C.teal, C.blue, C.purple, C.orange, C.green];
    const hexs = Array.from({ length: 12 }, (_, i) => ({
      x: Math.random() * 300,
      y: Math.random() * 200,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      r: Math.random() * 14 + 6,
      rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.025,
      color: palette[i % palette.length],
      baseSpeed: Math.random() * 0.8 + 0.3,
    }));

    const drawHex = (x: number, y: number, r: number, rot: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = rot + (i * Math.PI) / 3;
        if (i === 0) {
          ctx.moveTo(x + r * Math.cos(a), y + r * Math.sin(a));
        } else {
          ctx.lineTo(x + r * Math.cos(a), y + r * Math.sin(a));
        }
      }
      ctx.closePath();
    };

    const W = () => canvas.width,
      H = () => canvas.height;
    const tick = (ts: number) => {
      const speed = playingRef.current ? 1 : 0;

      if (playingRef.current) {
        if (lastTsRef.current === null) lastTsRef.current = ts;
        const dt = (ts - lastTsRef.current) / 1000;
        lastTsRef.current = ts;
        const newP = progressRef.current + dt / 30;
        progressRef.current = newP >= 1 ? 0 : newP;
        onProgressUpdate(progressRef.current);
      } else {
        lastTsRef.current = null;
      }

      ctx.clearRect(0, 0, W(), H());
      hexs.forEach((h) => {
        h.x += h.vx * h.baseSpeed * speed;
        h.y += h.vy * h.baseSpeed * speed;
        h.rot += h.rotV * speed;
        if (h.x < -h.r) h.x = W() + h.r;
        if (h.x > W() + h.r) h.x = -h.r;
        if (h.y < -h.r) h.y = H() + h.r;
        if (h.y > H() + h.r) h.y = -h.r;
        ctx.globalAlpha = 0.55;
        ctx.strokeStyle = h.color;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = h.color;
        ctx.shadowBlur = 6;
        drawHex(h.x, h.y, h.r, h.rot);
        ctx.stroke();
      });
      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []); // eslint-disable-line

  const barColors = [
    C.teal,
    C.amber,
    C.blue,
    C.green,
    C.purple,
    C.orange,
    C.red,
    C.teal,
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#1a0e00",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "10px",
        boxSizing: "border-box",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "flex-end",
          gap: "4px",
          height: "65%",
        }}
      >
        {bars.map((h, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: `${h}%`,
              backgroundColor: barColors[i],
              borderRadius: "2px 2px 0 0",
              boxShadow: `0 0 8px ${barColors[i]}`,
              transition: isPlaying
                ? "height 0.6s cubic-bezier(0.22,1,0.36,1)"
                : "none",
            }}
          />
        ))}
      </div>
      <div
        style={{
          position: "relative",
          zIndex: 1,
          height: "2px",
          backgroundColor: "#3a2a0a",
          marginTop: "2px",
        }}
      />
    </div>
  );
}
