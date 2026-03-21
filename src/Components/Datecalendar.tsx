import { useState, useEffect, useRef } from "react";

const DATES = [
  { month: "MARCH", date: "27", day: "FRIDAY" },
  { month: "MARCH", date: "28", day: "SATURDAY" },
  { month: "MARCH", date: "29", day: "SUNDAY" },
];

const TEXT_COLOR = "#0A3248";
const PAGE_BORDER = "#b89a60";
const TAPE_COLOR = "#c8a87a";
const STAPLE_CLR = "#7a6040";

interface DateCalendarProps {
  embedded?: boolean;
}

function DateCalendar({ embedded = false }: DateCalendarProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDir, setFlipDir] = useState<"fwd" | "bwd">("fwd");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const sectionRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isMobile = windowWidth < 1000;

  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const ID = "datecal-keyframes";
    if (document.getElementById(ID)) return;
    const style = document.createElement("style");
    style.id = ID;
    style.textContent = `
            @keyframes calFlipFwd {
                0%   { transform: perspective(900px) rotateX(0deg);  opacity: 1; }
                45%  { transform: perspective(900px) rotateX(-88deg); opacity: 0; }
                55%  { transform: perspective(900px) rotateX(-88deg); opacity: 0; }
                100% { transform: perspective(900px) rotateX(0deg);  opacity: 1; }
            }
            @keyframes calFlipBwd {
                0%   { transform: perspective(900px) rotateX(0deg);  opacity: 1; }
                45%  { transform: perspective(900px) rotateX(88deg);  opacity: 0; }
                55%  { transform: perspective(900px) rotateX(88deg);  opacity: 0; }
                100% { transform: perspective(900px) rotateX(0deg);  opacity: 1; }
            }
        `;
    document.head.appendChild(style);
    return () => {
      document.getElementById(ID)?.remove();
    };
  }, []);

  const triggerFlip = (targetPage: number, dir: "fwd" | "bwd") => {
    if (isFlipping) return;
    setFlipDir(dir);
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentPage(targetPage);
    }, 375);
    setTimeout(() => {
      setIsFlipping(false);
    }, 750);
  };

  const goNext = () => triggerFlip((currentPage + 1) % DATES.length, "fwd");
  const goPrev = () =>
    triggerFlip((currentPage - 1 + DATES.length) % DATES.length, "bwd");

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = touchStartX.current - e.changedTouches[0].clientX;
    const dy = Math.abs(touchStartY.current - e.changedTouches[0].clientY);
    if (Math.abs(dx) > 44 && Math.abs(dx) > dy) {
      if (dx > 0) {
        goNext();
      } else {
        goPrev();
      }
    }
  };

  const cardWidth = embedded
    ? isMobile
      ? "min(calc(100vw - 80px), 200px)"
      : "clamp(200px, 20vw, 280px)"
    : isMobile
      ? "min(calc(100vw - 48px), 320px)"
      : "clamp(260px, 32vw, 380px)";

  const alpha = embedded ? "0.55" : "1";
  const pageBg = embedded
    ? `linear-gradient(155deg, rgba(250,238,200,${alpha}) 0%, rgba(238,212,150,${alpha}) 100%)`
    : `linear-gradient(155deg, #faeec8 0%, #eed496 100%)`;

  const arrowBtn: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    backgroundColor: embedded ? "rgba(245,230,200,0.6)" : "#F5E6C8",
    border: embedded ? "1.5px solid rgba(10,50,72,0.5)" : "2px solid #0A3248",
    borderRadius: "50%",
    width: embedded ? "36px" : "40px",
    height: embedded ? "36px" : "40px",
    fontSize: embedded ? "20px" : "22px",
    cursor: "pointer",
    boxShadow: embedded
      ? "2px 2px 0 rgba(229,173,88,0.5)"
      : "3px 3px 0 #E5AD58",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.15s ease",
    zIndex: 40,
    color: TEXT_COLOR,
    fontFamily: "'American' Captain",
    backdropFilter: embedded ? "blur(6px)" : "none",
    WebkitBackdropFilter: embedded ? "blur(6px)" : "none",
  };

  const pageData = DATES[currentPage];
  const arrowPad = embedded ? 44 : 52;

  const CalendarCard = (
    <div
      ref={sectionRef}
      style={{
        position: "relative",
        width: cardWidth,
        margin: "0 auto",
        paddingBottom: "8px",
        paddingRight: "8px",
        boxSizing: "content-box" as const,
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Stack shadows */}
      <div
        style={{
          position: "absolute",
          top: "8px",
          left: "6px",
          right: "-8px",
          bottom: "-8px",
          backgroundColor: embedded ? "rgba(220,195,130,0.4)" : "#dfc578",
          border: `1.5px solid ${embedded ? "rgba(196,168,114,0.4)" : PAGE_BORDER}`,
          borderRadius: "12px",
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "4px",
          left: "3px",
          right: "-4px",
          bottom: "-4px",
          backgroundColor: embedded ? "rgba(232,208,144,0.45)" : "#e8d090",
          border: `1.5px solid ${embedded ? "rgba(196,168,114,0.5)" : PAGE_BORDER}`,
          borderRadius: "12px",
          zIndex: 2,
        }}
      />

      {/* ── Logo — always present behind the card, revealed when card flips away ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "12px",
          zIndex: 9,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <img
          src="/logo.png"
          alt=""
          style={{
            width: "75%",
            height: "75%",
            objectFit: "contain",
            filter:
              "brightness(0) saturate(100%) invert(14%) sepia(40%) saturate(800%) hue-rotate(175deg)",
            opacity: 0.9,
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      </div>

      {/* Main page */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          border: `${embedded ? "1.5px" : "2px"} solid ${embedded ? "rgba(184,154,96,0.6)" : PAGE_BORDER}`,
          borderRadius: "12px",
          paddingTop: embedded ? "3.2vh" : "4.5vh",
          paddingBottom: embedded ? "2vh" : "3vh",
          boxSizing: "border-box" as const,
          background: pageBg,
          boxShadow: embedded
            ? `2px 2px 0 rgba(184,149,96,0.4)`
            : `4px 4px 0 #b8956a`,
          backdropFilter: embedded ? "blur(12px)" : "none",
          WebkitBackdropFilter: embedded ? "blur(12px)" : "none",
          transformOrigin: "top center",
          animation: isFlipping
            ? `${flipDir === "fwd" ? "calFlipFwd" : "calFlipBwd"} 0.75s cubic-bezier(0.45,0,0.55,1)`
            : "none",
        }}
      >
        {/* Tape */}
        <div
          style={{
            position: "absolute",
            top: "-13px",
            left: "50%",
            transform: "translateX(-50%)",
            width: embedded ? "64px" : "88px",
            height: embedded ? "18px" : "24px",
            backgroundColor: TAPE_COLOR,
            borderRadius: "3px",
            zIndex: 30,
            opacity: embedded ? 0.7 : 0.9,
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: embedded ? "16px" : "22px",
          }}
        >
          {[0, 1].map((i) => (
            <div
              key={i}
              style={{
                width: embedded ? "10px" : "13px",
                height: "3.5px",
                backgroundColor: STAPLE_CLR,
                borderRadius: "1.5px",
                boxShadow: "0 1px 2px rgba(0,0,0,0.35)",
              }}
            />
          ))}
        </div>

        {/* Faint horizontal rules */}
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: "8%",
              right: "8%",
              top: `${20 + i * 20}%`,
              height: "1px",
              backgroundColor: "rgba(160,128,64,0.12)",
              pointerEvents: "none",
            }}
          />
        ))}

        {/* Date content */}
        <div
          style={{
            textAlign: "center",
            fontFamily: "'American' Captain",
            letterSpacing: "0.06em",
            color: TEXT_COLOR,
            userSelect: "none",
            padding: "0 4%",
          }}
        >
          <div
            style={{
              fontSize: embedded
                ? "clamp(0.78rem, 1.6vw, 1.15rem)"
                : "clamp(0.9rem, 2.2vw, 1.4rem)",
              opacity: 0.5,
              letterSpacing: "0.32em",
              marginBottom: "1vh",
            }}
          >
            {pageData.month}
          </div>

          <div
            style={{
              fontSize: embedded
                ? "clamp(3.8rem, 10vw, 6.8rem)"
                : "clamp(5rem, 16vw, 10rem)",
              fontWeight: "bold",
              lineHeight: 0.85,
              marginBottom: "0.6vh",
              marginTop: "1vh",
              textShadow:
                "2px 2px 0 rgba(0,0,0,0.07), -1px -1px 0 rgba(255,255,255,0.35)",
              color: "#0a2e40",
            }}
          >
            {pageData.date}
          </div>

          <div
            style={{
              fontSize: embedded
                ? "clamp(0.68rem, 1.4vw, 1rem)"
                : "clamp(0.8rem, 1.9vw, 1.25rem)",
              opacity: 0.48,
              letterSpacing: "0.26em",
              marginBottom: "0.2vh",
            }}
          >
            {pageData.day}
          </div>
        </div>

        {/* Dot indicators */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "6px",
            marginTop: embedded ? "1.6vh" : "2.5vh",
            paddingBottom: "0.3vh",
          }}
        >
          {DATES.map((_, i) => (
            <div
              key={i}
              onClick={() => {
                if (i === currentPage || isFlipping) return;
                triggerFlip(i, i > currentPage ? "fwd" : "bwd");
              }}
              style={{
                width: i === currentPage ? "20px" : "6px",
                height: "6px",
                borderRadius: "3px",
                backgroundColor:
                  i === currentPage
                    ? embedded
                      ? "rgba(10,50,72,0.8)"
                      : TEXT_COLOR
                    : embedded
                      ? "rgba(184,154,96,0.45)"
                      : PAGE_BORDER,
                cursor: i !== currentPage ? "pointer" : "default",
                transition: "all 0.3s ease",
                border: `1.5px solid ${embedded ? "rgba(184,154,96,0.35)" : PAGE_BORDER}`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );

  if (embedded) {
    return (
      <div
        style={{
          position: "relative",
          padding: isMobile ? "0" : `0 ${arrowPad}px`,
          width: isMobile
            ? `calc(${cardWidth} + 16px)`
            : `calc(${cardWidth} + ${arrowPad * 2}px)`,
          boxSizing: "border-box" as const,
        }}
      >
        {!isMobile && (
          <button
            onClick={goPrev}
            style={{ ...arrowBtn, left: 0 }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(240,220,180,0.75)";
              e.currentTarget.style.transform = "translateY(-52%)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(245,230,200,0.6)";
              e.currentTarget.style.transform = "translateY(-50%)";
            }}
          >
            ‹
          </button>
        )}
        {CalendarCard}
        {!isMobile && (
          <button
            onClick={goNext}
            style={{ ...arrowBtn, right: 0 }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(240,220,180,0.75)";
              e.currentTarget.style.transform = "translateY(-52%)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(245,230,200,0.6)";
              e.currentTarget.style.transform = "translateY(-50%)";
            }}
          >
            ›
          </button>
        )}
        {isMobile && (
          <div
            style={{
              textAlign: "center",
              fontFamily: "Arcade Classic, monospace",
              fontSize: "clamp(0.5rem, 2.5vw, 0.8rem)",
              color: "rgba(28,73,105,0.7)",
              letterSpacing: "0.15em",
              marginTop: "1.5vh",
            }}
          >
            ← SWIPE TO FLIP →
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "#F6EDC4",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "6vh 5vw 9vh",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          fontFamily: "'American' Captain",
          fontSize: "clamp(2rem, 6vw, 5rem)",
          letterSpacing: "0.05em",
          textAlign: "center",
          color: TEXT_COLOR,
          marginBottom: "6vh",
        }}
      >
        <h2 style={{ margin: 0 }}>SAVE THE DATE</h2>
      </div>
      <div
        style={{
          position: "relative",
          padding: isMobile ? "0" : "0 56px",
          width: isMobile ? cardWidth : `calc(${cardWidth} + 112px)`,
          maxWidth: "100%",
          boxSizing: "border-box",
        }}
      >
        {!isMobile && (
          <button
            onClick={goPrev}
            style={{ ...arrowBtn, left: 0 }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#F0DDB8";
              e.currentTarget.style.transform = "translateY(-52%)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#F5E6C8";
              e.currentTarget.style.transform = "translateY(-50%)";
            }}
          >
            ‹
          </button>
        )}
        {CalendarCard}
        {!isMobile && (
          <button
            onClick={goNext}
            style={{ ...arrowBtn, right: 0 }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#F0DDB8";
              e.currentTarget.style.transform = "translateY(-52%)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#F5E6C8";
              e.currentTarget.style.transform = "translateY(-50%)";
            }}
          >
            ›
          </button>
        )}
        {isMobile && (
          <div
            style={{
              textAlign: "center",
              fontFamily: "Arcade Classic, monospace",
              fontSize: "clamp(0.55rem, 2.8vw, 0.8rem)",
              color: "#1C4969",
              letterSpacing: "0.18em",
              opacity: 0.6,
              marginTop: "2.5vh",
            }}
          >
            ← SWIPE TO FLIP →
          </div>
        )}
      </div>
    </div>
  );
}

export default DateCalendar;
