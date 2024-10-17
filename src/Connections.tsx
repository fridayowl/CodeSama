import React, { useEffect, useState } from 'react';
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
    getBlockType: (id: string) => string;
    customization: any;
    onConnectionVisibilityChange: (connectionId: string, isVisible: boolean, connectionType:string) => void;
}

const defaultConnectionColor = "#000000";

const Connections: React.FC<ConnectionsProps> = ({
    connections,
    zoomLevel,
    getBlockPosition,
    getBlockType,
    customization,
    onConnectionVisibilityChange
}) => {
    const [renderedConnections, setRenderedConnections] = useState<Connection[]>([]);
    const [invisibleConnections, setInvisibleConnections] = useState<Set<string>>(new Set());

    useEffect(() => {
        setRenderedConnections(connections);
    }, [connections]);

    const scalePoint = (point: Point): Point => ({
        x: point.x * zoomLevel,
        y: point.y * zoomLevel
    });

    const getBezierPath = (start: Point, end: Point): string => {
        const midX = (start.x + end.x) / 2;
        const controlPoint1 = { x: midX, y: start.y };
        const controlPoint2 = { x: midX, y: end.y };

        return `M ${start.x},${start.y} 
                C ${controlPoint1.x},${controlPoint1.y} 
                  ${controlPoint2.x},${controlPoint2.y} 
                  ${end.x},${end.y}`;
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
            case 'class_contains_functions': return Layers;
            case 'class_contains_standalone': return Cog;
            case 'idecontainsclass': return FileCode2;
            case 'idecontainsstandalonecode': return FileCode2;
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

    const handleConnectionClick = (e: React.MouseEvent, connectionId: string, connectionType: string) => {
        e.stopPropagation();
        setInvisibleConnections(prev => {
            const newSet = new Set(prev);
            if (newSet.has(connectionId)) {
                newSet.delete(connectionId);
            } else {
                newSet.add(connectionId);
            }
            onConnectionVisibilityChange(connectionId, !newSet.has(connectionId), connectionType);
            return newSet;
        });
    };

    return (
        <svg className="absolute top-0 left-0 w-full h-full" style={{ pointerEvents: 'none' }}>
            <defs>
                <marker
                    id="arrowhead-triangle"
                    markerWidth="6"
                    markerHeight="4"
                    refX="0"
                    refY="2"
                    orient="auto"
                >
                    <polygon points="0 0, 6 2, 0 4" />
                </marker>
                <marker
                    id="arrowhead-diamond"
                    markerWidth="6"
                    markerHeight="6"
                    refX="0"
                    refY="3"
                    orient="auto"
                >
                    <path d="M0,3 L3,0 L6,3 L3,6 Z" />
                </marker>
                <marker
                    id="arrowhead-circle"
                    markerWidth="6"
                    markerHeight="6"
                    refX="3"
                    refY="3"
                    orient="auto"
                >
                    <circle cx="3" cy="3" r="2" />
                </marker>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            {renderedConnections.map((connection) => {
                
                const scaledStart = scalePoint(connection.startPoint);
                const scaledEnd = scalePoint(connection.endPoint);
                const path = getBezierPath(scaledStart, scaledEnd);
                const color = getConnectionColor(connection.type);
                const style = getConnectionStyle(connection.type);
                const IconComponent = getConnectionIcon(connection.type);
                const midPoint = {
                    x: (scaledStart.x + scaledEnd.x) / 2,
                    y: (scaledStart.y + scaledEnd.y) / 2
                };

                const arrowHead = customization[connection.type]?.arrowHead || 'arrow';
                const isVisible = !invisibleConnections.has(connection.id);

                return (
                    <g key={connection.id}>
                        {isVisible && (
                            <>
                                <path
                                    d={path}
                                    fill="none"
                                    stroke={color}
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    filter="url(#glow)"
                                    style={style}
                                    markerEnd={`url(#arrowhead-${arrowHead})`}
                                />
                                <foreignObject
                                    x={midPoint.x - 8}
                                    y={midPoint.y - 8}
                                    width={16}
                                    height={16}
                                >
                                    <div className="flex items-center justify-center w-full h-full bg-white rounded-full shadow-md">
                                        <IconComponent size={16} color={color} />
                                    </div>
                                </foreignObject>
                                <text
                                    x={midPoint.x -40}
                                    y={midPoint.y-20}
                                    fontSize={8}
                                    fill={color}
                                    // filter="url(#glow)"
                                >
                                    {`${connection.fromConnector} → ${connection.toConnector}`}
                                </text>
                            </>
                        )}
                        <circle
                            cx={scaledStart.x}
                            cy={scaledStart.y}
                            r={4}
                            fill={color}
                            onClick={(e) => handleConnectionClick(e, connection.id, connection.type)}
                            style={{ cursor: 'pointer', pointerEvents: 'all' }}
                        />
                        {isVisible && (
                            <circle
                                cx={scaledEnd.x}
                                cy={scaledEnd.y}
                                r={4}
                                fill={color}
                                onClick={(e) => handleConnectionClick(e, connection.id, connection.type)}
                                style={{ cursor: 'pointer', pointerEvents: 'all' }}
                            />
                        )}
                    </g>
                );
            })}
        </svg>
    );
};

export default Connections;