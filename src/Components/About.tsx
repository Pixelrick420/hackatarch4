import { useEffect, useState, useMemo, useRef } from 'react';

function About() {
    const colors = {
        background: '#F6EDC4',
        polygon: '#0A3248',

        textDark: '#0A3248',
        buttonGreen: '#7AA58A',
        buttonBorder: '#000000',
    };

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const bluePolygonPoints = useMemo(() => {
        const basePoints =
            windowWidth > 900
                ? [
                      [-0.1, 0.15],
                      [0.45, 0.35],
                      [0.45, 0.55],
                      [0.38, 0.65],
                      [-0.1, 0.55],
                  ]
                : [
                      [-0.1, 0.15],
                      [0.84, 0.35],
                      [0.94, 0.92],
                      [-0.1, 0.98],
                  ];

        const aspectRatio = windowWidth / window.innerHeight;
        const compensationFactor = aspectRatio < 1 ? 1 / aspectRatio : 1;

        const adjustedPoints = basePoints.map(([x, y]) => {
            const adjustedX = x * (aspectRatio > 1 ? 1 : compensationFactor);
            return `${adjustedX},${y}`;
        });

        return adjustedPoints.join(' ');
    }, [windowWidth]);

    return (
        <>
            <div
                ref={containerRef}
                style={{
                    width: '100%',
                    height: '100vh',
                    minHeight: '150vh',
                    margin: 0,
                    padding: 0,
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundColor: colors.background,
                    fontFamily: 'sans-serif',
                }}
            >
                <svg
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '30vh',
                        zIndex: 1,
                    }}
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                >
                    {Array.from({ length: 6 }).map((_, i) => {
                        const pieceHeight = 100 / 6;
                        const yStart = i * pieceHeight;
                        const highlightPercent = 90 - i * 15;
                        const highlightHeight = (highlightPercent / 100) * pieceHeight;
                        const mainHeight = pieceHeight - highlightHeight;

                        return (
                            <g key={i}>
                                <rect
                                    x="0"
                                    y={yStart}
                                    width="100"
                                    height={mainHeight}
                                    fill="rgba(0,0,0,0)"
                                />
                                <rect
                                    x="0"
                                    y={yStart + mainHeight}
                                    width="100"
                                    height={highlightHeight}
                                    fill={colors.polygon}
                                />
                            </g>
                        );
                    })}
                </svg>
                {/* <div
            style={{
                    position: 'relative',
                    minHeight: '1vh',
                    paddingTop: '20vh',
                }}>
          </div> */}

                <svg
                    style={{
                        position: 'absolute',
                        top: 100,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 1,
                        pointerEvents: 'none',
                    }}
                    viewBox="0 0 1 1"
                    preserveAspectRatio="none"
                >
                    <polygon
                        points={bluePolygonPoints}
                        fill={colors.polygon}
                        stroke="black"
                        strokeWidth="0.02"
                    />
                </svg>

                <div
                    style={{
                        position: 'absolute',
                        top: '10%',
                        right: '-5%',
                        fontFamily: "'American' Captain",
                        fontSize: '25vw',
                        color: 'rgba(0,0,0,0.3)',
                        zIndex: 0,
                        pointerEvents: 'none',
                        lineHeight: 0.8,
                        textAlign: 'right',
                    }}
                >
                    <img
                        src="/logo.png"
                        alt="Logo"
                        style={{
                            maxWidth: '100%',
                            maxHeight: '60vh',
                            width: 'auto',
                            height: 'auto',
                            objectFit: 'contain',
                        }}
                        onError={(e) => {
                            console.error('Failed to load logo.png');
                            (e.target as HTMLImageElement).style.display = 'none';
                        }}
                    />
                </div>

                <div
                    style={{
                        position: 'relative',
                        zIndex: 3,
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flex: 1,
                            flexDirection: windowWidth < 900 ? 'column' : 'row',
                            padding: '5vh 5vw',
                            height: '100%',
                            boxSizing: 'border-box',
                        }}
                    >
                        <div
                            style={{
                                flex: 1,
                                position: 'relative',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                minHeight: windowWidth < 900 ? '30vh' : 'auto',
                            }}
                        >
                            <img
                                src="/cassette-group.png"
                                alt="Retro Cassettes"
                                style={{
                                    width: 'clamp(300px, 30vw, 600px)',
                                    height: 'auto',
                                    animation: 'jumpIn 1s ease-out forwards',
                                    filter: 'drop-shadow(10px 10px 0px rgba(0,0,0,0.5))',
                                }}
                            />
                        </div>

                        <div
                            style={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: windowWidth < 900 ? 'center' : 'flex-start',
                                textAlign: windowWidth < 900 ? 'center' : 'left',
                                paddingLeft: windowWidth < 900 ? 0 : '4vw',
                            }}
                        >
                            <h1
                                style={{
                                    fontFamily: "'American' Captain",
                                    fontSize: 'clamp(3rem, 7vw, 8rem)',
                                    color: windowWidth < 900 ? colors.background : colors.polygon,
                                    margin: 0,
                                    lineHeight: 0.9,
                                    letterSpacing: '0.02em',
                                }}
                            >
                                ABOUT
                                <br />
                                HACK@ARCH
                            </h1>

                            <div
                                style={{
                                    marginTop: '4vh',
                                    maxWidth: '600px',

                                    fontFamily: 'Inria Sans !important',
                                    fontStyle: 'normal',
                                    fontWeight: '400',
                                    fontSize: '21px',
                                    lineHeight: '31px',
                                    color: windowWidth < 900 ? '#F8EDCD' : '#333',
                                }}
                            >
                                <p>
                                    Hack@Arch is a prestigious event for tech-enthusiast students
                                    from across the country to showcase their skills and gain
                                    hands-on experience, Across its previous editions, Hack@Arch has
                                    recorded 2,500+ registrations from across India, generated
                                    300,000+ digital impressions, and distributed over ₹2.5 lakhs in
                                    prize money.
                                </p>
                                <p>
                                    Notably, Hack@Arch 3.0 alone witnessed 1,100+ registrations,
                                    with participation from students representing 100+ colleges,
                                    establishing the event as a credible and impactful student-led
                                    initiative.
                                </p>
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '2rem',
                                    marginTop: '5vh',
                                    flexWrap: 'wrap',
                                    justifyContent: windowWidth < 900 ? 'center' : 'flex-start',
                                }}
                            >
                                <button
                                    onMouseEnter={() => setIsHovering(true)}
                                    onMouseLeave={() => setIsHovering(false)}
                                    style={{
                                        backgroundColor: colors.buttonGreen,
                                        border: '4px solid black',
                                        padding: '10px 40px',
                                        fontFamily: "'American' Captain",
                                        fontSize: '1.5rem',
                                        cursor: 'pointer',
                                        position: 'relative',
                                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                        transform: isHovering
                                            ? 'translate(-4px, -4px)'
                                            : 'translate(0, 0)',
                                        boxShadow: isHovering
                                            ? '6px 6px 0px black'
                                            : '0px 0px 0px black',
                                    }}
                                >
                                    EXPLORE
                                </button>
                            </div>
                        </div>
                    </div>
                    <img
                        src="/star.png"
                        alt="Star"
                        style={{
                            position: 'absolute',
                            bottom: '5vh',
                            left: '5vw',
                            width: '5vh',
                            height: 'auto',
                        }}
                    />
                    {/* Footer / Bottom Elements
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "90%",
              pointerEvents: "none",
              zIndex: 4,
              height: 0, 
            }}
          >
            {/* Spinning CD
                        <img 
                            src="/cd-disc.png" 
                            alt="CD"
                            style={{
                                position: 'absolute',
                                bottom: '-10vh', 
                                left: '10vw',
                                width: '25vh',
                                height: '25vh',
                                opacity: 0.8,
                                zIndex: 100,
                            }}
                        /> }

            
          </div> 
          */}
                </div>
            </div>
        </>
    );
}

export default About;
