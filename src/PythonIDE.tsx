import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, RefreshCw } from 'lucide-react';

interface PythonIDEProps {
    fileContent: string | null;
    onCodeChange: (newCode: string) => void;
    fileName: string;
    onFlowVisibilityChange: (isVisible: boolean) => void;
    customization: any;
}

const PythonIDE: React.FC<PythonIDEProps> = ({ fileContent, onCodeChange, fileName, onFlowVisibilityChange, customization }) => {
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
        }, 500);
    };

    return (
        <div className="w-[600px] h-full rounded-lg shadow-md overflow-hidden flex flex-col" style={{ backgroundColor: customization.backgroundColor }}>
            <div className="py-2 px-4 font-semibold flex justify-between items-center" style={{ backgroundColor: customization.highlightColor, color: customization.textColor }}>
                <span>{fileName}</span>
                <div className="flex items-center">
                    <span className="text-sm mr-2" style={{ color: customization.textColor }}>Location: Uploaded file</span>
                    <button
                        onClick={handleRefresh}
                        className="px-2 py-1 rounded hover:bg-opacity-80 flex items-center mr-2"
                        title="Refresh flow"
                        disabled={isRefreshing}
                        style={{ backgroundColor: customization.highlightColor }}
                    >
                        <RefreshCw size={16} className={`mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
                        <span className="text-xs">Refresh</span>
                    </button>
                    <button
                        onClick={toggleFlowVisibility}
                        className="px-2 py-1 rounded hover:bg-opacity-80 flex items-center"
                        title={isFlowVisible ? "Hide flow" : "Show flow"}
                        style={{ backgroundColor: customization.highlightColor }}
                    >
                        {isFlowVisible ? <Eye size={16} className="mr-1" /> : <EyeOff size={16} className="mr-1" />}
                        <span className="text-xs">{isFlowVisible ? "Hide" : "Show"}</span>
                    </button>
                </div>
            </div>
            <div className="flex flex-grow overflow-hidden">
                <div className="p-2 text-right select-none overflow-y-hidden" style={{ width: '40px', backgroundColor: customization.lineNumbersColor, color: customization.textColor }}>
                    {lines.map((_, index) => (
                        <div key={index} className="leading-6 text-xs">
                            {index + 1}
                        </div>
                    ))}
                </div>
                <textarea
                    className="flex-grow p-2 font-mono text-sm border-none resize-none outline-none overflow-y-scroll"
                    value={lines.join('\n')}
                    onChange={handleTextareaChange}
                    placeholder="Enter your Python code here..."
                    spellCheck="false"
                    style={{
                        backgroundColor: customization.backgroundColor,
                        color: customization.textColor
                    }}
                />
            </div>
        </div>
    );
};

export default PythonIDE;