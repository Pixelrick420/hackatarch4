import { useEffect, useState, useRef } from 'react';

interface WorkshopProps {
    workshopName: string;
    workshopNumber: number;
    registerLink: string;
}

function Workshop({ workshopName, registerLink }: WorkshopProps) {
    const handleRegisterClick = () => {
        window.open(registerLink, '_blank');
    };

    const trapezoidCount = 15;
    const trapezoids = Array.from({ length: trapezoidCount }, (_, i) => i);

    return (
        <div
            style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 'clamp(0.5rem, 2vw, 2rem)',
                fontFamily: 'Arcade Classic',
                boxSizing: 'border-box',
            }}
        >
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '600px',
                    aspectRatio: '1',
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '100%',
                        height: '100%',
                        transform: 'translate(-50%, -50%)',
                        animation: 'spin 30s linear infinite',
                        transition: 'all 0.5s ease',
                        userSelect: 'none',
                        WebkitUserSelect: 'none',
                        MozUserSelect: 'none',
                        msUserSelect: 'none',
                    }}
                >
                    {trapezoids.map((index) => {
                        const angle = (360 / trapezoidCount) * index;
                        return (
                            <div
                                key={index}
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    width: '18%',
                                    height: '70%',
                                    transformOrigin: 'center bottom',
                                    transform: `translate(-50%, -100%) rotate(${angle}deg)`,
                                }}
                            >
                                <img
                                    src="/trapezoid.png"
                                    alt=""
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain',
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>

                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '70%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 'clamp(0.3rem, 1.5vw, 1rem)',
                        padding: 'clamp(0.5rem, 2vw, 1rem)',
                        boxSizing: 'border-box',
                    }}
                >
                    <div
                        style={{
                            fontSize: 'clamp(0.9rem, 3.5vw, 2.5rem)',
                            fontWeight: 400,
                            fontFamily: "'Arcade Classic', 'Courier New', monospace",
                            color: 'black',
                            letterSpacing: '0.05em',
                            textAlign: 'center',
                            lineHeight: '1.2',
                            wordBreak: 'break-word',
                        }}
                    >
                        {workshopName}
                    </div>

                    <button
                        onClick={handleRegisterClick}
                        style={{
                            backgroundColor: '#0A3248',
                            color: 'white',
                            fontFamily: "'Arcade Classic', 'Courier New', monospace",
                            fontSize: 'clamp(0.7rem, 2.5vw, 1.5rem)',
                            fontWeight: 400,
                            padding: 'clamp(0.3rem, 1.2vw, 0.8rem) clamp(0.8rem, 2.5vw, 2rem)',
                            border: '3px solid black',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            boxShadow: '4px 4px 0px #4FD7C0',
                            transition: 'all 0.3s ease',
                            whiteSpace: 'nowrap',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = '6px 6px 0px #4FD7C0';
                            e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = '4px 4px 0px #4FD7C0';
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                    >
                        REGISTER
                    </button>
                </div>

                <style>
                    {`
                        @keyframes spin {
                            from {
                                transform: translate(-50%, -50%) rotate(0deg);
                            }
                            to {
                                transform: translate(-50%, -50%) rotate(360deg);
                            }
                        }
                    `}
                </style>
            </div>
        </div>
    );
}

interface MusicNote {
    id: number;
    x: number;
    y: number;
    speed: number;
    size: number;
}

const background = '#F6EDC4';

