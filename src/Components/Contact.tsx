import { useEffect, useState, useRef } from "react";

const KF = "contact-kf";
if (typeof document !== "undefined" && !document.getElementById(KF)) {
  const s = document.createElement("style");
  s.id = KF;
  s.textContent = `
    @keyframes ctUp    { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:none} }
    @keyframes ctLeft  { from{opacity:0;transform:translateX(-48px)} to{opacity:1;transform:none} }
    @keyframes ctRight { from{opacity:0;transform:translateX(48px)}  to{opacity:1;transform:none} }
    @keyframes mapPulse { 0%,100%{opacity:0.5} 50%{opacity:1} }
    @keyframes mapDotSpin {
      0%   { transform: translate(-50%,-50%) rotate(0deg)   translateX(18px); }
      100% { transform: translate(-50%,-50%) rotate(360deg) translateX(18px); }
    }
  `;
  document.head.appendChild(s);
}

function Contact() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isMobile = windowWidth < 1000;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
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

  const leads = [
    { name: "Dharshana KS - Arch.ai Lead", phone: "+91 98765 43211" },
    { name: "Sreemrudu KP - TinkerHub GECT Lead", phone: "+91 98765 43210" },
  ];

  const cardStyle: React.CSSProperties = {
    backgroundColor: "#F6EDC4",
    border: "2px solid black",
    borderRadius: "3vh",
    boxShadow: "4px 4px 0 #E5AD58",
    padding: "3vh 3vw",
  };

  const a = (name: string, delay: number): React.CSSProperties =>
    visible
      ? {
          animation: `${name} 0.75s cubic-bezier(0.22,1,0.36,1) ${delay}s both`,
        }
      : { opacity: 0 };

  return (
    <div
      id="contact"
      ref={sectionRef}
      style={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#F6EDC4",
        margin: 0,
        padding: 0,
        display: "grid",
        gridTemplateRows: "auto 1fr",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "3vh",
          right: "2vw",
          width: "6vw",
          height: "6vh",
          borderTop: "3px solid #3aae95",
          borderRight: "3px solid #3aae95",
          opacity: 0.7,
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: "2vh",
          left: "2vw",
          width: "6vw",
          height: "6vh",
          borderBottom: "3px solid #3aae95",
          borderLeft: "3px solid #3aae95",
          opacity: 0.7,
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      <div
        style={{
          position: "relative",
          width: "100vw",
          overflow: "hidden",
          userSelect: "none",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
          msUserSelect: "none",
          zIndex: 4,
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
                src="/x.webp"
                alt=""
                style={{ width: "2vh", height: "auto", objectFit: "contain" }}
              />
            ),
          )}
        </div>
      </div>

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
            gridRow: "4/6",
            padding: "5vh 5vw",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <img
            src="/star.webp"
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
            gridRow: "1/2",
            padding: "5vh 5vw",
            display: "flex",
            alignItems: "flex-end",
          }}
        >
          <img
            src="/star.webp"
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

      <div
        style={{
          display: "grid",
          gridTemplateRows: "auto 1fr",
          position: "relative",
          zIndex: 3,
          minHeight: "100vh",
        }}
      >
        <div
          style={{
            display: "grid",
            placeItems: "center",
            paddingTop: "5vh",
            paddingBottom: "5vh",
            ...a("ctUp", 0.05),
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
            <h1 style={{ margin: 0 }}>CONTACT US</h1>
          </div>
        </div>

        <div
          style={{
            padding: "0 5vw 8vh",
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? "4vh" : "4vw",
            alignItems: "stretch",
          }}
        >
          <div style={{ flex: 1, ...a("ctLeft", 0.2) }}>
            <MapCard isMobile={isMobile} />
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "3vh",
            }}
          >
            <div style={cardStyle}>
              <p
                style={{
                  fontFamily: "'American' Captain",
                  fontSize: "clamp(1rem, 2vw, 1.6rem)",
                  color: "#0A3248",
                  letterSpacing: "0.05em",
                  margin: "0 0 1vh 0",
                }}
              >
                VENUE
              </p>
              <p
                style={{
                  fontFamily: "Inria Sans, sans-serif",
                  fontSize: isMobile ? "3.5vw" : "1.1vw",
                  color: "#333",
                  margin: 0,
                  lineHeight: 1.6,
                  fontWeight: "600",
                }}
              >
                Government Engineering College Thrissur
                <br />
                Thrissur, Kerala 680009
              </p>
            </div>

            <div
              style={{
                ...cardStyle,
                flex: 1,
                display: "flex",
                flexDirection: "column",
                ...a("ctRight", 0.35),
              }}
            >
              <p
                style={{
                  fontFamily: "'American' Captain",
                  fontSize: "clamp(1rem, 2vw, 1.6rem)",
                  color: "#0A3248",
                  letterSpacing: "0.05em",
                  margin: "0 0 2vh 0",
                }}
              >
                HACK@ARCH LEADS
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "2vh",
                  flex: 1,
                  justifyContent: "center",
                }}
              >
                {leads.map((lead, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: "1vh",
                      backgroundColor: "#F6EDC4",
                      border: "2px solid black",
                      borderRadius: "2vh",
                      padding: "1.5vh 2vw",
                      boxShadow: "3px 3px 0 #E5AD58",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'American' Captain",
                        fontSize: "clamp(0.9rem, 1.8vw, 1.4rem)",
                        color: "#0A3248",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {lead.name}
                    </span>
                    <PhoneLink phone={lead.phone} isMobile={isMobile} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MapCard({ isMobile }: { isMobile: boolean }) {
  const [hovered, setHovered] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const minH = isMobile ? "55vw" : "55vh";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        height: "100%",
        position: "relative",
        border: `2px solid ${hovered ? "#005061" : "black"}`,
        borderRadius: "3vh",
        boxShadow: hovered ? "6px 6px 0 #005061" : "6px 6px 0 #E5AD58",
        overflow: "hidden",
        minHeight: minH,
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
      }}
    >
      {/* Loading placeholder */}
      {!mapLoaded && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "#F6EDC4",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.5rem",
            zIndex: 2,
          }}
        >
          {/* Spinning orbit dots */}
          <div style={{ position: "relative", width: "48px", height: "48px" }}>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "#0A3248",
                  animation: `mapDotSpin 1.2s linear ${i * 0.3}s infinite`,
                  transformOrigin: "0 0",
                }}
              />
            ))}
          </div>
          {/* Label */}
          <div
            style={{
              fontFamily: "'American' Captain",
              fontSize: "clamp(0.8rem, 1.5vw, 1rem)",
              color: "#0A3248",
              letterSpacing: "0.15em",
              animation: "mapPulse 1.8s ease-in-out infinite",
            }}
          >
            LOADING MAP...
          </div>
          <div
            style={{
              width: "60px",
              height: "3px",
              backgroundColor: "#F6EDC4",
              borderRadius: "2px",
            }}
          />
        </div>
      )}

      <iframe
        title="Government Engineering College Thrissur"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3922.31492332497!2d76.22466!3d10.5545108!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba7eee301ff400f%3A0x8851e3d8fc9c94f0!2sGovernment%20Engineering%20College%20Thrissur%20(GEC%20Thrissur)!5e0!3m2!1sen!2sin!4v1774072457982!5m2!1sen!2sin"
        width="100%"
        height="100%"
        style={{
          border: "none",
          display: "block",
          height: "100%",
          minHeight: minH,
          filter: "sepia(20%) contrast(1.05)",
          opacity: mapLoaded ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        onLoad={() => setMapLoaded(true)}
      />
    </div>
  );
}

function PhoneLink({ phone, isMobile }: { phone: string; isMobile: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={`tel:${phone.replace(/\s/g, "")}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: "Inria Sans, sans-serif",
        fontSize: isMobile ? "3.5vw" : "1.05vw",
        color: "#333",
        fontWeight: "700",
        textDecoration: "none",
        backgroundColor: hovered ? "#E5AD58" : "#F6EDC4",
        border: "1.5px solid black",
        borderRadius: "1.5vh",
        padding: "0.5vh 1.2vw",
        boxShadow: hovered ? "4px 4px 0 #0A3248" : "2px 2px 0 #E5AD58",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        transition: "all 0.2s ease",
        display: "inline-block",
        whiteSpace: "nowrap",
      }}
    >
      {phone}
    </a>
  );
}

export default Contact;
