import { useEffect, useRef, useState } from "react";

const C = {
  teal: "#3aae95",
  amber: "#E5AD58",
  red: "#e74c3c",
  green: "#2ecc71",
  purple: "#9b59b6",
  blue: "#3498db",
  orange: "#e67e22",
};

const WR = {
  gold: "#E5AD58",
  rust: "#c0392b",
  olive: "#7d8c3a",
  teal: "#2e8b7a",
  cream: "#f5e6c8",
  dark: "#1a0e00",
  border: "#3a2a0a",
};

interface ScreenProps {
  isPlaying: boolean;
  onProgressUpdate: (p: number) => void;
  progress: number;
}

const SLIDE_DURATION_SECS = 5;
const TOTAL_SLIDES = 4;

const HQ_PHASES = [
  { end: 1 / 18, color: C.teal },
  { end: 4 / 18, color: C.blue },
  { end: 6 / 18, color: C.amber },
  { end: 8 / 18, color: C.purple },
  { end: 10 / 18, color: C.orange },
  { end: 13 / 18, color: C.teal },
  { end: 15 / 18, color: C.red },
  { end: 17 / 18, color: C.amber },
  { end: 1, color: C.purple },
];

const WR_PHASES = [
  { end: 1 / 14, color: WR.gold },
  { end: 3 / 14, color: WR.teal },
  { end: 5 / 14, color: WR.olive },
  { end: 7 / 14, color: WR.rust },
  { end: 9 / 14, color: WR.gold },
  { end: 11 / 14, color: WR.teal },
  { end: 1, color: WR.rust },
];

function getHQPhaseColor(p: number) {
  return (
    HQ_PHASES.find((ph) => p <= ph.end) ?? HQ_PHASES[HQ_PHASES.length - 1]
  ).color;
}
function getWRPhaseColor(p: number) {
  return (
    WR_PHASES.find((ph) => p <= ph.end) ?? WR_PHASES[WR_PHASES.length - 1]
  ).color;
}

function fmtTime(secs: number) {
  const h = Math.floor(secs / 3600)
    .toString()
    .padStart(2, "0");
  const m = Math.floor((secs % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(secs % 60)
    .toString()
    .padStart(2, "0");
  return `${h}:${m}:${s}`;
}

const LINE_WIDTHS = ["72%", "55%", "64%", "48%", "70%"];
function Lines({
  count = 2,
  opacity = 0.5,
  color = "#1e3d50",
}: {
  count?: number;
  opacity?: number;
  color?: string;
}) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            height: "4px",
            borderRadius: "2px",
            background: color,
            opacity: opacity - i * 0.1,
            width: LINE_WIDTHS[i % LINE_WIDTHS.length],
            marginBottom: "10px",
          }}
        />
      ))}
    </>
  );
}

function HQSlideHero() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        padding: "12px 40px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: "58px",
          fontWeight: 900,
          color: C.amber,
          letterSpacing: ".05em",
          lineHeight: 1,
          marginBottom: "10px",
        }}
      >
        HACKQUEST
      </div>
      <div
        style={{
          fontSize: "14px",
          fontWeight: 900,
          color: C.teal,
          letterSpacing: ".2em",
          marginBottom: "20px",
        }}
      >
        SURVIVE THE QUEST
      </div>
      <Lines count={2} opacity={0.55} />
    </div>
  );
}

function HQSlideTimer({ progress }: { progress: number }) {
  const timeLeft = Math.round((1 - progress) * 18 * 3600);
  const color = getHQPhaseColor(progress);
  const pct = Math.round(progress * 100);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        padding: "10px 40px",
      }}
    >
      <div
        style={{
          fontSize: "12px",
          fontWeight: 900,
          color: "#3a5a6a",
          letterSpacing: ".14em",
          marginBottom: "6px",
        }}
      >
        TIME LEFT
      </div>
      <div
        style={{
          fontSize: "62px",
          fontWeight: 900,
          color,
          letterSpacing: ".03em",
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {fmtTime(timeLeft)}
      </div>
      <div
        style={{
          width: "100%",
          height: "6px",
          background: "#0a1a24",
          borderRadius: "3px",
          overflow: "hidden",
          margin: "14px 0 8px",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: color,
            borderRadius: "3px",
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          marginBottom: "12px",
        }}
      >
        <span style={{ fontSize: "11px", fontWeight: 900, color: C.teal }}>
          5 PM MAR 28
        </span>
        <span style={{ fontSize: "11px", fontWeight: 900, color: C.amber }}>
          11 AM MAR 29
        </span>
      </div>
      <Lines count={1} opacity={0.4} />
    </div>
  );
}

