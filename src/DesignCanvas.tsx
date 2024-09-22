import React, { useState, useCallback, useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import CanvasGrid from './CanvasGrid';
import { generateJsonFromPythonFile } from './fileProcessor';

// Type definitions
export interface BlockData {
    id: string;
    type: 'class' | 'function' | 'code';
    name: string;
    location: string;
    author: string;
    fileType: string;
    code: string;
    x: number;
    y: number;
    connections: ConnectionData[];
}

export interface ConnectionData {
    to: string;
    type: 'inherits' | 'composes' | 'uses' | 'contains';
    fromConnector: string;
    toConnector: string;
}

export interface ExtendedBlockData extends BlockData {
    parentClass?: string;
}

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

const DesignCanvas: React.FC = () => {
    const [blocks, setBlocks] = useState<ExtendedBlockData[]>([]);
    const [connections, setConnections] = useState<Connection[]>([]);
    const [fileContent, setFileContent] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>('');
    const [isFlowVisible, setIsFlowVisible] = useState(true);
    const [classVisibility, setClassVisibility] = useState<Record<string, boolean>>({});
    const [zoomLevel, setZoomLevel] = useState(1);
    const [canvasSize, setCanvasSize] = useState({ width: 3000, height: 2000 });
    const [idePosition, setIdePosition] = useState({ x: 20, y: 20 });
    const [refreshKey, setRefreshKey] = useState(0);

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
            setRefreshKey(prevKey => prevKey + 1);
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
        const codeBlocks = blocks.filter(block => block.type === 'code');

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

            newConnections.push({
                id: `IDE-${classBlock.id}`,
                start: 'python-ide',
                end: classBlock.id,
                startPoint: { x: idePosition.x + 600, y: idePosition.y + 30 },
                endPoint: { x: classBlock.x, y: classBlock.y },
                type: 'uses',
                fromConnector: 'output',
                toConnector: 'input'
            });
        });

        codeBlocks.forEach(codeBlock => {
            newConnections.push({
                id: `IDE-${codeBlock.id}`,
                start: 'python-ide',
                end: codeBlock.id,
                startPoint: { x: idePosition.x + 600, y: idePosition.y + 30 },
                endPoint: { x: codeBlock.x, y: codeBlock.y },
                type: 'uses',
                fromConnector: 'output',
                toConnector: 'input'
            });
        });

        setConnections(newConnections);
    }, [blocks, idePosition]);

    useEffect(() => {
        updateConnections();
    }, [updateConnections]);

    const handlePositionChange = useCallback((id: string, x: number, y: number) => {
        if (id === 'python-ide') {
            setIdePosition({ x, y });
        } else {
            setBlocks(prevBlocks =>
                prevBlocks.map(block =>
                    block.id === id ? { ...block, x, y } : block
                )
            );
        }
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
        loadFile(newCode);
    };

    const handleFlowVisibilityChange = (isVisible: boolean) => {
        setIsFlowVisible(isVisible);
    };

    const handleClassVisibilityChange = (classId: string, isVisible: boolean) => {
        setClassVisibility(prev => ({ ...prev, [classId]: isVisible }));
    };

    const getVisibleBlocks = useCallback(() => {
        return blocks.filter(block => {
            if (block.type === 'class' || block.type === 'code') return true;
            const parentClass = blocks.find(b => b.type === 'class' && block.id.startsWith(`${b.name}_`));
            return parentClass ? classVisibility[parentClass.id] !== false : true;
        });
    }, [blocks, classVisibility]);

    const getVisibleConnections = useCallback(() => {
        return connections.filter(conn => {
            const startBlock = blocks.find(b => b.id === conn.start);
            const endBlock = blocks.find(b => b.id === conn.end);
            if (startBlock?.type === 'class' && endBlock?.type === 'function') {
                return classVisibility[startBlock.id] !== false;
            }
            return true;
        });
    }, [connections, blocks, classVisibility]);

    const handleZoomIn = () => {
        setZoomLevel(prevZoom => Math.min(prevZoom + 0.1, 2));
    };

    const handleZoomOut = () => {
        setZoomLevel(prevZoom => {
            const newZoom = Math.max(prevZoom - 0.1, 0.2);
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
        setCanvasSize({ width: 3000, height: 2000 });
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
                height: 'calc(100vh - 150px)',
            }}>
                <div style={{
                    transform: `scale(${zoomLevel})`,
                    transformOrigin: 'top left',
                    transition: 'transform 0.3s ease-in-out',
                    width: `${canvasSize.width}px`,
                    height: `${canvasSize.height}px`,
                }}>
                    <CanvasGrid
                        key={refreshKey}
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
                        idePosition={idePosition}
                    />
                </div>
            </div>
        </div>
    );
};

export default DesignCanvas;