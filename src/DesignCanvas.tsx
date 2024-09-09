import React, { useState, useCallback, useEffect } from 'react';
import DraggableWrapper from './DraggableWrapper';
import { ClassBlock, FunctionBlock } from './Blocks';
import Connections from './Connections';
import PythonIDE from './PythonIDE';
import { generateJsonFromPythonFile, BlockData } from './fileProcessor';

interface Connection {
    id: string;
    start: string;
    end: string;
    startPoint: { x: number; y: number };
    endPoint: { x: number; y: number };
    type: 'inherits' | 'composes' | 'uses' | 'contains';
    fromConnector: string;
    toConnector: string;
}

interface ExtendedBlockData extends BlockData {
    parentClass?: string;
}

const DesignCanvas: React.FC = () => {
    const [blocks, setBlocks] = useState<ExtendedBlockData[]>([]);
    const [connections, setConnections] = useState<Connection[]>([]);
    const [fileContent, setFileContent] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>('');
    const [isFlowVisible, setIsFlowVisible] = useState(true);
    const [classVisibility, setClassVisibility] = useState<Record<string, boolean>>({});

    const loadFile = useCallback(async (content: string) => {
        try {
            const jsonData = await generateJsonFromPythonFile(content);
            
            // Modify the block IDs to include the class name for methods
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

    return (
        <div className="w-full h-screen p-4">
            <input type="file" onChange={handleFileChange} accept=".py" className="mb-4" />
            <div
                className="relative w-full h-[calc(100%-2rem)] bg-white"
                style={{
                    backgroundImage: `
                    linear-gradient(to right, #f0f0f0 1px, transparent 1px),
                    linear-gradient(to bottom, #f0f0f0 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px',
                }}
            >
                <DraggableWrapper
                    id="python-ide"
                    initialX={20}
                    initialY={20}
                    onPositionChange={() => { }}
                >
                    <PythonIDE
                        fileContent={fileContent}
                        onCodeChange={handleCodeChange}
                        fileName={fileName}
                        onFlowVisibilityChange={handleFlowVisibilityChange}
                    />
                </DraggableWrapper>

                {isFlowVisible && getVisibleBlocks().map((item) => (
                    <DraggableWrapper
                        key={item.id}
                        id={item.id}
                        initialX={item.x}
                        initialY={item.y}
                        onPositionChange={handlePositionChange}
                    >
                        {item.type === 'class' ? (
                            <ClassBlock
                                id={item.id}
                                name={item.name}
                                location={item.location}
                                author={item.author}
                                fileType={item.fileType}
                                code={item.code}
                                onVisibilityChange={handleClassVisibilityChange}
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
                {isFlowVisible && <Connections connections={getVisibleConnections()} />}
            </div>
        </div>
    );
};

export default DesignCanvas;