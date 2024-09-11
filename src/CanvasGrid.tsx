import React, { useRef, ReactNode } from 'react';
import DraggableWrapper from './DraggableWrapper';
import Connections from './Connections';
import { ClassBlock, FunctionBlock } from './Blocks';
import { ExtendedBlockData, Connection } from './DesignCanvas';
import PythonIDE from './PythonIDE';

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
    children?: ReactNode;
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
    children,
}) => {
    const canvasRef = useRef<HTMLDivElement>(null);

    return (
        <div
            ref={canvasRef}
            className="relative w-full h-[calc(100%-2rem)] bg-white overflow-hidden"
            style={{
                backgroundImage: `
                    linear-gradient(to right, #f0f0f0 1px, transparent 1px),
                    linear-gradient(to bottom, #f0f0f0 1px, transparent 1px)
                    `,
                backgroundSize: '20px 20px',
            }}
        >
            {isFlowVisible && getVisibleBlocks().map((item) => (
                <DraggableWrapper
                    key={item.id}
                    id={item.id}
                    initialX={item.x}
                    initialY={item.y}
                    onPositionChange={onPositionChange}
                    title={item.name}
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
                    ) : (
                        <FunctionBlock
                            id={item.id}
                            name={item.name}
                            location={`${item.location} (${item.parentClass})`}
                            author={item.author}
                            fileType={item.fileType}
                            code={item.code}
                            onVisibilityChange={() => { }}
                        />
                    )}
                </DraggableWrapper>
            ))}

            {/* Draggable PythonIDE Block */}
            <DraggableWrapper id="python-ide" initialX={20} initialY={20} onPositionChange={onPositionChange} title="Python IDE">
                <PythonIDE
                    fileContent={fileContent}
                    onCodeChange={onCodeChange}
                    fileName={fileName}
                    onFlowVisibilityChange={onFlowVisibilityChange}
                />
            </DraggableWrapper>

            {isFlowVisible && <Connections connections={getVisibleConnections()} />}

            {children}
        </div>
    );
};

export default CanvasGrid;
