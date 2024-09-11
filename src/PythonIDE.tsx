import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, RefreshCw } from 'lucide-react';

interface PythonIDEProps {
    fileContent: string | null;
    onCodeChange: (newCode: string) => void;
    fileName: string;
    onFlowVisibilityChange: (isVisible: boolean) => void;
}

const PythonIDE: React.FC<PythonIDEProps> = ({ fileContent, onCodeChange, fileName, onFlowVisibilityChange }) => {
    const [lines, setLines] = useState<string[]>([]);
    const [isFlowVisible, setIsFlowVisible] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

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

    const toggleFlowVisibility = () => {
        const newVisibility = !isFlowVisible;
        setIsFlowVisible(newVisibility);
        onFlowVisibilityChange(newVisibility);
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        onFlowVisibilityChange(false);
        setTimeout(() => {
            onFlowVisibilityChange(true);
            setIsRefreshing(false);
        }, 500); // Adjust this delay as needed
    };

    return (
        <div className="w-[600px] h-full bg-gray-100 rounded-lg shadow-md overflow-hidden flex flex-col">
            <div className="bg-gray-200 text-gray-700 py-2 px-4 font-semibold flex justify-between items-center">
                <span>{fileName}</span>
                <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">Location: Uploaded file</span>
                    <button
                        onClick={handleRefresh}
                        className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400 flex items-center mr-2"
                        title="Refresh flow"
                        disabled={isRefreshing}
                    >
                        <RefreshCw size={16} className={`mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
                        <span className="text-xs">Refresh</span>
                    </button>
                    <button
                        onClick={toggleFlowVisibility}
                        className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400 flex items-center"
                        title={isFlowVisible ? "Hide flow" : "Show flow"}
                    >
                        {isFlowVisible ? <Eye size={16} className="mr-1" /> : <EyeOff size={16} className="mr-1" />}
                        <span className="text-xs">{isFlowVisible ? "Hide" : "Show"}</span>
                    </button>
                </div>
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
