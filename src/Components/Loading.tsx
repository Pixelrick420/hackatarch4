import { useEffect, useRef, useState } from "react";

interface LoadingScreenProps {
  onComplete?: () => void;
  duration?: number;
}

const BG_COLOR = "#F6EDC4";
const STRIPE_LEFT = "#0A3248";
const STRIPE_RIGHT = "#005061";

const BODY_FILL = "#0d2e28";
const BODY_STROKE = "#000000";
const BODY_INSET = "#ffffff";

const SCREW_FILL = "#000000";
const SCREW_STROKE = "#ffffff";
const SCREW_LINE = "#ffffff";

const WINDOW_BG = "#040e0b";
const WINDOW_RIM = "#000000";

const REEL_OUTER = "#155c4a";
const REEL_RIM = "#000000";
const SPOKE_COLOR = "#ffffff";
const SPOKE_RIVET = "#ffffff";
const HUB_DARK = "#000000";
const HUB_MID = "#155c4a";
const HUB_SLOT = "#ffffff";
const HUB_CENTER = "#3aae95";
const REEL_DASH = "#ffffff";

const TAPE_COLOR = "#1a0a00";
const TAPE_SHINE = "rgba(255,255,255,0.12)";

const GEAR_TOOTH = "#3aae95";
const GEAR_TOOTH_STROKE = "#72cebb";
const GEAR_BODY = "#0d2e28";
const GEAR_CENTER = "#ffffff";

const RAIL_FILL = "#000000";
const RAIL_STROKE = "#1f7a63";

const PINCH_OUTER = "#000000";
const PINCH_OUTER_STROKE = "#ffffff";
const PINCH_INNER = "#0d2e28";
const PINCH_LINE = "#ffffff";

const HEAD_FILL = "#000000";
const HEAD_STROKE = "#ffffff";
const HEAD_INNER = "#0d2e28";

const BADGE_RIGHT_BG = "#3aae95";
const BADGE_TEXT = "#000000";

const LABEL_TEXT_COLOR = "#ffffff";

const W = 600;
const H = 380;

const LEFT_CX = 170;
const RIGHT_CX = 430;
const REEL_CY = 210;
const OUTER_R = 72;
const SPOKE_COUNT = 8;
const HUB_R = 22;
const PINCH_R = 8;

const WIN_X = 60;
const WIN_Y = 100;
const WIN_W = W - 120;
const WIN_H = 210;

interface ReelProps {
  cx: number;
  cy: number;
  rotation: number;
  tapeR: number;
  flip?: boolean;
}

function Reel({ cx, cy, rotation, tapeR, flip = false }: ReelProps) {
  const dir = flip ? -1 : 1;
  const deg = rotation * dir;
  const origin = `${cx}px ${cy}px`;
  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={OUTER_R}
        fill={REEL_OUTER}
        stroke={REEL_RIM}
        strokeWidth="2"
      />
      {/* Spokes — CSS transform so React always flushes the update */}
      <g style={{ transform: `rotate(${deg}deg)`, transformOrigin: origin }}>
        {Array.from({ length: SPOKE_COUNT }).map((_, i) => {
          const angle = (i / SPOKE_COUNT) * Math.PI * 2;
          return (
            <g key={i}>
              <line
                x1={cx + Math.cos(angle) * HUB_R}
                y1={cy + Math.sin(angle) * HUB_R}
                x2={cx + Math.cos(angle) * (OUTER_R - 6)}
                y2={cy + Math.sin(angle) * (OUTER_R - 6)}
                stroke={SPOKE_COLOR}
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle
                cx={cx + Math.cos(angle) * (OUTER_R - 10)}
                cy={cy + Math.sin(angle) * (OUTER_R - 10)}
                r="3.5"
                fill={SPOKE_RIVET}
                stroke={SPOKE_COLOR}
                strokeWidth="0.8"
              />
            </g>
          );
        })}
      </g>
      <circle cx={cx} cy={cy} r={tapeR} fill={TAPE_COLOR} />
      <circle
        cx={cx}
        cy={cy}
        r={HUB_R + 4}
        fill={HUB_DARK}
        stroke={HUB_SLOT}
        strokeWidth="1.5"
      />
      <circle
        cx={cx}
        cy={cy}
        r={HUB_R}
        fill={HUB_MID}
        stroke={SPOKE_COLOR}
        strokeWidth="1"
      />
      {/* Hub slots — CSS transform */}
      <g style={{ transform: `rotate(${deg}deg)`, transformOrigin: origin }}>
        {[0, 120, 240].map((a) => (
          <rect
            key={a}
            x={cx - 4}
            y={cy - HUB_R + 3}
            width="8"
            height="12"
            rx="2"
            fill={HUB_SLOT}
            stroke={SPOKE_COLOR}
            strokeWidth="0.5"
            transform={`rotate(${a}, ${cx}, ${cy})`}
          />
        ))}
      </g>
      <circle
        cx={cx}
        cy={cy}
        r="5"
        fill={HUB_DARK}
        stroke={HUB_CENTER}
        strokeWidth="1.5"
      />
      <circle
        cx={cx}
        cy={cy}
        r={OUTER_R - 1}
        fill="none"
        stroke={REEL_DASH}
        strokeWidth="0.8"
        strokeDasharray="30 200"
        strokeDashoffset={rotation * dir * 2}
        opacity="0.6"
      />
    </g>
  );
}

