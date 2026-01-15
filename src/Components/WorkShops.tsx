import { useState, useEffect } from 'react';
import Workshop from './WorkShop';

const background = '#F6EDC4';

export default function Workshops() {
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: background,
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
                    <img
                        src="/workshopimage.png"
                        alt=""
                        style={{
                            position: 'absolute',
                            right: '2vw',
                            height: '40vh',
                            objectFit: 'contain',
                        }}
                    />
                )}
            </div>
        </div>
    );
}
