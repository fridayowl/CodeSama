import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, RefreshCw } from 'lucide-react';

interface PythonIDECustomization {
    backgroundColor: string;
    textColor: string;
    lineNumbersColor: string;
    highlightColor: string;
    ide?: {
        backgroundColor: string;
        lineNumbersColor: string;
        highlightColor: string;
        textColor: string;
    };
}

interface PythonIDEProps {
    fileContent: string | null;
    onCodeChange: (newCode: string) => void;
    fileName: string;
    onFlowVisibilityChange: (isVisible: boolean) => void;
    customization: PythonIDECustomization;
}

const defaultCustomization: PythonIDECustomization = {
    backgroundColor: '#1E293B',
    textColor: '#E2E8F0',
    lineNumbersColor: '#64748B',
    highlightColor: '#2563EB'
};

const PythonIDE: React.FC<PythonIDEProps> = ({
    fileContent,
    onCodeChange,
    fileName,
    onFlowVisibilityChange,
    customization: propCustomization
}) => {
    const [lines, setLines] = useState<string[]>([]);
    const [isFlowVisible, setIsFlowVisible] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [localCustomization, setLocalCustomization] = useState({ ...defaultCustomization, ...propCustomization });
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [contentHeight, setContentHeight] = useState(0);

    const lineHeight = 20; // Compact line height
    const headerHeight = 40; // Height of the header
    const extraLines = 2; // Number of extra lines to add at the end
    const bottomPadding = 20; // Additional padding at the bottom

    useEffect(() => {
        if (propCustomization.ide) {
            setLocalCustomization({
                ...defaultCustomization,
                ...propCustomization.ide
            });
        } else {
            setLocalCustomization({
                ...defaultCustomization,
                ...propCustomization
            });
        }
    }, [propCustomization]);

    useEffect(() => {
        if (fileContent) {
            const newLines = fileContent.split('\n');
            setLines(newLines);
            setContentHeight((newLines.length + extraLines) * lineHeight + headerHeight + bottomPadding);
        } else {
            setLines([]);
            setContentHeight(lineHeight + headerHeight + bottomPadding);
        }
    }, [fileContent]);

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = e.target.value;
        const newLines = newContent.split('\n');
        setLines(newLines);
        setContentHeight((newLines.length + extraLines) * lineHeight + headerHeight + bottomPadding);
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
        <div
            ref={containerRef}
            className="w-[600px] rounded-lg shadow-md overflow-hidden flex flex-col"
            style={{
                backgroundColor: localCustomization.backgroundColor,
                height: `${contentHeight}px`
            }}
        >
            <div className="py-2 px-4 font-semibold flex justify-between items-center"
                style={{ backgroundColor: localCustomization.highlightColor, color: localCustomization.textColor, height: `${headerHeight}px` }}>
                <span>{fileName}</span>
                <div className="flex items-center">
                    <span className="text-sm mr-2" style={{ color: localCustomization.textColor }}>Location: Uploaded file</span>
                    <button
                        onClick={handleRefresh}
                        className="px-2 py-1 rounded hover:bg-opacity-80 flex items-center mr-2"
                        title="Refresh flow"
                        disabled={isRefreshing}
                        style={{ backgroundColor: localCustomization.highlightColor, color: localCustomization.textColor }}
                    >
                        <RefreshCw size={16} className={`mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
                        <span className="text-xs">Refresh</span>
                    </button>
                    <button
                        onClick={toggleFlowVisibility}
                        className="px-2 py-1 rounded hover:bg-opacity-80 flex items-center"
                        title={isFlowVisible ? "Hide flow" : "Show flow"}
                        style={{ backgroundColor: localCustomization.highlightColor, color: localCustomization.textColor }}
                    >
                        {isFlowVisible ? <Eye size={16} className="mr-1" /> : <EyeOff size={16} className="mr-1" />}
                        <span className="text-xs">{isFlowVisible ? "Hide" : "Show"}</span>
                    </button>
                </div>
            </div>
            <div className="flex flex-grow">
                <div
                    className="p-1 text-right select-none"
                    style={{
                        width: '30px',
                        backgroundColor: localCustomization.lineNumbersColor,
                        color: localCustomization.textColor
                    }}
                >
                    {[...Array(lines.length + extraLines)].map((_, index) => (
                        <div key={index} style={{ height: `${lineHeight}px`, fontSize: '10px', lineHeight: `${lineHeight}px` }}>
                            {index + 1}
                        </div>
                    ))}
                </div>
                <textarea
                    ref={textareaRef}
                    className="flex-grow p-1 font-mono text-sm border-none resize-none outline-none"
                    value={lines.join('\n')}
                    onChange={handleTextareaChange}
                    placeholder="Enter your Python code here..."
                    spellCheck="false"
                    style={{
                        backgroundColor: localCustomization.backgroundColor,
                        color: localCustomization.textColor,
                        lineHeight: `${lineHeight}px`,
                        fontSize: '12px',
                        height: `${contentHeight - headerHeight}px`,
                        paddingBottom: `${bottomPadding}px`
                    }}
                />
            </div>
        </div>
    );
};

export default PythonIDE;