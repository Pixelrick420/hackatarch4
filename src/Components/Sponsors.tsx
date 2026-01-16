import React, { useState, useEffect, useRef } from 'react';

interface SponsorsProps {
    cassetteImage?: string;
}

const Sponsors: React.FC<SponsorsProps> = ({ cassetteImage = '/casette.png' }) => {
    const [showCassette, setShowCassette] = useState(true);
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [currentSponsor, setCurrentSponsor] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isWiggling, setIsWiggling] = useState(false);

    const sponsors = ['/sponsor1.png', '/sponsor2.png', '/sponsor3.png'];
    const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const handleResize = () => {
            setShowCassette(window.innerWidth >= 1000);
            setIsSmallScreen(window.innerWidth < 500);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
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
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
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

    const containerPadding = isSmallScreen ? '20px 10px' : '40px 20px';
    const dashedBorderPadding = isSmallScreen ? '10px' : '20px';
    const contentPadding = isSmallScreen ? '20px 10px' : '40px 20px';
    const playerPadding = isSmallScreen ? '15px' : '30px';

    return (
        <>
            <div
                style={{
                    background: '#F6EDC4',
                    width: '100%',
                    height: '6vh',
                }}
            ></div>
            <div
                style={{
                    width: '100%',
                    background: '#F6EDC4',
                    padding: containerPadding,
                    boxSizing: 'border-box',
                    position: 'relative',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        position: 'relative',
                    }}
                >
                    <div
                        style={{
                            padding: dashedBorderPadding,
                            paddingTop: isSmallScreen ? 'calc(1.5rem + 10px)' : 'calc(2rem + 15px)',
                            borderWidth: 'min(calc(0.6 * 1vw), calc(0.5 * 1vh))',
                            borderColor: '#005061',
                            borderStyle: isSmallScreen ? 'none' : 'dashed',
                            maxWidth: 'fit-content',
                            position: 'relative',
                        }}
                    >
                        <h1
                            style={{
                                fontWeight: 'bold',
                                textAlign: 'center',
                                color: '#000000',
                                textTransform: 'uppercase',
                                backgroundColor: '#F6EDC4',
                                fontFamily: "'American' Captain",
                                fontSize: 'clamp(2rem, 8vh, 9vh)',
                                letterSpacing: '0.05em',
                                margin: 0,
                                padding: '0 20px',
                                position: 'absolute',
                                top: 0,
                                left: isSmallScreen ? '35%' : '50%',
                                transform: 'translate(-50%, -50%)',
                                zIndex: 2,
                                whiteSpace: 'nowrap',
                                lineHeight: 1,
                            }}
                        >
                            SPONSORS
                        </h1>

                        <div
                            style={{
                                padding: contentPadding,
                                background: '#005061',
                                backgroundImage: `url('/filter.png')`,
                                backgroundSize: 'contain',
                                display: 'grid',
                                gridTemplateColumns: showCassette ? '1fr 1fr' : '1fr',
                                gap: '40px',
                                alignItems: 'center',
                                maxWidth: '1200px',
                                marginTop: isSmallScreen ? '2vh' : 0,
                            }}
                        >
                            {showCassette && (
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <img
                                        src={cassetteImage}
                                        alt="Retro Cassette"
                                        style={{
                                            width: '100%',
                                            maxWidth: '400px',
                                            height: 'auto',
                                        }}
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                </div>
                            )}

                            <div
                                style={{
                                    maxWidth: '500px',
                                    margin: '0 auto',
                                    width: '100%',
                                    padding: playerPadding,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'space-evenly',
                                }}
                            >
                                <div
                                    style={{
                                        background: '#000000',
                                        border: '8px solid #5793A1CC',
                                        borderRadius: '12px',
                                        padding: 'clamp(15px, 4vw, 30px)',
                                        minHeight: 'clamp(150px, 25vw, 250px)',
                                        minWidth: 'calc(150px + clamp(150px, 25vw, 250px))',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        overflow: 'hidden',
                                        position: 'relative',
                                    }}
                                >
                                    {sponsors.map((sponsor, index) => (
                                        <img
                                            key={index}
                                            src={sponsor}
                                            alt={`Sponsor ${index + 1}`}
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                            }}
                                            style={{
                                                position: 'absolute',
                                                width: '90%',
                                                height: '90%',
                                                objectFit: 'contain',
                                                transition:
                                                    'opacity 0.5s ease-in-out, transform 0.5s ease-in-out',
                                                opacity: currentSponsor === index ? 1 : 0,
                                                transform: `scale(${currentSponsor === index ? 1 : 0.95}) ${isWiggling && currentSponsor === index ? 'translateX(5px)' : ''}`,
                                                animation:
                                                    isWiggling && currentSponsor === index
                                                        ? 'wiggle 0.3s ease-in-out 2'
                                                        : 'none',
                                            }}
                                        />
                                    ))}
                                    <style>{`
                                        @keyframes wiggle {
                                            0%, 100% { transform: rotate(0deg) scale(1); }
                                            25% { transform: rotate(-2deg) scale(1.02); }
                                            50% { transform: rotate(2deg) scale(1.04); }
                                            75% { transform: rotate(-1deg) scale(1.02); }
                                        }
                                    `}</style>
                                </div>

                                <div
                                    style={{
                                        display: 'flex',
                                        gap: '10px',
                                        marginTop: '24px',
                                        marginBottom: 0,
                                    }}
                                >
                                    <button
                                        onClick={handlePrev}
                                        style={{
                                            flex: 1,
                                            background: '#1A5679',
                                            border: 'none',
                                            borderRadius: '8px',
                                            padding: 'clamp(15px, 3vw, 25px)',
                                            cursor: 'pointer',
                                            transition: 'background 0.3s ease',
                                        }}
                                        onMouseEnter={(e) =>
                                            (e.currentTarget.style.background = '#2A7FA9')
                                        }
                                        onMouseLeave={(e) =>
                                            (e.currentTarget.style.background = '#1A5679')
                                        }
                                        aria-label="Previous"
                                    >
                                        <img
                                            src="/back.png"
                                            alt="Previous"
                                            style={{
                                                width: '100%',
                                                height: 'auto',
                                                maxWidth: '60px',
                                            }}
                                        />
                                    </button>

                                    <button
                                        onClick={handlePlay}
                                        style={{
                                            flex: 1,
                                            background: isPlaying ? '#2A7FA9' : '#1A5679',
                                            border: 'none',
                                            borderRadius: '8px',
                                            padding: 'clamp(15px, 3vw, 25px)',
                                            cursor: 'pointer',
                                            transition: 'background 0.3s ease',
                                        }}
                                        onMouseEnter={(e) =>
                                            (e.currentTarget.style.background = '#2A7FA9')
                                        }
                                        onMouseLeave={(e) =>
                                            (e.currentTarget.style.background = isPlaying
                                                ? '#2A7FA9'
                                                : '#1A5679')
                                        }
                                        aria-label={isPlaying ? 'Pause' : 'Play'}
                                    >
                                        <img
                                            src={'/play.png'}
                                            alt={'Play'}
                                            style={{
                                                width: '100%',
                                                height: 'auto',
                                                maxWidth: '60px',
                                            }}
                                        />
                                    </button>

                                    <button
                                        onClick={handleNext}
                                        style={{
                                            flex: 1,
                                            background: '#1A5679',
                                            border: 'none',
                                            borderRadius: '8px',
                                            padding: 'clamp(15px, 3vw, 25px)',
                                            cursor: 'pointer',
                                            transition: 'background 0.3s ease',
                                        }}
                                        onMouseEnter={(e) =>
                                            (e.currentTarget.style.background = '#2A7FA9')
                                        }
                                        onMouseLeave={(e) =>
                                            (e.currentTarget.style.background = '#1A5679')
                                        }
                                        aria-label="Next"
                                    >
                                        <img
                                            src="/forward.png"
                                            alt="Next"
                                            style={{
                                                width: '100%',
                                                height: 'auto',
                                                maxWidth: '60px',
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
