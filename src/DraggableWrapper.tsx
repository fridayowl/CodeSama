import React, { useState, useRef, useEffect } from 'react';

interface DraggableWrapperProps {
    id: string;
    initialX: number;
    initialY: number;
    onPositionChange: (id: string, x: number, y: number) => void;
    children: React.ReactNode;
    zoomLevel: number;
}

const DraggableWrapper: React.FC<DraggableWrapperProps> = ({
    id,
    initialX,
    initialY,
    onPositionChange,
    children,
    zoomLevel
}) => {
    const [position, setPosition] = useState({ x: initialX, y: initialY });
    const [isDragging, setIsDragging] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const dragStartPosition = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging && ref.current) {
                const dx = (e.clientX - dragStartPosition.current.x) / zoomLevel;
                const dy = (e.clientY - dragStartPosition.current.y) / zoomLevel;

                const newX = position.x + dx;
                const newY = position.y + dy;

                setPosition({ x: newX, y: newY });
                onPositionChange(id, newX, newY);

                dragStartPosition.current = { x: e.clientX, y: e.clientY };
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, id, onPositionChange, position, zoomLevel]);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        dragStartPosition.current = { x: e.clientX, y: e.clientY };
    };

    return (
        <div
            ref={ref}
            style={{
                position: 'absolute',
                left: `${position.x * zoomLevel}px`,
                top: `${position.y * zoomLevel}px`,
                cursor: isDragging ? 'grabbing' : 'grab',
                userSelect: 'none',
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'top left',
            }}
            onMouseDown={handleMouseDown}
        >
            {children}
        </div>
    );
};

export default DraggableWrapper;