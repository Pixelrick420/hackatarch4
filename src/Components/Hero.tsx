import { useState, useEffect, useRef } from "react";
import Game from "./Game";
import DateCalendar from "./Datecalendar";

interface Star {
  id: number;
  x: number;
  y: number;
  image: string;
  phase: number;
}

const C = {
  bg: "#F6EDC4",
  navy: "#0A3248",
  cream: "#F5E6C8",
  amber: "#E5AD58",
  teal: "#3aae95",
  tealDark: "#005061",
};

const DOTS = Array.from({ length: 18 }, (_, i) => {
  const tx = Math.sin(i * 127.1) * 43758.5453;
  const ty = Math.sin(i * 311.7) * 43758.5453;
  return {
    x: (tx - Math.floor(tx)) * 86 + 7,
    y: (ty - Math.floor(ty)) * 86 + 7,
    r: 2.5 + (i % 3) * 1.5,
  };
});

const STYLE_ID = "hero-keyframes";
if (typeof document !== "undefined" && !document.getElementById(STYLE_ID)) {
  const s = document.createElement("style");
  s.id = STYLE_ID;
  s.textContent = `
    @keyframes heroFadeUp    { from { opacity:0; transform:translateY(32px); } to { opacity:1; transform:translateY(0); } }
    @keyframes heroFadeLeft  { from { opacity:0; transform:translateX(-40px); } to { opacity:1; transform:translateX(0); } }
    @keyframes heroScaleIn   { from { opacity:0; transform:scale(0.88); } to { opacity:1; transform:scale(1); } }
    @keyframes heroLineGrow  { from { width:0; opacity:0; } to { opacity:0.45; } }
    @keyframes heroLineGrow2 { from { width:0; opacity:0; } to { opacity:0.2; } }
    @keyframes heroPulse     { 0%,100% { opacity:0.04; } 50% { opacity:0.07; } }
    @keyframes heroStatPop   { from { opacity:0; transform:translateY(16px) scale(0.92); } to { opacity:1; transform:translateY(0) scale(1); } }
    @keyframes heroRuleGrow  { from { width:0; } }
  `;
  document.head.appendChild(s);
}

