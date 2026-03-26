import { useEffect, useState, useRef } from "react";
import Workshop from "./WorkShop";

const background = "#F6EDC4";
const navy = "#0A3248";

const KF = "workshops-kf";
if (typeof document !== "undefined" && !document.getElementById(KF)) {
  const s = document.createElement("style");
  s.id = KF;
  s.textContent = `
    @keyframes wsUp    { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:none} }
    @keyframes wsLeft  { from{opacity:0;transform:translateX(-48px)} to{opacity:1;transform:none} }
    @keyframes wsRight { from{opacity:0;transform:translateX(48px)}  to{opacity:1;transform:none} }
    @keyframes spin { from{transform:translate(-50%,-50%) rotate(0deg)} to{transform:translate(-50%,-50%) rotate(360deg)} }
    @keyframes scrollRight { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
  `;
  document.head.appendChild(s);
}

interface MusicNote {
  id: number;
  x: number;
  y: number;
  speed: number;
  size: number;
}

export default function Workshops() {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [notes, setNotes] = useState<MusicNote[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [visible, setVisible] = useState(false);
  const nextNoteIdRef = useRef(0);
  const animationRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const MAX_NOTES = 10;
  const [containerWidth, setContainerWidth] = useState(0);
  const noteImages = [
    "/note1.webp",
    "/note2.webp",
    "/note3.webp",
    "/note4.webp",
  ];

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
      if (containerRef.current)
        setContainerWidth(containerRef.current.offsetWidth);
    };
    handleResize();
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
      { threshold: 0.2 },
    );
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const spawnNote = () => {
      setNotes((prev) => {
        if (prev.length >= MAX_NOTES) return prev;
        const speed = Math.random() * 0.5 + 0.6;
        const size = (1 / speed) * 30;
        const width = containerWidth || window.innerWidth;
        const newX = isInitialLoad ? Math.random() * width : width + size;
        const newY = Math.random() * 80;
        const note: MusicNote = {
          id: nextNoteIdRef.current,
          x: newX,
          y: newY,
          speed,
          size,
        };
        nextNoteIdRef.current++;
        return [...prev, note];
      });
    };
    for (let i = 1; i < MAX_NOTES; i++) setTimeout(spawnNote, i * 10);
    setTimeout(() => setIsInitialLoad(false), MAX_NOTES * 500 + 500);
    const spawnInterval = setInterval(spawnNote, 2000);
    return () => clearInterval(spawnInterval);
  }, [isInitialLoad, MAX_NOTES, containerWidth]);

  useEffect(() => {
    const animateNotes = () => {
      setNotes((prev) =>
        prev
          .map((n) => ({ ...n, x: n.x - n.speed }))
          .filter((n) => n.x > -n.size),
      );
      animationRef.current = requestAnimationFrame(animateNotes);
    };
    animationRef.current = requestAnimationFrame(animateNotes);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [containerWidth]);

  const a = (name: string, delay: number): React.CSSProperties =>
    visible
      ? {
          animation: `${name} 0.75s cubic-bezier(0.22,1,0.36,1) ${delay}s both`,
        }
      : { opacity: 0 };

  return (
    <div
      ref={containerRef}
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: background,
        position: "relative",
        overflow: "hidden",
        height: "min(800px, 100vw)",
      }}
    >
      <div
        style={{
          fontFamily: "'American' Captain",
          paddingLeft: "3vw",
          paddingTop: "5vh",
          fontSize: "clamp(2rem, 4vh, 5vh)",
          letterSpacing: "0.05em",
          zIndex: "2" as unknown as number,
          color: navy,
          ...a("wsUp", 0.05),
        }}
      >
        <h1 style={{ margin: 0 }}>WORKSHOPS</h1>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: screenWidth >= 1600 ? "flex-start" : "space-evenly",
          height: screenWidth < 900 ? "auto" : "50vh",
          backgroundColor: background,
          position: "relative",
          flex: 1,
        }}
      >
        <div
          style={{
            flex: "1 1 0",
            maxWidth: "600px",
            marginLeft: screenWidth >= 1600 ? "3vw" : "0",
            ...a("wsLeft", 0.2),
          }}
        >
          <Workshop
            workshopName={"Intro  To\nDevOps"}
            workshopNumber={0}
            registerLink={
              "https://docs.google.com/forms/d/e/1FAIpQLSckhYR5ch5m9q8ogCtajFVZAK9pe-m0QxjNbP762Y7oLeOKVw/viewform?usp=publish-editor"
            }
          />
        </div>
        <div
          style={{
            flex: "1 1 0",
            maxWidth: "600px",
            marginLeft: screenWidth >= 1600 ? "3vw" : "0",
            ...a("wsRight", 0.35),
          }}
        >
          <Workshop
            workshopName={"Intro  To\nCAD"}
            workshopNumber={0}
            registerLink={
              "https://docs.google.com/forms/d/e/1FAIpQLSc-Sm0tBaXSmLqg1wGFn6897jGSGzLJsn_pBHYQVFyZ2QWWuQ/viewform?usp=publish-editor"
            }
          />
        </div>
        {screenWidth >= 1600 && (
          <div
            style={{
              pointerEvents: "none",
              userSelect: "none",
              WebkitUserSelect: "none",
              MozUserSelect: "none",
              msUserSelect: "none",
              position: "absolute",
              right: "2vw",
              bottom: "40%",
              height: "min(400px, 100vw)",
              objectFit: "contain" as unknown as undefined,
              opacity: 0.6,
            }}
          >
            <img src="/workshopimage.webp" alt="" />
          </div>
        )}
      </div>

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
            gridAutoColumns: "minmax(1vh, 1fr)",
            width: "200vw",
            animation: "scrollRight 40s infinite linear",
          }}
        >
          {Array.from({ length: Math.ceil(screenWidth / 25) * 2 }).map(
            (_, i) => (
              <img
                key={i}
                src="/x.webp"
                alt=""
                style={{ width: "2vh", height: "auto", objectFit: "contain" }}
              />
            ),
          )}
        </div>
      </div>

      {notes.map((note) => {
        const noteImage = noteImages[note.id % noteImages.length];
        return (
          <div
            key={note.id}
            style={{
              position: "absolute",
              left: `${note.x}px`,
              top: `${note.y}vh`,
              width: `${note.size}px`,
              height: `${note.size}px`,
              zIndex: 0,
              pointerEvents: "none",
              userSelect: "none",
              WebkitUserSelect: "none",
              MozUserSelect: "none",
              msUserSelect: "none",
            }}
          >
            <img
              src={noteImage}
              alt="music note"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
        );
      })}
    </div>
  );
}
