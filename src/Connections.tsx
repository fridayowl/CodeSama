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
    getBlockPosition: (id: string) => { x: number; y: number; width: number; height: number };
}

const Connections: React.FC<ConnectionsProps> = ({ connections, zoomLevel, getBlockPosition }) => {
    const getBezierPath = (start: Point, end: Point): string => {
        const midX = (start.x + end.x) / 2;
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const curvature = 0.5;

        let controlPoint1, controlPoint2;

        if (dx < 0) { // If connection is right-to-left
            controlPoint1 = {
                x: start.x - Math.abs(dx) * curvature,
                y: start.y
            };
            controlPoint2 = {
                x: end.x + Math.abs(dx) * curvature,
                y: end.y
            };
        } else {
            controlPoint1 = {
                x: start.x + dx * curvature,
                y: start.y
            };
            controlPoint2 = {
                x: end.x - dx * curvature,
                y: end.y
            };
        }

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
                const path = getBezierPath(connection.startPoint, connection.endPoint);
                const color = getConnectionColor(connection.type);
                const midPoint = {
                    x: (connection.startPoint.x + connection.endPoint.x) / 2,
                    y: (connection.startPoint.y + connection.endPoint.y) / 2
                };

                return (
                    <g key={connection.id}>
                        <path
                            d={path}
                            fill="none"
                            stroke={color}
                            strokeWidth={2}
                            strokeLinecap="round"
                            filter="url(#glow)"
                        />
                        <circle cx={connection.startPoint.x} cy={connection.startPoint.y} r={4} fill={color} />
                        <circle cx={connection.endPoint.x} cy={connection.endPoint.y} r={4} fill={color} />
                        <foreignObject
                            x={midPoint.x - 8}
                            y={midPoint.y - 8}
                            width={16}
                            height={16}
                        >
                            <div className="flex items-center justify-center w-full h-full bg-white rounded-full shadow-md">
                                {getConnectionIcon(connection.type)}
                            </div>
                        </foreignObject>
                        <text
                            x={midPoint.x + 16}
                            y={midPoint.y}
                            fontSize={10}
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