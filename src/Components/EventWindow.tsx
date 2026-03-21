import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  ImPlay2,
  ImPause2,
  ImStop,
  ImPrevious,
  ImNext,
  ImBackward2,
  ImForward3,
  ImVolumeHigh,
  ImVolumeMute2,
  ImMinus,
  ImEnlarge,
  ImCross,
  ImArrowLeft,
  ImArrowRight,
  ImEqualizer,
} from "react-icons/im";

interface ScreenProps {
  isPlaying: boolean;
  onProgressUpdate: (p: number) => void;
  progress: number;
}

interface EventsWindowProps {
  screen: React.ComponentType<ScreenProps>;
  registrationUrl?: string;
  title?: string;
  parentRef?: React.RefObject<HTMLDivElement | null>;
  initialX?: number;
  initialY?: number;
}

const EventsWindow: React.FC<EventsWindowProps> = ({
  screen: Screen,
  registrationUrl = "https://unstop.com/hackathons/hackquest-an-18-hour-national-hackathon-hack-at-arch-40-government-engineering-college-gec-thrissur-1662896",
  title = "EVENTS",
  parentRef: parentRefProp,
  initialX = 20,
  initialY = 20,
}) => {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isMinimized, setIsMinimized] = useState(false);
  const [showCannotMinimize, setShowCannotMinimize] = useState(false);
  const [showCannotMaximize, setShowCannotMaximize] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSliderDragging, setIsSliderDragging] = useState(false);
  const [screenHovered, setScreenHovered] = useState(false);

  const windowRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const internalRef = useRef<HTMLDivElement>(null);

  const getParent = () => parentRefProp?.current ?? internalRef.current;

  const handleProgressUpdate = useCallback((p: number) => {
    setProgress(p);
  }, []);

  const progressFromClientX = useCallback((clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    setProgress(pct);
  }, []);

  const handleSliderMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSliderDragging(true);
    progressFromClientX(e.clientX);
  };

  const handleTitleMouseDown = (e: React.MouseEvent) => {
    if (windowRef.current) {
      const parent = getParent();
      const pr = parent ? parent.getBoundingClientRect() : { left: 0, top: 0 };
      setDragOffset({
        x: e.clientX - pr.left - position.x,
        y: e.clientY - pr.top - position.y,
      });
      setIsDragging(true);
    }
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (isDragging && windowRef.current) {
        const parent = getParent();
        const wr = windowRef.current.getBoundingClientRect();
        if (parent) {
          const pr = parent.getBoundingClientRect();
          setPosition({
            x: Math.max(
              0,
              Math.min(e.clientX - pr.left - dragOffset.x, pr.width - wr.width),
            ),
            y: Math.max(
              0,
              Math.min(
                e.clientY - pr.top - dragOffset.y,
                pr.height - wr.height,
              ),
            ),
          });
        } else {
          setPosition({
            x: Math.max(0, e.clientX - dragOffset.x),
            y: Math.max(0, e.clientY - dragOffset.y),
          });
        }
      }
      if (isSliderDragging) progressFromClientX(e.clientX);
    };
    const onUp = () => {
      setIsDragging(false);
      setIsSliderDragging(false);
    };
    if (isDragging || isSliderDragging) {
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    }
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
  }, [
    isDragging,
    isSliderDragging,
    dragOffset,
    progressFromClientX,
    getParent,
  ]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStop = () => {
    setIsPlaying(false);
    setProgress(0);
  };
  const handleGoToStart = () => {
    setIsPlaying(false);
    setProgress(0);
  };
  const handleGoToEnd = () => {
    setIsPlaying(false);
    setProgress(1);
  };
  const handlePrev = () => setProgress((p) => Math.max(0, p - 0.1));
  const handleNext = () => setProgress((p) => Math.min(1, p + 0.1));
  const handleMute = () => setIsMuted((m) => !m);

  const handleMinimize = () => {
    if (isMinimized) {
      setShowCannotMinimize(true);
      setTimeout(() => setShowCannotMinimize(false), 2000);
    } else setIsMinimized(true);
  };
  const handleMaximize = () => {
    if (!isMinimized) {
      setShowCannotMaximize(true);
      setTimeout(() => setShowCannotMaximize(false), 2000);
    } else setIsMinimized(false);
  };

  const atStart = progress <= 0;
  const atEnd = progress >= 1;

  const iconBtn = (active = false, disabled = false): React.CSSProperties => ({
    background: active ? "#a0a0a0" : "none",
    border: active ? "2px inset #666" : "none",
    padding: "4px 6px",
    cursor: disabled ? "default" : "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: disabled ? "#aaa" : "#222",
    borderRadius: "2px",
    opacity: disabled ? 0.5 : 1,
  });

  const titleIconBtn: React.CSSProperties = {
    background: "#c8d8c8",
    border: "2px solid #888",
    borderRadius: "3px",
    width: "28px",
    height: "24px",
    padding: 0,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#0A3248",
  };

  return (
    <div
      ref={parentRefProp ? undefined : internalRef}
      style={{
        position: parentRefProp ? "static" : "relative",
        width: parentRefProp ? 0 : "100%",
        height: parentRefProp ? 0 : "100%",
        background: "transparent",
        overflow: "visible",
      }}
    >
      <div
        ref={windowRef}
        style={{
          position: "absolute",
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: isMinimized ? "176px" : "480px",
          height: isMinimized ? "auto" : "384px",
          border: "3px solid #444",
          borderRadius: "6px",
          overflow: "hidden",
          boxShadow: "4px 4px 0px rgba(0,0,0,0.5)",
          transition: "width 0.3s, height 0.3s",
          fontFamily: "'American Captain', monospace",
          userSelect: "none",
          zIndex: isDragging ? 100 : 10,
        }}
      >
        {/* Title bar */}
        <div
          onMouseDown={handleTitleMouseDown}
          style={{
            background: "#3AAE95",
            height: "36px",
            cursor: isDragging ? "grabbing" : "grab",
            display: "flex",
            alignItems: "center",
            padding: "0 6px",
            gap: "4px",
          }}
        >
          <span
            style={{
              flex: 1,
              paddingLeft: "8px",
              fontSize: "13px",
              fontWeight: 700,
              color: "#0A3248",
              letterSpacing: "1px",
              pointerEvents: "none",
            }}
          >
            {title}
          </span>
          <button
            style={titleIconBtn}
            onClick={handleMinimize}
            title="Minimize"
          >
            <ImMinus size={10} />
          </button>
          <button style={titleIconBtn} onClick={handleMaximize} title="Restore">
            <ImEnlarge size={10} />
          </button>
          <button
            style={{
              ...titleIconBtn,
              background: "#d88",
              borderColor: "#a44",
              color: "#fff",
            }}
            title="Close"
          >
            <ImCross size={10} />
          </button>
        </div>

        {/* Toolbar */}
        <div
          style={{
            background: "#c0c0c0",
            height: "44px",
            display: "flex",
            alignItems: "center",
            padding: "0 12px",
            gap: "4px",
            borderBottom: "2px solid #888",
          }}
        >
          <button
            style={iconBtn(false, atStart)}
            onClick={handlePrev}
            title="Previous"
          >
            <ImArrowLeft size={20} color={atStart ? "#aaa" : "#0A3248"} />
          </button>
          <button
            style={iconBtn(false, atEnd)}
            onClick={handleNext}
            title="Next"
          >
            {" "}
            <ImArrowRight size={20} color={atEnd ? "#aaa" : "#0A3248"} />
          </button>
          <div
            style={{
              width: "1px",
              height: "24px",
              background: "#888",
              margin: "0 4px",
            }}
          />
          <div style={{ flex: 1 }} />
          <button style={iconBtn()} title="Settings">
            <ImEqualizer size={20} color="#0A3248" />
          </button>
        </div>

        {/* Screen */}
        <div
          onClick={() => window.open(registrationUrl, "_blank")}
          onMouseEnter={() => setScreenHovered(true)}
          onMouseLeave={() => setScreenHovered(false)}
          style={{
            height: isMinimized ? "0px" : "calc(100% - 44px - 36px - 70px)",
            overflow: "hidden",
            position: "relative",
            cursor: "pointer",
          }}
        >
          {!isMinimized && (
            <Screen
              isPlaying={isPlaying}
              onProgressUpdate={handleProgressUpdate}
              progress={progress}
            />
          )}
          {screenHovered && !isMinimized && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "rgba(58,174,149,0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
              }}
            >
              <div
                style={{
                  backgroundColor: "rgba(10,50,72,0.88)",
                  border: "2px solid #3aae95",
                  borderRadius: "4px",
                  padding: "6px 16px",
                  color: "#3aae95",
                  fontSize: "clamp(9px,1.4vw,12px)",
                  letterSpacing: "0.2em",
                  fontFamily: "'American Captain',monospace",
                }}
              >
                CLICK TO REGISTER
              </div>
            </div>
          )}
        </div>

        {/* Bottom controls */}
        {!isMinimized && (
          <div
            style={{
              background: "#c0c0c0",
              height: "70px",
              display: "flex",
              flexDirection: "column",
              padding: "8px 10px",
              gap: "6px",
              borderTop: "2px solid #888",
              overflow: "hidden",
            }}
          >
            <div
              ref={sliderRef}
              onMouseDown={handleSliderMouseDown}
              style={{
                position: "relative",
                width: "100%",
                height: "14px",
                background: "#999",
                border: "2px inset #666",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  height: "100%",
                  width: `${progress * 100}%`,
                  background: "#6b9999",
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: `${progress * 100}%`,
                  top: 0,
                  width: "14px",
                  height: "100%",
                  background: "#e0e0e0",
                  border: "2px solid #333",
                  transform: "translateX(-50%)",
                  cursor: "ew-resize",
                }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
              <button
                style={iconBtn(false, atStart)}
                onClick={handleGoToStart}
                title="Go to start"
              >
                <ImPrevious size={18} />
              </button>
              <button
                style={iconBtn(false, atStart)}
                onClick={handlePrev}
                title="Previous"
              >
                {" "}
                <ImBackward2 size={18} />
              </button>
              {isPlaying ? (
                <button
                  style={iconBtn(true)}
                  onClick={handlePause}
                  title="Pause"
                >
                  <ImPause2 size={18} color="#007a60" />
                </button>
              ) : (
                <button
                  style={iconBtn(false)}
                  onClick={handlePlay}
                  title="Play"
                >
                  {" "}
                  <ImPlay2 size={18} color={atEnd ? "#aaa" : "#222"} />
                </button>
              )}
              <button style={iconBtn(false)} onClick={handleStop} title="Stop">
                {" "}
                <ImStop size={18} />
              </button>
              <button
                style={iconBtn(false, atEnd)}
                onClick={handleNext}
                title="Next"
              >
                {" "}
                <ImForward3 size={18} />
              </button>
              <button
                style={iconBtn(false, atEnd)}
                onClick={handleGoToEnd}
                title="Go to end"
              >
                {" "}
                <ImNext size={18} />
              </button>
              <div
                style={{
                  width: "1px",
                  height: "18px",
                  background: "#888",
                  margin: "0 4px",
                }}
              />
              <div style={{ flex: 1 }} />
              {isMuted ? (
                <button
                  style={iconBtn(true)}
                  onClick={handleMute}
                  title="Unmute"
                >
                  <ImVolumeMute2 size={18} color="#c00" />
                </button>
              ) : (
                <button
                  style={iconBtn(false)}
                  onClick={handleMute}
                  title="Mute"
                >
                  {" "}
                  <ImVolumeHigh size={18} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {showCannotMinimize && <Toast>Cannot Minimize</Toast>}
      {showCannotMaximize && <Toast>Cannot Maximize</Toast>}
    </div>
  );
};

function Toast({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
        background: "#c0c0c0",
        border: "3px solid #444",
        borderRadius: "6px",
        padding: "24px 40px",
        fontSize: "16px",
        fontFamily: "'American Captain',monospace",
        boxShadow: "4px 4px 0 rgba(0,0,0,0.6)",
        zIndex: 1000,
        color: "#0A3248",
      }}
    >
      {children}
    </div>
  );
}

export default EventsWindow;
