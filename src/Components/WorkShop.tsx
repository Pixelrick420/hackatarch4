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
                padding: '2rem',
                fontFamily: 'Arcade Classic',
            }}
        >
            <div
                style={{
                    position: 'relative',
                    width: 'clamp(300px, 80vw, 500px)',
                    height: 'clamp(300px, 80vw, 500px)',
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
                                    width: '15%',
                                    height: '45%',
                                    transformOrigin: 'center bottom',
                                    transform: `translate(-50%, -100%) rotate(${angle}deg)`,
                                }}
                            >
                                <img
                                    src="/trapezoid.png"
                                    alt=""
                                    style={{
                                        width: '10vh',
                                        height: '10vh',
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
                        width: '50%',
                        height: '30%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 'clamp(0.5rem, 1.5vw, 1rem)',
                        backgroundColor: 'rgba(0,0,0,0)',
                    }}
                >
                    <div
                        style={{
                            fontSize: 'clamp(1.5rem, 2vw, 3rem)',
                            fontWeight: 400,
                            fontFamily: "'Arcade Classic', 'Courier New', monospace",
                            color: 'black',
                            letterSpacing: '0.05em',
                            textAlign: 'center',
                            marginBottom: 'clamp(0.5rem, 2vw, 1rem)',
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
                            fontSize: 'clamp(1rem, 4vw, 2rem)',
                            fontWeight: 400,
                            padding: '5px 2vh 5px 2vh',
                            border: '3px solid black',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            boxShadow: '4px 4px 0px #4FD7C0',
                            transition: 'all 0.5s ease',
                            marginTop: 'clamp(0.5rem, 2vw, 1rem)',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = '8px 8px 0px #4FD7C0';
                            e.currentTarget.style.transform = 'scale(1.01)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = '4px 4px 0px #4FD7C0';
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                    >
                        REGISTER
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Workshop;
