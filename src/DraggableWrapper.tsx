import React, { useState, useRef, useEffect } from 'react';
import { Move } from 'lucide-react';

interface DraggableWrapperProps {
    id: string;
    initialX: number;
    initialY: number;
    onPositionChange: (id: string, x: number, y: number) => void;
    children: React.ReactNode;
    title?: string;
}

const DraggableWrapper: React.FC<DraggableWrapperProps> = ({
    id,
    initialX,
    initialY,
    onPositionChange,
    children,
    title = "Draggable Item"
}) => {
    const [position, setPosition] = useState({ x: initialX, y: initialY });
    const [isDragging, setIsDragging] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const initialMousePosition = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                const dx = e.clientX - initialMousePosition.current.x;
                const dy = e.clientY - initialMousePosition.current.y;
                const newPosition = {
                    x: position.x + dx,
                    y: position.y + dy
                };
                setPosition(newPosition);
                onPositionChange(id, newPosition.x, newPosition.y);
                initialMousePosition.current = { x: e.clientX, y: e.clientY };
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
    }, [isDragging, id, onPositionChange, position.x, position.y]);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.target === ref.current?.firstChild) {
            setIsDragging(true);
            initialMousePosition.current = { x: e.clientX, y: e.clientY };
        }
    };

    return (
        <div
            ref={ref}
            style={{
                position: 'absolute',
                left: `${position.x}px`,
                top: `${position.y}px`,
                cursor: isDragging ? 'grabbing' : 'grab',
                userSelect: 'none',
            }}
            onMouseDown={handleMouseDown}
        >
            <div className="bg-gray-200 p-2 rounded-t flex items-center justify-between cursor-move">
                <Move size={16} />
                <span className="text-sm font-semibold">{title}</span>
            </div>
            <div className="bg-white border border-gray-300 rounded-b">
                {children}
            </div>
        </div>
    );
};

export default DraggableWrapper;