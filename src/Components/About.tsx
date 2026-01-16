import { useEffect, useState, useMemo, useRef } from "react";

function About() {
  // Colors extracted from your CSS dump and image analysis
  const colors = {
    background: "#F8EDCD", // [cite: 57]
    polygon: "#0A3248",
    //
    textDark: "#0A3248", // [cite: 4]
    buttonGreen: "#7AA58A", //
    buttonBorder: "#000000",
  };

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  // Handle Window Resize for Responsive SVG logic
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate the points for the Blue Background Polygon
  const bluePolygonPoints = useMemo(() => {
    const basePoints = [
      [-0.1, 0.15], // Top Left (off screen)
      [0.45, 0.35], // Top Right slant
      [0.38, 0.85], // Bottom Right slant
      [-0.1, 0.75], // Bottom Left (off screen)
    ];

    const aspectRatio = windowWidth / window.innerHeight;
    const compensationFactor = aspectRatio < 1 ? 1 / aspectRatio : 1;

    const adjustedPoints = basePoints.map(([x, y]) => {
      const adjustedX = x * (aspectRatio > 1 ? 1 : compensationFactor);
      return `${adjustedX},${y}`;
    });

    return adjustedPoints.join(" ");
  }, [windowWidth]);

  return (
    <>
      <style>
        
        {`
                    @font-face {
                    font-family: 'Inria Sans';
                    src: url('/inria_sans/InriaSans.ttf') format('truetype');
                    font-weight: 400;
                    font-style: normal;
                    }
                    
                    @keyframes jumpIn {
                        0% { transform: translateY(-50px); opacity: 0; }
                        60% { transform: translateY(10px); opacity: 1; }
                        100% { transform: translateY(0); opacity: 1; }
                    }
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                `}
      </style>

      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "100vh", // Changed from minHeight to height
          margin: 0,
          padding: 0,
          position: "relative",
          overflow: "hidden", // Changed from overflowX to overflow (hides vertical overflow too)
          backgroundColor: colors.background,
          fontFamily: "sans-serif",
        }}
      >
        {/* 1. Background Layer: SVG Polygon */}
        <svg
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 1,
            pointerEvents: "none",
          }}
          viewBox="0 0 1 1"
          preserveAspectRatio="none"
        >
          <polygon
            points={bluePolygonPoints}
            fill={colors.polygon}
            stroke="black"
            strokeWidth="0.005"
          />
        </svg>

        {/* 2. Background Text Decoration */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            right: "-5%",
            fontFamily: "'American' Captain",
            fontSize: "25vw",
            color: "rgba(0,0,0,0.03)",
            zIndex: 0,
            pointerEvents: "none",
            lineHeight: 0.8,
            textAlign: "right",
          }}
        >
          {/* HACK<br/>ARCH */}
          <img
            src="/logo.png"
            alt="Logo"
            style={{
              maxWidth: "100%",
              maxHeight: "60vh",
              width: "auto",
              height: "auto",
              objectFit: "contain",
            }}
            onError={(e) => {
              console.error("Failed to load logo.png");
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>

        {/* 3. Main Content Layer */}
        <div
          style={{
            position: "relative",
            zIndex: 3,
            height: "100%", // Ensure it fits parent height
            width: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Main Layout Grid/Flex */}
          <div
            style={{
              display: "flex",
              flex: 1,
              flexDirection: windowWidth < 768 ? "column" : "row",
              padding: "5vh 5vw",
              height: "100%", // Ensure content stretches
              boxSizing: "border-box", // Prevents padding from adding to height
            }}
          >
            {/* Left Side: Cassette Graphics */}
            <div
              style={{
                flex: 1,
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: windowWidth < 768 ? "30vh" : "auto", // Adjust mobile height
              }}
            >
              <img
                src="/cassette-group.png"
                alt="Retro Cassettes"
                style={{
                  width: "clamp(300px, 30vw, 600px)",
                  height: "auto",
                  animation: "jumpIn 1s ease-out forwards",
                  filter: "drop-shadow(10px 10px 0px rgba(0,0,0,0.5))",
                }}
              />
            </div>

            {/* Right Side: Text Content */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: windowWidth < 768 ? "center" : "flex-start",
                textAlign: windowWidth < 768 ? "center" : "left",
                paddingLeft: windowWidth < 768 ? 0 : "4vw",
              }}
            >
              {/* Header */}
              <h1
                style={{
                  fontFamily: "'American' Captain",
                  fontSize: "clamp(3rem, 7vw, 8rem)",
                  color: windowWidth < 768 ? colors.background : colors.polygon,
                  margin: 0,
                  lineHeight: 0.9,
                  letterSpacing: "0.02em",
                }}
              >
                ABOUT
                <br />
                HACK@ARCH
              </h1>

              {/* Body Text */}
              <div
                style={{
                  marginTop: "4vh",
                  maxWidth: "600px",
                  // fontSize: 'clamp(1rem, 1.2vw, 1.2rem)',
                  // lineHeight: windowWidth< 768? 1.0 : 1.6,
                  fontFamily: "'Inria Sans', sans-serif",
                  fontStyle: "normal",
                  fontWeight: "400",
                  fontSize: "21px",
                  lineHeight: "31px",
                  color: windowWidth < 768 ? "#F8EDCD" : "#333",
                }}
              >
                <p>
                  Hack@Arch is more than just a hackathon; it's a celebration of
                  innovation, creativity, and the relentless spirit of
                  engineering. Bringing together minds from diverse backgrounds
                  to solve real-world problems.
                </p>
                <p>
                  We aim to foster a community where code meets culture, and
                  where every keystroke contributes to a larger vision of
                  technological advancement. Join us in this journey of
                  discovery and creation.
                </p>
              </div>

              {/* Explore Button */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "2rem",
                  marginTop: "5vh",
                  flexWrap: "wrap",
                  justifyContent: windowWidth < 768 ? "center" : "flex-start",
                }}
              >
                <button
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                  style={{
                    backgroundColor: colors.buttonGreen,
                    border: "4px solid black",
                    padding: "10px 40px",
                    fontFamily: "'American' Captain",
                    fontSize: "1.5rem",
                    cursor: "pointer",
                    position: "relative",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    transform: isHovering
                      ? "translate(-4px, -4px)"
                      : "translate(0, 0)",
                    boxShadow: isHovering
                      ? "6px 6px 0px black"
                      : "0px 0px 0px black",
                  }}
                >
                  EXPLORE
                </button>
              </div>
            </div>
          </div>

          {/* Footer / Bottom Elements */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              pointerEvents: "none",
              zIndex: 4,
              height: 0, // Zero height container so it doesn't push layout
            }}
          >
            {/* Spinning CD
                        <img 
                            src="/cd-disc.png" 
                            alt="CD"
                            style={{
                                position: 'absolute',
                                bottom: '-10vh', // Positioned relative to bottom of screen
                                left: '10vw',
                                width: '25vh',
                                height: '25vh',
                                opacity: 0.8,
                                zIndex: 100,
                            }}
                        /> */}

            {/* Star Decoration */}
            <img
              src="/star.png"
              alt="Star"
              style={{
                position: "absolute",
                bottom: "5vh",
                left: "5vw",
                width: "5vh",
                height: "auto",
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default About;
