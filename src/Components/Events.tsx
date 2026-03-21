import { useEffect, useMemo, useState, useRef } from "react";
import EventsWindow from "./EventWindow";
import { HackQuestScreen } from "./EventScreens";

const KF = "events-kf";
if (typeof document !== "undefined" && !document.getElementById(KF)) {
  const s = document.createElement("style");
  s.id = KF;
  s.textContent = `
    @keyframes evUp    { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:none} }
    @keyframes evScale { from{opacity:0;transform:scale(0.94)}      to{opacity:1;transform:none} }
  `;
  document.head.appendChild(s);
}

const REGISTRATION_URL =
  "https://unstop.com/hackathons/hackquest-an-18-hour-national-hackathon-hack-at-arch-40-government-engineering-college-gec-thrissur-1662896";

function Events() {
  const backgroundColor = "#F6EDC4";
  const dotColor = "#1C4969";

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  // sharedParentRef is attached to the section so both windows
  // use the same bounding box for drag constraints
  const sharedParentRef = useRef<HTMLDivElement>(null);

  const DOT_SIZE = 6;
  const DOT_SPACING = 40;

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const gridConfig = useMemo(() => {
    const cols = Math.ceil(windowWidth / DOT_SPACING);
    const rows = Math.ceil((windowHeight * 0.6) / DOT_SPACING);
    return {
      cols,
      rows,
      startCol: Math.floor(cols * 0.3),
      startRow: Math.floor(rows * 0.3),
    };
  }, [windowWidth, windowHeight]);

  const a = (name: string, delay: number): React.CSSProperties =>
    visible
      ? {
          animation: `${name} 0.75s cubic-bezier(0.22,1,0.36,1) ${delay}s both`,
        }
      : { opacity: 0 };

  return (
    // sharedParentRef on the outermost div — full section bounds
    <div
      ref={(el) => {
        (sectionRef as React.MutableRefObject<HTMLDivElement | null>).current =
          el;
        (
          sharedParentRef as React.MutableRefObject<HTMLDivElement | null>
        ).current = el;
      }}
      style={{
        width: "100%",
        minHeight: "80vh",
        backgroundColor,
        margin: 0,
        padding: 0,
        display: "grid",
        gridTemplateRows: "auto 1fr",
        position: "relative",
        overflow: "visible",
      }}
    >
      {/* Dot grid */}
      <div
        style={{
          position: "absolute",
          top: "2vh",
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 1,
          display: "grid",
          gridTemplateColumns: `repeat(${gridConfig.cols}, ${DOT_SPACING}px)`,
          gridTemplateRows: `repeat(${gridConfig.rows}, ${DOT_SPACING}px)`,
          justifyContent: "start",
          alignContent: "start",
          paddingTop: `${gridConfig.startRow * DOT_SPACING}px`,
          paddingLeft: `${gridConfig.startCol * DOT_SPACING}px`,
          opacity: visible ? 1 : 0,
          transition: "opacity 0.8s ease 0.1s",
        }}
      >
        {Array.from({ length: gridConfig.cols * gridConfig.rows }).map(
          (_, i) => (
            <div
              key={i}
              style={{
                width: `${DOT_SIZE}px`,
                height: `${DOT_SIZE}px`,
                backgroundColor: dotColor,
                borderRadius: "50%",
                justifySelf: "center",
                alignSelf: "center",
              }}
            />
          ),
        )}
      </div>

      {/* Scrolling X banner */}
      <div
        style={{
          position: "relative",
          width: "100vw",
          overflow: "hidden",
          userSelect: "none",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
          msUserSelect: "none",
        }}
      >
        <div
          style={{
            display: "grid",
            gridAutoFlow: "column",
            gridAutoColumns: "minmax(2vh, 1fr)",
            width: "200%",
            animation: "scrollLeft 40s infinite linear",
          }}
        >
          {Array.from({ length: Math.ceil(windowWidth / 25) * 2 }).map(
            (_, i) => (
              <img
                key={i}
                src="/x.png"
                alt=""
                style={{ width: "2vh", height: "auto", objectFit: "contain" }}
              />
            ),
          )}
        </div>
      </div>

      {/* Stars */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 2,
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gridTemplateRows: "auto 1fr",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.6s ease 0.3s",
        }}
      >
        <div
          style={{
            gridColumn: "2/3",
            gridRow: "1/2",
            padding: "5vh 5vw",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <img
            src="/star.png"
            alt="Star"
            style={{ width: "50px", height: "auto", objectFit: "contain" }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
        <div
          style={{
            gridColumn: "1/2",
            gridRow: "2/3",
            padding: "5vh 5vw",
            display: "flex",
            alignItems: "flex-end",
          }}
        >
          <img
            src="/star.png"
            alt="Star"
            style={{
              width: "50px",
              height: "auto",
              objectFit: "contain",
              transform: "rotate(180deg)",
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          display: "grid",
          gridTemplateRows: "auto 1fr",
          position: "relative",
          zIndex: 3,
          minHeight: "30vh",
        }}
      >
        {/* Title */}
        <div
          style={{
            display: "grid",
            placeItems: "center",
            paddingTop: "5vh",
            paddingBottom: "5vh",
            ...a("evUp", 0.05),
          }}
        >
          <div
            style={{
              fontFamily: "'American' Captain",
              fontSize: "clamp(2rem, 5vw, 4rem)",
              letterSpacing: "0.05em",
              textAlign: "center",
              color: "#0A3248",
            }}
          >
            <h1 style={{ margin: 0 }}>EVENTS</h1>
          </div>
        </div>

        {/* Window area — fixed height so windows have room */}
        <div
          style={{
            position: "relative",
            height: windowWidth < 900 ? "900px" : "500px",
            ...a("evScale", 0.25),
          }}
        >
          <EventsWindow
            screen={HackQuestScreen}
            registrationUrl={REGISTRATION_URL}
            title="HACKQUEST"
            parentRef={sharedParentRef}
            initialX={windowWidth < 900 ? 10 : 20}
            initialY={windowWidth < 900 ? 10 : 60}
          />
          {/*<EventsWindow
            screen={WarRoomScreen}
            registrationUrl={REGISTRATION_URL}
            title="WAR ROOM"
            parentRef={sharedParentRef}
            initialX={windowWidth < 900 ? 10 : 520}
            initialY={windowWidth < 900 ? 420 : 60}
          />*/}
        </div>
      </div>
    </div>
  );
}

export default Events;
