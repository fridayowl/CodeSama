import React, { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import { Eye, EyeOff, RefreshCw } from 'lucide-react';

interface PythonIDECustomization {
    backgroundColor: string;
    textColor: string;
    lineNumbersColor: string;
    highlightColor: string;
}

interface PythonIDEProps {
    fileContent: string | null;
    onCodeChange: (newCode: string, lineNumber: number) => void;
    onBlockCodeChange: (id: string, newCode: string[], lineNumber: number) => void;
    fileName: string;
    onFlowVisibilityChange: (isVisible: boolean) => void;
    customization: PythonIDECustomization;
}

export interface PythonIDEHandle {
    handleBlockCodeChange: (id: string, newCode: string[], lineNumber: number) => void;
}

const defaultCustomization: PythonIDECustomization = {
    backgroundColor: '#1E293B',
    textColor: '#E2E8F0',
    lineNumbersColor: '#64748B',
    highlightColor: '#2563EB'
};

const PythonIDE = forwardRef<PythonIDEHandle, PythonIDEProps>(({
    fileContent,
    onCodeChange,
    onBlockCodeChange,
    fileName,
    onFlowVisibilityChange,
    customization: propCustomization
}, ref) => {
    const [content, setContent] = useState(fileContent || '');
    const [isFlowVisible, setIsFlowVisible] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [localCustomization, setLocalCustomization] = useState({ ...defaultCustomization, ...propCustomization });
    const [contentHeight, setContentHeight] = useState(0);
    const editorRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const lineHeight = 20;
    const headerHeight = 40;
    const extraLines = 2;
    const bottomPadding = 20;

    useEffect(() => {
        setLocalCustomization({
            ...defaultCustomization,
            ...propCustomization
        });
    }, [propCustomization]);

    useEffect(() => {
        if (fileContent !== null) {
            setContent(fileContent);
            updateContentHeight(fileContent);
            if (editorRef.current) {
                editorRef.current.innerText = fileContent;
            }
        }
    }, [fileContent]);

    const updateContentHeight = useCallback((text: string) => {
        const lines = text.split('\n').length;
        setContentHeight((lines + extraLines) * lineHeight + headerHeight + bottomPadding);
    }, []);

    const handleContentChange = useCallback(() => {
        if (editorRef.current) {
            const newContent = editorRef.current.innerText;
            setContent(newContent);
            updateContentHeight(newContent);

            // Calculate the line number based on the cursor position
            const selection = window.getSelection();
            const range = selection?.getRangeAt(0);
            const startNode = range?.startContainer;
            let lineNumber = 1;

            if (startNode && startNode.nodeType === Node.TEXT_NODE) {
                const textBefore = startNode.textContent?.substring(0, range?.startOffset || 0) || '';
                lineNumber += textBefore.split('\n').length - 1;
            }

            onCodeChange(newContent, lineNumber);
        }
    }, [onCodeChange, updateContentHeight]);

    const toggleFlowVisibility = useCallback(() => {
        setIsFlowVisible(prev => {
            const newVisibility = !prev;
            onFlowVisibilityChange(newVisibility);
            return newVisibility;
        });
    }, [onFlowVisibilityChange]);

    const handleRefresh = useCallback(() => {
        setIsRefreshing(true);
        onFlowVisibilityChange(false);
        setTimeout(() => {
            onFlowVisibilityChange(true);
            setIsRefreshing(false);
        }, 500);
    }, [onFlowVisibilityChange]);

    const handleBlockCodeChange = useCallback((id: string, newCode: string[], lineNumber: number) => {
        console.log("bchange", newCode, id, lineNumber);
        if (editorRef.current) {
            const oldContent = editorRef.current.innerText;
            console.log("bcheck", "oldcontent", oldContent);

            // Split the old content into lines
            const contentLines = oldContent.split('\n');

            // Convert newCode to an array if it's not already
            const newCodeLines = Array.isArray(newCode) ? newCode : [newCode];

            // Insert the new code lines at the specified line number
            contentLines.splice(lineNumber - 1, 0, ...newCodeLines);

            // Join the lines back together
            const updatedContent = contentLines.join('\n');

            // Update the content state
            setContent(updatedContent);

            // Update the content height
            updateContentHeight(updatedContent);

            // Update the editor content
            editorRef.current.innerText = updatedContent;

        }
    }, [setContent, updateContentHeight, onBlockCodeChange]);

    useImperativeHandle(ref, () => ({
        handleBlockCodeChange
    }), [handleBlockCodeChange]);


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
            <div className="flex flex-grow overflow-auto">
                <div
                    className="p-1 text-right select-none"
                    style={{
                        width: '30px',
                        backgroundColor: localCustomization.lineNumbersColor,
                        color: localCustomization.textColor
                    }}
                >
                    {content.split('\n').map((_, index) => (
                        <div key={index} style={{ height: `${lineHeight}px`, fontSize: '10px', lineHeight: `${lineHeight}px` }}>
                            {index + 1}
                        </div>
                    ))}
                </div>
                <div
                    ref={editorRef}
                    contentEditable
                    className="flex-grow p-1 font-mono text-sm outline-none whitespace-pre"
                    onInput={handleContentChange}
                    style={{
                        backgroundColor: localCustomization.backgroundColor,
                        color: localCustomization.textColor,
                        lineHeight: `${lineHeight}px`,
                        fontSize: '12px',
                        overflowY: 'auto',
                        height: `${contentHeight - headerHeight}px`,
                        paddingBottom: `${bottomPadding}px`
                    }}
                />
            </div>
        </div>
    );
});

export default PythonIDE;