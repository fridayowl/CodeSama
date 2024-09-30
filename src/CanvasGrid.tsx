import React from 'react';
import DraggableWrapper from './DraggableWrapper';
import Connections from './Connections';
import { ClassBlock, FunctionBlock, ClassStandaloneBlock, CodeBlock } from './Blocks';
import PythonIDE from './PythonIDE';
import { ExtendedBlockData, Connection } from './DesignCanvas';

interface CanvasGridProps {
    blocks: ExtendedBlockData[];
    connections: Connection[];
    isFlowVisible: boolean;
    onPositionChange: (id: string, x: number, y: number) => void;
    onVisibilityChange: (id: string, isVisible: boolean) => void;
    getVisibleBlocks: () => ExtendedBlockData[];
    getVisibleConnections: () => Connection[];
    fileContent: string | null;
    fileName: string;
    onCodeChange: (newCode: string) => void;
    onFlowVisibilityChange: (isVisible: boolean) => void;
    zoomLevel: number;
    idePosition: { x: number; y: number };
    customization: any;
}

const CanvasGrid: React.FC<CanvasGridProps> = ({
    blocks,
    connections,
    isFlowVisible,
    onPositionChange,
    onVisibilityChange,
    getVisibleBlocks,
    getVisibleConnections,
    fileContent,
    fileName,
    onCodeChange,
    onFlowVisibilityChange,
    zoomLevel,
    idePosition,
    customization
}) => {
    const getBlockPosition = (id: string) => {
        if (id === 'python-ide') {
            return {
                x: idePosition.x * zoomLevel,
                y: idePosition.y * zoomLevel,
                width: 600 * zoomLevel,
                height: 400 * zoomLevel
            };
        }
        const block = blocks.find(b => b.id === id);
        if (!block) return { x: 0, y: 0, width: 0, height: 0 };
        return {
            x: block.x * zoomLevel,
            y: block.y * zoomLevel,
            width: 200 * zoomLevel,
            height: 100 * zoomLevel
        };
    };

    const getAdjustedPosition = (id: string, isStart: boolean) => {
        const { x, y, width, height } = getBlockPosition(id);
        if (id === 'python-ide' && isStart) {
            return { x: x + width, y: y + height / 2 };
        }
        return { x: isStart ? x : x + width, y: y + height / 2 };
    };

    const sourceClassBlock = blocks.find(block => block.type === 'class');

    const updatedConnections: Connection[] = getVisibleConnections().map(conn => {
        if (conn.start === 'python-ide' && blocks.find(b => b.id === conn.end)?.type === 'class_standalone') {
            return {
                ...conn,
                start: sourceClassBlock ? sourceClassBlock.id : 'python-ide',
                startPoint: sourceClassBlock
                    ? getAdjustedPosition(sourceClassBlock.id, true)
                    : getAdjustedPosition('python-ide', true),
                type: 'uses',
                startBlockType: sourceClassBlock ? 'class' : 'code',
                endBlockType: 'class_standalone'
            };
        }
        return {
            ...conn,
            startPoint: getAdjustedPosition(conn.start, true),
            endPoint: getAdjustedPosition(conn.end, false),
            startBlockType: (blocks.find(b => b.id === conn.start)?.type || 'code') as Connection['startBlockType'],
            endBlockType: (blocks.find(b => b.id === conn.end)?.type || 'code') as Connection['endBlockType']
        };
    });

    return (
        <div className="relative w-full h-full" style={{
            backgroundImage: `linear-gradient(to right, ${customization.canvas.gridColor} 1px, transparent 1px),
                               linear-gradient(to bottom, ${customization.canvas.gridColor} 1px, transparent 1px)`,
            backgroundSize: `${customization.canvas.gridSpacing * zoomLevel}px ${customization.canvas.gridSpacing * zoomLevel}px`,
            backgroundColor: customization.canvas.backgroundColor,
        }}>
            {isFlowVisible && getVisibleBlocks().map((item) => (
                <DraggableWrapper
                    key={item.id}
                    id={item.id}
                    initialX={item.x}
                    initialY={item.y}
                    onPositionChange={onPositionChange}
                    title={item.name}
                    zoomLevel={zoomLevel}
                >
                    {item.type === 'class' && (
                        <ClassBlock
                            id={item.id}
                            name={item.name}
                            location={item.location}
                            author={item.author}
                            fileType={item.fileType}
                            code={item.code}
                            onVisibilityChange={onVisibilityChange}
                            customization={customization}
                        />
                    )}
                    {item.type === 'class_function' && (
                        <FunctionBlock
                            id={item.id}
                            name={item.name}
                            location={`${item.location} (${item.parentClass})`}
                            author={item.author}
                            fileType={item.fileType}
                            code={item.code}
                            onVisibilityChange={() => { }}
                            customization={customization}
                        />
                    )}
                    {item.type === 'class_standalone' && (
                        <ClassStandaloneBlock
                            id={item.id}
                            name={item.name}
                            location={item.location}
                            author={item.author}
                            fileType={item.fileType}
                            code={item.code}
                            onVisibilityChange={onVisibilityChange}
                            customization={customization}
                        />
                    )}
                    {item.type === 'code' && (
                        <CodeBlock
                            id={item.id}
                            name={item.name}
                            location={item.location}
                            author={item.author}
                            fileType={item.fileType}
                            code={item.code}
                            onVisibilityChange={onVisibilityChange}
                            customization={customization}
                        />
                    )}
                </DraggableWrapper>
            ))}

            <DraggableWrapper
                id="python-ide"
                initialX={idePosition.x}
                initialY={idePosition.y}
                onPositionChange={onPositionChange}
                title="Python IDE"
                zoomLevel={zoomLevel}
            >
                <PythonIDE
                    fileContent={fileContent}
                    onCodeChange={onCodeChange}
                    fileName={fileName}
                    onFlowVisibilityChange={onFlowVisibilityChange}
                    customization={customization.ide}
                />
            </DraggableWrapper>

            {isFlowVisible && (
                <Connections
                    connections={updatedConnections}
                    zoomLevel={zoomLevel}
                    getBlockPosition={getBlockPosition}
                    customization={customization.connections}
                />
            )}
        </div>
    );
};

export default CanvasGrid;