import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Upload, Settings as SettingsIcon } from 'lucide-react';
import CanvasGrid from './CanvasGrid';
import { generateJsonFromPythonFile } from './fileProcessor';
import SettingsPanel from './Settings';
import defaultCustomization from './customization.json';

export interface BlockData {
    id: string;
    type: 'class' | 'class_function' | 'code' | 'class_standalone';
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
    type: 'inherits' | 'composes' | 'uses' | 'contains' | 'codeLink';
    fromConnector: string;
    toConnector: string;
    startBlockType: 'class' | 'class_function' | 'code' | 'class_standalone';
    endBlockType: 'class' | 'class_function' | 'code' | 'class_standalone';
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
    const [autoZoom, setAutoZoom] = useState(true);
    const [customization, setCustomization] = useState(() => {
        const savedCustomization = localStorage.getItem('customization');
        return savedCustomization ? JSON.parse(savedCustomization) : defaultCustomization;
    });
    const canvasRef = useRef<HTMLDivElement>(null);
    const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);

    const loadFile = useCallback(async (content: string) => {
        try {
            const jsonData = await generateJsonFromPythonFile(content);

            const modifiedBlocks = jsonData.map((block, index) => {
                let x, y;
                if (block.type === 'class') {
                    x = 700;
                    y = 100 + index * 250;
                } else if (block.type === 'class_function') {
                    const parentClass = jsonData.find(b => b.type === 'class' && b.code.includes(`def ${block.name}(`));
                    if (parentClass) {
                        x = 1500;
                        y = 100 + index * 150;
                        return {
                            ...block,
                            id: `${parentClass.name}_${block.id}`,
                            parentClass: parentClass.name,
                            x,
                            y
                        } as ExtendedBlockData;
                    }
                } else if (block.type === 'code') {
                    x = 700;
                    y = 150 + index * 150;
                }

                return { ...block, x, y } as ExtendedBlockData;
            });

            const classStandaloneBlock: ExtendedBlockData = {
                id: 'classStandaloneBlock1',
                type: 'class_standalone',
                name: 'Class Standalone Block',
                location: 'Sample Location',
                author: 'Sample Author',
                fileType: 'Python',
                code: 'class SampleClass:\n    def sample_method(self):\n        print("This is a sample method")\n\nsample = SampleClass()\nsample.sample_method()',
                x: 1500,
                y: modifiedBlocks.length * 150,
                connections: []
            };

            setBlocks([...modifiedBlocks, classStandaloneBlock]);
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
        const functionBlocks = blocks.filter(block => block.type === 'class_function');
        const codeBlocks = blocks.filter(block => block.type === 'code');
        const classStandaloneBlocks = blocks.filter(block => block.type === 'class_standalone');

        classBlocks.forEach(classBlock => {
            functionBlocks.forEach(functionBlock => {
                if (functionBlock.id.startsWith(`${classBlock.name}_`)) {
                    newConnections.push({
                        id: `${classBlock.id}-${functionBlock.id}`,
                        start: classBlock.id,
                        end: functionBlock.id,
                        startPoint: { x: classBlock.x + 200, y: classBlock.y + 50 },
                        endPoint: { x: functionBlock.x, y: functionBlock.y + 50 },
                        type: 'contains',
                        fromConnector: 'method',
                        toConnector: 'input',
                        startBlockType: 'class',
                        endBlockType: 'class_function'
                    });
                }
            });

            newConnections.push({
                id: `IDE-${classBlock.id}`,
                start: 'python-ide',
                end: classBlock.id,
                startPoint: { x: idePosition.x + 600, y: idePosition.y + 30 },
                endPoint: { x: classBlock.x, y: classBlock.y + 50 },
                type: 'uses',
                fromConnector: 'output',
                toConnector: 'input',
                startBlockType: 'code',
                endBlockType: 'class'
            });
        });

        codeBlocks.forEach(codeBlock => {
            newConnections.push({
                id: `IDE-${codeBlock.id}`,
                start: 'python-ide',
                end: codeBlock.id,
                startPoint: { x: idePosition.x + 600, y: idePosition.y + 30 },
                endPoint: { x: codeBlock.x, y: codeBlock.y + 50 },
                type: 'uses',
                fromConnector: 'output',
                toConnector: 'input',
                startBlockType: 'code',
                endBlockType: 'code'
            });
        });

        const firstClassBlock = classBlocks[0];
        classStandaloneBlocks.forEach(classStandaloneBlock => {
            newConnections.push({
                id: `${firstClassBlock ? firstClassBlock.id : 'IDE'}-${classStandaloneBlock.id}`,
                start: firstClassBlock ? firstClassBlock.id : 'python-ide',
                end: classStandaloneBlock.id,
                startPoint: firstClassBlock
                    ? { x: firstClassBlock.x + 200, y: firstClassBlock.y + 50 }
                    : { x: idePosition.x + 600, y: idePosition.y + 30 },
                endPoint: { x: classStandaloneBlock.x, y: classStandaloneBlock.y + 50 },
                type: 'uses',
                fromConnector: 'output',
                toConnector: 'input',
                startBlockType: firstClassBlock ? 'class' : 'code',
                endBlockType: 'class_standalone'
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
            if (block.type === 'class' || block.type === 'code' || block.type === 'class_standalone') return true;
            const parentClass = blocks.find(b => b.type === 'class' && block.id.startsWith(`${b.name}_`));
            return parentClass ? classVisibility[parentClass.id] !== false : true;
        });
    }, [blocks, classVisibility]);

    const getVisibleConnections = useCallback(() => {
        return connections.filter(conn => {
            const startBlock = blocks.find(b => b.id === conn.start);
            const endBlock = blocks.find(b => b.id === conn.end);
            if (startBlock?.type === 'class' && endBlock?.type === 'class_function') {
                return classVisibility[startBlock.id] !== false;
            }
            return true;
        });
    }, [connections, blocks, classVisibility]);

    const handleZoomIn = () => {
        setZoomLevel(prevZoom => Math.min(prevZoom + 0.1, 2));
    };

    const handleZoomOut = () => {
        setZoomLevel(prevZoom => Math.max(prevZoom - 0.1, 0.2));
    };

    const handleZoomReset = () => {
        setZoomLevel(1);
    };

    const calculateBoundingBox = useCallback(() => {
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        blocks.forEach(block => {
            minX = Math.min(minX, block.x);
            minY = Math.min(minY, block.y);
            maxX = Math.max(maxX, block.x + 200);
            maxY = Math.max(maxY, block.y + 100);
        });
        return { minX, minY, maxX, maxY };
    }, [blocks]);

    const adjustZoom = useCallback(() => {
        if (!canvasRef.current) return;

        if (blocks.length === 0) {
            setZoomLevel(1);
            const { clientWidth, clientHeight } = canvasRef.current;
            setCanvasSize({ width: clientWidth, height: clientHeight });
            return;
        }

        if (!autoZoom) return;

        const { minX, minY, maxX, maxY } = calculateBoundingBox();
        const canvasWidth = canvasRef.current.clientWidth;
        const canvasHeight = canvasRef.current.clientHeight;

        const contentWidth = maxX - minX;
        const contentHeight = maxY - minY;

        const horizontalScale = canvasWidth / contentWidth;
        const verticalScale = canvasHeight / contentHeight;

        const newZoom = Math.min(horizontalScale, verticalScale, 1) * 0.9;

        setZoomLevel(newZoom);
        setCanvasSize({
            width: Math.max(contentWidth / newZoom, canvasWidth / newZoom),
            height: Math.max(contentHeight / newZoom, canvasHeight / newZoom)
        });
    }, [blocks, autoZoom, calculateBoundingBox]);

    useEffect(() => {
        adjustZoom();
    }, [blocks, adjustZoom]);

    const toggleAutoZoom = () => {
        setAutoZoom(!autoZoom);
    };

    const handleCustomizationChange = (newCustomization: any) => {
        setCustomization(newCustomization);
        localStorage.setItem('customization', JSON.stringify(newCustomization));
    };

    return (
        <div className="w-full h-screen p-4">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                    <button onClick={handleZoomIn} className="mr-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600" title="Zoom In">
                        <ZoomIn size={20} />
                    </button>
                    <button onClick={handleZoomOut} className="mr-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600" title="Zoom Out">
                        <ZoomOut size={20} />
                    </button>
                    <button onClick={handleZoomReset} className="mr-2 p-2 bg-green-500 text-white rounded hover:bg-green-600" title="Reset Zoom">
                        <RotateCcw size={20} />
                    </button>
                    <button
                        onClick={toggleAutoZoom}
                        className={`mr-2 p-2 rounded ${autoZoom ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-300 hover:bg-gray-400'}`}
                        title={autoZoom ? "Disable Auto-Zoom" : "Enable Auto-Zoom"}
                    >
                        Auto
                    </button>
                    <span className="ml-4">Zoom: {Math.round(zoomLevel * 100)}%</span>

                    <div className="relative ml-1">
                        <input
                            type="file"
                            onChange={handleFileChange}
                            accept=".py"
                            className="hidden"
                            id="file-upload"
                        />
                        <label
                            htmlFor="file-upload"
                            className="flex items-center px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 cursor-pointer"
                        >
                            <Upload size={20} className="mr-2" />
                            {fileName || "Choose file"}
                        </label>
                    </div>
                </div>
                <button
                    onClick={() => setIsSettingsPanelOpen(true)}
                    className="p-2 bg-gray-200 rounded hover:bg-gray-300"
                    title="Open Settings"
                >
                    <SettingsIcon size={20} />
                </button>
            </div>

            <div
                ref={canvasRef}
                className="overflow-auto"
                style={{
                    width: '100%',
                    height: 'calc(100vh - 150px)',
                    backgroundImage: `linear-gradient(to right, ${customization.canvas.gridColor} 1px, transparent 1px),
                                       linear-gradient(to bottom, ${customization.canvas.gridColor} 1px, transparent 1px)`,
                    backgroundSize: `${customization.canvas.gridSpacing * zoomLevel}px ${customization.canvas.gridSpacing * zoomLevel}px`,
                    backgroundColor: customization.canvas.backgroundColor,
                }}
            >
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
                        customization={customization}
                    />
                </div>
            </div>

            <SettingsPanel
                isOpen={isSettingsPanelOpen}
                onClose={() => setIsSettingsPanelOpen(false)}
                customization={customization}
                onCustomizationChange={handleCustomizationChange}
            />
        </div>
    );
};

export default DesignCanvas;