import { useEffect, useState, useMemo, useRef } from "react";

const KF = "cp-kf";
if (typeof document !== "undefined" && !document.getElementById(KF)) {
  const s = document.createElement("style");
  s.id = KF;
  s.textContent = `
    @keyframes cpUp    { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:none} }
    @keyframes cpScale { from{opacity:0;transform:scale(0.88)}      to{opacity:1;transform:none} }
    @keyframes cpPop   { from{opacity:0;transform:translateY(16px) scale(0.9)} to{opacity:1;transform:none} }
  `;
  document.head.appendChild(s);
}

interface Cloud {
  id: number;
  x: number;
  y: number;
  speed: number;
  size: number;
}

function CommunityPartners() {
  const communityBackground = "#F6EDC4";
  const footerMain = "#40456B";
  const footerHighlight = "#3AAE95";

  const [currentLogoIndex, setCurrentLogoIndex] = useState(0);
  const [clouds, setClouds] = useState<Cloud[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [visible, setVisible] = useState(false);
  const nextCloudIdRef = useRef(0);
  const cloudsRef = useRef<Cloud[]>([]);
  const animationRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const MAX_CLOUDS = 10;
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
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
      { threshold: 0.5 },
    );
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  const nonagonPoints = useMemo(() => {
    const basePoints = [
      [1.6653345369377348e-16, -0.45621778264910706],
      [0.42316992428735756, -0.5461653267577913],
      [0.8183914244512007, -0.37020137783417584],
      [1.034703320513664, 0.004461816427568571],
      [0.9894818203498206, 0.43471565015306024],
      [0.7, 0.7562177826491071],
      [0.2768300757126425, 0.8461653267577913],
      [-0.11839142445120077, 0.670201377834176],
      [-0.3347033205136639, 0.2955381835724315],
      [-0.2894818203498206, -0.1347156501530601],
    ];
    const aspectRatio = windowWidth / window.innerHeight;
    const compensationFactor = aspectRatio < 1 ? 1 / aspectRatio : 1;
    return basePoints
      .map(([x, y]) => {
        const adjustedX = x * compensationFactor;
        return `${adjustedX},${y}`;
      })
      .join(" ");
  }, [windowWidth]);

  const communityLogos = [
    "/community1.png",
    "/community2.png",
    "/community3.png",
    "/community4.png",
  ];
  const socialLinks = [
    {
      name: "instagram",
      icon: "/instagram.png",
      url: "https://www.instagram.com/hack_at_arch/",
    },
    {
      name: "linkedin",
      icon: "/linkedin.png",
      url: "https://www.linkedin.com/in/hack-at-arch-4a7b26238/",
    },
    { name: "youtube", icon: "/youtube.png", url: "#" },
    { name: "telegram", icon: "/telegram.png", url: "#" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLogoIndex((prev) => (prev + 1) % communityLogos.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [communityLogos.length]);

  useEffect(() => {
    cloudsRef.current = clouds;
  }, [clouds]);

  useEffect(() => {
    const spawnCloud = () => {
      setClouds((prev) => {
        if (prev.length >= MAX_CLOUDS) return prev;
        const speed = Math.random() * 0.5 + 0.6;
        const size = (1 / speed) * 200 + 200;
        const width = containerWidth || window.innerWidth;
        const newX = isInitialLoad ? Math.random() * width : -size;
        const newY = Math.random() * 90;
        const cloud: Cloud = {
          id: nextCloudIdRef.current,
          x: newX,
          y: newY,
          speed,
          size,
        };
        nextCloudIdRef.current++;
        return [...prev, cloud];
      });
    };
    for (let i = 1; i < MAX_CLOUDS; i++) setTimeout(spawnCloud, i * 10);
    setTimeout(
      () => {
        setIsInitialLoad(false);
      },
      MAX_CLOUDS * 500 + 500,
    );
    const spawnInterval = setInterval(spawnCloud, 3000);
    return () => clearInterval(spawnInterval);
  }, [isInitialLoad, MAX_CLOUDS, containerWidth]);

  useEffect(() => {
    const animateClouds = () => {
      const width = containerWidth || window.innerWidth;
      setClouds((prev) =>
        prev
          .map((cloud) => ({ ...cloud, x: cloud.x + cloud.speed }))
          .filter((cloud) => cloud.x < width + cloud.size),
      );
      animationRef.current = requestAnimationFrame(animateClouds);
    };
    animationRef.current = requestAnimationFrame(animateClouds);
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
    <>
      <div
        ref={containerRef}
        style={{
          overflow: "hidden",
          width: "100%",
          minHeight: "100vh",
          margin: 0,
          padding: 0,
          position: "relative",
        }}
      >
        <svg
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 1,
          }}
          viewBox="0 0 1 1"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="stripePattern"
              patternUnits="objectBoundingBox"
              width="0.075"
              height="1"
            >
              <rect x="0" y="0" width="0.06" height="1" fill={footerMain} />
              <rect
                x="0.06"
                y="0"
                width="0.015"
                height="1"
                fill={footerHighlight}
              />
            </pattern>
            <clipPath id="nonagonClip">
              <polygon points={nonagonPoints} />
            </clipPath>
            <mask id="nonagonMask">
              <rect x="-1" y="-1" width="3" height="3" fill="white" />
              <polygon points={nonagonPoints} fill="black" />
            </mask>
          </defs>
          <rect x="0" y="0" width="1" height="1" fill="url(#stripePattern)" />
          <polygon points={nonagonPoints} fill={communityBackground} />
        </svg>

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 2,
          }}
        >
          <svg width="0" height="0" style={{ position: "absolute" }}>
            <defs>
              <clipPath id="cloudsClipPath" clipPathUnits="objectBoundingBox">
                <polygon points={nonagonPoints} />
              </clipPath>
            </defs>
          </svg>
          <div
            style={{
              width: "100%",
              height: "100%",
              clipPath: "url(#cloudsClipPath)",
              pointerEvents: "none",
              userSelect: "none",
              WebkitUserSelect: "none",
              MozUserSelect: "none",
              msUserSelect: "none",
            }}
          >
            {clouds.map((cloud) => (
              <img
                key={cloud.id}
                src="/cloud.png"
                alt="cloud"
                style={{
                  position: "absolute",
                  left: `${cloud.x}px`,
                  top: `${cloud.y}vh`,
                  width: `${cloud.size}px`,
                  height: "auto",
                }}
              />
            ))}
          </div>
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 3,
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              paddingBottom: "3vh",
            }}
          >
            <div
              style={{
                fontFamily: "'American' Captain",
                paddingLeft: "3vw",
                marginTop: "6vh",
                marginBottom: 0,
                fontSize: "clamp(2rem, 4vh, 5vh)",
                letterSpacing: "0.05em",
                color: "#0A3248",
                ...a("cpUp", 0.05),
              }}
            >
              <h1 style={{ margin: 0 }}>COMMUNITY PARTNERS</h1>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
              }}
            >
              <div
                style={{
                  width: "min(40vh, 60vw)",
                  height: "min(40vh, 60vw)",
                  backgroundColor: "rgba(0, 0, 0, 0.05)",
                  borderRadius: "3vh",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "2vh",
                  ...a("cpScale", 0.2),
                }}
              >
                <img
                  src={communityLogos[currentLogoIndex]}
                  alt={`Community Partner ${currentLogoIndex + 1}`}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    height: "100%",
                    width: "100%",
                    objectFit: "contain",
                    transition: "opacity 0.5s ease-in-out",
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            </div>
          </div>

          <div
            style={{
              overflowX: "hidden",
              overflowY: "hidden",
              marginTop: 0,
              paddingTop: "2vh",
              marginBottom: "2vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "2vh",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "2vw",
                flexWrap: "wrap",
                padding: "0 2vw",
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "2vw",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              {socialLinks.map((social, i) => (
                <a
                  key={social.name}
                  href={social.url}
                  style={{
                    width: "50px",
                    height: "50px",
                    minWidth: "40px",
                    minHeight: "40px",
                    backgroundColor: "black",
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    transition: "transform 0.3s",
                    padding: 0,
                    margin: 0,
                    flexShrink: 0,
                    ...a("cpPop", 0.4 + i * 0.08),
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.1)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  <img
                    src={social.icon}
                    alt={social.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      display: "block",
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CommunityPartners;
