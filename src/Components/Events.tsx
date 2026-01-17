import { useEffect, useMemo, useState } from 'react';

function Events() {
    const backgroundColor = '#F6EDC4';
    const dotColor = '#1C4969';

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);

    const DOT_SIZE = 6;
    const DOT_SPACING = 40;

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
            setWindowHeight(window.innerHeight);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const gridConfig = useMemo(() => {
        const cols = Math.ceil(windowWidth / DOT_SPACING);
        const rows = Math.ceil(windowHeight / DOT_SPACING);

        const startCol = Math.floor(cols * 0.3);
        const startRow = Math.floor(rows * 0.3);

        return { cols, rows, startCol, startRow };
    }, [windowWidth, windowHeight]);

    return (
        <div
            style={{
                width: '100%',
                minHeight: '100vh',
                backgroundColor: backgroundColor,
                margin: 0,
                padding: 0,
                display: 'grid',
                gridTemplateRows: 'auto 1fr',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    zIndex: 1,
                    display: 'grid',
                    gridTemplateColumns: `repeat(${gridConfig.cols}, ${DOT_SPACING}px)`,
                    gridTemplateRows: `repeat(${gridConfig.rows}, ${DOT_SPACING}px)`,
                    justifyContent: 'start',
                    alignContent: 'start',
                    paddingTop: `calc(${gridConfig.startRow * DOT_SPACING}px)`,
                    paddingLeft: `calc(${gridConfig.startCol * DOT_SPACING}px)`,
                }}
            >
                {Array.from({ length: gridConfig.cols * gridConfig.rows }).map((_, index) => (
                    <div
                        key={index}
                        style={{
                            width: `${DOT_SIZE}px`,
                            height: `${DOT_SIZE}px`,
                            backgroundColor: dotColor,
                            borderRadius: '50%',
                            justifySelf: 'center',
                            alignSelf: 'center',
                        }}
                    />
                ))}
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
                        gridAutoColumns: 'minmax(2vh, 1fr)',
                        width: '200%',
                        animation: 'scrollLeft 40s infinite linear',
                        transform: 'translateX(0)',
                    }}
                >
                    {Array.from({ length: Math.ceil(windowWidth / 25) * 2 }).map((_, i) => (
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
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    zIndex: 2,
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gridTemplateRows: 'auto 1fr',
                }}
            >
                <div
                    style={{
                        gridColumn: '2 / 3',
                        gridRow: '1 / 2',
                        padding: '5vh 5vw',
                        display: 'flex',
                        justifyContent: 'flex-end',
                    }}
                >
                    <img
                        src="/star.png"
                        alt="Star"
                        style={{
                            width: '50px',
                            height: 'auto',
                            objectFit: 'contain',
                        }}
                        onError={(e) => {
                            console.error('Failed to load star.png');
                            (e.target as HTMLImageElement).style.display = 'none';
                        }}
                    />
                </div>

                <div
                    style={{
                        gridColumn: '1 / 2',
                        gridRow: '2 / 3',
                        padding: '5vh 5vw',
                        display: 'flex',
                        alignItems: 'flex-end',
                    }}
                >
                    <img
                        src="/star.png"
                        alt="Star"
                        style={{
                            width: '50px',
                            height: 'auto',
                            objectFit: 'contain',
                            transform: 'rotate(180deg)',
                        }}
                        onError={(e) => {
                            console.error('Failed to load star.png');
                            (e.target as HTMLImageElement).style.display = 'none';
                        }}
                    />
                </div>
            </div>

            <div
                style={{
                    display: 'grid',
                    gridTemplateRows: 'auto 1fr',
                    position: 'relative',
                    zIndex: 3,
                    minHeight: '100vh',
                }}
            >
                <div
                    style={{
                        display: 'grid',
                        placeItems: 'center',
                        paddingTop: '5vh',
                        paddingBottom: '5vh',
                    }}
                >
                    <div
                        style={{
                            fontFamily: "'American' Captain",
                            fontSize: 'clamp(2rem, 6vw, 5rem)',
                            letterSpacing: '0.05em',
                            textAlign: 'center',
                            color: '#0A3248',
                        }}
                    >
                        <h1 style={{ margin: 0 }}>EVENTS</h1>
                    </div>
                </div>

                <div
                    style={{
                        display: 'grid',
                        placeItems: 'center',
                        padding: '0 5vw',
                    }}
                >
                    <div
                        style={{
                            width: '100%',
                            maxWidth: '1200px',
                            display: 'grid',
                            placeItems: 'center',
                        }}
                    >
                        <div
                            style={{
                                color: '#666',
                                fontSize: '1.2rem',
                                textAlign: 'center',
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                padding: '2rem',
                                borderRadius: '1rem',
                                backdropFilter: 'blur(10px)',
                            }}
                        >
                            Event components will be displayed here
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Events;