export default function Workshops() {
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [notes, setNotes] = useState<MusicNote[]>([]);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const nextNoteIdRef = useRef(0);
    const notesRef = useRef<MusicNote[]>([]);
    const animationRef = useRef<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const MAX_NOTES = 15;
    const [containerWidth, setContainerWidth] = useState(0);

    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
            if (containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const noteImages = ['/note1.png', '/note2.png', '/note3.png', '/note4.png'];

    useEffect(() => {
        notesRef.current = notes;
    }, [notes]);

    useEffect(() => {
        const spawnNote = () => {
            setNotes((prev) => {
                if (prev.length >= MAX_NOTES) {
                    return prev;
                }

                const speed = Math.random() * 0.5 + 0.6;
                const size = (1 / speed) * 30;

                const width = containerWidth || window.innerWidth;
                const newX = isInitialLoad ? Math.random() * width : width + size;
                const newY = Math.random() * 80;
                const note: MusicNote = {
                    id: nextNoteIdRef.current,
                    x: newX,
                    y: newY,
                    speed,
                    size,
                };
                nextNoteIdRef.current++;
                return [...prev, note];
            });
        };

        for (let i = 1; i < MAX_NOTES; i++) {
            setTimeout(spawnNote, i * 10);
        }

        setTimeout(
            () => {
                setIsInitialLoad(false);
            },
            MAX_NOTES * 500 + 500
        );

        const spawnInterval = setInterval(spawnNote, 2000);

        return () => clearInterval(spawnInterval);
    }, [isInitialLoad, MAX_NOTES, containerWidth]);

    useEffect(() => {
        const animateNotes = () => {
            setNotes((prev) =>
                prev
                    .map((note) => ({
                        ...note,
                        x: note.x - note.speed,
                    }))
                    .filter((note) => note.x > -note.size)
            );
            animationRef.current = requestAnimationFrame(animateNotes);
        };

        animationRef.current = requestAnimationFrame(animateNotes);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [containerWidth]);

    return (
        <div
            ref={containerRef}
            style={{
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: background,
                position: 'relative',
                overflow: 'hidden',
                height: 'min(800px, 100vw)',
            }}
        >
            <div
                style={{
                    fontFamily: "'American' Captain",
                    paddingLeft: '3vw',
                    paddingTop: '5vh',
                    fontSize: 'clamp(2rem, 4vh, 5vh)',
                    letterSpacing: '0.05em',
                    zIndex: '2',
                    color: '#0A3248',
                }}
            >
                <h1 style={{ margin: 0 }}>WORKSHOPS</h1>
            </div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: screenWidth >= 1600 ? 'flex-start' : 'space-evenly',
                    height: screenWidth < 900 ? 'auto' : '50vh',
                    backgroundColor: background,
                    gap: 0,
                    position: 'relative',
                    marginBottom: 0,
                    flex: 1,
                }}
            >
                <div
                    style={{
                        flex: '1 1 0',
                        maxWidth: '600px',
                        backgroundColor: background,
                        marginLeft: screenWidth >= 1600 ? '3vw' : '0',
                    }}
                >
                    <Workshop
                        workshopName="WORKSHOP1"
                        workshopNumber={1}
                        registerLink="https://example.com/register"
                    />
                </div>
                <div
                    style={{
                        flex: '1 1 0',
                        maxWidth: '600px',
                        backgroundColor: background,
                        marginLeft: screenWidth >= 1600 ? '3vw' : '0',
                    }}
                >
                    <Workshop
                        workshopName="WORKSHOP2"
                        workshopNumber={2}
                        registerLink="https://example.com/register"
                    />
                </div>
                {screenWidth >= 1600 && (
                    <div
                        style={{
                            pointerEvents: 'none',
                            userSelect: 'none',
                            WebkitUserSelect: 'none',
                            MozUserSelect: 'none',
                            msUserSelect: 'none',
                            position: 'absolute',
                            right: '2vw',
                            bottom: '40%',
                            height: 'min(400px, 100vw)',
                            objectFit: 'contain',
                            opacity: '0.6',
                        }}
                    >
                        <img src="/workshopimage.png" alt="" />
                    </div>
                )}
            </div>
            <div
                style={{
                    position: 'relative',
                    width: '100vw',
                    overflow: 'hidden',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    MozUserSelect: 'none',
                    msUserSelect: 'none',
                }}
            >
                <div
                    style={{
                        display: 'grid',
                        gridAutoFlow: 'column',
                        gridAutoColumns: 'minmax(1vh, 1fr)',
                        width: '200vw',
                        animation: 'scrollRight 40s infinite linear',
                    }}
                >
                    {Array.from({ length: Math.ceil(screenWidth / 25) * 2 }).map((_, i) => (
                        <img
                            key={i}
                            src="/x.png"
                            alt=""
                            style={{
                                width: '2vh',
                                height: 'auto',
                                objectFit: 'contain',
                            }}
                        />
                    ))}
                </div>
            </div>

            {notes.map((note) => {
                const noteImage = noteImages[note.id % noteImages.length];
                return (
                    <div
                        key={note.id}
                        style={{
                            position: 'absolute',
                            left: `${note.x}px`,
                            top: `${note.y}vh`,
                            width: `${note.size}px`,
                            height: `${note.size}px`,
                            zIndex: 1,
                            pointerEvents: 'none',
                            userSelect: 'none',
                            WebkitUserSelect: 'none',
                            MozUserSelect: 'none',
                            msUserSelect: 'none',
                        }}
                    >
                        <img
                            src={noteImage}
                            alt="music note"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                            }}
                        />
                    </div>
                );
            })}

            <style>
                {`
                    @keyframes scrollRight {
                        0% {
                            transform: translateX(0);
                        }
                        100% {
                            transform: translateX(-50%);
                        }
                    }
                `}
            </style>
        </div>
    );
}
