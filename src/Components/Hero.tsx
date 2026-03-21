/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from 'react';
import Game from './Game';
import DateCalendar from './Datecalendar';

interface Star {
    id: number;
    x: number;
    y: number;
    image: string;
    phase: number;
}

function HeroSection() {
    const backgroundColor = '#F6EDC4';
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isGameOpen, setIsGameOpen] = useState(false);
    const [stars, setStars] = useState<Star[]>([]);
    const nextStarIdRef = useRef(0);
    const animationRef = useRef<number | null>(null);

    const MAX_STARS = 2;
    const MAX_STAR_SIZE = 60;
    const STAR_GROWTH_SPEED = 0.02;

    const navLinks = [
        { name: 'Home', url: '#' },
        { name: 'About Us', url: '#' },
        { name: 'Events', url: '#' },
        { name: 'Sponsors', url: '#' },
        { name: 'Contact Us', url: '#contact' },
    ];

    const starImages = ['/star3.png'];

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1000);
            if (window.innerWidth >= 1000) {
                setIsMenuOpen(false);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const spawnStar = () => {
            setStars((prev) => {
                if (prev.length >= MAX_STARS) {
                    return prev;
                }

                const randomImage = starImages[Math.floor(Math.random() * starImages.length)];
                const star: Star = {
                    id: nextStarIdRef.current,
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    image: randomImage,
                    phase: 0,
                };
                nextStarIdRef.current++;
                return [...prev, star];
            });
        };

        const spawnInterval = setInterval(spawnStar, 1500);
        for (let i = 0; i < MAX_STARS / 2; i++) {
            setTimeout(spawnStar, i * 500);
        }

        return () => clearInterval(spawnInterval);
    }, [starImages]);

    useEffect(() => {
        const animateStars = () => {
            setStars((prev) =>
                prev
                    .map((star) => ({
                        ...star,
                        phase: star.phase + STAR_GROWTH_SPEED,
                    }))
                    .filter((star) => star.phase < 2)
            );
            animationRef.current = requestAnimationFrame(animateStars);
        };

        animationRef.current = requestAnimationFrame(animateStars);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    const getStarSize = (phase: number) => {
        if (phase < 1) {
            return phase * MAX_STAR_SIZE;
        } else {
            return (2 - phase) * MAX_STAR_SIZE;
        }
    };

    return (
        <div
            style={{
                width: '100%',
                height: '100vh',
                position: 'relative',
                backgroundColor: backgroundColor,
                overflow: 'hidden',
                margin: 0,
                padding: 0,
            }}
        >
            {/* Semi-transparent background image */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: 'url(/herobackground.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    opacity: 0.3,
                    zIndex: 1,
                }}
            />

            {/* Twinkling Stars */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    zIndex: 2,
                }}
            >
                {stars.map((star) => {
                    const size = getStarSize(star.phase);
                    return (
                        <img
                            key={star.id}
                            src={star.image}
                            alt="star"
                            style={{
                                position: 'absolute',
                                left: `${star.x}%`,
                                top: `${star.y}%`,
                                width: `${size}px`,
                                height: `${size}px`,
                                objectFit: 'contain',
                                transform: 'translate(-50%, -50%)',
                                opacity: star.phase < 1 ? star.phase : 2 - star.phase,
                            }}
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                            }}
                        />
                    );
                })}
            </div>

            {/* Right Hero Image - Only visible on desktop */}
            {!isMobile && (
                <div
                    style={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        height: '100vh',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'flex-start',
                        zIndex: 3,
                    }}
                >
                    <img
                        src="/heroimage.png"
                        alt="Hero"
                        style={{
                            height: '100%',
                            width: 'auto',
                            objectFit: 'contain',
                        }}
                        onError={(e) => {
                            console.error('Failed to load heroimage.png');
                            (e.target as HTMLImageElement).style.display = 'none';
                        }}
                    />
                </div>
            )}

            {/* Content container */}
            <div
                style={{
                    position: 'relative',
                    zIndex: 4,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {/* Navigation */}
                {isMobile ? (
                    <>
                        {/* Hamburger Menu Button */}
                        <div
                            style={{
                                position: 'absolute',
                                top: '3vh',
                                left: '3vh',
                                zIndex: 10,
                            }}
                        >
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                style={{
                                    backgroundColor: '#F5E6C8',
                                    border: '2px solid black',
                                    borderRadius: '1vh',
                                    padding: '10px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '5px',
                                    width: '40px',
                                    height: '40px',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    boxShadow: '4px 4px 0 #E5AD58',
                                }}
                            >
                                <div
                                    style={{
                                        width: '24px',
                                        height: '3px',
                                        backgroundColor: 'black',
                                        borderRadius: '2px',
                                    }}
                                />
                                <div
                                    style={{
                                        width: '24px',
                                        height: '3px',
                                        backgroundColor: 'black',
                                        borderRadius: '2px',
                                    }}
                                />
                                <div
                                    style={{
                                        width: '24px',
                                        height: '3px',
                                        backgroundColor: 'black',
                                        borderRadius: '2px',
                                    }}
                                />
                            </button>
                        </div>

                        {/* Mobile Menu Dropdown */}
                        {isMenuOpen && (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '10vh',
                                    left: '3vh',
                                    backgroundColor: '#F5E6C8',
                                    border: '2px solid black',
                                    borderRadius: '2vh',
                                    padding: '2vh',
                                    boxShadow: '4px 4px 0 #E5AD58',
                                    zIndex: 10,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1vh',
                                }}
                            >
                                {navLinks.map((link, index) => (
                                    <a
                                        key={index}
                                        href={link.url}
                                        onClick={() => setIsMenuOpen(false)}
                                        style={{
                                            textDecoration: 'none',
                                            color: '#333',
                                            fontWeight: '500',
                                            fontSize: '2.5vh',
                                            padding: '1vh 2vh',
                                            borderRadius: '1vh',
                                            backgroundColor: 'transparent',
                                            transition: 'background-color 0.3s ease',
                                            whiteSpace: 'nowrap',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = '#F0DDB8';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                        }}
                                    >
                                        {link.name}
                                    </a>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <nav
                        style={{
                            display: 'flex',
                            justifyContent: 'space-evenly',
                            alignItems: 'center',
                            gap: '15px',
                            padding: '3vh 2vh',
                        }}
                    >
                        {navLinks.map((link, index) => (
                            <a
                                key={index}
                                href={link.url}
                                style={{
                                    textDecoration: 'none',
                                    color: '#333',
                                    fontWeight: '500',
                                    fontSize: '5vh',
                                    padding: '10px 24px',
                                    border: '2px solid  black',
                                    borderRadius: '3vh',
                                    backgroundColor: '#F5E6C8',
                                    transition: 'all 0.3s ease',
                                    whiteSpace: 'nowrap',
                                    boxShadow: '4px 4px 0 #E5AD58',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#F0DDB8';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '8px 8px 0 #E5AD58';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#F5E6C8';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '4px 4px 0 #E5AD58';
                                }}
                            >
                                {link.name}
                            </a>
                        ))}
                    </nav>
                )}

                {/* ── Title overlay — top-left, below navbar ── */}
                <div
                    style={{
                        position: 'absolute',
                        top: isMobile ? '12vh' : '14vh',
                        left: isMobile ? '3vh' : '5vw',
                        zIndex: 6,
                        animation: 'jumpIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
                        pointerEvents: 'none',
                    }}
                >
                    <div
                        style={{
                            fontFamily: "'American' Captain",
                            fontSize: 'clamp(5rem, 6vw, 8rem)',
                            letterSpacing: '0.05em',
                            paddingTop:'1vh',
                            lineHeight: 1,

                            color: '#0A3248',
                            textShadow: '3px 3px 0 rgba(229,173,88,0.55)',
                        }}
                    >
                        HACK@ARCH 4.0 <br></br>IS HERE !!!
                    </div>
                </div>

                {/* Images Container */}
                <div
                    style={{
                        flex: 1,
                        display: 'flex',
                        justifyContent: isMobile ? 'center' : 'flex-start',
                        alignItems: 'center',
                        paddingLeft: isMobile ? '0' : '5vw',
                        paddingTop: isMobile ? '10vh' : '0',
                    }}
                >
                    {/* Logo + Calendar overlay wrapper */}
                    <div
                        style={{
                            position: 'relative',
                            flex: '0 0 auto',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            // Larger on mobile so logo fills more of the screen
                            maxWidth: isMobile ? '88%' : '40%',
                        }}
                    >
                        {/* Logo — z:1 */}
                        <img
                            src="/logo.png"
                            alt="Logo"
                            style={{
                                maxWidth: '100%',
                                maxHeight: '60vh',
                                width: 'auto',
                                height: 'auto',
                                objectFit: 'contain',
                                position: 'relative',
                                zIndex: 1,
                            }}
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                            }}
                        />

                        {/* Calendar — centered over logo, 80% of logo width, z:2 */}
                        <div
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '80%',
                                zIndex: 2,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <DateCalendar embedded />
                        </div>
                    </div>
                </div>

                

                {/* 
                <div
                    style={{
                        position: 'absolute',
                        bottom: '5vh',
                        left: '30%',
                        transform: 'translateX(-50%)',
                        zIndex: 5,
                    }}
                >
                    <button
                        onClick={() => setIsGameOpen(true)}
                        style={{
                            backgroundColor: '#F5E6C8',
                            border: '2px solid black',
                            borderRadius: '2vh',
                            padding: '2vh 4vh',
                            fontSize: '3vh',
                            fontWeight: '600',
                            color: '#333',
                            cursor: 'pointer',
                            boxShadow: '4px 4px 0 #E5AD58',
                            transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#F0DDB8';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '6px 6px 0 #E5AD58';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#F5E6C8';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '4px 4px 0 #E5AD58';
                        }}
                    >
                        GAME
                    </button>
                </div> */}
            </div>

            {isGameOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 100,
                    }}
                    onClick={() => setIsGameOpen(false)}
                >
                    <div
                        style={{
                            backgroundColor: '#F5E6C8',
                            border: '3px solid black',
                            borderRadius: '2vh',
                            padding: '3vh',
                            maxWidth: '90vw',
                            maxHeight: '90vh',
                            overflow: 'auto',
                            position: 'relative',
                            boxShadow: '8px 8px 0 #E5AD58',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setIsGameOpen(false)}
                            style={{
                                position: 'absolute',
                                top: '2vh',
                                right: '2vh',
                                backgroundColor: '#E5AD58',
                                border: '2px solid black',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                fontSize: '20px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            ×
                        </button>
                        <Game />
                    </div>
                </div>
            )}
        </div>
    );
}

export default HeroSection;