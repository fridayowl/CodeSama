import React, { useState } from 'react';
import { Eye, EyeOff, Edit, Save } from 'lucide-react';

interface CodeBlockProps {
    id: string;
    name: string;
    location: string;
    author: string;
    fileType: string;
    code: string;
    onVisibilityChange: (id: string, isVisible: boolean) => void;
    onCodeChange?: (id: string, newCode: string) => void;
    isStandalone?: boolean;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
    id,
    name,
    location,
    author,
    fileType,
    code,
    onVisibilityChange,
    onCodeChange,
    isStandalone = false
}) => {
    const [isVisible, setIsVisible] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCode, setCurrentCode] = useState(code);

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

    return (
        <div className={`w-full max-w-3xl p-4 rounded-lg shadow-md ${isStandalone ? 'bg-purple-100' : 'bg-yellow-100'}`}>
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-lg">{name}</h3>
                <div className="flex space-x-2">
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
                </div>
            </div>
            <p className="text-sm">File: {fileType}</p>
            <p className="text-sm">Location: {location}</p>
            <p className="text-sm">Author: {author}</p>
            {isVisible && (
                <div className="mt-2">
                    {isEditing ? (
                        <>
                            <textarea
                                value={currentCode}
                                onChange={handleCodeChange}
                                className="w-full p-2 border rounded font-mono text-sm bg-white"
                                rows={currentCode.split('\n').length}
                            />
                            <button
                                onClick={handleSave}
                                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Save
                            </button>
                        </>
                    ) : (
                        <pre
                            className="w-full p-2 border rounded bg-white overflow-auto font-mono text-sm"
                        >
                            {currentCode}
                        </pre>
                    )}
                </div>
            )}
        </div>
    );
};

export default CodeBlock;