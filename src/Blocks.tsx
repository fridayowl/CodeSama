import React, { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, Edit, Save } from 'lucide-react';

interface BlockProps {
    id: string;
    name: string;
    location: string;
    author: string;
    fileType: string;
    code: string;
    onVisibilityChange: (id: string, isVisible: boolean) => void;
    customization: any;
}

const PythonCodeEditor: React.FC<{ code: string; onChange: (code: string) => void; customization: any }> = ({ code, onChange, customization }) => {
    const [lines, setLines] = useState(code.split('\n'));
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.width = `${Math.max(...lines.map(line => line.length)) * 8}px`;
        }
    }, [lines]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newCode = e.target.value;
        setLines(newCode.split('\n'));
        onChange(newCode);
    };

    const ideStyle = customization?.ide || {};

    return (
        <div className="relative font-mono text-sm border rounded overflow-hidden" style={{ backgroundColor: ideStyle.backgroundColor || '#f0f0f0' }}>
            <div className="absolute left-0 top-0 bottom-0 p-2 pr-4 text-right select-none" style={{ backgroundColor: ideStyle.lineNumbersColor || '#e0e0e0' }}>
                {lines.map((_, i) => (
                    <div key={i} style={{ color: ideStyle.textColor || '#000000' }}>
                        {i + 1}
                    </div>
                ))}
            </div>
            <textarea
                ref={textareaRef}
                value={code}
                onChange={handleChange}
                className="w-full p-2 pl-12 bg-transparent resize-none outline-none"
                style={{
                    minWidth: '300px',
                    height: `${lines.length * 1.5}em`,
                    minHeight: '3em',
                    overflowX: 'auto',
                    whiteSpace: 'pre',
                    color: ideStyle.textColor || '#000000',
                }}
                spellCheck={false}
            />
        </div>
    );
};

const PythonBlock: React.FC<BlockProps & {
    type: 'class' | 'class_function' | 'code' | 'class_standalone' | 'standalone_function' }> = ({
    id, name, location, author, fileType, code, onVisibilityChange, type, customization
}) => {
    const [isVisible, setIsVisible] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCode, setCurrentCode] = useState(code);

    const handleCodeChange = (newCode: string) => {
        setCurrentCode(newCode);
    };

    const handleSave = () => {
        setIsEditing(false);
        // Here you would typically save the code to your backend or state management system
    };

    const toggleVisibility = () => {
        const newVisibility = !isVisible;
        setIsVisible(newVisibility);
        onVisibilityChange(id, newVisibility);
    };

    const blockStyle = customization?.blocks?.[type] || {};
    const ideStyle = customization?.ide || {};

    return (
        <div className="w-full max-w-3xl p-4 rounded-lg shadow-md"
            style={{
                backgroundColor: blockStyle.backgroundColor || '#ffffff',
                color: blockStyle.textColor || '#000000',
                borderColor: blockStyle.borderColor || '#000000',
                borderWidth: '2px',
                borderStyle: 'solid'
            }}>
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-lg">{name}</h3>
                <div>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="p-1 bg-gray-200 rounded hover:bg-gray-300 mr-2"
                        title={isEditing ? "Save" : "Edit"}
                    >
                        {isEditing ? <Save size={16} /> : <Edit size={16} />}
                    </button>
                    <button
                        onClick={toggleVisibility}
                        className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                        title={isVisible ? "Hide code" : "Show code"}
                    >
                        {isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                </div>
            </div>
            <p className="text-sm">Type: {type}</p>
            <p className="text-sm">File: {fileType}</p>
            <p className="text-sm">Location: {location}</p>
            <p className="text-sm">Author: {author}</p>
            {isVisible && (
                <div className="mt-2">
                    {isEditing ? (
                        <>
                            <PythonCodeEditor code={currentCode} onChange={handleCodeChange} customization={customization} />
                            <button
                                onClick={handleSave}
                                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Save
                            </button>
                        </>
                    ) : (
                        <pre
                            onClick={() => setIsEditing(true)}
                            className="w-full p-2 border rounded cursor-pointer overflow-auto font-mono text-sm"
                            style={{
                                minWidth: '300px',
                                height: `${currentCode.split('\n').length * 1.5}em`,
                                minHeight: '3em',
                                whiteSpace: 'pre',
                                backgroundColor: ideStyle.backgroundColor || '#f0f0f0',
                                color: ideStyle.textColor || '#000000',
                            }}
                        >
                            {currentCode}
                        </pre>
                    )}
                </div>
            )}
        </div>
    );
};

export const ClassBlock: React.FC<BlockProps> = (props) => <PythonBlock {...props} type="class" />;
export const FunctionBlock: React.FC<BlockProps> = (props) => <PythonBlock {...props} type="class_function" />;
export const ClassStandaloneBlock: React.FC<BlockProps> = (props) => <PythonBlock {...props} type="class_standalone" />;
export const CodeBlock: React.FC<BlockProps> = (props) => <PythonBlock {...props} type="code" />;
export const StandaloneFunctionBlock: React.FC<BlockProps> = (props) => <PythonBlock {...props} type="standalone_function" />;

export default {
    ClassBlock,
    FunctionBlock,
    ClassStandaloneBlock,
    CodeBlock,
    StandaloneFunctionBlock
};