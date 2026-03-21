import { useEffect, useState, useRef } from "react";

const COLORS = {
  bg: "#F6EDC4",
  navy: "#0A3248",
  teal: "#005061",
  accent: "#3aae95",
  green: "#7AA58A",
  cream: "#F8EDCD",
};

const DOTS = Array.from({ length: 50 }, (_, i) => {
  const t1 = Math.sin(i * 127.1) * 43758.5453;
  const t2 = Math.sin(i * 311.7) * 43758.5453;
  return {
    x: (t1 - Math.floor(t1)) * 90 + 5,
    y: (t2 - Math.floor(t2)) * 90 + 5,
    r: 3 + (i % 3) * 1.5,
  };
});

const KF = "about-kf";
if (typeof document !== "undefined" && !document.getElementById(KF)) {
  const s = document.createElement("style");
  s.id = KF;
  s.textContent = `
    @keyframes aLeft  { from{opacity:0;transform:translateX(-48px)} to{opacity:1;transform:none} }
    @keyframes aRight { from{opacity:0;transform:translateX(48px)}  to{opacity:1;transform:none} }
    @keyframes aUp    { from{opacity:0;transform:translateY(32px)}  to{opacity:1;transform:none} }
  `;
  document.head.appendChild(s);
}

function About() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isHovering, setIsHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
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
      { threshold: 0.5 },
    );
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  const isMobile = windowWidth < 900;
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
        width: "100%",
        height: isMobile ? "auto" : "100vh",
        minHeight: isMobile ? "100vh" : "unset",
        margin: 0,
        padding: 0,
        position: "relative",
        overflow: "hidden",
        backgroundColor: COLORS.bg,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-10vw",
          right: "-20vw",
          width: "60vw",
          height: "60vw",
          borderRadius: "50%",
          backgroundColor: COLORS.navy,
          opacity: 0.09,
          pointerEvents: "none",
          zIndex: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "-10vw",
          right: "-20vw",
          width: "60vw",
          height: "60vw",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <img
          src="/logo.png"
          alt=""
          style={{
            width: "55%",
            height: "55%",
            objectFit: "contain",
            opacity: 0.6,
            display: "block",
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      </div>

      {DOTS.map((dot, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            width: `${dot.r}px`,
            height: `${dot.r}px`,
            borderRadius: "50%",
            backgroundColor: "#3AAE95",
            pointerEvents: "none",
            zIndex: 0,
            transform: "translate(-50%, -50%)",
            opacity: visible ? 1 : 0,
            transition: `opacity 0.4s ease ${0.05 + i * 0.015}s`,
          }}
        />
      ))}

      <div
        style={{
          position: "relative",
          zIndex: 2,
          height: isMobile ? "auto" : "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          boxSizing: "border-box",
          padding: isMobile ? "14vh 6vw 8vh" : "0 6vw",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: "center",
            gap: isMobile ? "6vh" : "4vw",
            width: "100%",
            maxWidth: "1400px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              flex: "0 0 auto",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              ...a("aLeft", 0.05),
            }}
          >
            <img
              src="/cassette-group.png"
              alt="Retro Cassettes"
              style={{
                width: isMobile
                  ? "clamp(220px, 60vw, 400px)"
                  : "clamp(280px, 28vw, 520px)",
                height: "auto",
                animation: "jumpIn 1s ease-out forwards",
                filter: "drop-shadow(8px 8px 0px rgba(0,0,0,0.45))",
                display: "block",
              }}
            />
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: isMobile ? "center" : "flex-start",
              textAlign: isMobile ? "center" : "left",
              ...a("aRight", 0.2),
            }}
          >
            <h1
              style={{
                fontFamily: "'American' Captain",
                fontSize: "clamp(2rem, 10vh, 9vh)",
                color: COLORS.navy,
                margin: 0,
              }}
            >
              HACK@ARCH
            </h1>

            <div
              style={{
                width: isMobile ? "40%" : "clamp(60px, 6vw, 120px)",
                height: "4px",
                backgroundColor: COLORS.accent,
                margin: isMobile ? "2rem auto 2rem" : "2rem 0",
                borderRadius: "2px",
              }}
            />

            <div
              style={{
                maxWidth: "560px",
                fontFamily: "Inria Sans, sans-serif",
                fontWeight: 400,
                fontSize: "clamp(0.95rem, 1.2vw, 1.15rem)",
                lineHeight: 1.75,
                color: "#3a3228",
              }}
            >
              <p style={{ margin: "0 0 1.2em" }}>
                Hack@Arch is a prestigious event for tech-enthusiast students
                from across the country to showcase their skills and gain
                hands-on experience. Across its previous editions, Hack@Arch has
                recorded 2,500+ registrations from across India, generated
                300,000+ digital impressions, and distributed over ₹2.5 lakhs in
                prize money.
              </p>
              <p style={{ margin: 0 }}>
                Notably, Hack@Arch 3.0 alone witnessed 1,100+ registrations,
                with participation from students representing 100+ colleges,
                establishing the event as a credible and impactful student-led
                initiative.
              </p>
            </div>

            <div
              style={{
                marginTop: "2.5rem",
                display: "flex",
                gap: "1.2rem",
                flexWrap: "wrap",
                justifyContent: isMobile ? "center" : "flex-start",
                ...a("aUp", 0.35),
              }}
            >
              <button
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                onClick={() =>
                  document
                    .getElementById("events")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                style={{
                  backgroundColor: COLORS.green,
                  border: "3px solid black",
                  padding: "10px 40px",
                  fontFamily: "'American' Captain",
                  fontSize: "1.4rem",
                  letterSpacing: "0.05em",
                  cursor: "pointer",
                  transition: "transform 0.18s ease, box-shadow 0.18s ease",
                  transform: isHovering
                    ? "translate(-4px, -4px)"
                    : "translate(0, 0)",
                  boxShadow: isHovering
                    ? "6px 6px 0px black"
                    : "0px 0px 0px black",
                  outline: "none",
                  color: "#fff",
                }}
              >
                EXPLORE
              </button>
            </div>
          </div>
        </div>
      </div>

      <img
        src="/star.png"
        alt=""
        style={{
          position: "absolute",
          bottom: "4vh",
          left: "4vw",
          width: "5vh",
          height: "auto",
          zIndex: 2,
          opacity: visible ? 0.7 : 0,
          transition: "opacity 0.6s ease 0.5s",
        }}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
    </div>
  );
}

export default About;
