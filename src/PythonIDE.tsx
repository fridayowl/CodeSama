import React, { useState, useEffect } from 'react';

interface PythonIDEProps {
    fileContent: string | null;
    onCodeChange: (newCode: string) => void;
    fileName: string;
}

const PythonIDE: React.FC<PythonIDEProps> = ({ fileContent, onCodeChange, fileName }) => {
    const [lines, setLines] = useState<string[]>([]);

    useEffect(() => {
        if (fileContent) {
            setLines(fileContent.split('\n'));
        } else {
            setLines([]);
        }
    }, [fileContent]);

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = e.target.value;
        setLines(newContent.split('\n'));
        onCodeChange(newContent);
    };

    return (
        <div className="w-[600px] h-full bg-gray-100 rounded-lg shadow-md overflow-hidden flex flex-col">
            <div className="bg-gray-200 text-gray-700 py-2 px-4 font-semibold flex justify-between items-center">
                <span>{fileName}</span>
                <span className="text-sm text-gray-500">Location: Uploaded file</span>
            </div>
            <div className="flex flex-grow overflow-hidden">
                <div className="bg-gray-700 text-gray-300 p-2 text-right select-none overflow-y-hidden" style={{ width: '40px' }}>
                    {lines.map((_, index) => (
                        <div key={index} className="leading-6 text-xs">
                            {index + 1}
                        </div>
                    ))}
                </div>
                <textarea
                    className="flex-grow p-2 font-mono text-sm bg-gray-800 text-white border-none resize-none outline-none overflow-y-scroll"
                    value={lines.join('\n')}
                    onChange={handleTextareaChange}
                    placeholder="Enter your Python code here..."
                    spellCheck="false"
                />
            </div>
        </div>
    );
};

export default PythonIDE;