import React, { useState } from 'react';
import { Eye, EyeOff, Edit, Save, Info, FileText, TestTube, ChevronDown, ChevronUp } from 'lucide-react';

interface CodeBlockProps {
    id: string;
    type: 'class' | 'function' | 'code';
    name: string;
    location: string;
    author: string;
    fileType: string;
    code: string;
    onVisibilityChange: (id: string, isVisible: boolean) => void;
    onCodeChange?: (id: string, newCode: string) => void;
    customization: any;
    
}

const CodeBlock: React.FC<CodeBlockProps> = ({
    id,
    type,
    name,
    location,
    author,
    fileType,
    code,
    onVisibilityChange,
    onCodeChange,
    customization
}) => {
    const [isVisible, setIsVisible] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isDetailsVisible, setIsDetailsVisible] = useState(false);
    const [currentCode, setCurrentCode] = useState(code);

    const blockStyle = customization.blocks[type];

    const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCurrentCode(e.target.value);
    };

    const handleSave = () => {
        setIsEditing(false);
        if (onCodeChange) {
            onCodeChange(id, currentCode);
        }
    };

    const toggleVisibility = () => {
        const newVisibility = !isVisible;
        setIsVisible(newVisibility);
        onVisibilityChange(id, newVisibility);
    };

    const toggleEditing = () => {
        setIsEditing(!isEditing);
    };

    const toggleDetails = () => {
        setIsDetailsVisible(!isDetailsVisible);
    };

    return (
        <div className="w-full max-w-3xl rounded-lg shadow-md overflow-hidden"
            style={{
                backgroundColor: blockStyle.backgroundColor,
                borderColor: blockStyle.borderColor,
                color: blockStyle.textColor
            }}>
            <div className="p-2 flex justify-between items-center" style={{ backgroundColor: blockStyle.headerColor }}>
                <h3 className="font-bold text-lg">{name}</h3>
                <div className="flex space-x-2">
                    <button
                        onClick={toggleDetails}
                        className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                        title="Show/Hide Details"
                    >
                        <Info size={16} />
                    </button>
                    <button
                        onClick={toggleEditing}
                        className="p-1 bg-gray-200 rounded hover:bg-gray-300"
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
                    <button
                        className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                        title="Documentation"
                    >
                        <FileText size={16} />
                    </button>
                    <button
                        className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                        title="Testing"
                    >
                        <TestTube size={16} />
                    </button>
                </div>
            </div>
            {isDetailsVisible && (
                <div className="px-4 py-2 bg-gray-100">
                    <p className="text-sm">Type: {type}</p>
                    <p className="text-sm">File: {fileType}</p>
                    <p className="text-sm">Location: {location}</p>
                    <p className="text-sm">Author: {author}</p>
                </div>
            )}
            {isVisible && (
                <div className="p-4">
                    {isEditing ? (
                        <>
                            <textarea
                                value={currentCode}
                                onChange={handleCodeChange}
                                className="w-full p-2 border rounded font-mono text-sm"
                                rows={currentCode.split('\n').length}
                                style={{
                                    backgroundColor: customization.ide.backgroundColor,
                                    color: customization.ide.textColor
                                }}
                            />
                            <button
                                // onClick={handleSave}
                                className="mt-2 px-4 py-2 text-white rounded hover:bg-opacity-80"
                                style={{ backgroundColor: customization.ide.highlightColor }}
                            >
                                Save
                            </button>
                        </>
                    ) : (
                        <pre className="w-full p-2 border rounded overflow-auto font-mono text-sm"
                            style={{
                                backgroundColor: customization.ide.backgroundColor,
                                color: customization.ide.textColor
                            }}>
                            {currentCode}
                        </pre>
                    )}
                </div>
            )}
        </div>
    );
};

export default CodeBlock;