function HQSlideFormat() {
  const items = [
    { color: C.amber, label: "EVOLVING PROBLEMS" },
    { color: C.purple, label: "HACKSTORE" },
    { color: C.teal, label: "CONSTRAINTS" },
    { color: C.blue, label: "FINAL PITCH" },
  ];
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "100%",
        padding: "10px 40px",
      }}
    >
      <div
        style={{
          fontSize: "11px",
          fontWeight: 900,
          color: C.teal,
          letterSpacing: ".18em",
          marginBottom: "14px",
        }}
      >
        HOW IT WORKS
      </div>
      {items.map(({ color, label }) => (
        <div
          key={label}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "10px",
          }}
        >
          <div
            style={{
              width: "4px",
              height: "20px",
              background: color,
              borderRadius: "2px",
              flexShrink: 0,
            }}
          />
          <div
            style={{
              fontSize: "16px",
              fontWeight: 900,
              color,
              letterSpacing: ".06em",
            }}
          >
            {label}
          </div>
          <div
            style={{
              flex: 1,
              height: "3px",
              borderRadius: "2px",
              background: "#1e3d50",
              opacity: 0.5,
            }}
          />
        </div>
      ))}
    </div>
  );
}

function HQSlideJourney({ progress }: { progress: number }) {
  const colors = [
    C.teal,
    C.blue,
    C.amber,
    C.purple,
    C.orange,
    C.teal,
    C.red,
    C.amber,
    C.purple,
  ];
  const cur = Math.min(Math.floor(progress * colors.length), colors.length - 1);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "100%",
        padding: "10px 40px",
      }}
    >
      <div
        style={{
          fontSize: "11px",
          fontWeight: 900,
          color: C.teal,
          letterSpacing: ".18em",
          marginBottom: "16px",
        }}
      >
        18-HOUR JOURNEY
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "5px",
          marginBottom: "16px",
        }}
      >
        {colors.map((c, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: i === cur ? 28 : 14,
              borderRadius: "3px",
              background: i <= cur ? c : "#0d2a3a",
              opacity: i < cur ? 0.5 : i === cur ? 1 : 0.2,
              transition: "height .3s",
            }}
          />
        ))}
      </div>
      <Lines count={2} opacity={0.45} />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "2px",
        }}
      >
        <span style={{ fontSize: "11px", fontWeight: 900, color: C.teal }}>
          START
        </span>
        <span style={{ fontSize: "11px", fontWeight: 900, color: C.amber }}>
          FINISH
        </span>
      </div>
    </div>
  );
}

function WRSlideHero() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        padding: "12px 40px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: "52px",
          fontWeight: 900,
          color: WR.gold,
          letterSpacing: ".05em",
          lineHeight: 1,
          marginBottom: "8px",
        }}
      >
        WAR ROOM
      </div>
      <div
        style={{
          fontSize: "11px",
          fontWeight: 900,
          color: WR.teal,
          letterSpacing: ".2em",
          marginBottom: "6px",
        }}
      >
        STARTUP SIMULATION
      </div>
      <div
        style={{
          fontSize: "10px",
          fontWeight: 700,
          color: WR.rust,
          letterSpacing: ".14em",
          marginBottom: "20px",
          border: `1px solid ${WR.rust}`,
          padding: "2px 10px",
          borderRadius: "2px",
        }}
      >
        GECT EXCLUSIVE
      </div>
      <Lines count={2} opacity={0.45} color={WR.border} />
    </div>
  );
}

function WRSlideTimer({ progress }: { progress: number }) {
  const timeLeft = Math.round((1 - progress) * 14 * 3600);
  const color = getWRPhaseColor(progress);
  const pct = Math.round(progress * 100);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        padding: "10px 40px",
      }}
    >
      <div
        style={{
          fontSize: "12px",
          fontWeight: 900,
          color: "#5a3a1a",
          letterSpacing: ".14em",
          marginBottom: "6px",
        }}
      >
        TIME LEFT
      </div>
      <div
        style={{
          fontSize: "62px",
          fontWeight: 900,
          color,
          letterSpacing: ".03em",
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {fmtTime(timeLeft)}
      </div>
      <div
        style={{
          width: "100%",
          height: "6px",
          background: "#0d0900",
          borderRadius: "3px",
          overflow: "hidden",
          margin: "14px 0 8px",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: color,
            borderRadius: "3px",
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          marginBottom: "12px",
        }}
      >
        <span style={{ fontSize: "11px", fontWeight: 900, color: WR.gold }}>
          8 PM MAR
        </span>
        <span style={{ fontSize: "11px", fontWeight: 900, color: WR.rust }}>
          10 AM +1
        </span>
      </div>
      <Lines count={1} opacity={0.35} color={WR.border} />
    </div>
  );
}

