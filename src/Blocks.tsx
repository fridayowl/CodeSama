import React, { useState } from 'react';

interface BlockProps {
    name: string;
    location: string;
    author: string;
    fileType: string;
    code: string;
}

const Block: React.FC<BlockProps & { type: 'class' | 'function' }> = ({ name, location, author, fileType, code, type }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [currentCode, setCurrentCode] = useState(code);

    const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCurrentCode(e.target.value);
    };

    const handleSave = () => {
        setIsEditing(false);
        // Here you would typically save the code to your backend or state management system
    };

    console.log(`Rendering ${type} block: ${name}`); // Add this line for debugging
    console.log("Code:", code); // Add this line for debugging

    return (
        <div className={`w-80 p-4 ${type === 'class' ? 'bg-blue-100' : 'bg-green-100'} rounded-lg shadow-md`}>
            <h3 className="font-bold text-lg">{name}</h3>
            <p className="text-sm">Type: {type}</p>
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

export const ClassBlock: React.FC<BlockProps> = (props) => <Block {...props} type="class" />;
export const FunctionBlock: React.FC<BlockProps> = (props) => <Block {...props} type="function" />;