function HeroSection({ ready = false }: { ready?: boolean }) {
  const [isGameOpen, setIsGameOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1000);
  const [stars, setStars] = useState<Star[]>([]);
  const animationRef = useRef<number | null>(null);
  const MAX_STAR_SIZE = 60;
  const STAR_GROWTH_SPD = 0.02;

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 1000);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const animate = () => {
      setStars((prev) =>
        prev
          .map((s) => ({ ...s, phase: s.phase + STAR_GROWTH_SPD }))
          .filter((s) => s.phase < 2),
      );
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const starSize = (phase: number) =>
    phase < 1 ? phase * MAX_STAR_SIZE : (2 - phase) * MAX_STAR_SIZE;

  const anim = (
    name: string,
    delay: number,
    duration = 0.7,
    easing = "cubic-bezier(0.22,1,0.36,1)",
    fill: "both" | "forwards" = "both",
  ): React.CSSProperties =>
    ready
      ? { animation: `${name} ${duration}s ${easing} ${delay}s ${fill}` }
      : { opacity: 0 };

  const STATS = [
    { val: "2500+", label: "Registrations" },
    { val: "100+", label: "Colleges" },
    { val: "₹2.5L", label: "Prize Pool" },
  ];

  return (
    <div
      style={{
        width: "100%",

        height: isMobile ? "70vh" : "100vh",
        position: "relative",
        backgroundColor: C.bg,
        overflow: "hidden",
        margin: 0,
        padding: 0,
      }}
    >
      {/* Background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url(/herobackground.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.1,
          zIndex: 1,
        }}
      />

      {/* Teal circle */}
      <div
        style={{
          position: "absolute",
          bottom: "-18vw",
          left: "-10vw",
          width: "52vw",
          height: "52vw",
          borderRadius: "50%",
          backgroundColor: C.tealDark,
          opacity: ready ? 0.12 : 0,
          transition: "opacity 1.2s ease 0.2s",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* Navy rotated square */}
      <div
        style={{
          position: "absolute",
          top: "-4vw",
          right: "-4vw",
          width: "32vw",
          height: "32vw",
          borderRadius: "4vw",
          backgroundColor: C.navy,
          opacity: ready ? 0.08 : 0,
          transform: `rotate(${ready ? 18 : 30}deg)`,
          transition:
            "opacity 1s ease 0.1s, transform 1.4s cubic-bezier(0.22,1,0.36,1) 0.1s",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* ── Desktop: amber horizontal lines ── */}
      {!isMobile && (
        <>
          <div
            style={{
              position: "absolute",
              top: "38%",
              right: 0,
              width: "48vw",
              height: "3px",
              backgroundColor: C.amber,
              zIndex: 1,
              pointerEvents: "none",
              ...anim("heroLineGrow", 0.6, 0.8),
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "calc(38% + 8px)",
              right: 0,
              width: "36vw",
              height: "1.5px",
              backgroundColor: C.amber,
              zIndex: 1,
              pointerEvents: "none",
              ...anim("heroLineGrow2", 0.75, 0.8),
            }}
          />
        </>
      )}

      {/* ── Mobile: tangent lines from left edge to top edge ── */}
      {isMobile &&
        (() => {
          const TANGENT_LINE_COUNT = 100;

          const CX = 0;
          const CY = 0;
          const R = 50;

          const lines = [];
          for (let i = 0; i < TANGENT_LINE_COUNT; i++) {
            const angle = 10 + (i / (TANGENT_LINE_COUNT - 1)) * 70;
            const rad = (angle * Math.PI) / 180;

            const tx = CX + R * Math.cos(rad);
            const ty = CY - R * Math.sin(rad);

            const dx = -Math.sin(rad);
            const dy = -Math.cos(rad);

            let t1 = Infinity,
              t2 = -Infinity;
            const candidates: number[] = [];
            if (Math.abs(dx) > 0.001) candidates.push(-tx / dx);
            if (Math.abs(dy) > 0.001) candidates.push(-ty / dy);

            if (Math.abs(dx) > 0.001) candidates.push((100 - tx) / dx);
            if (Math.abs(dy) > 0.001) candidates.push((100 - ty) / dy);

            candidates.sort((a, b) => a - b);
            t2 = candidates[candidates.length - 1];
            t1 = candidates[0];

            const x1 = tx + t1 * dx;
            const y1 = ty + t1 * dy;
            const x2 = tx + t2 * dx;
            const y2 = ty + t2 * dy;

            lines.push({ x1, y1, x2, y2 });
          }

          return (
            <svg
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                zIndex: 1,
                pointerEvents: "none",
                opacity: ready ? 0.5 : 0,
                transition: "opacity 0.8s ease 0.4s",
              }}
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {lines.map((l, i) => (
                <line
                  key={i}
                  x1={l.x1}
                  y1={l.y1}
                  x2={l.x2}
                  y2={l.y2}
                  stroke={C.amber}
                  strokeWidth="0.4"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </svg>
          );
        })()}
      {/* Ghost 4.0 */}
      <div
        style={{
          position: "absolute",
          right: "-2vw",
          top: "50%",
          transform: "translateY(-50%)",
          fontFamily: "'American' Captain",
          fontSize: "clamp(14rem, 28vw, 36rem)",
          color: C.navy,
          lineHeight: 1,
          userSelect: "none",
          pointerEvents: "none",
          zIndex: 1,
          animation: ready ? "heroPulse 4s ease-in-out 1s infinite" : "none",
          opacity: ready ? 0.04 : 0,
          transition: "opacity 1.5s ease 0.8s",
        }}
      >
        4.0
      </div>

      {/* Dots */}
      {DOTS.filter((d) => d.x > 50).map((dot, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            width: dot.r,
            height: dot.r,
            borderRadius: "50%",
            backgroundColor: C.navy,
            transform: "translate(-50%,-50%)",
            pointerEvents: "none",
            zIndex: 1,
            opacity: ready ? 0.13 : 0,
            transition: `opacity 0.5s ease ${0.4 + i * 0.04}s`,
          }}
        />
      ))}

      {/* Stars */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 2,
        }}
      >
        {stars.map((star) => {
          const sz = starSize(star.phase);
          return (
            <img
              key={star.id}
              src={star.image}
              alt=""
              style={{
                position: "absolute",
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: sz,
                height: sz,
                objectFit: "contain",
                transform: "translate(-50%, -50%)",
                opacity: star.phase < 1 ? star.phase : 2 - star.phase,
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          );
        })}
      </div>

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 4,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ height: "clamp(56px, 8vh, 80px)", flexShrink: 0 }} />

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: "center",
            paddingLeft: isMobile ? "6vw" : "7vw",
            paddingRight: isMobile ? "6vw" : "0",
            paddingBottom: isMobile ? "4vh" : "0",
            gap: isMobile ? "3vh" : "5vw",
          }}
        >
          {/* ── CHANGE 2: hide calendar entirely on mobile ── */}
          {!isMobile && (
            <div
              style={{
                position: "relative",
                flex: "0 0 auto",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "clamp(220px, 28vw, 420px)",
                ...anim("heroScaleIn", 0.15, 0.9),
              }}
            >
              <DateCalendar embedded />
            </div>
          )}

          {/* Right: headline */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: isMobile ? "center" : "flex-start",
              textAlign: isMobile ? "center" : "left",
              maxWidth: isMobile ? "100%" : "48vw",
            }}
          >
            <div
              style={{
                fontFamily: "'Arcade Classic', monospace",
                fontSize: "clamp(0.6rem, 1vw, 0.8rem)",
                letterSpacing: "0.3em",
                color: C.teal,
                marginBottom: "1rem",
                border: `1px solid ${C.teal}`,
                display: "inline-block",
                padding: "2px 8px",
                borderRadius: "2px",
                backgroundColor: "rgba(58,174,149,0.06)",
                ...anim("heroFadeUp", 0.3, 0.6),
              }}
            >
              Edition 4.0
            </div>

            <h1
              style={{
                fontFamily: "'American' Captain",
                fontSize: "clamp(3rem, 7vw, 8rem)",
                color: C.navy,
                margin: 0,
                lineHeight: 0.9,
                letterSpacing: "0.02em",
                ...anim("heroFadeLeft", 0.45, 0.8),
              }}
            >
              HACK@ARCH
              <br />
              <span
                style={{
                  color: C.teal,
                  display: "inline-block",
                  ...anim("heroFadeLeft", 0.6, 0.8),
                }}
              >
                IS HERE
              </span>
            </h1>

            <div
              style={{
                height: "3px",
                backgroundColor: C.amber,
                margin: isMobile ? "1.5rem auto" : "1.5rem 0",
                borderRadius: "2px",
                ...anim("heroRuleGrow", 0.75, 0.6, "ease-out"),
                width: isMobile ? "40%" : "clamp(60px, 8vw, 140px)",
              }}
            />

            {!isMobile && (
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  flexWrap: "wrap",
                  marginTop: "0.5rem",
                }}
              >
                {STATS.map((stat, i) => (
                  <div
                    key={stat.val}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      backgroundColor: C.cream,
                      border: `2px solid ${C.navy}`,
                      borderRadius: "8px",
                      padding: "0.5rem 1rem",
                      boxShadow: `3px 3px 0 ${C.amber}`,
                      minWidth: "80px",
                      ...anim("heroStatPop", 0.9 + i * 0.12, 0.55),
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'American' Captain",
                        fontSize: "clamp(1.1rem, 1.8vw, 1.6rem)",
                        color: C.navy,
                        lineHeight: 1,
                      }}
                    >
                      {stat.val}
                    </span>
                    <span
                      style={{
                        fontFamily: "Inria Sans, sans-serif",
                        fontSize: "clamp(0.6rem, 0.9vw, 0.75rem)",
                        color: C.tealDark,
                        opacity: 0.7,
                        letterSpacing: "0.05em",
                        marginTop: "2px",
                      }}
                    >
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {isGameOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 100,
          }}
          onClick={() => setIsGameOpen(false)}
        >
          <div
            style={{
              backgroundColor: C.cream,
              border: "3px solid black",
              borderRadius: "2vh",
              padding: "3vh",
              maxWidth: "90vw",
              maxHeight: "90vh",
              overflow: "auto",
              position: "relative",
              boxShadow: `8px 8px 0 ${C.amber}`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsGameOpen(false)}
              style={{
                position: "absolute",
                top: "2vh",
                right: "2vh",
                backgroundColor: C.amber,
                border: "2px solid black",
                borderRadius: "50%",
                width: 40,
                height: 40,
                fontSize: 20,
                fontWeight: "bold",
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              ×
            </button>
            <Game />
          </div>
        </div>
      )}
    </div>
  );
}

export default HeroSection;
