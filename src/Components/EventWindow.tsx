import React, { useState, useRef, useEffect } from 'react';

interface EventsWindowProps {
    eventArray?: React.ReactNode[];
}

const EventsWindow: React.FC<EventsWindowProps> = ({
    eventArray = [
        <div key={0} style={{ color: '#ffffffff', fontSize: '24px', padding: '20px' }}>
            Event 1
        </div>,
        <div key={1} style={{ color: '#ffffffff', fontSize: '24px', padding: '20px' }}>
            Event 2
        </div>,
        <div key={2} style={{ color: '#ffffffff', fontSize: '24px', padding: '20px' }}>
            Event 3
        </div>,
        <div key={2} style={{ color: '#ffffffff', fontSize: '24px', padding: '20px' }}>
            Event 4
        </div>,
    ],
}) => {
    const [position, setPosition] = useState({ x: 50, y: 50 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [isMinimized, setIsMinimized] = useState(false);
    const [showCannotMinimize, setShowCannotMinimize] = useState(false);
    const [showCannotMaximize, setShowCannotMaximize] = useState(false);
    const [sliderValue, setSliderValue] = useState(0);
    const [isSliderDragging, setIsSliderDragging] = useState(false);

    const windowRef = useRef<HTMLDivElement>(null);
    const sliderRef = useRef<HTMLDivElement>(null);
    const parentRef = useRef<HTMLDivElement>(null);

    const currentEventIndex = Math.round(sliderValue * (eventArray.length - 1));

    const handleMouseDown = (e: React.MouseEvent) => {
        if (windowRef.current && parentRef.current) {
            const rect = windowRef.current.getBoundingClientRect();
            setDragOffset({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
            setIsDragging(true);
        }
    };

    const handleSliderMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsSliderDragging(true);
        updateSliderValue(e.clientX);
    };

    const updateSliderValue = (clientX: number) => {
        if (sliderRef.current) {
            const rect = sliderRef.current.getBoundingClientRect();
            const x = clientX - rect.left;
            const percentage = Math.max(0, Math.min(1, x / rect.width));
            setSliderValue(percentage);
        }
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging && windowRef.current && parentRef.current) {
                const parentRect = parentRef.current.getBoundingClientRect();
                const windowRect = windowRef.current.getBoundingClientRect();

                let newX = e.clientX - dragOffset.x - parentRect.left;
                let newY = e.clientY - dragOffset.y - parentRect.top;

                newX = Math.max(0, Math.min(newX, parentRect.width - windowRect.width));
                newY = Math.max(0, Math.min(newY, parentRect.height - windowRect.height));

                setPosition({ x: newX, y: newY });
            }

            if (isSliderDragging) {
                updateSliderValue(e.clientX);
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            setIsSliderDragging(false);
        };

        if (isDragging || isSliderDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, isSliderDragging, dragOffset]);

    const handleMinimize = () => {
        if (isMinimized) {
            setShowCannotMinimize(true);
            setTimeout(() => setShowCannotMinimize(false), 2000);
        } else {
            setIsMinimized(true);
        }
    };

    const handleMaximize = () => {
        if (!isMinimized) {
            setShowCannotMaximize(true);
            setTimeout(() => setShowCannotMaximize(false), 2000);
        } else {
            setIsMinimized(false);
        }
    };

    const windowStyle: React.CSSProperties = {
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: isMinimized ? '200px' : '600px',
        height: isMinimized ? '100px' : '650px',
        border: '4px solid #666',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        transition: 'width 0.3s, height 0.3s',
        fontFamily: "'Arcade Classic', monospace",
        userSelect: 'none',
    };

    return (
        <div
            ref={parentRef}
            style={{
                position: 'relative',
                width: '100%',
                height: '100vh',
                background: '#00000000',
                overflow: 'hidden',
            }}
        >
            <div ref={windowRef} style={windowStyle}>
                {/* Title Bar */}
                <div
                    onMouseDown={handleMouseDown}
                    style={{
                        background: 'linear-gradient(to right, #a8d5a8, #6b9999)',
                        height: '50px',
                        cursor: isDragging ? 'grabbing' : 'grab',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        padding: '0 10px',
                        gap: '10px',
                    }}
                >
                    <img
                        src="minimize.png"
                        alt="minimize"
                        onClick={handleMinimize}
                        style={{
                            width: '50px',
                            height: '35px',
                            cursor: 'pointer',
                            objectFit: 'contain',
                        }}
                    />
                    <img
                        src="maximize.png"
                        alt="maximize"
                        onClick={handleMaximize}
                        style={{
                            width: '50px',
                            height: '35px',
                            cursor: 'pointer',
                            objectFit: 'contain',
                        }}
                    />
                    <img
                        src="close.png"
                        alt="close"
                        style={{
                            width: '50px',
                            height: '35px',
                            cursor: 'pointer',
                            objectFit: 'contain',
                        }}
                    />
                </div>

                {/* Controls Bar */}
                <div
                    style={{
                        background: '#c0c0c0',
                        height: '60px',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 20px',
                        gap: '20px',
                    }}
                >
                    <img
                        src="leftarrow.png"
                        alt="left"
                        style={{
                            width: '40px',
                            height: '40px',
                            cursor: 'pointer',
                            objectFit: 'contain',
                        }}
                    />
                    <img
                        src="rightarrow.png"
                        alt="right"
                        style={{
                            width: '40px',
                            height: '40px',
                            cursor: 'pointer',
                            objectFit: 'contain',
                        }}
                    />
                    <div style={{ flex: 1 }}></div>
                    <img
                        src="settings.png"
                        alt="settings"
                        style={{
                            width: '40px',
                            height: '40px',
                            cursor: 'pointer',
                            objectFit: 'contain',
                        }}
                    />
                </div>

                {/* Main Screen */}
                <div
                    style={{
                        background: '#000',
                        height: isMinimized ? '0px' : 'calc(100% - 180px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                    }}
                >
                    {!isMinimized && eventArray[currentEventIndex]}
                </div>

                {/* Bottom Controls */}
                {!isMinimized && (
                    <div
                        style={{
                            background: '#c0c0c0',
                            height: '70px',
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '10px',
                            gap: '10px',
                        }}
                    >
                        <div
                            ref={sliderRef}
                            onMouseDown={handleSliderMouseDown}
                            style={{
                                position: 'relative',
                                width: '100%',
                                height: '25px',
                                background: '#999',
                                border: '2px solid #666',
                                cursor: 'pointer',
                            }}
                        >
                            <div
                                style={{
                                    position: 'absolute',
                                    left: `${sliderValue * 100}%`,
                                    top: '0',
                                    width: '20px',
                                    height: '100%',
                                    background: 'white',
                                    border: '2px solid #333',
                                    transform: 'translateX(-50%)',
                                    cursor: 'pointer',
                                }}
                            />
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                            }}
                        >
                            <img
                                src="playbutton.png"
                                alt="play"
                                style={{
                                    width: '35px',
                                    height: '35px',
                                    cursor: 'pointer',
                                    objectFit: 'contain',
                                }}
                            />
                            <img
                                src="pause.png"
                                alt="pause"
                                style={{
                                    width: '35px',
                                    height: '35px',
                                    cursor: 'pointer',
                                    objectFit: 'contain',
                                }}
                            />
                            <img
                                src="stop.png"
                                alt="stop"
                                style={{
                                    width: '35px',
                                    height: '35px',
                                    cursor: 'pointer',
                                    objectFit: 'contain',
                                }}
                            />
                            <div style={{ width: '2px', height: '25px', background: '#666' }}></div>
                            <img
                                src="start.png"
                                alt="start"
                                style={{
                                    width: '35px',
                                    height: '35px',
                                    cursor: 'pointer',
                                    objectFit: 'contain',
                                }}
                            />
                            <img
                                src="backwards.png"
                                alt="backwards"
                                style={{
                                    width: '35px',
                                    height: '35px',
                                    cursor: 'pointer',
                                    objectFit: 'contain',
                                }}
                            />
                            <img
                                src="forwards.png"
                                alt="forwards"
                                style={{
                                    width: '35px',
                                    height: '35px',
                                    cursor: 'pointer',
                                    objectFit: 'contain',
                                }}
                            />
                            <img
                                src="end.png"
                                alt="end"
                                style={{
                                    width: '35px',
                                    height: '35px',
                                    cursor: 'pointer',
                                    objectFit: 'contain',
                                }}
                            />
                            <div style={{ flex: 1 }}></div>
                            <img
                                src="volume.png"
                                alt="volume"
                                style={{
                                    width: '35px',
                                    height: '35px',
                                    cursor: 'pointer',
                                    objectFit: 'contain',
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {showCannotMinimize && (
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        background: 'white',
                        border: '4px solid #666',
                        borderRadius: '8px',
                        padding: '30px 50px',
                        fontSize: '24px',
                        fontFamily: "'Arcade Classic', monospace",
                        boxShadow: '0 4px 20px rgba(0,0,0,0.8)',
                        zIndex: 1000,
                    }}
                >
                    Cannot Minimize
                </div>
            )}

            {showCannotMaximize && (
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        background: 'white',
                        border: '4px solid #666',
                        borderRadius: '8px',
                        padding: '30px 50px',
                        fontSize: '24px',
                        fontFamily: "'Arcade Classic', monospace",
                        boxShadow: '0 4px 20px rgba(0,0,0,0.8)',
                        zIndex: 1000,
                    }}
                >
                    Cannot Maximize
                </div>
            )}
        </div>
    );
};

export default EventsWindow;
