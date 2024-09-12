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
    zoomLevel: number;
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
    zoomLevel,
    children,
}) => {
    const canvasRef = useRef<HTMLDivElement>(null);

    const handlePositionChange = (id: string, x: number, y: number) => {
        // Adjust position based on zoom level
        onPositionChange(id, x / zoomLevel, y / zoomLevel);
    };

    return (
        <div
            ref={canvasRef}
            className="relative w-full h-full"
            style={{
                backgroundImage: `
                    linear-gradient(to right, #f0f0f0 1px, transparent 1px),
                    linear-gradient(to bottom, #f0f0f0 1px, transparent 1px)
                `,
                backgroundSize: `${20 * zoomLevel}px ${20 * zoomLevel}px`,
            }}
        >
            {isFlowVisible && getVisibleBlocks().map((item) => (
                <DraggableWrapper
                    key={item.id}
                    id={item.id}
                    initialX={item.x * zoomLevel}
                    initialY={item.y * zoomLevel}
                    onPositionChange={handlePositionChange}
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

            <DraggableWrapper
                id="python-ide"
                initialX={20 * zoomLevel}
                initialY={20 * zoomLevel}
                onPositionChange={handlePositionChange}
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

            {isFlowVisible && <Connections connections={getVisibleConnections()} zoomLevel={zoomLevel} />}

            {children}
        </div>
    );
};

export default CanvasGrid;