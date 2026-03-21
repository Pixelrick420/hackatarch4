import { useState, useEffect } from "react";

const C = {
  bg: "#F6EDC4",
  navy: "#0A3248",
  cream: "#F5E6C8",
  amber: "#E5AD58",
  teal: "#3aae95",
};

const navLinks = [
  { name: "Home", url: "#hero" },
  { name: "About Us", url: "#about" },
  { name: "Events", url: "#events" },
  { name: "Sponsors", url: "#sponsors" },
  { name: "Contact Us", url: "#contact" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth < 1000);
      if (window.innerWidth >= 1000) setIsMenuOpen(false);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "1.6vh 5vw",

        backgroundColor: scrolled ? "rgba(246,237,196,0.)" : "transparent",
        backdropFilter: scrolled ? "blur(8px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(8px)" : "none",
        transition: "background-color 0.3s ease, backdrop-filter 0.3s ease",
        pointerEvents: "auto",
      }}
    >
      {isMobile ? (
        <div style={{ width: "100%", position: "relative" }}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{
              backgroundColor: C.cream,
              border: `2px solid ${C.navy}`,
              borderRadius: "8px",
              padding: "8px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              gap: "5px",
              width: "40px",
              height: "40px",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: `3px 3px 0 ${C.amber}`,
            }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: 22,
                  height: 2.5,
                  backgroundColor: C.navy,
                  borderRadius: 2,
                }}
              />
            ))}
          </button>

          {isMenuOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                left: 0,
                backgroundColor: C.cream,
                border: `2px solid ${C.navy}`,
                borderRadius: "12px",
                padding: "1.2vh 2vw",
                boxShadow: `4px 4px 0 ${C.amber}`,
                display: "flex",
                flexDirection: "column",
                gap: "0.4vh",
                minWidth: "180px",
              }}
            >
              {navLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    textDecoration: "none",
                    color: C.navy,
                    fontFamily: "'American' Captain",
                    fontSize: "1.1rem",
                    letterSpacing: "0.05em",
                    padding: "0.8vh 1.5vw",
                    borderRadius: "6px",
                    transition: "background 0.2s",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#F0DDB8")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  {link.name}
                </a>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            border: `2px solid ${C.navy}`,
            borderRadius: "40px",
            overflow: "hidden",
            backgroundColor: C.cream,
            boxShadow: `4px 4px 0 ${C.amber}`,
          }}
        >
          {navLinks.map((link, i) => (
            <a
              key={i}
              href={link.url}
              style={{
                textDecoration: "none",
                color: C.navy,
                fontFamily: "'American' Captain",
                fontSize: "clamp(0.8rem, 1.4vw, 1.1rem)",
                letterSpacing: "0.06em",
                padding: "0.8vh 2.2vw",
                borderRight:
                  i < navLinks.length - 1 ? `2px solid ${C.navy}` : "none",
                transition: "background 0.2s, color 0.2s",
                whiteSpace: "nowrap",
                display: "block",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = C.navy;
                e.currentTarget.style.color = C.bg;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = C.navy;
              }}
            >
              {link.name}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
