import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Settings as SettingsIcon, X, Info, Layers } from 'lucide-react';
import CanvasGrid from './CanvasGrid';
import { generateJsonFromPythonFile, BlockData, ConnectionData as FileProcessorConnectionData } from './fileProcessor';
import SettingsPanel from './Settings';
import defaultCustomization from './customization.json';
import customTemplates from './customTemplates';
import CanvasInfoPanel from './CanvasInfoPanel';
import BlocksListPanel from './BlocksListPanel';

export interface ConnectionData extends FileProcessorConnectionData {
    id: string;
}

export interface ExtendedBlockData extends BlockData {
    parentClass?: string;
    isVisible?: boolean;
    width: number;
}

interface Template {
    name: string;
    canvas?: {
        backgroundColor?: string;
    };
    blocks?: {
        class?: {
            backgroundColor?: string;
        };
        class_function?: {
            backgroundColor?: string;
        };
    };
    connections?: {
        inherits?: {
            lineColor?: string;
        };
    };
}

interface TemplateCardProps {
    template: Template;
    onSelect: (template: Template) => void;
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
    isVisible?: boolean;
}

interface DesignCanvasProps {
    selectedFile: string | null;
    selectedFileName: string | null;
    onCodeChange: (newContent: string) => void;  // Add this line
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
    const [autoZoom, setAutoZoom] = useState(false);
    const [isAutoZoomLocked, setIsAutoZoomLocked] = useState(false);
    const [customization, setCustomization] = useState(() => {
        const savedCustomization = localStorage.getItem('customization');
        return savedCustomization ? JSON.parse(savedCustomization) : defaultCustomization;
    });
    const canvasRef = useRef<HTMLDivElement>(null);
    const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
    const [isTemplatesPanelOpen, setIsTemplatesPanelOpen] = useState(false);
    const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(false);
    const [hiddenSubConnections, setHiddenSubConnections] = useState<string[]>([]);
    const [hiddenSubBlocks, setHiddenSubBlocks] = useState<string[]>([]);
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
    const [isBlocksListOpen, setIsBlocksListOpen] = useState(false);
    const [ideContent, setIdeContent] = useState<string | null>(null);

