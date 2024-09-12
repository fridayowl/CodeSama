import React from 'react';
import { GitFork, Package, ArrowUpRight, Layers } from 'lucide-react';

interface Point {
    x: number;
    y: number;
}

interface Connection {
    id: string;
    start: string;
    end: string;
    startPoint: Point;
    endPoint: Point;
    type: 'inherits' | 'composes' | 'uses' | 'contains';
    fromConnector: string;
    toConnector: string;
}

interface ConnectionsProps {
    connections: Connection[];
    zoomLevel: number;
}

const Connections: React.FC<ConnectionsProps> = ({ connections, zoomLevel }) => {
    const getBezierPath = (start: Point, end: Point): string => {
        const midX = (start.x + end.x) / 2;
        const midY = (start.y + end.y) / 2;
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const curvature = 0.5;

        const controlPoint1 = {
            x: start.x + dx * curvature,
            y: start.y
        };

        const controlPoint2 = {
            x: end.x - dx * curvature,
            y: end.y
        };

        return `M ${start.x},${start.y} C ${controlPoint1.x},${controlPoint1.y} ${controlPoint2.x},${controlPoint2.y} ${end.x},${end.y}`;
    };

    const getConnectionColor = (type: Connection['type']) => {
        switch (type) {
            case 'inherits': return '#3b82f6'; // blue-500
            case 'composes': return '#10b981'; // emerald-500
            case 'uses': return '#8b5cf6'; // violet-500
            case 'contains': return '#f59e0b'; // amber-500
            default: return '#6b7280'; // gray-500
        }
    };

    const getConnectionIcon = (type: Connection['type']) => {
        switch (type) {
            case 'inherits': return <GitFork size={16} />;
            case 'composes': return <Package size={16} />;
            case 'uses': return <ArrowUpRight size={16} />;
            case 'contains': return <Layers size={16} />;
        }
    };

    return (
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <defs>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            {connections.map((connection) => {
                const startPoint = {
                    x: connection.startPoint.x * zoomLevel,
                    y: connection.startPoint.y * zoomLevel
                };
                const endPoint = {
                    x: connection.endPoint.x * zoomLevel,
                    y: connection.endPoint.y * zoomLevel
                };
                const path = getBezierPath(startPoint, endPoint);
                const color = getConnectionColor(connection.type);
                const midPoint = {
                    x: (startPoint.x + endPoint.x) / 2,
                    y: (startPoint.y + endPoint.y) / 2
                };

                return (
                    <g key={connection.id}>
                        <path
                            d={path}
                            fill="none"
                            stroke={color}
                            strokeWidth={3 * zoomLevel}
                            strokeLinecap="round"
                            filter="url(#glow)"
                        />
                        <circle cx={startPoint.x} cy={startPoint.y} r={4 * zoomLevel} fill={color} />
                        <circle cx={endPoint.x} cy={endPoint.y} r={4 * zoomLevel} fill={color} />
                        <foreignObject
                            x={midPoint.x - 8 * zoomLevel}
                            y={midPoint.y - 8 * zoomLevel}
                            width={16 * zoomLevel}
                            height={16 * zoomLevel}
                        >
                            <div className="flex items-center justify-center w-full h-full bg-white rounded-full shadow-md" style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center' }}>
                                {getConnectionIcon(connection.type)}
                            </div>
                        </foreignObject>
                        <text
                            x={midPoint.x + 16 * zoomLevel}
                            y={midPoint.y}
                            fontSize={10 * zoomLevel}
                            fill={color}
                            filter="url(#glow)"
                        >
                            {`${connection.fromConnector} → ${connection.toConnector}`}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
};

export default Connections;