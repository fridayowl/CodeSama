import React, { useState, useCallback, useEffect } from 'react';
import DraggableWrapper from './DraggableWrapper';
import { ClassBlock, FunctionBlock } from './Blocks';
import Connections from './Connections';
import PythonIDE from './PythonIDE';
import { generateJsonFromPythonFile, BlockData } from './fileProcessor';
import CanvasGrid from './CanvasGrid';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

// Interface declarations
export interface Connection {
    id: string;
    start: string;
    end: string;
    startPoint: { x: number; y: number };
    endPoint: { x: number; y: number };
    type: 'inherits' | 'composes' | 'uses' | 'contains';
    fromConnector: string;
    toConnector: string;
}

export interface ExtendedBlockData extends BlockData {
    parentClass?: string;
}

const DesignCanvas: React.FC = () => {
    const [blocks, setBlocks] = useState<ExtendedBlockData[]>([]);
    const [connections, setConnections] = useState<Connection[]>([]);
    const [fileContent, setFileContent] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>('');
    const [isFlowVisible, setIsFlowVisible] = useState(true);
    const [classVisibility, setClassVisibility] = useState<Record<string, boolean>>({});
    const [zoomLevel, setZoomLevel] = useState(1);
    const [canvasSize, setCanvasSize] = useState({ width: 3000, height: 2000 }); // Default size



    const loadFile = useCallback(async (content: string) => {
        try {
            const jsonData = await generateJsonFromPythonFile(content);

            const modifiedBlocks = jsonData.map(block => {
                if (block.type === 'function') {
                    const parentClass = jsonData.find(b => b.type === 'class' && b.code.includes(`def ${block.name}(`));
                    if (parentClass) {
                        return {
                            ...block,
                            id: `${parentClass.name}_${block.id}`,
                            parentClass: parentClass.name
                        } as ExtendedBlockData;
                    }
                }
                return block as ExtendedBlockData;
            });

            setBlocks(modifiedBlocks);
        } catch (error) {
            console.error('Error processing file:', error);
        }
    }, []);

    useEffect(() => {
        if (fileContent) {
            loadFile(fileContent);
        }
    }, [fileContent, loadFile]);

    const updateConnections = useCallback(() => {
        const newConnections: Connection[] = [];
        const classBlocks = blocks.filter(block => block.type === 'class');
        const functionBlocks = blocks.filter(block => block.type === 'function');

        classBlocks.forEach(classBlock => {
            functionBlocks.forEach(functionBlock => {
                if (functionBlock.id.startsWith(`${classBlock.name}_`)) {
                    newConnections.push({
                        id: `${classBlock.id}-${functionBlock.id}`,
                        start: classBlock.id,
                        end: functionBlock.id,
                        startPoint: { x: classBlock.x, y: classBlock.y },
                        endPoint: { x: functionBlock.x, y: functionBlock.y },
                        type: 'contains',
                        fromConnector: 'method',
                        toConnector: 'input'
                    });
                }
            });
        });

        setConnections(newConnections);
    }, [blocks]);

    useEffect(() => {
        updateConnections();
    }, [updateConnections]);

    const handlePositionChange = useCallback((id: string, x: number, y: number) => {
        setBlocks(prevBlocks =>
            prevBlocks.map(block =>
                block.id === id ? { ...block, x, y } : block
            )
        );
    }, []);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFileName(file.name);
            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                const content = e.target?.result;
                if (typeof content === 'string') {
                    setFileContent(content);
                }
            };
            reader.readAsText(file);
        }
    };

    const handleCodeChange = (newCode: string) => {
        setFileContent(newCode);
    };

    const handleFlowVisibilityChange = (isVisible: boolean) => {
        setIsFlowVisible(isVisible);
    };

    const handleClassVisibilityChange = (classId: string, isVisible: boolean) => {
        setClassVisibility(prev => ({ ...prev, [classId]: isVisible }));
    };

    const getVisibleBlocks = () => {
        return blocks.filter(block => {
            if (block.type === 'class') return true;
            const parentClass = blocks.find(b => b.type === 'class' && block.id.startsWith(`${b.name}_`));
            return parentClass ? classVisibility[parentClass.id] !== false : true;
        });
    };

    const getVisibleConnections = () => {
        return connections.filter(conn => {
            const startBlock = blocks.find(b => b.id === conn.start);
            const endBlock = blocks.find(b => b.id === conn.end);
            if (startBlock?.type === 'class' && endBlock?.type === 'function') {
                return classVisibility[startBlock.id] !== false;
            }
            return true;
        });
    };

    const handleZoomIn = () => {
        setZoomLevel(prevZoom => Math.min(prevZoom + 0.1, 2));
    };

    const handleZoomOut = () => {
        setZoomLevel(prevZoom => {
            const newZoom = Math.max(prevZoom - 0.1, 0.2);
            // Increase canvas size when zooming out
            if (newZoom < prevZoom) {
                setCanvasSize(prev => ({
                    width: prev.width * (prevZoom / newZoom),
                    height: prev.height * (prevZoom / newZoom)
                }));
            }
            return newZoom;
        });
    };

    const handleZoomReset = () => {
        setZoomLevel(1);
        setCanvasSize({ width: 3000, height: 2000 }); // Reset to default size
    };

    return (
        <div className="w-full h-screen p-4">
            <input type="file" onChange={handleFileChange} accept=".py" className="mb-4" />

            <div className="flex items-center mb-4">
                <button onClick={handleZoomIn} className="mr-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600" title="Zoom In">
                    <ZoomIn size={20} />
                </button>
                <button onClick={handleZoomOut} className="mr-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600" title="Zoom Out">
                    <ZoomOut size={20} />
                </button>
                <button onClick={handleZoomReset} className="mr-2 p-2 bg-green-500 text-white rounded hover:bg-green-600" title="Reset Zoom">
                    <RotateCcw size={20} />
                </button>
                <span className="ml-4">Zoom: {Math.round(zoomLevel * 100)}%</span>
            </div>

            <div className="overflow-auto" style={{
                width: '100%',
                height: 'calc(100vh - 150px)', // Adjust based on your layout
            }}>
                <div style={{
                    transform: `scale(${zoomLevel})`,
                    transformOrigin: 'top left',
                    transition: 'transform 0.3s ease-in-out',
                    width: `${canvasSize.width}px`,
                    height: `${canvasSize.height}px`,
                }}>
                    <CanvasGrid
                        blocks={blocks}
                        connections={connections}
                        isFlowVisible={isFlowVisible}
                        onPositionChange={handlePositionChange}
                        onVisibilityChange={handleClassVisibilityChange}
                        getVisibleBlocks={getVisibleBlocks}
                        getVisibleConnections={getVisibleConnections}
                        fileContent={fileContent}
                        fileName={fileName}
                        onCodeChange={handleCodeChange}
                        onFlowVisibilityChange={handleFlowVisibilityChange}
                        zoomLevel={zoomLevel}
                    />
                </div>
            </div>
        </div>
    );
};

export default DesignCanvas;