    const toggleAutoZoom = () => {
        if (!isAutoZoomLocked) {
            setAutoZoom(!autoZoom);
        }
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

    const toggleAutoZoomLock = () => {
        setIsAutoZoomLocked(!isAutoZoomLocked);
        if (!isAutoZoomLocked) {
            setAutoZoom(false);
        }
    };

    const adjustZoom = useCallback(() => {
        if (!canvasRef.current || !autoZoom) return;

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

    const handleConnectionVisibilityChange = useCallback((connectionId: string, isVisible: boolean, connectionType: string) => {
        console.log("Connection visibility change for", connectionId, "to", isVisible);

        let connectionIdsFormatted: string[] = [];
        console.log("Clicked connection ID:", connectionType);

        if (connectionType === "idecontainsclass") {
            setConnections(prevConnections =>
                prevConnections.map(conn => {
                    const formateConnectionId = `${connectionId}-${connectionId}.`
                    console.log("Clicked connection ID Fromated:", connectionId);
                    console.log("Clicked connection ID Condition:", conn.id);

                    if (conn.id.includes(formateConnectionId)) {
                        console.log("Clicked connection ID ADDEDFromated", conn.id)
                        connectionIdsFormatted.push(conn.id);
                        return { ...conn, isVisible };
                    }
                    if (conn.start === connectionId.split('-')[0]) {
                        connectionIdsFormatted.push(conn.id);
                        return { ...conn, isVisible };
                    }

                    return conn;
                })
            );
        }

        const connection = connections.find(conn => conn.id === connectionId);
        if (connection) {
            console.log("Connection found:", connection);

            setBlocks(prevBlocks => {
                const updatedBlocks = prevBlocks.map(block => {
                    if (block.id === connection.end) {
                        console.log(`Updating visibility for end block ${block.id} to ${isVisible}`);
                        return { ...block, isVisible };
                    }
                    if (block.parentClass === connection.end) {
                        console.log(`Setting sub-block ${block.id} visibility to ${isVisible}`);
                        return { ...block, isVisible };
                    }
                    return block;
                });

                return updatedBlocks;
            });

            setHiddenSubConnections(prev => {
                if (isVisible) {
                    return prev.filter(id => !connectionIdsFormatted.includes(id));
                } else {
                    return [...new Set([...prev, ...connectionIdsFormatted])];
                }
            });

        } else {
            console.log("No connection found for ID:", connectionId);
        }
    }, [connections, setHiddenSubConnections]);

    const estimateInitialWidth = (code: string): number => {
        const lines = code.split('\n');
        const maxLineLength = Math.max(...lines.map(line => line.length));
        const CHAR_WIDTH = 8;
        const PADDING = 40;
        return Math.max(200, maxLineLength * CHAR_WIDTH + PADDING);
    };

    const processFile = useCallback(async (content: string, fileName: string) => {
        try {
            const jsonData = await generateJsonFromPythonFile(content, fileName);
            console.log('Loaded JSON data:', jsonData);

            const UNIFORM_SPACING = 40;
            const COLUMN_WIDTH = 350;
            const IDE_WIDTH = 600;
            const X_OFFSET = IDE_WIDTH + 250;

            const getBlockHeight = (block: BlockData) => {
                const lineCount = block.code.split('\n').length;
                return Math.max(120, lineCount * 20 + 60);
            };

            const classes = jsonData.filter(block => block.type === 'class');
            const standaloneCodes = jsonData.filter(block => block.type === 'code');
            const standaloneFunctions = jsonData.filter(block => block.type === 'standalone_function');
            const classFunctions = jsonData.filter(block => block.type === 'class_function');
            const classStandalones = jsonData.filter(block => block.type === 'class_standalone');

            const sortedMainBlocks = [...classes, ...standaloneCodes, ...standaloneFunctions]
                .sort((a, b) => a.lineNumber - b.lineNumber);

            let currentY = 100;

            const modifiedBlocks: ExtendedBlockData[] = sortedMainBlocks.map((block) => {
                const height = getBlockHeight(block) + 20;
                let x = X_OFFSET;

                const newBlock = {
                    ...block,
                    width: estimateInitialWidth(block.code),
                    x,
                    y: currentY,
                    height,
                } as ExtendedBlockData;

                currentY += height + UNIFORM_SPACING;

                return newBlock;
            });

            let methodY = 100;
            const classFunctionBlocks = classFunctions.map((block) => {
                const height = getBlockHeight(block) + 20;
                const parentClass = classes.find(c => c.code.includes(`def ${block.name}(`));

                console.log("pp", block.name);
                console.log("ppp", parentClass ? parentClass.name : 'No parent class');

                const newBlock = {
                    ...block,
                    width: estimateInitialWidth(block.code),
                    x: X_OFFSET + 3 * COLUMN_WIDTH,
                    y: methodY,
                    height
                } as ExtendedBlockData;

                methodY += height + UNIFORM_SPACING;
                return newBlock;
            });

            let standaloneY = methodY;
            const classStandaloneBlocks = classStandalones.map((block) => {
                const height = getBlockHeight(block) + 20;
                const newBlock = {
                    ...block,
                    width: estimateInitialWidth(block.code),
                    x: X_OFFSET + 3 * COLUMN_WIDTH,
                    y: standaloneY,
                    height
                } as ExtendedBlockData;
                standaloneY += height + UNIFORM_SPACING;
                return newBlock;
            });

            const allBlocks = [...modifiedBlocks, ...classFunctionBlocks, ...classStandaloneBlocks];

            setBlocks(allBlocks);
            setIdeContent(content);
            console.log('Set blocks:', allBlocks);
            setRefreshKey(prevKey => prevKey + 1);
        } catch (error) {
            console.error('Error processing file:', error);
        }
    }, []);

    useEffect(() => {
        if (selectedFileName) {
            // Check if there's content in local storage for this file
            const storedContent = localStorage.getItem(`file_${selectedFileName}`);

            if (storedContent) {
                // If found in local storage, use this content
                setIdeContent(storedContent);
                processFile(storedContent, selectedFileName);
            } else if (selectedFile) {
                // If not in local storage, use the selectedFile content
                setIdeContent(selectedFile);
                processFile(selectedFile, selectedFileName);
                // Also, store this content in local storage for future use
                localStorage.setItem(`file_${selectedFileName}`, selectedFile);
            }
        }
    }, [selectedFile, selectedFileName, processFile]);

    const getConnectionPoints = useCallback((startBlock: ExtendedBlockData, endBlock: ExtendedBlockData) => {
        const CONNECTOR_OFFSET = 20;

        if (startBlock.type === 'class' && (endBlock.type === 'class_function' || endBlock.type === 'class_standalone')) {
            const classLines = startBlock.code.split('\n');
            const functionStartLine = classLines.findIndex(line =>
                line.includes(`def ${endBlock.name}(`) || line.includes(endBlock.code.split('\n')[0])
            );

            if (functionStartLine !== -1) {
                const startY = startBlock.y + (functionStartLine + 1) * 20;
                return {
                    startPoint: { x: startBlock.x + 750, y: startY + 40 },
                    endPoint: { x: endBlock.x, y: endBlock.y + 25 }
                };
            }
        }

        return {
            startPoint: { x: startBlock.x + startBlock.width - CONNECTOR_OFFSET, y: startBlock.y + 50 },
            endPoint: { x: endBlock.x, y: endBlock.y + 25 }
        };
    }, []);

    const updateConnections = useCallback(() => {
        const newConnections: Connection[] = [];
        const allBlocks = blocks.filter(block =>
            ['class', 'code', 'standalone_function'].includes(block.type)
        );

        const getIDEConnectionStartPoint = (blockLineNumber: number) => {
            const lineHeight = 20;
            return {
                x: idePosition.x + 600,
                y: idePosition.y + ((blockLineNumber - 1) * lineHeight) + 40
            };
        };

        const connectBlockToIDE = (block: ExtendedBlockData) => {
            const startPoint = getIDEConnectionStartPoint(block.lineNumber);
            const endPoint = { x: block.x, y: block.y + 25 };

            const cleanBlockId = block.id.endsWith(':') ? block.id.slice(0, -1) : block.id;

            let connectionType: ConnectionData['type'];
            if (block.type === 'class') {
                connectionType = 'idecontainsclass';
            } else {
                connectionType = 'idecontainsstandalonecode';
            }

            newConnections.push({
                id: `${cleanBlockId}`,
                start: 'python-ide',
                end: cleanBlockId,
                startPoint,
                endPoint,
                type: connectionType,
                fromConnector: "python - ide" ,
                toConnector: cleanBlockId.split('.').pop() || '',
                startBlockType: 'code',
                endBlockType: block.type
            });
        };

        allBlocks.forEach(connectBlockToIDE);

        blocks.forEach(block => {
            if (block.type === 'class') {
                const classFunctions = blocks.filter(b =>
                    b.type === 'class_function' && b.parentClass === block.id
                );
                classFunctions.forEach(functionBlock => {
                   
                    const { startPoint, endPoint } = getConnectionPoints(block, functionBlock);
                    newConnections.push({
                        id: `${block.id}-${functionBlock.id}`,
                        start: block.id,
                        end: functionBlock.id,
                        startPoint,
                        endPoint,
                        type: 'class_contains_functions',
                        fromConnector: block.id.split('.').pop() ||'',
                        toConnector: functionBlock.id.split('.').pop() ||'',
                        startBlockType: 'class',
                        endBlockType: 'class_function'
                    });
                });

                const classStandalones = blocks.filter(b =>
                    b.type === 'class_standalone' && b.parentClass === block.id
                );
                classStandalones.forEach(standaloneBlock => {
                    const { startPoint, endPoint } = getConnectionPoints(block, standaloneBlock);
                    newConnections.push({
                        id: `${block.id}-${standaloneBlock.id}`,
                        start: block.id,
                        end: standaloneBlock.id,
                        startPoint,
                        endPoint,
                        type: 'class_contains_standalone',
                        fromConnector: block.id.split('.').pop() || '',
                        toConnector: standaloneBlock.id.split('.').pop() || '',
                        startBlockType: 'class',
                        endBlockType: 'class_standalone'
                    });
                });
            }
        });

        setConnections(prevConnections => {
            return newConnections.map(newConn => {
                const existingConn = prevConnections.find(conn => conn.id === newConn.id);
                return existingConn ? { ...newConn, isVisible: existingConn.isVisible } : newConn;
            });
        });
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
        setIdeContent(newCode);
        if (selectedFileName) {
            // Update local storage with the new content
            localStorage.setItem(`file_${selectedFileName}`, newCode);
            console.log("new code", newCode);

            // Process the file with the new content
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
            if (block.isVisible === false) return false;
            if (hiddenSubBlocks.includes(block.id)) return false;
            if (block.type === 'class' || block.type === 'code' || block.type === 'class_standalone' || block.type === 'standalone_function') return true;
            const parentClass = blocks.find(b => b.type === 'class' && block.id.startsWith(`${b.name}_`));
            return parentClass ? classVisibility[parentClass.id] !== false : true;
        });
    }, [blocks, classVisibility, hiddenSubBlocks]);

    const getVisibleConnections = useCallback(() => {
        return connections
            .filter(conn => !hiddenSubConnections.includes(conn.id))
            .map(conn => ({
                ...conn,
                isVisible: conn.isVisible !== false
            }));
    }, [connections, hiddenSubConnections]);

    const handleZoomIn = () => {
        setZoomLevel(prevZoom => Math.min(prevZoom + 0.1, 2));
    };

    const handleZoomOut = () => {
        setZoomLevel(prevZoom => Math.max(prevZoom - 0.1, 0.2));
    };

    const handleZoomReset = () => {
        setZoomLevel(1);
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

    const handleBlockWidthChange = useCallback((id: string, newWidth: number) => {
        setBlocks(prevBlocks =>
            prevBlocks.map(block =>
                block.id === id ? { ...block, width: newWidth } : block
            )
        );
    }, []);

    const handleBlockSelect = useCallback((blockId: string) => {
        setSelectedBlockId(blockId);
        const selectedBlock = blocks.find(block => block.id === blockId);
        if (selectedBlock && canvasRef.current) {
            const newZoom = calculateZoomForBlock(selectedBlock);
            const newScrollPosition = calculateScrollPositionForBlock(selectedBlock, newZoom);

            setZoomLevel(newZoom);
            canvasRef.current.scrollTo({
                left: newScrollPosition.x,
                top: newScrollPosition.y,
                behavior: 'smooth'
            });
        }
    }, [blocks]);

    const calculateZoomForBlock = (block: ExtendedBlockData) => {
        if (!canvasRef.current) return zoomLevel;
        const viewportWidth = canvasRef.current.clientWidth;
        const viewportHeight = canvasRef.current.clientHeight;
        const blockWidth = block.width;
        const blockHeight = 350; // Assuming a fixed height for blocks

        const widthRatio = viewportWidth / (blockWidth * 2);
        const heightRatio = viewportHeight / (blockHeight * 2);

        return Math.min(widthRatio, heightRatio, 0.8); // Cap at 80% zoom
    };

    const calculateScrollPositionForBlock = (block: ExtendedBlockData, newZoom: number) => {
        if (!canvasRef.current) return { x: 0, y: 0 };
        const viewportWidth = canvasRef.current.clientWidth;
        const viewportHeight = canvasRef.current.clientHeight;

        const scrollX = (block.x * newZoom) - (viewportWidth / 2) + (block.width * newZoom / 2);
        const scrollY = (block.y * newZoom) - (viewportHeight / 2) + (75 * newZoom); // 75 is half of the assumed block height

        return { x: scrollX, y: scrollY };
    };

    const TemplateCard: React.FC<TemplateCardProps> = ({ template, onSelect }) => (
        <div
            className="w-48 h-64 bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-105"
            onClick={() => onSelect(template)}
        >
            <div className="h-2/3 p-4 flex flex-col justify-between" style={{ backgroundColor: template.canvas?.backgroundColor || '#ffffff' }}>
                <div className="flex justify-between">
                    <div className="w-8 h-8 rounded" style={{ backgroundColor: template.blocks?.class?.backgroundColor || '#cccccc' }} />
                    <div className="w-8 h-8 rounded" style={{ backgroundColor: template.blocks?.class_function?.backgroundColor || '#aaaaaa' }} />
                </div>
                <div className="w-full h-2 rounded-full" style={{ backgroundColor: template.connections?.inherits?.lineColor || '#000000' }} />
            </div>
            <div className="h-1/3 p-4 flex flex-col justify-between bg-white">
                <h3 className="font-bold text-sm">{template.name}</h3>
                <p className="text-xs text-gray-600">Click to apply</p>
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
                        onClick={() => setIsBlocksListOpen(true)}
                        className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm flex items-center"
                        title="Show Blocks List"
                    >
                        <Layers size={16} className="mr-2" />
                        Blocks
                    </button>
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
                    <button
                        onClick={() => setIsInfoPanelOpen(true)}
                        className="p-2 bg-gray-200 rounded hover:bg-gray-300"
                        title="Open Canvas Info"
                    >
                        <Info size={20} />
                    </button>
                </div>
            </div>

            <div className="flex">
                <div
                    ref={canvasRef}
                    className="overflow-auto flex-grow"
                    style={{
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
                            connections={getVisibleConnections()}
                            isFlowVisible={isFlowVisible}
                            onPositionChange={handlePositionChange}
                            onVisibilityChange={handleClassVisibilityChange}
                            getVisibleBlocks={getVisibleBlocks}
                            getVisibleConnections={getVisibleConnections}
                            fileContent={ideContent}
                            fileName={selectedFileName || ''}
                            onCodeChange={handleCodeChange}
                            onFlowVisibilityChange={handleFlowVisibilityChange}
                            zoomLevel={zoomLevel}
                            idePosition={idePosition}
                            customization={customization}
                            onConnectionVisibilityChange={handleConnectionVisibilityChange}
                            onBlockWidthChange={handleBlockWidthChange}
                            onBlockSelect={handleBlockSelect}
                            selectedBlockId={selectedBlockId}
                        />
                    </div>
                </div>
            </div>

            {isTemplatesPanelOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg w-11/12 max-w-6xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Choose a Template</h2>
                            <button onClick={() => setIsTemplatesPanelOpen(false)} className="p-1 rounded-full hover:bg-gray-200">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {customTemplates.map((template, index) => (
                                <TemplateCard key={index} template={template} onSelect={handleTemplateChange} />
                            ))}
                        </div>
                    </div>
                </div>
            )}
            <BlocksListPanel
                isOpen={isBlocksListOpen}
                onClose={() => setIsBlocksListOpen(false)}
                blocks={blocks}
                onBlockSelect={handleBlockSelect}
                customization={customization}
            />
            <SettingsPanel
                isOpen={isSettingsPanelOpen}
                onClose={() => setIsSettingsPanelOpen(false)}
                customization={customization}
                onCustomizationChange={handleCustomizationChange}
            />
            <CanvasInfoPanel
                isOpen={isInfoPanelOpen}
                onClose={() => setIsInfoPanelOpen(false)}
                blocks={blocks}
                onBlockSelect={handleBlockSelect}
            />
        </div>
    );
};

export default DesignCanvas;