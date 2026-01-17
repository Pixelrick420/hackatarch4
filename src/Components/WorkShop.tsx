interface WorkshopProps {
    workshopName: string;
    workshopNumber: number;
    registerLink: string;
}

export default function Workshop({ workshopName, registerLink }: WorkshopProps) {
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
