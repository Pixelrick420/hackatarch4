import { useEffect, useRef, useCallback, memo } from 'react';

interface FluidCursorProps {
    children: React.ReactNode;
    color?: string;
    opacity?: number;
    gridSize?: number;
    baseRadius?: number;
}

const FluidCursor = memo(
    ({
        children,
        color = '#3AAE95',
        opacity = 0.2,
        gridSize = 4,
        baseRadius = 100,
    }: FluidCursorProps) => {
        const canvasRef = useRef<HTMLCanvasElement>(null);
        const mouseRef = useRef({
            x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
            y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0,
            prevX: 0,
            prevY: 0,
        });

        const metaballsRef = useRef<
            Array<{
                x: number;
                y: number;
                vx: number;
                vy: number;
                radius: number;
                life: number;
                maxLife: number;
            }>
        >([]);

        const animationFrameRef = useRef<number | null>(null);
        const rafEnabledRef = useRef(true);
        const lastTimeRef = useRef(0);
        const fpsLimit = 60;
        const frameInterval = 1000 / fpsLimit;

        // Reusable objects to avoid garbage collection
        const tempBoundsRef = useRef({
            minX: Infinity,
            maxX: -Infinity,
            minY: Infinity,
            maxY: -Infinity,
        });

        // Pre-calculate common values
        const threshold = useRef(1.0);
        const radiusFactor = useRef(3);

        const handleMouseMove = useCallback((e: MouseEvent) => {
            if (!rafEnabledRef.current) return;

            const mouse = mouseRef.current;
            mouse.prevX = mouse.x;
            mouse.prevY = mouse.y;
            mouse.x = e.clientX;
            mouse.y = e.clientY;

            const dx = e.clientX - mouse.prevX;
            const dy = e.clientY - mouse.prevY;
            const speedSquared = dx * dx + dy * dy;

            if (speedSquared > 4) {
                const speed = Math.sqrt(speedSquared);
                const count = Math.min(3, Math.floor(speed / 5));

                for (let i = 0; i < count; i++) {
                    metaballsRef.current.push({
                        x: e.clientX + (Math.random() - 0.5) * 35,
                        y: e.clientY + (Math.random() - 0.5) * 35,
                        vx: dx * 0.12 + (Math.random() - 0.5) * 2.5,
                        vy: dy * 0.12 + (Math.random() - 0.5) * 2.5,
                        radius: 35 + Math.random() * 45,
                        life: 0,
                        maxLife: 45 + Math.random() * 35,
                    });
                }
            }

            if (metaballsRef.current.length > 60) {
                metaballsRef.current = metaballsRef.current.slice(-60);
            }
        }, []);

        const resizeCanvas = useCallback(() => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();

            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;

            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.scale(dpr, dpr);
            }
        }, []);

        useEffect(() => {
            const canvas = canvasRef.current;
            if (!canvas || typeof window === 'undefined') return;

            const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
            if (!ctx) return;

            // Initialize canvas
            resizeCanvas();
            const resizeObserver = new ResizeObserver(resizeCanvas);
            resizeObserver.observe(canvas);

            // Event listeners
            window.addEventListener('mousemove', handleMouseMove, { passive: true });

            // Animation loop
            const animate = (timestamp: number) => {
                if (!rafEnabledRef.current) return;

                // Throttle to target FPS
                if (timestamp - lastTimeRef.current < frameInterval) {
                    animationFrameRef.current = requestAnimationFrame(animate);
                    return;
                }
                lastTimeRef.current = timestamp;

                // Clear canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Update metaballs
                const metaballs = metaballsRef.current;
                for (let i = metaballs.length - 1; i >= 0; i--) {
                    const ball = metaballs[i];
                    ball.life++;
                    ball.x += ball.vx;
                    ball.y += ball.vy;
                    ball.vx *= 0.92;
                    ball.vy *= 0.92;

                    if (ball.life >= ball.maxLife) {
                        metaballs.splice(i, 1);
                    }
                }

                // Combine all metaballs including cursor
                const allMetaballs = [
                    ...metaballs,
                    {
                        x: mouseRef.current.x,
                        y: mouseRef.current.y,
                        vx: 0,
                        vy: 0,
                        radius: baseRadius,
                        life: 0,
                        maxLife: 100,
                    },
                ];

                if (allMetaballs.length === 0) {
                    animationFrameRef.current = requestAnimationFrame(animate);
                    return;
                }

                // Calculate bounding box
                const bounds = tempBoundsRef.current;
                bounds.minX = Infinity;
                bounds.maxX = -Infinity;
                bounds.minY = Infinity;
                bounds.maxY = -Infinity;

                for (const ball of allMetaballs) {
                    const r = ball.radius * radiusFactor.current;
                    const x1 = ball.x - r;
                    const x2 = ball.x + r;
                    const y1 = ball.y - r;
                    const y2 = ball.y + r;

                    if (x1 < bounds.minX) bounds.minX = x1;
                    if (x2 > bounds.maxX) bounds.maxX = x2;
                    if (y1 < bounds.minY) bounds.minY = y1;
                    if (y2 > bounds.maxY) bounds.maxY = y2;
                }

                // Clamp bounds to canvas
                bounds.minX = Math.max(0, Math.floor(bounds.minX / gridSize) * gridSize);
                bounds.maxX = Math.min(canvas.width, Math.ceil(bounds.maxX / gridSize) * gridSize);
                bounds.minY = Math.max(0, Math.floor(bounds.minY / gridSize) * gridSize);
                bounds.maxY = Math.min(canvas.height, Math.ceil(bounds.maxY / gridSize) * gridSize);

                const cols = Math.ceil((bounds.maxX - bounds.minX) / gridSize) + 1;
                const rows = Math.ceil((bounds.maxY - bounds.minY) / gridSize) + 1;

                if (cols <= 1 || rows <= 1) {
                    animationFrameRef.current = requestAnimationFrame(animate);
                    return;
                }

                // Calculate field values with optimization
                const field: number[][] = Array(rows);
                const radiusSquaredCache = new Float32Array(allMetaballs.length);

                // Pre-calculate radius squared
                for (let i = 0; i < allMetaballs.length; i++) {
                    radiusSquaredCache[i] = allMetaballs[i].radius * allMetaballs[i].radius;
                }

                for (let y = 0; y < rows; y++) {
                    field[y] = new Array(cols);
                    const worldY = bounds.minY + y * gridSize;

                    for (let x = 0; x < cols; x++) {
                        const worldX = bounds.minX + x * gridSize;
                        let sum = 0;

                        for (let i = 0; i < allMetaballs.length; i++) {
                            const ball = allMetaballs[i];
                            const dx = worldX - ball.x;
                            const dy = worldY - ball.y;
                            const distSq = dx * dx + dy * dy;
                            const maxDistSq =
                                radiusSquaredCache[i] * radiusFactor.current * radiusFactor.current;

                            if (distSq < maxDistSq) {
                                sum += radiusSquaredCache[i] / (distSq + 1);
                            }
                        }
                        field[y][x] = sum;
                    }
                }

                // Draw metaballs with smooth interpolation
                ctx.fillStyle = color;
                ctx.globalAlpha = opacity;

                // Draw grid cells
                for (let y = 0; y < rows - 1; y++) {
                    const y0 = bounds.minY + y * gridSize;
                    const row = field[y];
                    const nextRow = field[y + 1];

                    for (let x = 0; x < cols - 1; x++) {
                        const x0 = bounds.minX + x * gridSize;

                        const tl = row[x];
                        const tr = row[x + 1];
                        const bl = nextRow[x];
                        const br = nextRow[x + 1];

                        if (
                            tl < threshold.current &&
                            tr < threshold.current &&
                            bl < threshold.current &&
                            br < threshold.current
                        ) {
                            continue;
                        }

                        if (
                            tl > threshold.current &&
                            tr > threshold.current &&
                            bl > threshold.current &&
                            br > threshold.current
                        ) {
                            ctx.fillRect(x0, y0, gridSize, gridSize);
                            continue;
                        }

                        // Marching squares with linear interpolation
                        const topT = (threshold.current - tl) / (tr - tl);
                        const rightT = (threshold.current - tr) / (br - tr);
                        const bottomT = (threshold.current - bl) / (br - bl);
                        const leftT = (threshold.current - tl) / (bl - tl);

                        const topX = x0 + topT * gridSize;
                        const rightY = y0 + rightT * gridSize;
                        const bottomX = x0 + bottomT * gridSize;
                        const leftY = y0 + leftT * gridSize;

                        ctx.beginPath();

                        // Optimized marching squares cases
                        const state =
                            (tl > threshold.current ? 8 : 0) |
                            (tr > threshold.current ? 4 : 0) |
                            (br > threshold.current ? 2 : 0) |
                            (bl > threshold.current ? 1 : 0);

                        switch (state) {
                            case 1:
                            case 14:
                                ctx.moveTo(x0, leftY);
                                ctx.lineTo(bottomX, y0 + gridSize);
                                ctx.lineTo(x0, y0 + gridSize);
                                break;
                            case 2:
                            case 13:
                                ctx.moveTo(bottomX, y0 + gridSize);
                                ctx.lineTo(x0 + gridSize, rightY);
                                ctx.lineTo(x0 + gridSize, y0 + gridSize);
                                break;
                            case 3:
                            case 12:
                                ctx.moveTo(x0, leftY);
                                ctx.lineTo(x0 + gridSize, rightY);
                                ctx.lineTo(x0 + gridSize, y0 + gridSize);
                                ctx.lineTo(x0, y0 + gridSize);
                                break;
                            case 4:
                            case 11:
                                ctx.moveTo(topX, y0);
                                ctx.lineTo(x0 + gridSize, y0);
                                ctx.lineTo(x0 + gridSize, rightY);
                                break;
                            case 6:
                            case 9:
                                ctx.moveTo(topX, y0);
                                ctx.lineTo(x0 + gridSize, y0);
                                ctx.lineTo(x0 + gridSize, y0 + gridSize);
                                ctx.lineTo(bottomX, y0 + gridSize);
                                break;
                            case 7:
                            case 8:
                                ctx.moveTo(x0, leftY);
                                ctx.lineTo(topX, y0);
                                ctx.lineTo(x0 + gridSize, y0);
                                ctx.lineTo(x0 + gridSize, y0 + gridSize);
                                ctx.lineTo(x0, y0 + gridSize);
                                break;
                            case 5:
                                ctx.moveTo(x0, y0);
                                ctx.lineTo(topX, y0);
                                ctx.lineTo(bottomX, y0 + gridSize);
                                ctx.lineTo(x0, y0 + gridSize);
                                break;
                            case 10:
                                ctx.moveTo(x0, y0);
                                ctx.lineTo(x0 + gridSize, y0);
                                ctx.lineTo(x0 + gridSize, rightY);
                                ctx.lineTo(x0, leftY);
                                break;
                        }

                        ctx.closePath();
                        ctx.fill();
                    }
                }

                ctx.globalAlpha = 1.0;
                animationFrameRef.current = requestAnimationFrame(animate);
            };

            // Start animation
            rafEnabledRef.current = true;
            animationFrameRef.current = requestAnimationFrame(animate);

            // Handle visibility changes
            const handleVisibilityChange = () => {
                rafEnabledRef.current = !document.hidden;
                if (!document.hidden) {
                    lastTimeRef.current = performance.now();
                    animationFrameRef.current = requestAnimationFrame(animate);
                }
            };

            document.addEventListener('visibilitychange', handleVisibilityChange);

            return () => {
                rafEnabledRef.current = false;
                resizeObserver.disconnect();
                window.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('visibilitychange', handleVisibilityChange);

                if (animationFrameRef.current) {
                    cancelAnimationFrame(animationFrameRef.current);
                }
            };
        }, [color, opacity, gridSize, baseRadius, handleMouseMove, resizeCanvas, frameInterval]);

        return (
            <div style={{ position: 'relative', width: '100%', minHeight: '100vh' }}>
                <canvas
                    ref={canvasRef}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        pointerEvents: 'none',
                        zIndex: 9999,
                    }}
                />
                {children}
            </div>
        );
    }
);

FluidCursor.displayName = 'FluidCursor';
export default FluidCursor;
