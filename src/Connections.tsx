import React from 'react';
import { GitFork, Package, ArrowUpRight, Layers, FileCode2, LucideIcon, Cog } from 'lucide-react';
import { Connection } from './DesignCanvas';

interface Point {
    x: number;
    y: number;
}

interface ConnectionsProps {
    connections: Connection[];
    zoomLevel: number;
    getBlockPosition: (id: string) => { x: number; y: number; width: number; height: number };
    customization: any;
}

const defaultConnectionColor = "#000000";

const Connections: React.FC<ConnectionsProps> = ({ connections, zoomLevel, getBlockPosition, customization }) => {
    const getBezierPath = (start: Point, end: Point, type: Connection['type']): string => {
        const midX = (start.x + end.x) / 2;
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const curvature = type === 'class_to_standalone' ? 0.7 : 0.5;

        let controlPoint1, controlPoint2;

        if (dx < 0) {
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

    const getConnectionColor = (type: Connection['type']): string => {
        if (customization && customization[type]) {
            return customization[type].lineColor || defaultConnectionColor;
        }
        return defaultConnectionColor;
    };

    const getConnectionIcon = (type: Connection['type']): LucideIcon => {
        switch (type) {
            case 'inherits': return GitFork;
            case 'composes': return Package;
            case 'uses': return ArrowUpRight;
            case 'class_contains_functions': return Layers;
            case 'codeLink': return FileCode2;
            case 'class_to_standalone': return Cog;
            default: return Cog;
        }
    };

    const getConnectionStyle = (type: Connection['type']) => {
        if (customization && customization[type]) {
            const style = customization[type];
            return {
                strokeDasharray: style.lineStyle === 'dashed' ? '5,5' :
                    style.lineStyle === 'dotted' ? '2,2' : 'none',
            };
        }
        return {};
    };

    const getAdjustedPosition = (position: Point): Point => {
        return {
            x: position.x * zoomLevel,
            y: position.y * zoomLevel
        };
    };

    return (
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <defs>
                <marker
                    id="arrowhead-triangle"
                    markerWidth="10"
                    markerHeight="7"
                    refX="0"
                    refY="3.5"
                    orient="auto"
                >
                    <polygon points="0 0, 10 3.5, 0 7" />
                </marker>
                <marker
                    id="arrowhead-diamond"
                    markerWidth="10"
                    markerHeight="10"
                    refX="0"
                    refY="5"
                    orient="auto"
                >
                    <path d="M0,5 L5,0 L10,5 L5,10 Z" />
                </marker>
                <marker
                    id="arrowhead-circle"
                    markerWidth="10"
                    markerHeight="10"
                    refX="5"
                    refY="5"
                    orient="auto"
                >
                    <circle cx="5" cy="5" r="3" />
                </marker>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            {connections.map((connection) => {
                const startPos = getAdjustedPosition(connection.startPoint);
                const endPos = getAdjustedPosition(connection.endPoint);
                const path = getBezierPath(startPos, endPos, connection.type);
                const color = getConnectionColor(connection.type);
                const style = getConnectionStyle(connection.type);
                const IconComponent = getConnectionIcon(connection.type);
                const midPoint = {
                    x: (startPos.x + endPos.x) / 2,
                    y: (startPos.y + endPos.y) / 2
                };

                const arrowHead = customization[connection.type]?.arrowHead || 'arrow';

                return (
                    <g key={connection.id}>
                        <path
                            d={path}
                            fill="none"
                            stroke={color}
                            strokeWidth={2 * zoomLevel}
                            strokeLinecap="round"
                            filter="url(#glow)"
                            style={style}
                            markerEnd={`url(#arrowhead-${arrowHead})`}
                        />
                        <circle cx={startPos.x} cy={startPos.y} r={4 * zoomLevel} fill={color} />
                        <circle cx={endPos.x} cy={endPos.y} r={4 * zoomLevel} fill={color} />
                        <foreignObject
                            x={midPoint.x - 8 * zoomLevel}
                            y={midPoint.y - 8 * zoomLevel}
                            width={16 * zoomLevel}
                            height={16 * zoomLevel}
                        >
                            <div className="flex items-center justify-center w-full h-full bg-white rounded-full shadow-md">
                                <IconComponent size={16 * zoomLevel} color={color} />
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