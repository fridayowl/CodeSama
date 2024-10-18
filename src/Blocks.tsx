import React, { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, Edit, Save, Info, FileText, TestTube } from 'lucide-react';

interface BlockProps {
    id: string;
    type: 'class' | 'class_function' | 'code' | 'class_standalone' | 'standalone_function';
    name: string;
    location: string;
    author: string;
    fileType: string;
    code: string;
    lineNumber?: number;
    onVisibilityChange: (id: string, isVisible: boolean) => void;
    onBlockCodeChange: (id: string, newCode: string[], lineNumber: number) => void;
    customization: any;
    isConnectorVisible?: boolean;
    parentClass?: string;
    initialWidth: number;
    onWidthChange: (width: number) => void;
    onSelect: () => void;
    isSelected: boolean;
}

const Block: React.FC<BlockProps> = ({
    id,
    type,
    name,
    location,
    author,
    fileType,
    code,
    lineNumber,
    onVisibilityChange,
    onBlockCodeChange,
    customization,
    isConnectorVisible = true,
    parentClass,
    initialWidth,
    onWidthChange,
    onSelect,
    isSelected,
}) => {
    const [isVisible, setIsVisible] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isDetailsVisible, setIsDetailsVisible] = useState(false);
    const [isDocumentationVisible, setIsDocumentationVisible] = useState(false);
    const [isTestingVisible, setIsTestingVisible] = useState(false);
    const [currentCode, setCurrentCode] = useState(code);
    const [calculatedWidth, setCalculatedWidth] = useState(initialWidth);
    const codeRef = useRef<HTMLPreElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const blockStyle = customization?.blocks?.[type] || {};

    const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCurrentCode(e.target.value);
    };

    const handleSave = () => {
        setIsEditing(false);
        const codeLines = currentCode.split('\n');
        onBlockCodeChange(id, codeLines, lineNumber || 1);
    };

    const toggleVisibility = () => {
        const newVisibility = !isVisible;
        setIsVisible(newVisibility);
        onVisibilityChange(id, newVisibility);
    };

    const toggleEditing = () => {
        setIsEditing(!isEditing);
        if (!isVisible) {
            setIsVisible(true);
            onVisibilityChange(id, true);
        }
    };

    const toggleDetails = () => {
        setIsDetailsVisible(!isDetailsVisible);
    };

    const toggleDocumentation = () => {
        setIsDocumentationVisible(!isDocumentationVisible);
    };

    const toggleTesting = () => {
        setIsTestingVisible(!isTestingVisible);
    };

    const handleButtonClick = (e: React.MouseEvent, action: () => void) => {
        e.stopPropagation();
        action();
    };

    useEffect(() => {
        if (codeRef.current && containerRef.current) {
            const codeWidth = codeRef.current.scrollWidth;
            const containerWidth = containerRef.current.offsetWidth;
            const newWidth = Math.max(codeWidth, containerWidth, initialWidth);

            if (newWidth !== calculatedWidth) {
                setCalculatedWidth(newWidth);
                onWidthChange(newWidth);
            }
        }
    }, [code, onWidthChange, calculatedWidth, initialWidth]);

    const renderCodeWithLineNumbers = () => {
        const lines = currentCode.split('\n');
        const startLineNumber = lineNumber || 1;
        return lines.map((line, index) => (
            <div key={index} className="flex">
                <span className="mr-4 text-gray-500 select-none" style={{ minWidth: '2em' }}>
                    {startLineNumber + index}
                </span>
                <span>{line}</span>
            </div>
        ));
    };

    if (!isConnectorVisible) {
        return null;
    }

    const glowEffectClass = isSelected
        ? 'ring-4 ring-green-500 shadow-xl shadow-blue-500/50 '
        : '';

    return (
        <div
            ref={containerRef}
            className={`w-full max-w-3xl rounded-lg shadow-md overflow-hidden ${glowEffectClass}`}
            style={{
                backgroundColor: blockStyle.backgroundColor || '#ffffff',
                borderColor: blockStyle.borderColor || '#000000',
                color: blockStyle.textColor || '#000000',
                borderWidth: '2px',
                borderStyle: 'solid',
                paddingLeft: '20px',
                width: `850px`,
                cursor: 'pointer',
            }}
            onClick={() => onSelect()}
        >
            <div className="p-2 flex justify-between items-center" style={{ backgroundColor: blockStyle.headerColor || '#f0f0f0', paddingLeft: '20px' }}>
                <h3 className="font-bold text-lg">
                    {name}
                    {lineNumber && <span className="ml-2 text-sm font-normal">(Line {lineNumber})</span>}
                </h3>
                <div className="flex space-x-2">
                    <button
                        onClick={(e) => handleButtonClick(e, toggleDetails)}
                        className="p-1 rounded hover:bg-opacity-80"
                        title="Details"
                        style={{ backgroundColor: customization.buttons.backgroundColor, color: customization.buttons.textColor }}
                    >
                        <Info size={16} />
                    </button>
                    <button
                        onClick={(e) => handleButtonClick(e, toggleEditing)}
                        className="p-1 rounded hover:bg-opacity-80"
                        title={isEditing ? "Save" : "Edit"}
                        style={{ backgroundColor: customization.buttons.backgroundColor, color: customization.buttons.textColor }}
                    >
                        {isEditing ? <Save size={16} /> : <Edit size={16} />}
                    </button>
                    <button
                        onClick={(e) => handleButtonClick(e, toggleVisibility)}
                        className="p-1 rounded hover:bg-opacity-80"
                        title={isVisible ? "Hide code" : "Show code"}
                        style={{ backgroundColor: customization.buttons.backgroundColor, color: customization.buttons.textColor }}
                    >
                        {isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    <button
                        onClick={(e) => handleButtonClick(e, toggleDocumentation)}
                        className="p-1 rounded hover:bg-opacity-80"
                        title="Documentation"
                        style={{ backgroundColor: customization.buttons.backgroundColor, color: customization.buttons.textColor }}
                    >
                        <FileText size={16} />
                    </button>
                    <button
                        onClick={(e) => handleButtonClick(e, toggleTesting)}
                        className="p-1 rounded hover:bg-opacity-80"
                        title="Testing"
                        style={{ backgroundColor: customization.buttons.backgroundColor, color: customization.buttons.textColor }}
                    >
                        <TestTube size={16} />
                    </button>
                </div>
            </div>
            {isDetailsVisible && (
                <div className="px-4 py-2 bg-gray-100" style={{ paddingLeft: '20px' }}>
                    <p className="text-sm">Type: {type}</p>
                    <p className="text-sm">File: {fileType}</p>
                    <p className="text-sm">Location: {location}</p>
                    <p className="text-sm">Author: {author}</p>
                    {lineNumber && <p className="text-sm">Line Number: {lineNumber}</p>}
                    {parentClass && <p className="text-sm">Parent Class: {parentClass}</p>}
                </div>
            )}
            {isVisible && (
                <div className="p-4" style={{ paddingLeft: '20px' }}>
                    {isEditing ? (
                        <>
                            <textarea
                                value={currentCode}
                                onChange={handleCodeChange}
                                className="w-full p-2 border rounded font-mono text-sm"
                                rows={currentCode.split('\n').length}
                                style={{
                                    backgroundColor: customization.ide?.backgroundColor || '#f0f0f0',
                                    color: customization.ide?.textColor || '#000000',
                                    paddingLeft: '20px'
                                }}
                            />
                            <button
                                onClick={(e) => handleButtonClick(e, handleSave)}
                                className="mt-2 px-4 py-2 text-white rounded hover:bg-opacity-80"
                                style={{ backgroundColor: customization.buttons.backgroundColor, color: customization.buttons.textColor }}
                            >
                                Save
                            </button>
                        </>
                    ) : (
                        <pre
                            ref={codeRef}
                            className="w-full p-2 border rounded overflow-auto font-mono text-sm"
                            style={{
                                backgroundColor: customization.ide?.backgroundColor || '#f0f0f0',
                                color: customization.ide?.textColor || '#000000',
                                paddingLeft: '20px'
                            }}
                        >
                            {renderCodeWithLineNumbers()}
                        </pre>
                    )}
                </div>
            )}
            {isDocumentationVisible && (
                <div className="p-4 bg-gray-50 border-t" style={{ paddingLeft: '20px' }}>
                    <h4 className="font-semibold mb-2">Documentation</h4>
                    <p className="text-sm">This is a sample documentation for the {name} {type}. Replace this with actual documentation.</p>
                </div>
            )}
            {isTestingVisible && (
                <div className="p-4 bg-gray-50 border-t" style={{ paddingLeft: '20px' }}>
                    <h4 className="font-semibold mb-2">Testing</h4>
                    <button
                        onClick={(e) => handleButtonClick(e, () => console.log('Run tests'))}
                        className="px-4 py-2 text-white rounded hover:bg-opacity-80"
                        style={{ backgroundColor: customization.buttons.backgroundColor, color: customization.buttons.textColor }}
                    >
                        Run Tests
                    </button>
                    <p className="mt-2 text-sm">Click the button above to run tests for this {type}.</p>
                </div>
            )}
        </div>
    );
};

export const ClassBlock: React.FC<BlockProps> = (props) => <Block {...props} />;
export const FunctionBlock: React.FC<BlockProps> = (props) => <Block {...props} />;
export const ClassStandaloneBlock: React.FC<BlockProps> = (props) => <Block {...props} />;
export const CodeBlock: React.FC<BlockProps> = (props) => <Block {...props} />;
export const StandaloneFunctionBlock: React.FC<BlockProps> = (props) => <Block {...props} />;

export default {
    ClassBlock,
    FunctionBlock,
    ClassStandaloneBlock,
    CodeBlock,
    StandaloneFunctionBlock
};