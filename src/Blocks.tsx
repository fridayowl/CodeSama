import React, { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, Edit, Save, Info, FileText, TestTube, AlertTriangle, Copy, Wand2, ScrollText } from 'lucide-react';
import { checkPythonSyntax, SyntaxError } from './pythonsyntaxChecker';
import ComingSoon from './ComingSoon';

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

const defaultBlockStyle = {
    backgroundColor: '#ffffff',
    borderColor: '#000000',
    textColor: '#000000',
    headerColor: '#f0f0f0'
};

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
    const [syntaxErrors, setSyntaxErrors] = useState<SyntaxError[]>([]);
    const [hasSyntaxError, setHasSyntaxError] = useState(false);
    const [showComingSoon, setShowComingSoon] = useState(false);
    const codeRef = useRef<HTMLPreElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const blockStyle = customization?.blocks?.[type] || defaultBlockStyle;
    const [isLogsVisible, setIsLogsVisible] = useState(false);

    const adjustErrorLineNumbers = (errors: SyntaxError[], blockLineNumber: number): SyntaxError[] => {
        return errors.map(error => ({
            ...error,
            line: error.line + blockLineNumber - 1
        }));
    };

    useEffect(() => {
        const errors = checkPythonSyntax(currentCode);
        const adjustedErrors = adjustErrorLineNumbers(errors, lineNumber || 1);
        const validErrors = adjustedErrors.filter(error => error.line > 0);
        setSyntaxErrors(validErrors);
        setHasSyntaxError(validErrors.length > 0);
    }, [currentCode, lineNumber]);

    const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newCode = e.target.value;
        setCurrentCode(newCode);
        const errors = checkPythonSyntax(newCode);
        const adjustedErrors = adjustErrorLineNumbers(errors, lineNumber || 1);
        const validErrors = adjustedErrors.filter(error => error.line > 0);
        setSyntaxErrors(validErrors);
        setHasSyntaxError(validErrors.length > 0);
    };

    const handleViewLogs = () => {
        setIsLogsVisible(!isLogsVisible);
        // Add any additional logic for fetching or displaying logs
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

    const handleCopyErrorAndCode = () => {
        const errorText = syntaxErrors.map(error => `Line ${error.line}: ${error.message}`).join('\n');
        const textToCopy = `Errors:\n${errorText}\n\nCode:\n${currentCode}`;
        navigator.clipboard.writeText(textToCopy).then(() => {
            alert('Errors and code copied to clipboard!');
        });
    };

    const handleFixUsingAI = () => {
        setShowComingSoon(true);
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

    const errorBorderStyle = hasSyntaxError ? {
        borderColor: 'red',
        borderWidth: '2px',
        boxShadow: '0 0 10px rgba(255, 0, 0, 0.5)'
    } : {};

    return (
        <div
            ref={containerRef}
            className={`w-full max-w-3xl rounded-lg shadow-md overflow-hidden ${glowEffectClass}`}
            style={{
                ...errorBorderStyle,
                backgroundColor: blockStyle?.backgroundColor || defaultBlockStyle.backgroundColor,
                borderColor: hasSyntaxError ? 'red' : (blockStyle?.borderColor || defaultBlockStyle.borderColor),
                color: blockStyle?.textColor || defaultBlockStyle.textColor,
                borderWidth: '2px',
                borderStyle: 'solid',
                paddingLeft: '20px',
                width: `850px`,
                cursor: 'pointer',
            }}
            onClick={() => onSelect()}
        >
            <div className="p-2 flex justify-between items-center"
                style={{
                    backgroundColor: blockStyle?.headerColor || defaultBlockStyle.headerColor,
                    paddingLeft: '20px',
                    borderBottom: hasSyntaxError ? '2px solid red' : 'none'
                }}>
                <h3 className="font-bold text-lg flex items-center">
                    {hasSyntaxError && <AlertTriangle size={20} className="mr-2 text-red-500" />}
                    {name}
                    {lineNumber && <span className="ml-2 text-sm font-normal">(Line {lineNumber})</span>}
                </h3>
                <div className="flex space-x-2">
                    <button
                        onClick={(e) => handleButtonClick(e, toggleDetails)}
                        className="p-1 rounded hover:bg-opacity-80"
                        title="Details"
                        style={{ backgroundColor: customization.buttons?.backgroundColor, color: customization.buttons?.textColor }}
                    >
                        <Info size={16} />
                    </button>
                    <button
                        onClick={(e) => handleButtonClick(e, toggleEditing)}
                        className="p-1 rounded hover:bg-opacity-80"
                        title={isEditing ? "Save" : "Edit"}
                        style={{ backgroundColor: customization.buttons?.backgroundColor, color: customization.buttons?.textColor }}
                    >
                        {isEditing ? <Save size={16} /> : <Edit size={16} />}
                    </button>
                    <button
                        onClick={(e) => handleButtonClick(e, toggleVisibility)}
                        className="p-1 rounded hover:bg-opacity-80"
                        title={isVisible ? "Hide code" : "Show code"}
                        style={{ backgroundColor: customization.buttons?.backgroundColor, color: customization.buttons?.textColor }}
                    >
                        {isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    <button
                        onClick={(e) => handleButtonClick(e, toggleDocumentation)}
                        className="p-1 rounded hover:bg-opacity-80"
                        title="Documentation"
                        style={{ backgroundColor: customization.buttons?.backgroundColor, color: customization.buttons?.textColor }}
                    >
                        <FileText size={16} />
                    </button>
                    <button
                        onClick={(e) => handleButtonClick(e, toggleTesting)}
                        className="p-1 rounded hover:bg-opacity-80"
                        title="Testing"
                        style={{ backgroundColor: customization.buttons?.backgroundColor, color: customization.buttons?.textColor }}
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
                            <div className="mt-2 flex space-x-2">
                                <button
                                    onClick={(e) => handleButtonClick(e, handleSave)}
                                    className="px-4 py-2 text-white rounded hover:bg-opacity-80"
                                    style={{ backgroundColor: customization.buttons?.backgroundColor, color: customization.buttons?.textColor }}
                                >
                                    Save
                                </button>
                                {syntaxErrors.length > 0 && (
                                    <>
                                        <button
                                            onClick={(e) => handleButtonClick(e, handleCopyErrorAndCode)}
                                            className="px-4 py-2 text-white rounded hover:bg-opacity-80 flex items-center"
                                            style={{ backgroundColor: customization.buttons?.backgroundColor, color: customization.buttons?.textColor }}
                                        >
                                            <Copy size={16} className="mr-2" />
                                            Copy Error and Code
                                        </button>
                                        <button
                                            onClick={(e) => handleButtonClick(e, handleFixUsingAI)}
                                            className="px-4 py-2 text-white rounded hover:bg-opacity-80 flex items-center"
                                            style={{ backgroundColor: customization.buttons?.backgroundColor, color: customization.buttons?.textColor }}
                                        >
                                            <Wand2 size={16} className="mr-2" />
                                            Fix using AI
                                        </button>
                                        <button
                                            onClick={(e) => handleButtonClick(e, handleViewLogs)}
                                            className="px-4 py-2 text-white rounded hover:bg-opacity-80 flex items-center ml-2"
                                            style={{ backgroundColor: customization.buttons?.backgroundColor, color: customization.buttons?.textColor }}
                                        >
                                            <ScrollText size={16} className="mr-2" />
                                            Logs
                                        </button>
                                    </>
                                )}
                            </div>
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

                    {syntaxErrors.length > 0 && (
                        <div className="mt-4 p-2 bg-red-100 border border-red-400 rounded">
                            <h4 className="font-semibold flex items-center">
                                <AlertTriangle size={16} className="mr-2 text-red-500" />
                                Syntax Errors:
                            </h4>
                            <ul className="list-disc list-inside">
                                {syntaxErrors.map((error, index) => (
                                    <li key={index} className="text-sm text-red-700">
                                        Line {error.line}: {error.message}
                                    </li>
                                ))}
                            </ul>
                        </div>
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
                        style={{ backgroundColor: customization.buttons?.backgroundColor, color: customization.buttons?.textColor }}
                    >
                        Run Tests
                    </button>
                    <p className="mt-2 text-sm">Click the button above to run tests for this {type}.</p>
                </div>
            )}
            {showComingSoon && (
                <ComingSoon
                    feature="AI-powered code fixing"
                    onClose={() => setShowComingSoon(false)}
                />
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