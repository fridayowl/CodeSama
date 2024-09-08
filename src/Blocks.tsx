import React, { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface BlockProps {
    id: string;
    name: string;
    location: string;
    author: string;
    fileType: string;
    code: string;
    onVisibilityChange: (id: string, isVisible: boolean) => void;
}

const PythonCodeEditor: React.FC<{ code: string; onChange: (code: string) => void }> = ({ code, onChange }) => {
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

    return (
        <div className="relative font-mono text-sm bg-white border rounded overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 p-2 pr-4 text-right bg-gray-100 select-none">
                {lines.map((_, i) => (
                    <div key={i} className="text-gray-500">
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
                }}
                spellCheck={false}
            />
        </div>
    );
};

const PythonBlock: React.FC<BlockProps & { type: 'class' | 'function' }> = ({
    id, name, location, author, fileType, code, onVisibilityChange, type
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

    const bgColor = type === 'class' ? 'bg-blue-100' : 'bg-green-100';

    return (
        <div className={`w-full max-w-3xl p-4 ${bgColor} rounded-lg shadow-md`}>
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-lg">{name}</h3>
                <button
                    onClick={toggleVisibility}
                    className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                    title={isVisible ? "Hide code" : "Show code"}
                >
                    {isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
            </div>
            <p className="text-sm">Type: {type.charAt(0).toUpperCase() + type.slice(1)}</p>
            <p className="text-sm">File: {fileType}</p>
            <p className="text-sm">Location: {location}</p>
            <p className="text-sm">Author: {author}</p>
            {isVisible && (
                <div className="mt-2">
                    {isEditing ? (
                        <>
                            <PythonCodeEditor code={currentCode} onChange={handleCodeChange} />
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
                            className="w-full p-2 border rounded cursor-pointer bg-white overflow-auto font-mono text-sm"
                            style={{
                                minWidth: '300px',
                                height: `${currentCode.split('\n').length * 1.5}em`,
                                minHeight: '3em',
                                whiteSpace: 'pre',
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
export const FunctionBlock: React.FC<BlockProps> = (props) => <PythonBlock {...props} type="function" />;