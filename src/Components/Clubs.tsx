import { useEffect, useState } from 'react';

function Clubs() {
    const clubMain = '#3AAE95';
    const clubHighlight = '#40456B';

    const [isFlipped, setIsFlipped] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsFlipped((prev) => !prev);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div
            style={{
                width: '100%',
                minHeight: '100vh',
                margin: 0,
                padding: 0,
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: clubMain,
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
                                fill={clubMain}
                            />
                            <rect
                                x="0"
                                y={yStart + mainHeight}
                                width="100"
                                height={highlightHeight}
                                fill={clubHighlight}
                            />
                        </g>
                    );
                })}
            </svg>

            <div
                style={{
                    position: 'relative',
                    zIndex: 2,
                    minHeight: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingTop: '20vh',
                }}
            >
                <div
                    style={{
                        width: 'min(50vh, 70vw)',
                        height: 'min(50vh, 70vw)',
                        perspective: '1000px',
                    }}
                >
                    <div
                        style={{
                            width: '100%',
                            height: '100%',
                            position: 'relative',
                            transformStyle: 'preserve-3d',
                            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                            transition: 'transform 1s ease-in-out',
                        }}
                    >
                        <div
                            style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                backfaceVisibility: 'hidden',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <div
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    position: 'relative',
                                    animation: 'rotate 3s linear infinite',
                                }}
                            >
                                <img
                                    src="/cd.png"
                                    alt="CD"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain',
                                    }}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                                <img
                                    src="/arch.png"
                                    alt="Arch"
                                    style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        width: '30%',
                                        height: '30%',
                                        objectFit: 'contain',
                                    }}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                            </div>
                        </div>

                        <div
                            style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                backfaceVisibility: 'hidden',
                                transform: 'rotateY(180deg)',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <div
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    position: 'relative',
                                    animation: 'rotate 3s linear infinite',
                                }}
                            >
                                <img
                                    src="/cd.png"
                                    alt="CD"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain',
                                    }}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                                <img
                                    src="/tinker.png"
                                    alt="Tinker"
                                    style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        width: '30%',
                                        height: '30%',
                                        objectFit: 'contain',
                                    }}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes rotate {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
        </div>
    );
}

export default Clubs;
