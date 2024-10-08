import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Settings as SettingsIcon, X } from 'lucide-react';
import CanvasGrid from './CanvasGrid';
import { generateJsonFromPythonFile, BlockData, ConnectionData as FileProcessorConnectionData } from './fileProcessor';
import SettingsPanel from './Settings';
import defaultCustomization from './customization.json';
import customTemplates from './customTemplates';

export interface ConnectionData extends FileProcessorConnectionData { }

export interface ExtendedBlockData extends BlockData {
    parentClass?: string;
}

export interface Connection {
    id: string;
    start: string;
    end: string;
    startPoint: { x: number; y: number };
    endPoint: { x: number; y: number };
    type: ConnectionData['type'];
    fromConnector: string;
    toConnector: string;
    startBlockType: 'class' | 'class_function' | 'code' | 'class_standalone' | 'standalone_function';
    endBlockType: 'class' | 'class_function' | 'code' | 'class_standalone' | 'standalone_function';
}

interface DesignCanvasProps {
    selectedFile: string | null;
    selectedFileName: string | null;
}

const DesignCanvas: React.FC<DesignCanvasProps> = ({ selectedFile, selectedFileName }) => {
    const [blocks, setBlocks] = useState<ExtendedBlockData[]>([]);
    const [connections, setConnections] = useState<Connection[]>([]);
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
    const [isTemplatesPanelOpen, setIsTemplatesPanelOpen] = useState(false);

    const processFile = useCallback(async (content: string, fileName: string) => {
        try {
            const jsonData = await generateJsonFromPythonFile(content, fileName);
            console.log('Loaded JSON data:', jsonData);

            let classY = 100;
            let functionY = 220;
            let codeY = 100;
            let standaloneY = 220;
            let standaloneFunctionY = 340;

            const classes = jsonData.filter(block => block.type === 'class');

            const modifiedBlocks: ExtendedBlockData[] = jsonData.map((block) => {
                let x, y;
                if (block.type === 'class') {
                    x = 700;
                    y = classY;
                    classY += 250;
                } else if (block.type === 'class_function') {
                    const parentClass = jsonData.find(b => b.type === 'class' && b.code.includes(`def ${block.name}(`));
                    if (parentClass) {
                        x = 1500;
                        y = functionY;
                        functionY += 150;
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
                    y = Math.max(classY, functionY, codeY);
                    codeY = y + 150;
                } else if (block.type === 'class_standalone') {
                    if (classes.length > 0) {
                        x = 2200;
                        y = standaloneY;
                        standaloneY += 250;
                    } else {
                        return null;
                    }
                } else if (block.type === 'standalone_function') {
                    x = 700;
                    y = Math.max(classY, functionY, codeY);
                    codeY = y + 150;
                }
                return { ...block, x, y } as ExtendedBlockData;
            }).filter(Boolean) as ExtendedBlockData[];

            setBlocks(modifiedBlocks);
            console.log('Set blocks:', modifiedBlocks);
            setRefreshKey(prevKey => prevKey + 1);
        } catch (error) {
            console.error('Error processing file:', error);
        }
    }, []);

    useEffect(() => {
        if (selectedFile && selectedFileName) {
            processFile(selectedFile, selectedFileName);
        }
    }, [selectedFile, selectedFileName, processFile]);

    const getConnectionPoints = useCallback((startBlock: ExtendedBlockData, endBlock: ExtendedBlockData) => {
        return {
            startPoint: { x: startBlock.x + 200, y: startBlock.y + 50 },
            endPoint: { x: endBlock.x, y: endBlock.y + 50 }
        };
    }, []);

    const updateConnections = useCallback(() => {
        const newConnections: Connection[] = [];
        const classBlocks = blocks.filter(block => block.type === 'class');
        const functionBlocks = blocks.filter(block => block.type === 'class_function');
        const codeBlocks = blocks.filter(block => block.type === 'code');
        const classStandaloneBlocks = blocks.filter(block => block.type === 'class_standalone');
        const standaloneFunctionBlocks = blocks.filter(block => block.type === 'standalone_function');

        classBlocks.forEach(classBlock => {
            functionBlocks.forEach(functionBlock => {
                if (functionBlock.id.startsWith(`${classBlock.name}_`)) {
                    const { startPoint, endPoint } = getConnectionPoints(classBlock, functionBlock);
                    newConnections.push({
                        id: `${classBlock.id}-${functionBlock.id}`,
                        start: classBlock.id,
                        end: functionBlock.id,
                        startPoint,
                        endPoint,
                        type: 'class_contains_functions',
                        fromConnector: 'method',
                        toConnector: 'input',
                        startBlockType: 'class',
                        endBlockType: 'class_function'
                    });
                }
            });

            const ideBlock = { x: idePosition.x, y: idePosition.y, id: 'python-ide' } as ExtendedBlockData;
            const { startPoint, endPoint } = getConnectionPoints(ideBlock, classBlock);
            newConnections.push({
                id: `IDE-${classBlock.id}`,
                start: 'python-ide',
                end: classBlock.id,
                startPoint: { x: startPoint.x + 600, y: startPoint.y + 30 },
                endPoint,
                type: 'uses',
                fromConnector: 'output',
                toConnector: 'input',
                startBlockType: 'code',
                endBlockType: 'class'
            });
        });

        codeBlocks.forEach(codeBlock => {
            const ideBlock = { x: idePosition.x, y: idePosition.y, id: 'python-ide' } as ExtendedBlockData;
            const { startPoint, endPoint } = getConnectionPoints(ideBlock, codeBlock);
            newConnections.push({
                id: `IDE-${codeBlock.id}`,
                start: 'python-ide',
                end: codeBlock.id,
                startPoint: { x: startPoint.x + 600, y: startPoint.y + 30 },
                endPoint,
                type: 'uses',
                fromConnector: 'output',
                toConnector: 'input',
                startBlockType: 'code',
                endBlockType: 'code'
            });
        });

        classStandaloneBlocks.forEach(classStandaloneBlock => {
            const parentClass = classBlocks.find(classBlock =>
                classStandaloneBlock.connections.some(conn => conn.to === classBlock.id)
            );

            if (parentClass) {
                const { startPoint, endPoint } = getConnectionPoints(parentClass, classStandaloneBlock);
                newConnections.push({
                    id: `${parentClass.id}-${classStandaloneBlock.id}`,
                    start: parentClass.id,
                    end: classStandaloneBlock.id,
                    startPoint,
                    endPoint,
                    type: 'class_to_standalone',
                    fromConnector: 'output',
                    toConnector: 'input',
                    startBlockType: 'class',
                    endBlockType: 'class_standalone'
                });
            }
        });

        standaloneFunctionBlocks.forEach(functionBlock => {
            const ideBlock = { x: idePosition.x, y: idePosition.y, id: 'python-ide' } as ExtendedBlockData;
            const { startPoint, endPoint } = getConnectionPoints(ideBlock, functionBlock);
            newConnections.push({
                id: `IDE-${functionBlock.id}`,
                start: 'python-ide',
                end: functionBlock.id,
                startPoint: { x: startPoint.x + 600, y: startPoint.y + 30 },
                endPoint,
                type: 'uses',
                fromConnector: 'output',
                toConnector: 'input',
                startBlockType: 'code',
                endBlockType: 'standalone_function'
            });
        });

        setConnections(newConnections);
    }, [blocks, idePosition, getConnectionPoints]);

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
        updateConnections();
    }, [updateConnections]);

    const handleCodeChange = (newCode: string) => {
        if (selectedFileName) {
            processFile(newCode, selectedFileName);
        }
    };

    const handleFlowVisibilityChange = (isVisible: boolean) => {
        setIsFlowVisible(isVisible);
    };

    const handleClassVisibilityChange = (classId: string, isVisible: boolean) => {
        setClassVisibility(prev => ({ ...prev, [classId]: isVisible }));
    };

    const getVisibleBlocks = useCallback(() => {
        return blocks.filter(block => {
            if (block.type === 'class' || block.type === 'code' || block.type === 'class_standalone' || block.type === 'standalone_function') return true;
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

    const handleTemplateChange = (template: any) => {
        setCustomization(template);
        localStorage.setItem('customization', JSON.stringify(template));
        setIsTemplatesPanelOpen(false);
    };

    const TemplateCard: React.FC<{ template: any }> = ({ template }) => (
        <div
            className="w-48 h-64 bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-105"
            onClick={() => handleTemplateChange(template)}>
            <div className="h-1/2 p-2 flex flex-col justify-between" style={{ backgroundColor: template.canvas.backgroundColor }}>
                <div className="flex justify-between">
                    <div className="w-8 h-8 rounded" style={{ backgroundColor: template.blocks.class.backgroundColor }} />
                    <div className="w-8 h-8 rounded" style={{ backgroundColor: template.blocks.class_function.backgroundColor }} />
                </div>
                <div className="w-full h-1 rounded" style={{ backgroundColor: template.connections.uses.lineColor }} />
            </div>
            <div className="h-1/2 p-4 flex flex-col justify-between">
                <h3 className="font-bold text-lg">{template.name}</h3>
                <p className="text-sm text-gray-600">Click to apply</p>
            </div>
        </div>
    );

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
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setIsTemplatesPanelOpen(true)}
                        className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                        title="Choose Template"
                    >
                        Choose Template
                    </button>
                    <button
                        onClick={() => setIsSettingsPanelOpen(true)}
                        className="p-2 bg-gray-200 rounded hover:bg-gray-300"
                        title="Open Settings"
                    >
                        <SettingsIcon size={20} />
                    </button>
                </div>
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
                        fileContent={selectedFile}
                        fileName={selectedFileName || ''}
                        onCodeChange={handleCodeChange}
                        onFlowVisibilityChange={handleFlowVisibilityChange}
                        zoomLevel={zoomLevel}
                        idePosition={idePosition}
                        customization={customization}
                    />
                </div>
            </div>

            {isTemplatesPanelOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-3xl max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Choose a Template</h2>
                            <button onClick={() => setIsTemplatesPanelOpen(false)} className="p-1 rounded-full hover:bg-gray-200">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            {customTemplates.map((template, index) => (
                                <TemplateCard key={index} template={template} />
                            ))}
                        </div>
                    </div>
                </div>
            )}

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