function WRSlideFormat() {
  const items = [
    { color: WR.gold, label: "IDEA SHORTLISTING" },
    { color: WR.olive, label: "PROTOTYPE & PITCH" },
    { color: WR.rust, label: "CUSTOMER REVIEW" },
    { color: WR.gold, label: "DEBATE & FINAL PITCH" },
  ];
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "100%",
        padding: "10px 40px",
      }}
    >
      <div
        style={{
          fontSize: "11px",
          fontWeight: 900,
          color: WR.gold,
          letterSpacing: ".18em",
          marginBottom: "14px",
        }}
      >
        PHASES
      </div>
      {items.map(({ color, label }) => (
        <div
          key={label}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "10px",
          }}
        >
          <div
            style={{
              width: "4px",
              height: "20px",
              background: color,
              borderRadius: "2px",
              flexShrink: 0,
            }}
          />
          <div
            style={{
              fontSize: "13px",
              fontWeight: 900,
              color,
              letterSpacing: ".06em",
            }}
          >
            {label}
          </div>
          <div
            style={{
              flex: 1,
              height: "3px",
              borderRadius: "2px",
              background: WR.border,
              opacity: 0.7,
            }}
          />
        </div>
      ))}
    </div>
  );
}

function WRSlideJourney({ progress }: { progress: number }) {
  const colors = [
    WR.gold,
    WR.teal,
    WR.teal,
    WR.olive,
    WR.olive,
    WR.rust,
    WR.rust,
    WR.gold,
  ];
  const cur = Math.min(Math.floor(progress * colors.length), colors.length - 1);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "100%",
        padding: "10px 40px",
      }}
    >
      <div
        style={{
          fontSize: "11px",
          fontWeight: 900,
          color: WR.gold,
          letterSpacing: ".18em",
          marginBottom: "16px",
        }}
      >
        14-HOUR JOURNEY
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "5px",
          marginBottom: "16px",
        }}
      >
        {colors.map((c, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: i === cur ? 28 : 14,
              borderRadius: "3px",
              background: i <= cur ? c : "#1a0e00",
              opacity: i < cur ? 0.5 : i === cur ? 1 : 0.2,
              transition: "height .3s",
            }}
          />
        ))}
      </div>
      <Lines count={2} opacity={0.4} color={WR.border} />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "2px",
        }}
      >
        <span style={{ fontSize: "11px", fontWeight: 900, color: WR.gold }}>
          START
        </span>
        <span style={{ fontSize: "11px", fontWeight: 900, color: WR.rust }}>
          FINISH
        </span>
      </div>
    </div>
  );
}

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
  const slideTimerRef = useRef(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [liveProgress, setLiveProgress] = useState(progress);

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
    const shapes = Array.from({ length: 12 }, (_, i) => ({
      x: Math.random() * 500,
      y: Math.random() * 300,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 8 + 3,
      type: i % 3,
      color: palette[i % palette.length],
      rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.02,
      speed: Math.random() * 0.4 + 0.15,
    }));
    const W = () => canvas.width,
      H = () => canvas.height;
    const tick = (ts: number) => {
      const sp = playingRef.current ? 1 : 0;
      if (playingRef.current) {
        if (lastTsRef.current === null) lastTsRef.current = ts;
        const dt = (ts - lastTsRef.current) / 1000;
        lastTsRef.current = ts;
        const newP = progressRef.current + dt / 30;
        progressRef.current = newP >= 1 ? 0 : newP;
        onProgressUpdate(progressRef.current);
        setLiveProgress(progressRef.current);
        slideTimerRef.current += dt;
        if (slideTimerRef.current >= SLIDE_DURATION_SECS) {
          slideTimerRef.current = 0;
          setCurrentSlide((s) => (s + 1) % TOTAL_SLIDES);
        }
      } else {
        lastTsRef.current = null;
      }
      ctx.clearRect(0, 0, W(), H());
      shapes.forEach((s) => {
        s.x += s.vx * s.speed * sp;
        s.y += s.vy * s.speed * sp;
        s.rot += s.rotV * sp;
        if (s.x < 0) s.x = W();
        if (s.x > W()) s.x = 0;
        if (s.y < 0) s.y = H();
        if (s.y > H()) s.y = 0;
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rot);
        ctx.globalAlpha = 0.12;
        ctx.fillStyle = s.color;
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 1;
        if (s.type === 0) {
          ctx.beginPath();
          ctx.arc(0, 0, s.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (s.type === 1) {
          ctx.strokeRect(-s.size / 2, -s.size / 2, s.size, s.size);
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
    return () => cancelAnimationFrame(rafRef.current);
  }, [onProgressUpdate]);

  const ticker = [
    { text: "SURPRISE INCOMING", color: C.amber, icon: "★" },
    { text: "HACKSTORE OPEN", color: C.teal, icon: "▲" },
    { text: "TRIVIA BATTLE", color: C.purple, icon: "◆" },
    { text: "PROBLEM EVOLVING", color: C.red, icon: "●" },
  ];
  const tickerItems = [...ticker, ...ticker];

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
        fontFamily: "'Courier New',monospace",
        color: "#e0f0ec",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "6px 16px",
            borderBottom: "1px solid #0d2a3a",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 900,
                letterSpacing: ".12em",
                color: C.teal,
                border: `1px solid ${C.teal}`,
                padding: "2px 7px",
                borderRadius: "2px",
              }}
            >
              OPEN TO ALL
            </span>
          </div>
          <span
            style={{
              fontSize: "12px",
              fontWeight: 900,
              color: C.amber,
              letterSpacing: ".1em",
            }}
          >
            HACKQUEST
          </span>
          <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
            {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
              <div
                key={i}
                onClick={() => setCurrentSlide(i)}
                style={{
                  width: i === currentSlide ? 16 : 7,
                  height: "7px",
                  borderRadius: "3px",
                  cursor: "pointer",
                  background: i === currentSlide ? C.teal : "#1a3a4a",
                  transition: "width .3s",
                }}
              />
            ))}
          </div>
        </div>
        <div style={{ flex: 1, overflow: "hidden" }}>
          {currentSlide === 0 && <HQSlideHero />}
          {currentSlide === 1 && <HQSlideTimer progress={liveProgress} />}
          {currentSlide === 2 && <HQSlideFormat />}
          {currentSlide === 3 && <HQSlideJourney progress={liveProgress} />}
        </div>
        <div
          style={{
            flexShrink: 0,
            overflow: "hidden",
            borderTop: "1px solid #0d2a3a",
            height: "20px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: "9px",
              fontWeight: 900,
              color: C.teal,
              padding: "0 10px",
              borderRight: "1px solid #0d2a3a",
              whiteSpace: "nowrap",
              letterSpacing: ".08em",
            }}
          >
            FEED
          </div>
          <div style={{ overflow: "hidden", flex: 1 }}>
            <div
              style={{
                whiteSpace: "nowrap",
                animation: isPlaying ? "hqTicker 18s linear infinite" : "none",
                fontSize: "9px",
                fontWeight: 700,
                letterSpacing: ".07em",
                paddingLeft: "14px",
                color: "#8ab8c8",
              }}
            >
              {tickerItems.map((item, i) => (
                <span key={i}>
                  <span style={{ color: item.color }}>{item.icon}</span>
                  {` ${item.text}   ·   `}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes hqTicker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @keyframes hqPulse{0%,100%{opacity:1}50%{opacity:0.3}}
      `}</style>
    </div>
  );
}

export function WarRoomScreen({
  isPlaying,
  onProgressUpdate,
  progress,
}: ScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(progress);
  const playingRef = useRef(isPlaying);
  const lastTsRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);
  const slideTimerRef = useRef(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [liveProgress, setLiveProgress] = useState(progress);

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
    const palette = [WR.gold, WR.rust, WR.olive, WR.teal, WR.cream];
    const hexs = Array.from({ length: 14 }, (_, i) => ({
      x: Math.random() * 500,
      y: Math.random() * 300,
      vx: (Math.random() - 0.5) * 0.55,
      vy: (Math.random() - 0.5) * 0.55,
      r: Math.random() * 12 + 5,
      color: palette[i % palette.length],
      rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.018,
      speed: Math.random() * 0.45 + 0.15,
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
      const sp = playingRef.current ? 1 : 0;
      if (playingRef.current) {
        if (lastTsRef.current === null) lastTsRef.current = ts;
        const dt = (ts - lastTsRef.current) / 1000;
        lastTsRef.current = ts;
        const newP = progressRef.current + dt / 30;
        progressRef.current = newP >= 1 ? 0 : newP;
        onProgressUpdate(progressRef.current);
        setLiveProgress(progressRef.current);
        slideTimerRef.current += dt;
        if (slideTimerRef.current >= SLIDE_DURATION_SECS) {
          slideTimerRef.current = 0;
          setCurrentSlide((s) => (s + 1) % TOTAL_SLIDES);
        }
      } else {
        lastTsRef.current = null;
      }
      ctx.clearRect(0, 0, W(), H());
      hexs.forEach((h) => {
        h.x += h.vx * h.speed * sp;
        h.y += h.vy * h.speed * sp;
        h.rot += h.rotV * sp;
        if (h.x < -h.r) h.x = W() + h.r;
        if (h.x > W() + h.r) h.x = -h.r;
        if (h.y < -h.r) h.y = H() + h.r;
        if (h.y > H() + h.r) h.y = -h.r;
        ctx.save();
        ctx.globalAlpha = 0.18;
        ctx.strokeStyle = h.color;
        ctx.lineWidth = 1.2;
        drawHex(h.x, h.y, h.r, h.rot);
        ctx.stroke();
        ctx.restore();
      });
      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [onProgressUpdate]);

  const ticker = [
    { text: "DOMAIN BID OPENS", color: WR.gold, icon: "◈" },
    { text: "INVESTOR PITCH LIVE", color: WR.teal, icon: "▲" },
    { text: "CUSTOMER REVIEW INCOMING", color: WR.rust, icon: "⚑" },
    { text: "GECT EXCLUSIVE", color: WR.olive, icon: "★" },
  ];
  const tickerItems = [...ticker, ...ticker];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: WR.dark,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Courier New',monospace",
        color: WR.cream,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "6px 16px",
            borderBottom: `1px solid ${WR.border}`,
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 900,
                letterSpacing: ".12em",
                color: WR.gold,
                border: `1px solid ${WR.gold}`,
                padding: "2px 7px",
                borderRadius: "2px",
              }}
            >
              GECT EXCLUSIVE
            </span>
          </div>
          <span
            style={{
              fontSize: "12px",
              fontWeight: 900,
              color: WR.gold,
              letterSpacing: ".1em",
            }}
          >
            WAR ROOM
          </span>
          <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
            {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
              <div
                key={i}
                onClick={() => setCurrentSlide(i)}
                style={{
                  width: i === currentSlide ? 16 : 7,
                  height: "7px",
                  borderRadius: "3px",
                  cursor: "pointer",
                  background: i === currentSlide ? WR.gold : WR.border,
                  transition: "width .3s",
                }}
              />
            ))}
          </div>
        </div>
        <div style={{ flex: 1, overflow: "hidden" }}>
          {currentSlide === 0 && <WRSlideHero />}
          {currentSlide === 1 && <WRSlideTimer progress={liveProgress} />}
          {currentSlide === 2 && <WRSlideFormat />}
          {currentSlide === 3 && <WRSlideJourney progress={liveProgress} />}
        </div>
        <div
          style={{
            flexShrink: 0,
            overflow: "hidden",
            borderTop: `1px solid ${WR.border}`,
            height: "20px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: "9px",
              fontWeight: 900,
              color: WR.gold,
              padding: "0 10px",
              borderRight: `1px solid ${WR.border}`,
              whiteSpace: "nowrap",
              letterSpacing: ".08em",
            }}
          >
            FEED
          </div>
          <div style={{ overflow: "hidden", flex: 1 }}>
            <div
              style={{
                whiteSpace: "nowrap",
                animation: isPlaying ? "wrTicker 18s linear infinite" : "none",
                fontSize: "9px",
                fontWeight: 700,
                letterSpacing: ".07em",
                paddingLeft: "14px",
                color: "#c8a870",
              }}
            >
              {tickerItems.map((item, i) => (
                <span key={i}>
                  <span style={{ color: item.color }}>{item.icon}</span>
                  {` ${item.text}   ·   `}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes wrTicker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @keyframes wrPulse{0%,100%{opacity:1}50%{opacity:0.3}}
      `}</style>
    </div>
  );
}
