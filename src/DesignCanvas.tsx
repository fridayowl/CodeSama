import React, { useState, useCallback, useEffect } from 'react';
import DraggableWrapper from './DraggableWrapper';
import { ClassBlock, FunctionBlock } from './Blocks';
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

    const loadFile = async () => {
        if (fileContent) {
            try {
                const jsonData = await generateJsonFromPythonFile(fileContent);
                setBlocks(jsonData);
            } catch (error) {
                console.error('Error processing file:', error);
                // Handle error (e.g., show error message to user)
            }
        }
    };

    useEffect(() => {
        loadFile();
    }, [fileContent]);

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
        console.log(blocks)
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

    return (
        <div className="relative w-full h-screen">
            <input type="file" onChange={handleFileChange} accept=".py" />
            <div
                className="relative w-full h-full bg-white"
                style={{
                    backgroundImage: `
                    linear-gradient(to right, #f0f0f0 1px, transparent 1px),
                    linear-gradient(to bottom, #f0f0f0 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px',
                }}
            >
                {blocks.map((item) => ( 
                    <DraggableWrapper
                        key={item.id}
                        id={item.id}
                        initialX={item.x}
                        initialY={item.y}
                        onPositionChange={handlePositionChange}
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
    );
};

export default DesignCanvas;