interface GearProps {
  cx: number;
  cy: number;
  rotation: number;
  teethCount?: number;
  r?: number;
}

function Gear({ cx, cy, rotation, teethCount = 10, r = 16 }: GearProps) {
  return (
    <g
      style={{
        transform: `rotate(${rotation}deg)`,
        transformOrigin: `${cx}px ${cy}px`,
      }}
    >
      {Array.from({ length: teethCount }).map((_, i) => (
        <rect
          key={i}
          x={cx - 3}
          y={cy - r}
          width="6"
          height="8"
          rx="1"
          fill={GEAR_TOOTH}
          stroke={GEAR_TOOTH_STROKE}
          strokeWidth="0.5"
          transform={`rotate(${(i / teethCount) * 360}, ${cx}, ${cy})`}
        />
      ))}
      <circle
        cx={cx}
        cy={cy}
        r={r - 5}
        fill={GEAR_BODY}
        stroke={GEAR_TOOTH_STROKE}
        strokeWidth="1"
      />
      <circle
        cx={cx}
        cy={cy}
        r="4"
        fill={HUB_DARK}
        stroke={GEAR_CENTER}
        strokeWidth="1"
      />
    </g>
  );
}

function LoadingScreen({ onComplete, duration = 3800 }: LoadingScreenProps) {
  const [rotation, setRotation] = useState(0);
  const [progress, setProgress] = useState(0);
  const [flashOpacity, setFlashOpacity] = useState(0);
  const [visible, setVisible] = useState(true);
  const [isNarrow, setIsNarrow] = useState(window.innerWidth < 500);
  const rotRef = useRef(0);
  const rafRef = useRef<number>(0);
  const lastRef = useRef<number>(0);

  useEffect(() => {
    const onResize = () => setIsNarrow(window.innerWidth < 500);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const spinDuration = duration - 600;
    const start = performance.now();
    const tick = (now: number) => {
      const dt = lastRef.current ? now - lastRef.current : 16;
      lastRef.current = now;
      const elapsed = now - start;
      const t = Math.min(elapsed / spinDuration, 1);
      setProgress(t);
      const speed = 0.8 * Math.pow(t, 1.8) + 0.02;
      rotRef.current = (rotRef.current + speed * dt) % 360;
      setRotation(rotRef.current);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [duration]);

  useEffect(() => {
    const flashStart = duration - 600;
    const t1 = setTimeout(() => {
      let fo = 0;
      const flashIn = setInterval(() => {
        fo += 0.12;
        setFlashOpacity(Math.min(fo, 1));
        if (fo >= 1) {
          clearInterval(flashIn);
          setTimeout(() => {
            setVisible(false);
            onComplete?.();
          }, 80);
        }
      }, 20);
    }, flashStart);
    return () => clearTimeout(t1);
  }, [duration, onComplete]);

  if (!visible) return null;

  const leftTapeR = OUTER_R * 0.75 * (1 - progress * 0.5);
  const rightTapeR = OUTER_R * 0.35 + OUTER_R * 0.4 * progress;
  const tapeY = REEL_CY + 18;
  const leftEdgeX = LEFT_CX + leftTapeR;
  const rightEdgeX = RIGHT_CX - rightTapeR;
  const pinchY = tapeY + 22;
  const pinchLeftX = LEFT_CX + OUTER_R + 30;
  const pinchRightX = RIGHT_CX - OUTER_R - 30;
  const pinchCY = REEL_CY + 50;
  const gearRot = rotation * 2.3;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: BG_COLOR,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "10px",
          background: `repeating-linear-gradient(90deg, ${STRIPE_LEFT} 0px, ${STRIPE_LEFT} 24px, ${STRIPE_RIGHT} 24px, ${STRIPE_RIGHT} 48px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "10px",
          background: `repeating-linear-gradient(90deg, ${STRIPE_RIGHT} 0px, ${STRIPE_RIGHT} 24px, ${STRIPE_LEFT} 24px, ${STRIPE_LEFT} 48px)`,
        }}
      />

      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        style={{
          maxWidth: isNarrow
            ? "min(90vh, 90vw * 1.58)"
            : "min(90vw, 90vh * 1.58)",
          maxHeight: isNarrow
            ? "min(90vw, 90vh / 1.58)"
            : "min(90vh, 90vw / 1.58)",
          display: "block",
          transform: isNarrow ? "rotate(90deg)" : "none",
          transition: "transform 0.3s ease",
        }}
      >
        {/* Body */}
        <rect
          x="10"
          y="10"
          width={W - 20}
          height={H - 20}
          rx="20"
          fill={BODY_FILL}
          stroke={BODY_STROKE}
          strokeWidth="3.5"
        />
        <rect
          x="22"
          y="22"
          width={W - 44}
          height={H - 44}
          rx="14"
          fill="none"
          stroke={BODY_INSET}
          strokeWidth="1"
          opacity="0.6"
        />

        {/* Corner screws */}
        {(
          [
            [38, 38],
            [W - 38, 38],
            [38, H - 38],
            [W - 38, H - 38],
          ] as [number, number][]
        ).map(([sx, sy], i) => (
          <g key={i}>
            <circle
              cx={sx}
              cy={sy}
              r="9"
              fill={SCREW_FILL}
              stroke={SCREW_STROKE}
              strokeWidth="1.2"
            />
            <line
              x1={sx - 5}
              y1={sy}
              x2={sx + 5}
              y2={sy}
              stroke={SCREW_LINE}
              strokeWidth="1.2"
              opacity="0.8"
            />
            <line
              x1={sx}
              y1={sy - 5}
              x2={sx}
              y2={sy + 5}
              stroke={SCREW_LINE}
              strokeWidth="1.2"
              opacity="0.8"
            />
          </g>
        ))}

        {/* INDEX — top-left below screw */}
        <text
          x="28"
          y="68"
          fontFamily="'Arial Narrow', Arial, sans-serif"
          fontSize="11"
          fontWeight="700"
          letterSpacing="1.5"
          fill={LABEL_TEXT_COLOR}
          opacity="0.9"
        >
          INDEX
        </text>
        <polygon
          points="28,73 34,77 28,81"
          fill={LABEL_TEXT_COLOR}
          opacity="0.75"
        />

        {/* NR line — top-right above window */}
        <text
          x={WIN_X + WIN_W}
          y="84"
          textAnchor="end"
          fontFamily="'Arial Narrow', Arial, sans-serif"
          fontSize="10"
          letterSpacing="1"
          fill={LABEL_TEXT_COLOR}
          opacity="0.75"
        >
          □ON □OFF
        </text>
        <text
          x="340"
          y="84"
          fontFamily="'Arial Narrow', Arial, sans-serif"
          fontSize="10"
          letterSpacing="1"
          fill={LABEL_TEXT_COLOR}
          opacity="0.75"
        >
          NR
        </text>
        <line
          x1="358"
          y1="80"
          x2={WIN_X + WIN_W - 78}
          y2="80"
          stroke={LABEL_TEXT_COLOR}
          strokeWidth="1.2"
          opacity="0.6"
        />

        {/* Reel window */}
        <rect
          x={WIN_X}
          y={WIN_Y}
          width={WIN_W}
          height={WIN_H}
          rx="12"
          fill={WINDOW_BG}
          stroke={WINDOW_RIM}
          strokeWidth="2.5"
        />
        <rect
          x={WIN_X + 2}
          y={WIN_Y + 2}
          width={WIN_W - 4}
          height={WIN_H - 4}
          rx="11"
          fill="none"
          stroke={SPOKE_COLOR}
          strokeWidth="0.4"
          opacity="0.2"
        />

        {/* Guide rails */}
        <rect
          x="65"
          y="260"
          width={W - 130}
          height="6"
          rx="3"
          fill={RAIL_FILL}
          stroke={RAIL_STROKE}
          strokeWidth="0.8"
        />
        <rect
          x="65"
          y="272"
          width={W - 130}
          height="6"
          rx="3"
          fill={RAIL_FILL}
          stroke={RAIL_STROKE}
          strokeWidth="0.8"
        />

        {/* Pinch rollers */}
        {([pinchLeftX, pinchRightX] as number[]).map((px, i) => (
          <g key={i}>
            <circle
              cx={px}
              cy={pinchCY}
              r={PINCH_R + 4}
              fill={PINCH_OUTER}
              stroke={PINCH_OUTER_STROKE}
              strokeWidth="1.2"
            />
            <circle
              cx={px}
              cy={pinchCY}
              r={PINCH_R}
              fill={PINCH_INNER}
              stroke={HUB_CENTER}
              strokeWidth="0.8"
            />
            <g
              style={{
                transform: `rotate(${rotation * 1.8}deg)`,
                transformOrigin: `${px}px ${pinchCY}px`,
              }}
            >
              {[0, 90, 180, 270].map((ang) => (
                <line
                  key={ang}
                  x1={px}
                  y1={pinchCY - PINCH_R + 1}
                  x2={px}
                  y2={pinchCY + PINCH_R - 1}
                  stroke={PINCH_LINE}
                  strokeWidth="1"
                  opacity="0.5"
                  transform={`rotate(${ang}, ${px}, ${pinchCY})`}
                />
              ))}
            </g>
          </g>
        ))}

        {/* Tape */}
        <path
          d={`M ${leftEdgeX} ${REEL_CY - 5} L ${pinchLeftX - PINCH_R} ${pinchCY - 2} Q ${W / 2} ${pinchY} ${pinchRightX + PINCH_R} ${pinchCY - 2} L ${rightEdgeX} ${REEL_CY - 5}`}
          fill="none"
          stroke={TAPE_COLOR}
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d={`M ${leftEdgeX} ${REEL_CY - 7} L ${pinchLeftX - PINCH_R} ${pinchCY - 4} Q ${W / 2} ${pinchY - 2} ${pinchRightX + PINCH_R} ${pinchCY - 4} L ${rightEdgeX} ${REEL_CY - 7}`}
          fill="none"
          stroke={TAPE_SHINE}
          strokeWidth="1.5"
        />

        {/* Reels */}
        <Reel cx={LEFT_CX} cy={REEL_CY} rotation={rotation} tapeR={leftTapeR} />
        <Reel
          cx={RIGHT_CX}
          cy={REEL_CY}
          rotation={rotation}
          tapeR={rightTapeR}
          flip
        />

        {/* Gears */}
        <Gear cx={100} cy={155} rotation={gearRot} />
        <Gear cx={W - 100} cy={155} rotation={-gearRot * 0.8} />

        {/* Erase head notch */}
        <path
          d={`M ${W / 2 - 40} ${H - 12} L ${W / 2 - 20} ${H - 28} L ${W / 2 + 20} ${H - 28} L ${W / 2 + 40} ${H - 12}`}
          fill={WINDOW_BG}
          stroke={WINDOW_RIM}
          strokeWidth="1.5"
        />
        <rect
          x={W / 2 - 12}
          y={H - 34}
          width="24"
          height="14"
          rx="3"
          fill={HEAD_FILL}
          stroke={HEAD_STROKE}
          strokeWidth="1"
        />
        <rect
          x={W / 2 - 7}
          y={H - 31}
          width="14"
          height="8"
          rx="1"
          fill={HEAD_INNER}
        />

        {/* HA-90 badge — bottom-right below window */}
        <rect
          x={WIN_X + WIN_W - 80}
          y={WIN_Y + WIN_H + 8}
          width="80"
          height="28"
          rx="4"
          fill={BADGE_RIGHT_BG}
        />
        <text
          x={WIN_X + WIN_W - 40}
          y={WIN_Y + WIN_H + 27}
          textAnchor="middle"
          fontFamily="'American Captain', 'Arial Black', sans-serif"
          fontSize="18"
          fontWeight="900"
          fill={BADGE_TEXT}
          letterSpacing="1"
        >
          HA-90
        </text>
      </svg>

      {flashOpacity > 0 && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "white",
            opacity: flashOpacity,
            zIndex: 10000,
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
}

export default LoadingScreen;
