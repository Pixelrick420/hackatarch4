import { useState, useEffect, useRef } from 'react';

const DATES = [
    { month: 'MARCH', date: '27', day: 'FRIDAY' },
    { month: 'MARCH', date: '28', day: 'SATURDAY' },
    { month: 'MARCH', date: '29', day: 'SUNDAY' },
];

const PAGE_BG     = '#F0E0B0';
const PAGE_DARK1  = '#E8D090';
const PAGE_DARK2  = '#DFC578';
const PAGE_BORDER = '#C4A872';
const TAPE_COLOR  = '#D4B896';
const STAPLE_CLR  = '#8A7560';
const TEXT_COLOR  = '#0A3248';

interface DateCalendarProps {
    /** When true: no outer section/title, translucent backdrop, compact sizing */
    embedded?: boolean;
}

function DateCalendar({ embedded = false }: DateCalendarProps) {
    const [currentPage, setCurrentPage] = useState(0);
    const [isFlipping, setIsFlipping]   = useState(false);
    const [flipDir, setFlipDir]         = useState<'fwd' | 'bwd'>('fwd');
    const [hasAnimated, setHasAnimated] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const sectionRef  = useRef<HTMLDivElement>(null);
    const touchStartX = useRef(0);
    const touchStartY = useRef(0);

    const isMobile = windowWidth < 1000;

    // ── Responsive ─────────────────────────────────────────────────────────
    useEffect(() => {
        const onResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    // ── Inject keyframes once ───────────────────────────────────────────────
    useEffect(() => {
        const ID = 'datecal-keyframes';
        if (document.getElementById(ID)) return;
        const style = document.createElement('style');
        style.id = ID;
        style.textContent = `
            @keyframes calFlipFwd {
                0%   { transform: perspective(900px) rotateX(0deg);  opacity: 1;   }
                42%  { transform: perspective(900px) rotateX(-82deg); opacity: 0.4; }
                50%  { transform: perspective(900px) rotateX(-90deg); opacity: 0;   }
                58%  { transform: perspective(900px) rotateX(-90deg); opacity: 0;   }
                100% { transform: perspective(900px) rotateX(0deg);  opacity: 1;   }
            }
            @keyframes calFlipBwd {
                0%   { transform: perspective(900px) rotateX(0deg);  opacity: 1;   }
                42%  { transform: perspective(900px) rotateX(82deg);  opacity: 0.4; }
                50%  { transform: perspective(900px) rotateX(90deg);  opacity: 0;   }
                58%  { transform: perspective(900px) rotateX(90deg);  opacity: 0;   }
                100% { transform: perspective(900px) rotateX(0deg);  opacity: 1;   }
            }
        `;
        document.head.appendChild(style);
        return () => { document.getElementById(ID)?.remove(); };
    }, []);

    // ── Auto-play on section enter (IntersectionObserver) ───────────────────
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (!entries[0].isIntersecting || hasAnimated) return;
                setHasAnimated(true);
                [1, 2, 0].forEach((targetPage, i) => {
                    const base = 700 + i * 950;
                    setTimeout(() => { setFlipDir('fwd'); setIsFlipping(true); }, base);
                    setTimeout(() => { setCurrentPage(targetPage); },            base + 375);
                    setTimeout(() => { setIsFlipping(false); },                  base + 750);
                });
            },
            { threshold: 0.3 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, [hasAnimated]);

    // ── Manual flip ─────────────────────────────────────────────────────────
    const triggerFlip = (targetPage: number, dir: 'fwd' | 'bwd') => {
        if (isFlipping) return;
        setFlipDir(dir);
        setIsFlipping(true);
        setTimeout(() => { setCurrentPage(targetPage); }, 375);
        setTimeout(() => { setIsFlipping(false); },        750);
    };

    const goNext = () => triggerFlip((currentPage + 1) % DATES.length, 'fwd');
    const goPrev = () => triggerFlip((currentPage - 1 + DATES.length) % DATES.length, 'bwd');

    // ── Swipe ───────────────────────────────────────────────────────────────
    const onTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
    };
    const onTouchEnd = (e: React.TouchEvent) => {
        const dx = touchStartX.current - e.changedTouches[0].clientX;
        const dy = Math.abs(touchStartY.current - e.changedTouches[0].clientY);
        if (Math.abs(dx) > 44 && Math.abs(dx) > dy) {
            dx > 0 ? goNext() : goPrev();
        }
    };

    // ── Sizing — compact when embedded ─────────────────────────────────────
    const cardWidth = embedded
        ? isMobile
            ? 'min(calc(100vw - 80px), 220px)'
            : 'clamp(234px, 23vw, 312px)'
        : isMobile
            ? 'min(calc(100vw - 48px), 340px)'
            : 'clamp(260px, 34vw, 400px)';

    const dateFontSize = embedded
        ? 'clamp(4.16rem, 11.7vw, 7.54rem)'
        : 'clamp(5.5rem, 19vw, 10.5rem)';

    const monthFontSize = embedded
        ? 'clamp(0.91rem, 1.82vw, 1.3rem)'
        : 'clamp(0.95rem, 2.4vw, 1.55rem)';

    const dayFontSize = embedded
        ? 'clamp(0.78rem, 1.56vw, 1.17rem)'
        : 'clamp(0.85rem, 2.1vw, 1.35rem)';

    const arrowSize = embedded ? '42px' : '40px';
    const arrowFont = embedded ? '23px' : '22px';

    // Translucency only when embedded
    const pageBg = embedded
        ? `radial-gradient(ellipse at 25% 18%, rgba(255,255,255,0.12) 0%, transparent 55%),
           radial-gradient(ellipse at 75% 82%, rgba(0,0,0,0.03)  0%, transparent 50%),
           linear-gradient(160deg, rgba(245,232,188,0.52) 0%, rgba(237,212,154,0.52) 100%)`
        : `radial-gradient(ellipse at 25% 18%, rgba(255,255,255,0.18) 0%, transparent 55%),
           radial-gradient(ellipse at 75% 82%, rgba(0,0,0,0.04)  0%, transparent 50%),
           linear-gradient(160deg, #F5E8BC 0%, #EDD49A 100%)`;

    const pageBorder = embedded
        ? `1.5px solid rgba(196,168,114,0.55)`
        : `2px solid ${PAGE_BORDER}`;

    const pageBoxShadow = embedded
        ? `3px 3px 0 rgba(184,149,106,0.45), inset 0 0 30px rgba(0,0,0,0.02)`
        : `4px 4px 0 #B8956A, inset 0 0 30px rgba(0,0,0,0.04)`;

    const stackBg1 = embedded ? 'rgba(232,208,144,0.45)' : PAGE_DARK1;
    const stackBg2 = embedded ? 'rgba(223,197,120,0.35)' : PAGE_DARK2;

    const arrowBtn: React.CSSProperties = {
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        backgroundColor: embedded ? 'rgba(245,230,200,0.55)' : '#F5E6C8',
        border: embedded ? '1.5px solid rgba(0,0,0,0.4)' : '2px solid black',
        borderRadius: '50%',
        width:  arrowSize,
        height: arrowSize,
        fontSize: arrowFont,
        lineHeight: '1',
        cursor: 'pointer',
        boxShadow: embedded ? '2px 2px 0 rgba(229,173,88,0.5)' : '3px 3px 0 #E5AD58',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
        zIndex: 40,
        color: TEXT_COLOR,
        fontFamily: 'American Captain',
        backdropFilter: embedded ? 'blur(4px)' : 'none',
        WebkitBackdropFilter: embedded ? 'blur(4px)' : 'none',
    };

    const pageData = DATES[currentPage];

    // ── Calendar card ───────────────────────────────────────────────────────
    const CalendarCard = (
        <div
            ref={sectionRef}
            style={{
                position: 'relative',
                width: cardWidth,
                margin: '0 auto',
                paddingBottom: '10px',
                paddingRight: '10px',
                boxSizing: 'content-box' as const,
            }}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
        >
            {/* Page 3 — farthest back */}
            <div
                style={{
                    position: 'absolute',
                    top: '10px', left: '8px', right: '-10px', bottom: '-10px',
                    backgroundColor: stackBg2,
                    border: pageBorder,
                    borderRadius: '14px',
                    zIndex: 1,
                }}
            />
            {/* Page 2 — one behind */}
            <div
                style={{
                    position: 'absolute',
                    top: '5px', left: '4px', right: '-5px', bottom: '-5px',
                    backgroundColor: stackBg1,
                    border: pageBorder,
                    borderRadius: '13px',
                    zIndex: 2,
                }}
            />

            {/* Main page */}
            <div
                style={{
                    position: 'relative',
                    zIndex: 10,
                    border: pageBorder,
                    borderRadius: '14px',
                    paddingTop: embedded ? '2.5vh' : '3.5vh',
                    paddingBottom: embedded ? '2.5vh' : '4vh',
                    boxSizing: 'border-box' as const,
                    background: pageBg,
                    boxShadow: pageBoxShadow,
                    backdropFilter: embedded ? 'blur(10px)' : 'none',
                    WebkitBackdropFilter: embedded ? 'blur(10px)' : 'none',
                    transformOrigin: 'top center',
                    animation: isFlipping
                        ? `${flipDir === 'fwd' ? 'calFlipFwd' : 'calFlipBwd'} 0.75s cubic-bezier(0.45, 0, 0.55, 1)`
                        : 'none',
                }}
            >
                {/* Tape strip */}
                <div
                    style={{
                        position: 'absolute',
                        top: '-14px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: embedded ? '75px' : '100px',
                        height: embedded ? '20px' : '26px',
                        backgroundColor: TAPE_COLOR,
                        borderRadius: '4px',
                        zIndex: 30,
                        opacity: embedded ? 0.72 : 0.88,
                        boxShadow: '0 2px 5px rgba(0,0,0,0.18)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: embedded ? '18px' : '26px',
                    }}
                >
                    {[0, 1].map((i) => (
                        <div
                            key={i}
                            style={{
                                width: embedded ? '11px' : '14px',
                                height: '4px',
                                backgroundColor: STAPLE_CLR,
                                borderRadius: '1.5px',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
                            }}
                        />
                    ))}
                </div>

                {/* Faint ruled lines */}
                {[0, 1, 2, 3,].map((i) => (
                    <div
                        key={i}
                        style={{
                            position: 'absolute',
                            left: '10%', right: '10%',
                            top: `${22 + i * 22}%`,
                            height: '1px',
                            backgroundColor: 'rgba(180,148,90,0.15)',
                            pointerEvents: 'none',
                        }}
                    />
                ))}

                {/* Page content */}
                <div
                    style={{
                        textAlign: 'center',
                        fontFamily: "'American' Captain",
                        letterSpacing: '0.06em',
                        color: TEXT_COLOR,
                        userSelect: 'none',
                        padding: '2vh 4% 0',
                    }}
                >
                    <div style={{ fontSize: monthFontSize, opacity: 0.55, letterSpacing: '0.28em', marginBottom: '0.4vh' }}>
                        {pageData.month}
                    </div>
                    <div
                        style={{
                            fontSize: dateFontSize,
                            fontWeight: 'bold',
                            lineHeight: 0.9,
                            marginBottom: '0.8vh',
                            textShadow: `2px 2px 0 rgba(0,0,0,0.08), -1px -1px 0 rgba(255,255,255,0.3)`,
                        }}
                    >
                        {pageData.date}
                    </div>
                    <div style={{ fontSize: dayFontSize, opacity: 0.52, letterSpacing: '0.22em' }}>
                        {pageData.day}
                    </div>
                </div>

                {/* Dot indicators */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: embedded ? '2vh' : '3vh', paddingBottom: '0.5vh' }}>
                    {DATES.map((_, i) => (
                        <div
                            key={i}
                            onClick={() => {
                                if (i === currentPage || isFlipping) return;
                                triggerFlip(i, i > currentPage ? 'fwd' : 'bwd');
                            }}
                            style={{
                                width: i === currentPage ? '18px' : '7px',
                                height: '7px',
                                borderRadius: '4px',
                                backgroundColor: i === currentPage
                                    ? embedded ? 'rgba(10,50,72,0.75)' : TEXT_COLOR
                                    : embedded ? 'rgba(196,168,114,0.5)' : PAGE_BORDER,
                                cursor: i !== currentPage ? 'pointer' : 'default',
                                transition: 'all 0.35s ease',
                                border: `1.5px solid ${embedded ? 'rgba(196,168,114,0.4)' : PAGE_BORDER}`,
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );

    // ── EMBEDDED mode: bare card + arrows, no wrapper section ───────────────
    if (embedded) {
        return (
            <div
                style={{
                    position: 'relative',
                    padding: isMobile ? '0' : `0 ${parseInt(arrowSize) + 12}px`,
                    width: isMobile
                        ? `calc(${cardWidth} + 20px)`
                        : `calc(${cardWidth} + ${(parseInt(arrowSize) + 12) * 2}px)`,
                    boxSizing: 'border-box' as const,
                }}
            >
                {/* Left arrow */}
                {!isMobile && (
                    <button
                        onClick={goPrev}
                        style={{ ...arrowBtn, left: 0 }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(240,221,184,0.7)';
                            e.currentTarget.style.transform = 'translateY(-52%)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(245,230,200,0.55)';
                            e.currentTarget.style.transform = 'translateY(-50%)';
                        }}
                    >‹</button>
                )}

                {CalendarCard}

                {/* Right arrow */}
                {!isMobile && (
                    <button
                        onClick={goNext}
                        style={{ ...arrowBtn, right: 0 }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(240,221,184,0.7)';
                            e.currentTarget.style.transform = 'translateY(-52%)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(245,230,200,0.55)';
                            e.currentTarget.style.transform = 'translateY(-50%)';
                        }}
                    >›</button>
                )}

                {/* Swipe hint on mobile */}
                {isMobile && (
                    <div
                        style={{
                            textAlign: 'center',
                            fontFamily: 'Arcade Classic, monospace',
                            fontSize: 'clamp(0.15rem, 2.7vw, 1rem)',
                            color: 'rgba(28,73,105,0.75)',
                            letterSpacing: '0.15em',
                            marginTop: '2vh',
                        }}
                    >
                        ← SWIPE SIDEWAYS TO FLIP →
                    </div>
                )}
            </div>
        );
    }

    // ── STANDALONE mode: full section with title ────────────────────────────
    return (
        <div
            style={{
                width: '100%',
                backgroundColor: '#F6EDC4',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '6vh 5vw 9vh',
                boxSizing: 'border-box',
            }}
        >
            <div
                style={{
                    fontFamily: "'American' Captain",
                    fontSize: 'clamp(2rem, 6vw, 5rem)',
                    letterSpacing: '0.05em',
                    textAlign: 'center',
                    color: TEXT_COLOR,
                    marginBottom: '6vh',
                }}
            >
                <h2 style={{ margin: 0 }}>SAVE THE DATE</h2>
            </div>

            <div
                style={{
                    position: 'relative',
                    padding: isMobile ? '0' : '0 56px',
                    width: isMobile ? cardWidth : `calc(${cardWidth} + 112px)`,
                    maxWidth: '100%',
                    boxSizing: 'border-box',
                }}
            >
                {!isMobile && (
                    <button
                        onClick={goPrev}
                        style={{ ...arrowBtn, left: 0 }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#F0DDB8';
                            e.currentTarget.style.transform = 'translateY(-52%)';
                            e.currentTarget.style.boxShadow = '5px 5px 0 #E5AD58';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#F5E6C8';
                            e.currentTarget.style.transform = 'translateY(-50%)';
                            e.currentTarget.style.boxShadow = '3px 3px 0 #E5AD58';
                        }}
                    >‹</button>
                )}

                {CalendarCard}

                {!isMobile && (
                    <button
                        onClick={goNext}
                        style={{ ...arrowBtn, right: 0 }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#F0DDB8';
                            e.currentTarget.style.transform = 'translateY(-52%)';
                            e.currentTarget.style.boxShadow = '5px 5px 0 #E5AD58';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#F5E6C8';
                            e.currentTarget.style.transform = 'translateY(-50%)';
                            e.currentTarget.style.boxShadow = '3px 3px 0 #E5AD58';
                        }}
                    >›</button>
                )}

                {isMobile && (
                    <div
                        style={{
                            textAlign: 'center',
                            fontFamily: 'Arcade Classic, monospace',
                            fontSize: 'clamp(0.55rem, 2.8vw, 0.8rem)',
                            color: '#1C4969',
                            letterSpacing: '0.18em',
                            opacity: 0.6,
                            marginTop: '2.5vh',
                        }}
                    >
                        ← SWIPE TO FLIP →
                    </div>
                )}
            </div>
        </div>
    );
}

export default DateCalendar;