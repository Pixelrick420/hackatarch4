import { useEffect, useMemo, useState } from 'react';

function Contact() {
    const backgroundColor = '#F6EDC4';
    const dotColor = '#1C4969';

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);

    const DOT_SIZE = 6;
    const DOT_SPACING = 40;

    const isMobile = windowWidth < 1000;

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

    const leads = [
        { name: 'Dharshana KS - Arch.ai Lead', phone: '+91 98765 43211' },
        { name: 'Sreemrudu KP - TinkerHub GECT Lead', phone: '+91 98765 43210' },

    ];

    const cardStyle: React.CSSProperties = {
        backgroundColor: '#F5E6C8',
        border: '2px solid black',
        borderRadius: '3vh',
        boxShadow: '4px 4px 0 #E5AD58',
        padding: '3vh 3vw',
    };

    return (
        <div
            id="contact"
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
            {/* ── Blue dot grid (z:1) ── */}
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

            {/* ── Scrolling X banner (grid row 1 / auto) ── */}
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

            {/* ── Star corners overlay (z:2) ── */}
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
                        style={{ width: '50px', height: 'auto', objectFit: 'contain' }}
                        onError={(e) => {
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
                            (e.target as HTMLImageElement).style.display = 'none';
                        }}
                    />
                </div>
            </div>

            {/* ── Main content (z:3) ── */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateRows: 'auto 1fr',
                    position: 'relative',
                    zIndex: 3,
                    minHeight: '100vh',
                }}
            >
                {/* Title — identical wrapper to Events */}
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
                        <h1 style={{ margin: 0 }}>CONTACT US</h1>
                    </div>
                </div>

                {/* Body — same 5vw side padding, left-aligned flow */}
                <div
                    style={{
                        padding: '0 5vw 8vh',
                        display: 'flex',
                        flexDirection: isMobile ? 'column' : 'row',
                        gap: isMobile ? '4vh' : '4vw',
                        alignItems: 'stretch',
                    }}
                >
                    {/* LEFT — Map pane, translucent yellow */}
                    <div
                        style={{
                            flex: isMobile ? 'unset' : '0 0 50%',
                            width: isMobile ? '100%' : '50%',
                            backgroundColor: 'rgba(245, 230, 200, 0.7)',
                            border: '2px solid black',
                            borderRadius: '3vh',
                            boxShadow: '6px 6px 0 #E5AD58',
                            overflow: 'hidden',
                            minHeight: isMobile ? '55vw' : '55vh',
                            backdropFilter: 'blur(4px)',
                            WebkitBackdropFilter: 'blur(4px)',
                        }}
                    >


                        <iframe
                            title="Government Engineering College Thrissur"
src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3922.31492332497!2d76.22466!3d10.5545108!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba7eee301ff400f%3A0x8851e3d8fc9c94f0!2sGovernment%20Engineering%20College%20Thrissur%20(GEC%20Thrissur)!5e0!3m2!1sen!2sin!4v1774072457982!5m2!1sen!2sin"
                           width="100%"
                           height="100%"
                            style={{
                                border: 'none',
                                display: 'block',
                                minHeight: isMobile ? '55vw' : '55vh',
                                filter: 'sepia(20%) contrast(1.05)',
                            }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>

                    {/* RIGHT — Contact details */}
                    <div
                        style={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '3vh',
                            justifyContent: 'center',
                            paddingTop: '1vh',
                        }}
                    >
                        {/* Venue card */}
                        <div style={cardStyle}>
                            <p
                                style={{
                                    fontFamily: "'American' Captain",
                                    fontSize: 'clamp(1rem, 2vw, 1.6rem)',
                                    color: '#0A3248',
                                    letterSpacing: '0.05em',
                                    margin: '0 0 1vh 0',
                                }}
                            >
                                VENUE
                            </p>
                            <p
                                style={{
                                    fontFamily: 'Inria Sans, sans-serif',
                                    fontSize: isMobile ? '3.5vw' : '1.1vw',
                                    color: '#333',
                                    margin: 0,
                                    lineHeight: 1.6,
                                    fontWeight: '600',
                                }}
                            >
                                Government Engineering College Thrissur
                                <br />
                                Thrissur, Kerala 680009
                            </p>
                        </div>

                        {/* Leads card */}
                        <div style={cardStyle}>
                            <p
                                style={{
                                    fontFamily: "'American' Captain",
                                    fontSize: 'clamp(1rem, 2vw, 1.6rem)',
                                    color: '#0A3248',
                                    letterSpacing: '0.05em',
                                    margin: '0 0 2vh 0',
                                }}
                            >
                                HACK@ARCH LEADS
                            </p>

                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '2vh',
                                }}
                            >
                                {leads.map((lead, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            display: 'flex',
                                            flexDirection: isMobile ? 'column' : 'row',
                                            justifyContent: 'space-between',
                                            alignItems: isMobile ? 'flex-start' : 'center',
                                            backgroundColor: '#F6EDC4',
                                            border: '2px solid black',
                                            borderRadius: '2vh',
                                            padding: '1.5vh 2vw',
                                            boxShadow: '3px 3px 0 #E5AD58',
                                            gap: isMobile ? '0.5vh' : '0',
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontFamily: "'American' Captain",
                                                fontSize: 'clamp(0.9rem, 1.8vw, 1.4rem)',
                                                color: '#0A3248',
                                                letterSpacing: '0.05em',
                                            }}
                                        >
                                            {lead.name}
                                        </span>
                                        <a
                                            href={`tel:${lead.phone.replace(/\s/g, '')}`}
                                            style={{
                                                fontFamily: 'Inria Sans, sans-serif',
                                                fontSize: isMobile ? '3.5vw' : '1.05vw',
                                                color: '#333',
                                                fontWeight: '700',
                                                textDecoration: 'none',
                                                backgroundColor: '#F5E6C8',
                                                border: '1.5px solid black',
                                                borderRadius: '1.5vh',
                                                padding: '0.5vh 1.2vw',
                                                boxShadow: '2px 2px 0 #E5AD58',
                                                transition: 'all 0.2s ease',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = '#E5AD58';
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                e.currentTarget.style.boxShadow = '4px 4px 0 #0A3248';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = '#F5E6C8';
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = '2px 2px 0 #E5AD58';
                                            }}
                                        >
                                            {lead.phone}
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer tag — Arcade Classic from App.css */}
                        <div
                            style={{
                                fontFamily: 'Arcade Classic, monospace',
                                fontSize: isMobile ? '3vw' : 'clamp(0.6rem, 1vw, 1rem)',
                                color: '#1C4969',
                                letterSpacing: '0.2em',
                            }}
                        >
                            {/* ★ &nbsp; SEE YOU THERE &nbsp; ★ */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contact;