import React, { useState } from 'react';
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

export const ClassBlock: React.FC<BlockProps> = ({ id, name, location, author, fileType, code, onVisibilityChange }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCode, setCurrentCode] = useState(code);

    const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCurrentCode(e.target.value);
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

    return (
        <div className="w-80 p-4 bg-blue-100 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-lg">{name}</h3>
                <button
                    onClick={toggleVisibility}
                    className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                    title={isVisible ? "Hide functions" : "Show functions"}
                >
                    {isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
            </div>
            <p className="text-sm">Type: Class</p>
            <p className="text-sm">File: {fileType}</p>
            <p className="text-sm">Location: {location}</p>
            <p className="text-sm">Author: {author}</p>
            <div className="mt-2">
                {isEditing ? (
                    <>
                        <textarea
                            value={currentCode}
                            onChange={handleCodeChange}
                            className="w-full h-48 p-2 border rounded font-mono text-sm"
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
                        onClick={() => setIsEditing(true)}
                        className="w-full h-48 p-2 border rounded cursor-pointer bg-white overflow-auto font-mono text-sm"
                    >
                        {currentCode}
                    </pre>
                )}
            </div>
        </div>
    );
};

export const FunctionBlock: React.FC<BlockProps> = ({ id, name, location, author, fileType, code, onVisibilityChange }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [currentCode, setCurrentCode] = useState(code);

    const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCurrentCode(e.target.value);
    };

    const handleSave = () => {
        setIsEditing(false);
        // Here you would typically save the code to your backend or state management system
    };

    return (
        <div className="w-80 p-4 bg-green-100 rounded-lg shadow-md">
            <h3 className="font-bold text-lg">{name}</h3>
            <p className="text-sm">Type: Function</p>
            <p className="text-sm">File: {fileType}</p>
            <p className="text-sm">Location: {location}</p>
            <p className="text-sm">Author: {author}</p>
            <div className="mt-2">
                {isEditing ? (
                    <>
                        <textarea
                            value={currentCode}
                            onChange={handleCodeChange}
                            className="w-full h-48 p-2 border rounded font-mono text-sm"
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
                        onClick={() => setIsEditing(true)}
                        className="w-full h-48 p-2 border rounded cursor-pointer bg-white overflow-auto font-mono text-sm"
                    >
                        {currentCode}
                    </pre>
                )}
            </div>
        </div>
    );
};