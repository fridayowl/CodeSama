import React, { useState, useCallback, useEffect, useRef } from 'react';
import DraggableWrapper from './DraggableWrapper';
import { ClassBlock, FunctionBlock } from './Blocks';
import PythonIDE from './PythonIDE';
import Connections from './Connections';
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

const DesignCanvas: React.FC = () => {
    const [blocks, setBlocks] = useState<BlockData[]>([]);
    const [connections, setConnections] = useState<Connection[]>([]);
    const [fileContent, setFileContent] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>('Untitled.py');
    const [idePosition, setIdePosition] = useState({ x: 20, y: 20 });
    const canvasRef = useRef<HTMLDivElement>(null);

    const loadFile = useCallback(async () => {
        if (fileContent) {
            try {
                const jsonData = await generateJsonFromPythonFile(fileContent);
                setBlocks(jsonData);
            } catch (error) {
                console.error('Error processing file:', error);
                // Handle error (e.g., show error message to user)
            }
        }
    }, [fileContent]);

    useEffect(() => {
        loadFile();
    }, [loadFile]);

    const updateConnections = useCallback(() => {
        const newConnections: Connection[] = [];
        blocks.forEach(block => {
            block.connections.forEach(conn => {
                const endBlock = blocks.find(b => b.id === conn.to);
                if (endBlock) {
                    newConnections.push({
                        id: `${block.id}-${endBlock.id}`,
                        start: block.id,
                        end: endBlock.id,
                        startPoint: { x: block.x, y: block.y },
                        endPoint: { x: endBlock.x, y: endBlock.y },
                        type: conn.type,
                        fromConnector: conn.fromConnector,
                        toConnector: conn.toConnector
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

    const handleCodeChange = useCallback((newCode: string) => {
        setFileContent(newCode);
        loadFile();
    }, [loadFile]);

    return (
        <div className="relative w-full h-screen flex flex-col">
            <input type="file" onChange={handleFileChange} accept=".py" className="mb-4 p-2" />
            <div
                ref={canvasRef}
                className="flex-grow relative overflow-auto bg-white"
                style={{
                    backgroundImage: `
                    linear-gradient(to right, #f0f0f0 1px, transparent 1px),
                    linear-gradient(to bottom, #f0f0f0 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px',
                }}
            >
                <div className="absolute inset-0" style={{ minWidth: '200%', minHeight: '200%' }}>
                    <DraggableWrapper
                        id="python-ide"
                        initialX={idePosition.x}
                        initialY={idePosition.y}
                        onPositionChange={handlePositionChange}
                        title={fileName}
                    >
                        <PythonIDE
                            fileContent={fileContent}
                            onCodeChange={handleCodeChange}
                            fileName={fileName}
                        />
                    </DraggableWrapper>

                    {blocks.map((item) => (
                        <DraggableWrapper
                            key={item.id}
                            id={item.id}
                            initialX={item.x}
                            initialY={item.y}
                            onPositionChange={handlePositionChange}
                            title={item.name}
                        >
                            {item.type === 'class' ? (
                                <ClassBlock
                                    name={item.name}
                                    location={item.location}
                                    author={item.author}
                                    fileType={item.fileType}
                                    code={item.code}
                                />
                            ) : (
                                <FunctionBlock
                                    name={item.name}
                                    location={item.location}
                                    author={item.author}
                                    fileType={item.fileType}
                                    code={item.code}
                                />
                            )}
                        </DraggableWrapper>
                    ))}
                    <Connections connections={connections} />
                </div>
            </div>
        </div>
    );
};

export default DesignCanvas;