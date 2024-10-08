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
}

const defaultConnectionColor = "#000000";
const HEADER_HEIGHT = 40; // Estimated height of the header
const CONNECTOR_OFFSET_X = 5; // Horizontal offset from the edge of the block

const Connections: React.FC<ConnectionsProps> = ({ connections, zoomLevel, getBlockPosition, getBlockType, customization }) => {
    const [renderedConnections, setRenderedConnections] = useState<Connection[]>([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setRenderedConnections(connections);
        }, 100);

        return () => clearTimeout(timer);
    }, [connections]);

    const getConnectionPoint = (blockId: string, isStart: boolean): Point => {
        const block = getBlockPosition(blockId);
        const blockType = getBlockType(blockId);
        const isIdeOrClass = blockId === 'python-ide' || blockType === 'class';

        if (isStart && isIdeOrClass) {
            // Start from the right side for IDE and class blocks
            return {
                x: block.x + block.width - CONNECTOR_OFFSET_X,
                y: block.y + HEADER_HEIGHT / 2
            };
        } else {
            // All other cases, use the left side
            return {
                x: block.x + CONNECTOR_OFFSET_X,
                y: block.y + HEADER_HEIGHT / 2
            };
        }
    };

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

    return (
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
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
                const startPos = getConnectionPoint(connection.start, true);
                const endPos = getConnectionPoint(connection.end, false);
                const path = getBezierPath(startPos, endPos);
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
                            strokeWidth={2 / zoomLevel}
                            strokeLinecap="round"
                            filter="url(#glow)"
                            style={style}
                            markerEnd={`url(#arrowhead-${arrowHead})`}
                        />
                        <circle cx={startPos.x} cy={startPos.y} r={4 / zoomLevel} fill={color} />
                        <circle cx={endPos.x} cy={endPos.y} r={4 / zoomLevel} fill={color} />
                        <foreignObject
                            x={midPoint.x - 8 / zoomLevel}
                            y={midPoint.y - 8 / zoomLevel}
                            width={16 / zoomLevel}
                            height={16 / zoomLevel}
                        >
                            <div className="flex items-center justify-center w-full h-full bg-white rounded-full shadow-md">
                                <IconComponent size={16 / zoomLevel} color={color} />
                            </div>
                        </foreignObject>
                        <text
                            x={midPoint.x + 16 / zoomLevel}
                            y={midPoint.y}
                            fontSize={10 / zoomLevel}
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