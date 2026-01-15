/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

interface FlipDigitProps {
    digit: string;
}

function FlipDigit({ digit }: FlipDigitProps) {
    const [prevDigit, setPrevDigit] = useState(digit);
    const [isFlipping, setIsFlipping] = useState(false);

    if (digit !== prevDigit && !isFlipping) {
        setIsFlipping(true);
        setTimeout(() => {
            setPrevDigit(digit);
            setIsFlipping(false);
        }, 300);
    }

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                backgroundColor: digitBackground,
                borderRadius: '12px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
                boxShadow: 'inset 0 -4px 0 rgba(0,0,0,0.3)',
                position: 'relative',
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: 0,
                    right: 0,
                    height: '2px',
                    backgroundColor: splitLineColor,
                    zIndex: 10,
                }}
            />

            <div
                style={{
                    position: 'absolute',
                    left: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '8px',
                    height: '8px',
                    backgroundColor: screwColor,
                    borderRadius: '50%',
                    zIndex: 11,
                }}
            />

            <div
                style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '8px',
                    height: '8px',
                    backgroundColor: screwColor,
                    borderRadius: '50%',
                    zIndex: 11,
                }}
            />

            <div
                style={{
                    fontFamily: "'American Captain', 'Arial Black', sans-serif",
                    fontSize: 'clamp(2rem, 8vw, 6rem)',
                    fontWeight: 900,
                    color: 'white',
                    lineHeight: 1,
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    transform: isFlipping ? 'rotateX(90deg)' : 'rotateX(0deg)',
                    transition: 'transform 0.3s ease',
                }}
            >
                {prevDigit}
            </div>
        </div>
    );
}

interface ColorDotProps {
    color: string;
}

function ColorDot({ color }: ColorDotProps) {
    return (
        <div
            style={{
                width: 'clamp(8px, 1.2vw, 14px)',
                height: 'clamp(8px, 1.2vw, 14px)',
                backgroundColor: color,
                borderRadius: '50%',
            }}
        />
    );
}

interface ButtonProps {
    color: string;
    isPressed: boolean;
    onClick: () => void;
}

function Button3D({ color, isPressed, onClick }: ButtonProps) {
    return (
        <button
            onClick={onClick}
            style={{
                width: 'clamp(45px, 5vw, 60px)',
                height: 'clamp(24px, 3vw, 32px)',
                marginBottom: '-1vh',
                backgroundColor: color,
                border: '2px solid black',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                transform: isPressed ? 'translateY(3px)' : 'translateY(0)',
                boxShadow: isPressed ? '0 2px 4px rgba(0,0,0,0.3)' : '0 5px 8px rgba(0,0,0,0.4)',
            }}
        />
    );
}

const digitBackground = '#354366';
const clockBackground = '#1c2037';
const innerBorder = '#4C5163';
const screwColor = '#2a3351';
const splitLineColor = '#2a3351';
const colorRed = '#C80F0F';
const colorGreen = '#0FC815';
const colorYellow = '#C8C50F';
const colorBlue = '#3376C4';

