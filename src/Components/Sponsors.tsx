import React from 'react';

interface SponsorsProps {
    cassetteImage?: string;
    logoImage?: string;
    backgroundTexture?: string;
}

const Sponsors: React.FC<SponsorsProps> = ({
    cassetteImage = '/casette.png',
    logoImage = '/logo.png',
}) => {
    const styles = {
        container: {
            width: '100%',
            minHeight: '400px',
            background: '#F6EDC4',
            padding: '40px 20px',
            boxSizing: 'border-box' as const,
            position: 'relative' as const,
            overflow: 'hidden',
        },
        title: {
            fontFamily: "'American Captain', Impact, 'Arial Black', sans-serif",
            fontSize: 'clamp(4vh, 6vw, 5vh)',
            fontWeight: 'bold' as const,
            textAlign: 'center' as const,
            color: '#000000ff',
            margin: '0 0 -5vh 0',
            textTransform: 'uppercase' as const,
            position: 'relative' as const,
            zIndex: 2,
            background: 'rgba(0, 0, 0, 0)',
            paddingBottom: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        contentWrapper: {
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '60px 20px 40px',
            background: '#005061',
            position: 'relative' as const,
        },
        mainContent: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '5vw',
            paddingLeft: '2vw',
            paddingRight: '2vw',
            alignItems: 'center',
            justifyContent: 'center',
        },
        cassetteSection: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '300px',
        },
        cassetteContainer: {
            width: '100%',
            maxWidth: '400px',
            aspectRatio: '3/4',
            borderRadius: '15px',
            padding: '30px 20px',
            position: 'relative' as const,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        cassetteImage: {
            width: '110%',
            height: 'auto',
            objectFit: 'contain' as const,
        },
        playerSection: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        playerContainer: {
            width: '100%',
            maxWidth: '500px',
            borderRadius: '20px',
            padding: '30px',

            position: 'relative' as const,
        },
        screen: {
            background: '#133C56',
            border: '8px solid #5793A1',
            borderRadius: '12px',
            padding: '30px 20px',
            minHeight: '40vh',
            display: 'flex',
            flexDirection: 'column' as const,
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative' as const,
            overflow: 'hidden',
        },
        controls: {
            display: 'flex',
            gap: '10px',
            justifyContent: 'space-between',
            marginTop: '24px',
        },
        button: {
            flex: 1,
            background: '#1A5679',
            border: 'none',
            borderRadius: '8px',
            padding: '20px 10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '80px',
        },
        icon: {
            width: '0',
            height: '0',
            borderStyle: 'solid' as const,
        },
        prevIcon: {
            borderWidth: '25px 40px 25px 0',
            borderColor: 'transparent #8AE0CE transparent transparent',
            marginRight: '-10px',
        },
        prevIcon2: {
            borderWidth: '25px 40px 25px 0',
            borderColor: 'transparent #8AE0CE transparent transparent',
        },
        playIcon: {
            borderWidth: '35px 0 35px 55px',
            borderColor: 'transparent transparent transparent #8AE0CE',
        },
        nextIcon: {
            borderWidth: '25px 0 25px 40px',
            borderColor: 'transparent transparent transparent #8AE0CE',
            marginLeft: '-10px',
        },
        nextIcon2: {
            borderWidth: '25px 0 25px 40px',
            borderColor: 'transparent transparent transparent #8AE0CE',
        },
    };

    return (
        <div style={styles.container}>
            <div style={styles.title}>
                <h1
                    style={{
                        backgroundColor: '#F6EDC4',
                        width: 'max-content',
                        padding: '0 4vh 0 4vh',
                        fontFamily: "'American' Captain",
                        letterSpacing: '0.05em',
                    }}
                >
                    SPONSORS
                </h1>
            </div>

            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 'max-content',
                        padding: '2vh',
                        borderWidth: '1vh',
                        borderColor: 'black',
                        borderStyle: 'dashed',
                    }}
                >
                    <div style={styles.contentWrapper}>
                        <div style={styles.mainContent}>
                            <div style={styles.cassetteSection}>
                                <div style={styles.cassetteContainer}>
                                    <img
                                        src={cassetteImage}
                                        alt="Retro Cassette"
                                        style={styles.cassetteImage}
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                </div>
                            </div>

                            <div style={styles.playerSection}>
                                <div style={styles.playerContainer}>
                                    <div style={styles.screen}>
                                        <img
                                            src={logoImage}
                                            alt="Logo"
                                            onError={(e) => {
                                                const parent = e.currentTarget.parentElement;
                                                if (parent) {
                                                    parent.innerHTML =
                                                        '<div style="color: #8AE0CE; font-size: 48px; font-weight: bold;">♪</div>';
                                                }
                                            }}
                                        />
                                    </div>

                                    <div style={styles.controls}>
                                        <button style={styles.button} aria-label="Previous">
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <div
                                                    style={{ ...styles.icon, ...styles.prevIcon }}
                                                ></div>
                                                <div
                                                    style={{ ...styles.icon, ...styles.prevIcon2 }}
                                                ></div>
                                            </div>
                                        </button>

                                        <button style={styles.button} aria-label="Play">
                                            <div
                                                style={{ ...styles.icon, ...styles.playIcon }}
                                            ></div>
                                        </button>

                                        <button style={styles.button} aria-label="Next">
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <div
                                                    style={{ ...styles.icon, ...styles.nextIcon }}
                                                ></div>
                                                <div
                                                    style={{ ...styles.icon, ...styles.nextIcon2 }}
                                                ></div>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sponsors;
