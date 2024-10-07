import React from 'react';
import DraggableWrapper from './DraggableWrapper';
import Connections from './Connections';
import { ClassBlock, FunctionBlock, ClassStandaloneBlock, CodeBlock, StandaloneFunctionBlock } from './Blocks';
import PythonIDE from './PythonIDE';
import { ExtendedBlockData, Connection } from './DesignCanvas';

interface CanvasGridProps {
    blocks: ExtendedBlockData[];
    connections: Connection[];
    isFlowVisible: boolean;
    onPositionChange: (id: string, x: number, y: number) => void;
    onVisibilityChange: (id: string, isVisible: boolean) => void;
    onCodeChange: (id: string, newCode: string) => void;
    getVisibleBlocks: () => ExtendedBlockData[];
    getVisibleConnections: () => Connection[];
    fileContent: string | null;
    fileName: string;
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
    onCodeChange,
    getVisibleBlocks,
    getVisibleConnections,
    fileContent,
    fileName,
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
            width: 300 * zoomLevel,  // Increased width to accommodate new features
            height: 150 * zoomLevel  // Increased height to accommodate new features
        };
    };

    const getAdjustedPosition = (id: string, isStart: boolean) => {
        const { x, y, width, height } = getBlockPosition(id);
        if (id === 'python-ide' && isStart) {
            return { x: x + width, y: y + height / 2 };
        }
        return { x: isStart ? x : x + width, y: y + height / 2 };
    };

    const renderBlock = (item: ExtendedBlockData) => {
        const commonProps = {
            id: item.id,
            name: item.name,
            location: item.location,
            author: item.author,
            fileType: item.fileType,
            code: item.code,
            onVisibilityChange: onVisibilityChange,
            onCodeChange: (newCode: string) => onCodeChange(item.id, newCode),
            customization: customization
        };

        switch (item.type) {
            case 'class':
                return <ClassBlock {...commonProps} type="class" />;
            case 'class_function':
                return <FunctionBlock {...commonProps} type="class_function" />;
            case 'class_standalone':
                return <ClassStandaloneBlock {...commonProps} type="class_standalone" />;
            case 'code':
                return <CodeBlock {...commonProps} type="code" />;
            case 'standalone_function':
                return <StandaloneFunctionBlock {...commonProps} type="standalone_function" />;
            default:
                return null;
        }
    };

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
                    {renderBlock(item)}
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
                    onCodeChange={(newCode) => onCodeChange('python-ide', newCode)}
                    fileName={fileName}
                    onFlowVisibilityChange={onFlowVisibilityChange}
                    customization={customization.ide}
                />
            </DraggableWrapper>

            {isFlowVisible && (
                <Connections
                    connections={getVisibleConnections().map(conn => ({
                        ...conn,
                        startPoint: getAdjustedPosition(conn.start, true),
                        endPoint: getAdjustedPosition(conn.end, false)
                    }))}
                    zoomLevel={zoomLevel}
                    getBlockPosition={getBlockPosition}
                    customization={customization.connections}
                />
            )}
        </div>
    );
};

export default CanvasGrid;