function CountdownTimer() {
    const TARGET_DATE = new Date('2026-02-20T00:00:00').getTime();
    const [pressedButton, setPressedButton] = useState<number | null>(null);

    const calculateTimeLeft = (): TimeLeft => {
        const now = new Date().getTime();
        const difference = TARGET_DATE - now;

        if (difference <= 0) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((difference % (1000 * 60)) / 1000),
        };
    };

    const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatNumber = (num: number): string => {
        return num.toString().padStart(2, '0');
    };

    const timeUnits = [
        { value: timeLeft.days, label: 'DAYS', color: colorRed },
        { value: timeLeft.hours, label: 'HOURS', color: colorGreen },
        { value: timeLeft.minutes, label: 'MINUTES', color: colorYellow },
        { value: timeLeft.seconds, label: 'SECONDS', color: colorBlue },
    ];

    const handleButtonClick = (index: number) => {
        setPressedButton(index === pressedButton ? null : index);
    };

    return (
        <div
            style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontFamily: "'American Captain', 'Arial Black', sans-serif",
                padding: '2rem 1rem',
            }}
        >
            <div
                style={{
                    width: '100%',
                    maxWidth: '1100px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'flex-end',
                        marginBottom: '-1px',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            marginLeft: '25vw',
                            gap: 'clamp(8px, 1vw, 12px)',
                            paddingRight: 'clamp(20px, 3vw, 35px)',
                        }}
                    >
                        <Button3D
                            color={colorRed}
                            isPressed={pressedButton === 0}
                            onClick={() => handleButtonClick(0)}
                        />
                        <Button3D
                            color={colorYellow}
                            isPressed={pressedButton === 1}
                            onClick={() => handleButtonClick(1)}
                        />
                        <Button3D
                            color={colorBlue}
                            isPressed={pressedButton === 2}
                            onClick={() => handleButtonClick(2)}
                        />
                    </div>
                </div>

                <div
                    style={{
                        backgroundColor: clockBackground,
                        borderRadius: '24px',
                        padding: 'clamp(1.5rem, 3vw, 3rem)',
                        boxShadow:
                            '0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
                        border: `3px solid black`,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 'clamp(1rem, 2vw, 2rem)',
                        position: 'relative',
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            top: '20px',
                            left: '20px',
                            right: '20px',
                            bottom: '20px',
                            border: `3px solid ${innerBorder}`,
                            borderRadius: '16px',
                            pointerEvents: 'none',
                        }}
                    />

                    <div
                        style={{
                            position: 'absolute',
                            top: '16px',
                            left: '16px',
                            width: '12px',
                            height: '12px',
                            backgroundColor: screwColor,
                            borderRadius: '50%',
                        }}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            top: '16px',
                            right: '16px',
                            width: '12px',
                            height: '12px',
                            backgroundColor: screwColor,
                            borderRadius: '50%',
                        }}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '16px',
                            left: '16px',
                            width: '12px',
                            height: '12px',
                            backgroundColor: screwColor,
                            borderRadius: '50%',
                        }}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '16px',
                            right: '16px',
                            width: '12px',
                            height: '12px',
                            backgroundColor: screwColor,
                            borderRadius: '50%',
                        }}
                    />

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 'clamp(0.5rem, 1.2vw, 1.5rem)',
                            flexWrap: 'wrap',
                        }}
                    >
                        {timeUnits.map((unit, unitIndex) => {
                            const formatted = formatNumber(unit.value);
                            const digit1 = formatted[0];
                            const digit2 = formatted[1];

                            return (
                                <div
                                    key={unit.label}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'clamp(0.3rem, 0.7vw, 0.8rem)',
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: 'clamp(0.4rem, 1vw, 0.8rem)',
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                gap: 'clamp(0.2rem, 0.5vw, 0.4rem)',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: 'clamp(40px, 8vw, 100px)',
                                                    aspectRatio: '3/4',
                                                    marginTop: '1vh',
                                                }}
                                            >
                                                <FlipDigit digit={digit1} />
                                            </div>
                                            <div
                                                style={{
                                                    width: 'clamp(40px, 8vw, 100px)',
                                                    aspectRatio: '3/4',
                                                    marginTop: '1vh',
                                                }}
                                            >
                                                <FlipDigit digit={digit2} />
                                            </div>
                                        </div>

                                        <div
                                            style={{
                                                fontFamily:
                                                    "'American Captain', 'Arial Black', sans-serif",
                                                fontSize: 'clamp(0.8rem, 2vw, 1.5rem)',
                                                fontWeight: 900,
                                                color: 'white',
                                                letterSpacing: '0.1em',
                                                textAlign: 'center',
                                            }}
                                        >
                                            {unit.label}
                                        </div>
                                    </div>

                                    {unitIndex < timeUnits.length - 1 && (
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 'clamp(0.4rem, 1vw, 0.8rem)',
                                                marginBottom: 'clamp(1.2rem, 2.2vw, 1.8rem)',
                                            }}
                                        >
                                            <ColorDot color={unit.color} />
                                            <ColorDot color={unit.color} />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CountdownTimer;
