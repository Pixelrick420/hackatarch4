import { useEffect, useState } from "react";

function Contact() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const isMobile = windowWidth < 1000;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const leads = [
    { name: "Dharshana KS - Arch.ai Lead", phone: "+91 98765 43211" },
    { name: "Sreemrudu KP - TinkerHub GECT Lead", phone: "+91 98765 43210" },
  ];

  const cardStyle: React.CSSProperties = {
    backgroundColor: "#F5E6C8",
    border: "2px solid black",
    borderRadius: "3vh",
    boxShadow: "4px 4px 0 #E5AD58",
    padding: "3vh 3vw",
  };

  return (
    <div
      id="contact"
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
      {/* Edit this to change the number of diagonal lines */}
      {(() => {
        const DIAGONAL_LINE_COUNT = 100;
        // Each line is parallel at 45°: from (0, offset) on the left edge
        // to (offset, 0) on the top edge. Offset steps from near-0 to near-corner.
        const lines = Array.from({ length: DIAGONAL_LINE_COUNT }).map(
          (_, i) => {
            const offset = ((i + 1) / (DIAGONAL_LINE_COUNT + 1)) * 100;
            return (
              <line
                key={i}
                x1={0}
                y1={offset}
                x2={offset}
                y2={1}
                stroke="#3aae95"
                strokeWidth="1"
                opacity="0.8"
                vectorEffect="non-scaling-stroke"
              />
            );
          },
        );
        return (
          <svg
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              zIndex: 1,
            }}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {lines}
          </svg>
        );
      })()}

      {/* top-right corner bracket */}
      <div
        style={{
          position: "absolute",
          top: "2vh",
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

      {/* bottom-left corner bracket */}
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
                src="/x.png"
                alt=""
                style={{ width: "2vh", height: "auto", objectFit: "contain" }}
              />
            ),
          )}
        </div>
      </div>

      {/* Star corners */}
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

      {/* Main content */}
      <div
        style={{
          display: "grid",
          gridTemplateRows: "auto 1fr",
          position: "relative",
          zIndex: 3,
          minHeight: "100vh",
        }}
      >
        {/* Title */}
        <div
          style={{
            display: "grid",
            placeItems: "center",
            paddingTop: "5vh",
            paddingBottom: "5vh",
          }}
        >
          <div
            style={{
              fontFamily: "'American' Captain",
              fontSize: "clamp(2rem, 6vw, 5rem)",
              letterSpacing: "0.05em",
              textAlign: "center",
              color: "#0A3248",
            }}
          >
            <h1 style={{ margin: 0 }}>CONTACT US</h1>
          </div>
        </div>

        {/* Two-column body */}
        <div
          style={{
            padding: "0 5vw 8vh",
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? "4vh" : "4vw",
            alignItems: "stretch",
          }}
        >
          {/* LEFT: map */}
          <MapCard isMobile={isMobile} />

          {/* RIGHT: venue + leads */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "3vh",
            }}
          >
            {/* Venue */}
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

            {/* Leads — flex:1 fills remaining height to match map */}
            <div
              style={{
                ...cardStyle,
                flex: 1,
                display: "flex",
                flexDirection: "column",
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
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1,
        border: `2px solid ${hovered ? "#005061" : "black"}`,
        borderRadius: "3vh",
        boxShadow: hovered ? "6px 6px 0 #005061" : "6px 6px 0 #E5AD58",
        overflow: "hidden",
        minHeight: isMobile ? "55vw" : "55vh",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
      }}
    >
      <iframe
        title="Government Engineering College Thrissur"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3922.31492332497!2d76.22466!3d10.5545108!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba7eee301ff400f%3A0x8851e3d8fc9c94f0!2sGovernment%20Engineering%20College%20Thrissur%20(GEC%20Thrissur)!5e0!3m2!1sen!2sin!4v1774072457982!5m2!1sen!2sin"
        width="100%"
        height="100%"
        style={{
          border: "none",
          display: "block",
          minHeight: isMobile ? "55vw" : "55vh",
          filter: "sepia(20%) contrast(1.05)",
        }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
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
        backgroundColor: hovered ? "#E5AD58" : "#F5E6C8",
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
