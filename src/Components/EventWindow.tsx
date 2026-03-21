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

interface EventsWindowProps {
  eventArray?: React.ReactNode[];
  totalDuration?: number;
}

const EventsWindow: React.FC<EventsWindowProps> = ({
  eventArray = [
    <div key={0} style={{ color: "#fff", fontSize: "24px", padding: "20px" }}>
      Event 1
    </div>,
    <div key={1} style={{ color: "#fff", fontSize: "24px", padding: "20px" }}>
      Event 2
    </div>,
    <div key={2} style={{ color: "#fff", fontSize: "24px", padding: "20px" }}>
      Event 3
    </div>,
    <div key={3} style={{ color: "#fff", fontSize: "24px", padding: "20px" }}>
      Event 4
    </div>,
  ],
  totalDuration = 10000,
}) => {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isMinimized, setIsMinimized] = useState(false);
  const [showCannotMinimize, setShowCannotMinimize] = useState(false);
  const [showCannotMaximize, setShowCannotMaximize] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const [progress, setProgress] = useState(0);

  const [isSliderDragging, setIsSliderDragging] = useState(false);
  const total = eventArray.length;
  const currentIndex = Math.min(Math.floor(progress * total), total - 1);

  const windowRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  const rafRef = useRef<number>(0);
  const playStartRef = useRef<number>(0);
  const progressAtPlay = useRef<number>(0);
  const isPlayingRef = useRef(false);

  const startRAF = useCallback(
    (fromProgress: number) => {
      cancelAnimationFrame(rafRef.current);
      playStartRef.current = performance.now();
      progressAtPlay.current = fromProgress;
      isPlayingRef.current = true;

      const tick = (now: number) => {
        if (!isPlayingRef.current) return;
        const elapsed = now - playStartRef.current;
        const newProgress = Math.min(
          progressAtPlay.current + elapsed / totalDuration,
          1,
        );
        setProgress(newProgress);

        if (newProgress >= 1) {
          isPlayingRef.current = false;
          setIsPlaying(false);
          return;
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    },
    [totalDuration],
  );

  const stopRAF = useCallback(() => {
    isPlayingRef.current = false;
    cancelAnimationFrame(rafRef.current);
  }, []);

  const handlePlay = useCallback(() => {
    if (progress >= 1) {
      setProgress(0);
      startRAF(0);
    } else {
      startRAF(progress);
    }
    setIsPlaying(true);
  }, [progress, startRAF]);

  const handlePause = useCallback(() => {
    stopRAF();
    setIsPlaying(false);
  }, [stopRAF]);

  const handleStop = useCallback(() => {
    stopRAF();
    setIsPlaying(false);
    setProgress(0);
  }, [stopRAF]);

  const handleGoToStart = useCallback(() => {
    stopRAF();
    setIsPlaying(false);
    setProgress(0);
  }, [stopRAF]);

  const handleGoToEnd = useCallback(() => {
    stopRAF();
    setIsPlaying(false);
    setProgress(1);
  }, [stopRAF]);

  const handlePrev = useCallback(() => {
    stopRAF();
    setIsPlaying(false);

    const boundary = currentIndex / total;
    const atBoundary = Math.abs(progress - boundary) < 0.001;
    const target = atBoundary
      ? Math.max(0, (currentIndex - 1) / total)
      : boundary;
    setProgress(target);
  }, [stopRAF, currentIndex, total, progress]);

  const handleNext = useCallback(() => {
    stopRAF();
    setIsPlaying(false);
    const target = Math.min((currentIndex + 1) / total, 1);
    setProgress(target);
  }, [stopRAF, currentIndex, total]);

  const handleMute = () => setIsMuted((m) => !m);

  const handleBack = handlePrev;
  const handleForward = handleNext;

  const progressFromClientX = useCallback(
    (clientX: number) => {
      if (!sliderRef.current) return;
      const rect = sliderRef.current.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      stopRAF();
      setIsPlaying(false);
      setProgress(pct);
    },
    [stopRAF],
  );

  const handleSliderMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSliderDragging(true);
    progressFromClientX(e.clientX);
  };

  const handleTitleMouseDown = (e: React.MouseEvent) => {
    if (windowRef.current) {
      const rect = windowRef.current.getBoundingClientRect();
      setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      setIsDragging(true);
    }
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (isDragging && windowRef.current && parentRef.current) {
        const pr = parentRef.current.getBoundingClientRect();
        const wr = windowRef.current.getBoundingClientRect();
        setPosition({
          x: Math.max(
            0,
            Math.min(e.clientX - dragOffset.x - pr.left, pr.width - wr.width),
          ),
          y: Math.max(
            0,
            Math.min(e.clientY - dragOffset.y - pr.top, pr.height - wr.height),
          ),
        });
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
  }, [isDragging, isSliderDragging, dragOffset, progressFromClientX]);

  useEffect(() => () => stopRAF(), [stopRAF]);

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

  const atStart = progress <= 0;
  const atEnd = progress >= 1;

  return (
    <div
      ref={parentRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        background: "transparent",
        overflow: "hidden",
      }}
    >
      <div
        ref={windowRef}
        style={{
          position: "absolute",
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: isMinimized ? "220px" : "600px",
          height: isMinimized ? "auto" : "650px",
          border: "3px solid #444",
          borderRadius: "6px",
          overflow: "hidden",
          boxShadow: "4px 4px 0px rgba(0,0,0,0.5)",
          transition: "width 0.3s, height 0.3s",
          fontFamily: "'American Captain', monospace",
          userSelect: "none",
        }}
      >
        {/* Title bar */}
        <div
          onMouseDown={handleTitleMouseDown}
          style={{
            background: "linear-gradient(to right, #a8d5a8, #6b9999)",
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
            EVENTS — {currentIndex + 1} / {total}
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
            onClick={handleBack}
            title="Previous event"
          >
            <ImArrowLeft size={20} color={atStart ? "#aaa" : "#0A3248"} />
          </button>
          <button
            style={iconBtn(false, atEnd)}
            onClick={handleForward}
            title="Next event"
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

        {/* Main screen */}
        <div
          style={{
            background: "#000",
            height: isMinimized ? "0px" : "calc(100% - 44px - 36px - 70px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {!isMinimized && eventArray[currentIndex]}
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
            }}
          >
            {/* Scrubber — pixel-perfect teal fill */}
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

            {/* Transport row */}
            <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
              <button
                style={iconBtn(false, atStart)}
                onClick={handleGoToStart}
                title="Go to start"
              >
                {" "}
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

              {/* Play/Pause toggle — only one shown at a time */}
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

              {/* Mute toggle */}
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

      {showCannotMinimize && (
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
            fontFamily: "'American Captain', monospace",
            boxShadow: "4px 4px 0 rgba(0,0,0,0.6)",
            zIndex: 1000,
            color: "#0A3248",
          }}
        >
          Cannot Minimize
        </div>
      )}
      {showCannotMaximize && (
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
            fontFamily: "'American Captain', monospace",
            boxShadow: "4px 4px 0 rgba(0,0,0,0.6)",
            zIndex: 1000,
            color: "#0A3248",
          }}
        >
          Cannot Maximize
        </div>
      )}
    </div>
  );
};

export default EventsWindow;
