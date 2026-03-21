import React, { useState, useEffect, useRef } from "react";

const KF = "sponsors-kf";
if (typeof document !== "undefined" && !document.getElementById(KF)) {
  const s = document.createElement("style");
  s.id = KF;
  s.textContent = `
    @keyframes spUp    { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:none} }
    @keyframes spLeft  { from{opacity:0;transform:translateX(-48px)} to{opacity:1;transform:none} }
    @keyframes spScale { from{opacity:0;transform:scale(0.92)}      to{opacity:1;transform:none} }
    @keyframes wiggle {
      0%, 100% { transform: rotate(0deg) scale(1); }
      25% { transform: rotate(-2deg) scale(1.02); }
      50% { transform: rotate(2deg) scale(1.04); }
      75% { transform: rotate(-1deg) scale(1.02); }
    }
  `;
  document.head.appendChild(s);
}

interface SponsorsProps {
  cassetteImage?: string;
}

const Sponsors: React.FC<SponsorsProps> = ({
  cassetteImage = "/casette.png",
}) => {
  const [showCassette, setShowCassette] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [currentSponsor, setCurrentSponsor] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isWiggling, setIsWiggling] = useState(false);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const sponsors = ["/sponsor1.webp", "/sponsor2.webp"];
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setScreenWidth(width);
      setShowCassette(width >= 1000);
      setIsSmallScreen(width < 500);
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
      { threshold: 0.5 },
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentSponsor((prev) => (prev + 1) % sponsors.length);
      }, 2000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, sponsors.length]);

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentSponsor((prev) => (prev + 1) % sponsors.length);
  };
  const handlePrev = () => {
    setIsPlaying(false);
    setCurrentSponsor((prev) => (prev - 1 + sponsors.length) % sponsors.length);
  };
  const handlePlay = () => {
    setIsPlaying(true);
    setIsWiggling(true);
    setTimeout(() => setIsWiggling(false), 600);
  };

  const a = (name: string, delay: number): React.CSSProperties =>
    visible
      ? {
          animation: `${name} 0.75s cubic-bezier(0.22,1,0.36,1) ${delay}s both`,
        }
      : { opacity: 0 };

  return (
    <>
      <div style={{ background: "#F6EDC4", width: "100%", height: "6vh" }} />
      <div
        ref={sectionRef}
        style={{
          width: "100%",
          background: "#F6EDC4",
          padding: isSmallScreen ? "20px 10px" : "40px 20px",
          boxSizing: "border-box",
          position: "relative",
        }}
      >
        {isSmallScreen && (
          <h1
            style={{
              fontWeight: "bold",
              textAlign: "left",
              textTransform: "uppercase",
              backgroundColor: "#F6EDC4",
              fontFamily: "'American' Captain",
              fontSize: "clamp(2rem, 8vh, 9vh)",
              letterSpacing: "0.05em",
              margin: 0,
              marginLeft: 0,
              marginBottom: "2rem",
              padding: 0,
              zIndex: 2,
              whiteSpace: "nowrap",
              lineHeight: 1,
              color: "#0A3248",
              ...a("spUp", 0.05),
            }}
          >
            SPONSORS
          </h1>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              padding: isSmallScreen ? "10px" : "20px",
              paddingTop: isSmallScreen ? "10px" : "calc(2rem + 15px)",
              borderWidth: "min(calc(0.6 * 1vw), calc(0.5 * 1vh))",
              borderColor: "#005061",
              borderStyle: isSmallScreen ? "none" : "dashed",
              maxWidth: "fit-content",
              position: "relative",
              width: "100%",
              ...a("spScale", 0.1),
            }}
          >
            {!isSmallScreen && (
              <h1
                style={{
                  fontWeight: "bold",
                  textAlign: "center",
                  color: "#0A3248",
                  textTransform: "uppercase",
                  backgroundColor: "#F6EDC4",
                  fontFamily: "'American' Captain",
                  fontSize: "clamp(2rem, 8vh, 9vh)",
                  letterSpacing: "0.05em",
                  margin: 0,
                  padding: 0,
                  position: "absolute",
                  top: 0,
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 2,
                  whiteSpace: "nowrap",
                  lineHeight: 1,
                }}
              >
                SPONSORS
              </h1>
            )}
            <div
              style={{
                padding: isSmallScreen ? "20px 10px" : "40px 20px",
                background: "#005061",
                backgroundImage: `url('/filter.png')`,
                backgroundSize: "contain",
                display: "grid",
                gridTemplateColumns: showCassette ? "1fr 1fr" : "1fr",
                gap: showCassette ? "40px" : "20px",
                alignItems: "center",
                maxWidth: "1200px",
                marginTop: isSmallScreen ? "2vh" : 0,
                borderRadius: "1vh",
              }}
            >
              {showCassette && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    ...a("spLeft", 0.3),
                  }}
                >
                  <img
                    src={cassetteImage}
                    alt="Retro Cassette"
                    style={{ width: "100%", maxWidth: "400px", height: "auto" }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}
              <div
                style={{
                  maxWidth: screenWidth < 700 ? "100%" : "500px",
                  margin: "0 auto",
                  width: "100%",
                  padding: isSmallScreen ? "10px" : "30px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                  ...a("spUp", 0.45),
                }}
              >
                <div
                  style={{
                    background: "#F6EDC4",
                    border: `${screenWidth < 700 ? "4px" : "8px"} solid #5793A1CC`,
                    borderRadius: screenWidth < 700 ? "8px" : "12px",
                    padding: "clamp(10px, 3vw, 30px)",
                    minHeight:
                      screenWidth < 700
                        ? "clamp(200px, 40vw, 300px)"
                        : "clamp(150px, 25vw, 250px)",
                    minWidth: "300px",
                    width: "100%",
                    aspectRatio: screenWidth < 700 ? "1" : "auto",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  {sponsors.map((sponsor, index) => (
                    <img
                      key={index}
                      src={sponsor}
                      alt={`Sponsor ${index + 1}`}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                      style={{
                        position: "absolute",
                        width: "90%",
                        height: "90%",
                        objectFit: "contain",
                        transition:
                          "opacity 0.5s ease-in-out, transform 0.5s ease-in-out",
                        opacity: currentSponsor === index ? 1 : 0,
                        transform: `scale(${currentSponsor === index ? 1 : 0.95}) ${isWiggling && currentSponsor === index ? "translateX(5px)" : ""}`,
                        animation:
                          isWiggling && currentSponsor === index
                            ? "wiggle 0.3s ease-in-out 2"
                            : "none",
                      }}
                    />
                  ))}
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: screenWidth < 700 ? "6px" : "10px",
                    marginTop: screenWidth < 700 ? "16px" : "24px",
                    marginBottom: 0,
                    width: "100%",
                  }}
                >
                  <button
                    onClick={handlePrev}
                    style={{
                      flex: 1,
                      background: "#1A5679",
                      border: "none",
                      borderRadius: screenWidth < 700 ? "6px" : "8px",
                      padding:
                        screenWidth < 700
                          ? "clamp(8px, 2vw, 12px)"
                          : "clamp(15px, 3vw, 25px)",
                      cursor: "pointer",
                      transition: "background 0.3s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#2A7FA9")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "#1A5679")
                    }
                    aria-label="Previous"
                  >
                    <img
                      src="/back.png"
                      alt="Previous"
                      style={{
                        width: "100%",
                        height: "auto",
                        maxWidth: screenWidth < 700 ? "40px" : "60px",
                      }}
                    />
                  </button>
                  <button
                    onClick={handlePlay}
                    style={{
                      flex: 1,
                      background: isPlaying ? "#2A7FA9" : "#1A5679",
                      border: "none",
                      borderRadius: screenWidth < 700 ? "6px" : "8px",
                      padding:
                        screenWidth < 700
                          ? "clamp(8px, 2vw, 12px)"
                          : "clamp(15px, 3vw, 25px)",
                      cursor: "pointer",
                      transition: "background 0.3s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#2A7FA9")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = isPlaying
                        ? "#2A7FA9"
                        : "#1A5679")
                    }
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    <img
                      src={"/play.png"}
                      alt={"Play"}
                      style={{
                        width: "100%",
                        height: "auto",
                        maxWidth: screenWidth < 700 ? "40px" : "60px",
                      }}
                    />
                  </button>
                  <button
                    onClick={handleNext}
                    style={{
                      flex: 1,
                      background: "#1A5679",
                      border: "none",
                      borderRadius: screenWidth < 700 ? "6px" : "8px",
                      padding:
                        screenWidth < 700
                          ? "clamp(8px, 2vw, 12px)"
                          : "clamp(15px, 3vw, 25px)",
                      cursor: "pointer",
                      transition: "background 0.3s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#2A7FA9")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "#1A5679")
                    }
                    aria-label="Next"
                  >
                    <img
                      src="/forward.png"
                      alt="Next"
                      style={{
                        width: "100%",
                        height: "auto",
                        maxWidth: screenWidth < 700 ? "40px" : "60px",
                      }}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sponsors;
