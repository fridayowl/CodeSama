import React from 'react';
import DraggableWrapper from './DraggableWrapper';
import Connections from './Connections';
import { ClassBlock, FunctionBlock } from './Blocks';
import CodeBlock from './CodeBlock';
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

    return (
        <div className="relative w-full h-full" style={{
            backgroundImage: `linear-gradient(to right, #f0f0f0 1px, transparent 1px),
                               linear-gradient(to bottom, #f0f0f0 1px, transparent 1px)`,
            backgroundSize: `${20 * zoomLevel}px ${20 * zoomLevel}px`,
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
                    {item.type === 'class' ? (
                        <ClassBlock
                            id={item.id}
                            name={item.name}
                            location={item.location}
                            author={item.author}
                            fileType={item.fileType}
                            code={item.code}
                            onVisibilityChange={onVisibilityChange}
                        />
                    ) : item.type === 'function' ? (
                        <FunctionBlock
                            id={item.id}
                            name={item.name}
                            location={`${item.location} (${item.parentClass})`}
                            author={item.author}
                            fileType={item.fileType}
                            code={item.code}
                            onVisibilityChange={() => { }}
                        />
                    ) : (
                        <CodeBlock
                            id={item.id}
                            type={item.type}
                            name={item.name}
                            location={item.location}
                            author={item.author}
                            fileType={item.fileType}
                            code={item.code}
                            onVisibilityChange={onVisibilityChange}
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
                />
            </DraggableWrapper>

            {isFlowVisible && (
                <Connections
                    connections={getVisibleConnections().map(conn => ({
                        ...conn,
                        startPoint: getAdjustedPosition(conn.start, true),
                        endPoint: getAdjustedPosition(conn.end, false),
                        startBlockType: blocks.find(b => b.id === conn.start)?.type || 'code',
                        endBlockType: blocks.find(b => b.id === conn.end)?.type || 'code',
                        type: (blocks.find(b => b.id === conn.start)?.type === 'code' ||
                            blocks.find(b => b.id === conn.end)?.type === 'code')
                            ? 'codeLink' : conn.type
                    }))}
                    zoomLevel={zoomLevel}
                    getBlockPosition={getBlockPosition}
                />
            )}
        </div>
    );
};

export default CanvasGrid;