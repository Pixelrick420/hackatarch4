import { useEffect, useState, useRef } from 'react';
import Workshop from './WorkShop';

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

    const MAX_NOTES = 6;
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
                const newY = Math.random() * 80 + 10;
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
                minHeight: '100vh',
            }}
        >
            <div
                style={{
                    fontFamily: "'American' Captain",
                    paddingLeft: '3vw',
                    paddingTop: '5vh',
                    fontSize: 'clamp(2rem, 4vh, 5vh)',
                    letterSpacing: '0.05em',
                    marginBottom: '2vh',
                    zIndex: '2',
                }}
            >
                <h1 style={{ margin: 0 }}>WORKSHOPS</h1>
            </div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: screenWidth < 900 ? 'column' : 'row',
                    alignItems: 'center',
                    justifyContent: screenWidth >= 1300 ? 'flex-start' : 'space-evenly',
                    height: screenWidth < 900 ? 'auto' : '50vh',
                    backgroundColor: background,
                    gap: screenWidth < 900 ? '-20vh' : '2vw',
                    position: 'relative',
                    marginBottom: 0,
                    flex: 1,
                }}
            >
                <div
                    style={{
                        width: '30vw',
                        minWidth: '40vh',
                        backgroundColor: background,
                        marginLeft: screenWidth >= 1300 ? '5vw' : '0',
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
                        width: '30vw',
                        minWidth: '40vh',
                        backgroundColor: background,
                        marginLeft: screenWidth >= 1300 ? '5vw' : '0',
                    }}
                >
                    <Workshop
                        workshopName="WORKSHOP2"
                        workshopNumber={2}
                        registerLink="https://example.com/register"
                    />
                </div>
                {screenWidth >= 1300 && (
                    <div
                        style={{
                            pointerEvents: 'none',
                            userSelect: 'none',
                            WebkitUserSelect: 'none',
                            MozUserSelect: 'none',
                            msUserSelect: 'none',
                            position: 'absolute',
                            right: '2vw',
                            bottom: '20vh',
                            height: '40vh',
                            objectFit: 'contain',
                            opacity: '0.2',
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
        </div>
    );
}
