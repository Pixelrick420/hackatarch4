import { useEffect, useRef } from "react";

interface ScrollingDividerProps {
  text?: string;
  rotationDeg?: number;
}

function ScrollingDivider({
  text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  rotationDeg = 2,
}: ScrollingDividerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    let animationId: number;
    let position = 0;
    const speed = 1;

    const animate = () => {
      position -= speed;
      if (Math.abs(position) >= scrollElement.scrollWidth / 2) {
        position = 0;
      }
      scrollElement.style.transform = `translateX(${position}px)`;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  const styles = {
    outerWrapper: {
      width: "100%",
      position: "relative" as const,

      marginTop: "-5vh",
      marginBottom: "-5vh",
      display: "flex",
      justifyContent: "center",
      overflow: "visible",
      zIndex: 50,
      backgroundColor: "rgba(0,0,0,0)",
      pointerEvents: "none" as const,
    },
    rotatedContainer: {
      width: "120vw",
      position: "relative" as const,
      left: "-10vw",
      transform: `rotate(${rotationDeg}deg)`,
      transformOrigin: "center center",
    },
    container: {
      width: "100%",
      position: "relative" as const,

      overflow: "hidden",
    },
    dashedBorder: {
      width: "100%",
      height: "1.5vh",
      backgroundColor: "#F6EDC4",
      backgroundSize: "30px 2px",
      backgroundPosition: "0px 0px, 2px 3px",
      backgroundRepeat: "repeat-x",
    },
    innerDashedBorder: {
      width: "100%",
      height: "1.5vh",
      backgroundColor: "#E5AD58",
      backgroundSize: "30px 2px",
      backgroundPosition: "0px 0px, 2px 3px",
      backgroundRepeat: "repeat-x",
    },
    border1: {
      outerHeight: "0.5vh",
      backgroundImage: `
        linear-gradient(to right, #315971 50%, transparent 50%),
        linear-gradient(to right, rgba(0,0,0,0.2) 50%, transparent 50%)
      `,
    },
    border2: {
      borderColor: "#E46D45",
      backgroundImage: `
        linear-gradient(to right, #E46D45 50%, transparent 50%),
        linear-gradient(to right, rgba(0,0,0,0.2) 50%, transparent 50%)
      `,
    },
    border3: {
      borderColor: "#E46D45",
      backgroundImage: `
        linear-gradient(to right, #E46D45 50%, transparent 50%),
        linear-gradient(to right, rgba(0,0,0,0.2) 50%, transparent 50%)
      `,
    },
    border4: {
      backgroundImage: `
        linear-gradient(to right, #EEE4B8 50%, transparent 50%),
        linear-gradient(to right, rgba(0,0,0,0.2) 50%, transparent 50%)
      `,
    },
    stripeLayer: { width: "100%" },
    stripeTeal: { backgroundColor: "#ADD1B5", height: "2.5vh" },
    stripeOrange: { backgroundColor: "#E5AD58", height: "1.5vh" },
    stripeMint: { backgroundColor: "#ADD1B5", height: "1.5vh" },
    stripeNavy: { backgroundColor: "#ADD1B5", height: "2vh" },
    scrollingTextArea: {
      width: "100%",
      height: "8vh",
      backgroundColor: "#E5AD58",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      position: "relative" as const,
    },
    scrollingText: {
      display: "flex",
      whiteSpace: "nowrap" as const,
      willChange: "transform",
    },
    textContent: {
      fontSize: "clamp(2.5rem, 3.5vh, 4rem)",
      color: "#030546",
      letterSpacing: "0.03em",
      paddingRight: "5vw",
      textTransform: "uppercase" as const,
    },
  };

  return (
    <>
      <div style={styles.outerWrapper}>
        <div style={styles.rotatedContainer}>
          <div style={styles.container}>
            <div style={{ ...styles.dashedBorder, ...styles.border1 }}></div>
            <div style={{ ...styles.stripeLayer, ...styles.stripeTeal }}></div>
            <div
              style={{ ...styles.stripeLayer, ...styles.stripeOrange }}
            ></div>
            <div
              style={{ ...styles.innerDashedBorder, ...styles.border2 }}
            ></div>
            <div style={styles.scrollingTextArea}>
              <div ref={scrollRef} style={styles.scrollingText}>
                {/* Render enough copies to fill the screen + buffer */}
                {[...Array(4)].map((_, i) => (
                  <span key={i} style={styles.textContent}>
                    {text}
                  </span>
                ))}
              </div>
            </div>
            <div
              style={{ ...styles.innerDashedBorder, ...styles.border3 }}
            ></div>
            <div
              style={{ ...styles.stripeLayer, ...styles.stripeOrange }}
            ></div>
            <div style={{ ...styles.stripeLayer, ...styles.stripeMint }}></div>
            <div style={{ ...styles.stripeLayer, ...styles.stripeNavy }}></div>
            <div style={{ ...styles.dashedBorder, ...styles.border4 }}></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ScrollingDivider;
