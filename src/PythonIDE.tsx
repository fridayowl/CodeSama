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
    onClassNameClick: (className: string, lineNumber: number) => void;
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
    customization: propCustomization,
    onClassNameClick
}, ref) => {
    const [content, setContent] = useState(fileContent || '');
    const [isFlowVisible, setIsFlowVisible] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [localCustomization, setLocalCustomization] = useState({ ...defaultCustomization, ...propCustomization });
    const [contentHeight, setContentHeight] = useState(0);
    const [highlightedContent, setHighlightedContent] = useState<string>('');
    const editorRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const lineHeight = 20;
    const headerHeight = 40;
    const extraLines = 2;
    const bottomPadding = 20;

    const builtInFunctions = new Set([
        'abs', 'all', 'any', 'ascii', 'bin', 'bool', 'bytearray', 'bytes', 'callable', 'chr',
        'classmethod', 'compile', 'complex', 'delattr', 'dict', 'dir', 'divmod', 'enumerate',
        'eval', 'exec', 'filter', 'float', 'format', 'frozenset', 'getattr', 'globals', 'hasattr',
        'hash', 'help', 'hex', 'id', 'input', 'int', 'isinstance', 'issubclass', 'iter', 'len',
        'list', 'locals', 'map', 'max', 'memoryview', 'min', 'next', 'object', 'oct', 'open',
        'ord', 'pow', 'print', 'property', 'range', 'repr', 'reversed', 'round', 'set', 'setattr',
        'slice', 'sorted', 'staticmethod', 'str', 'sum', 'super', 'tuple', 'type', 'vars', 'zip'
    ]);

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
            highlightCode(fileContent);
        }
    }, [fileContent]);

    const updateContentHeight = useCallback((text: string) => {
        const lines = text.split('\n').length;
        setContentHeight((lines + extraLines) * lineHeight + headerHeight + bottomPadding);
    }, []);

    const highlightCode = useCallback((code: string) => {
        const lines = code.split('\n');
        const highlightedLines = lines.map((line, lineIndex) => {
            // Highlight class definitions
            line = line.replace(
                /\b(class)\s+([a-zA-Z_]\w*)/g,
                (match, classKeyword, className) => {
                    return `<span style="color: #FF00FF; font-weight: bold;">${classKeyword}</span> <span class="clickable-class" style="color: #00FFFF; font-weight: bold; cursor: pointer;" data-class-name="${className}" data-line-number="${lineIndex + 1}">${className}</span>`;
                }
            );

            // Highlight function calls (excluding built-in functions)
            return line.replace(/\b([a-zA-Z_]\w*)\s*\(/g, (match, funcName) => {
                if (builtInFunctions.has(funcName)) {
                    return match; // Return the original match without highlighting for built-in functions
                }
                return `<span style="color: #FFD700; font-weight: bold;">${funcName}</span>(`;
            });
        });

        setHighlightedContent(highlightedLines.join('\n'));
    }, []);

    const handleClassNameClick = useCallback((e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.classList.contains('clickable-class')) {
            const className = target.getAttribute('data-class-name');
            const lineNumber = parseInt(target.getAttribute('data-line-number') || '0', 10);
            if (className && lineNumber) {
                onClassNameClick(className, lineNumber);
            }
        }
    }, [onClassNameClick]);

    useEffect(() => {
        const editorElement = editorRef.current;
        if (editorElement) {
            editorElement.addEventListener('click', handleClassNameClick);
        }
        return () => {
            if (editorElement) {
                editorElement.removeEventListener('click', handleClassNameClick);
            }
        };
    }, [handleClassNameClick]);

    const handleContentChange = useCallback(() => {
        if (editorRef.current) {
            const newContent = editorRef.current.innerText;
            setContent(newContent);
            updateContentHeight(newContent);
            highlightCode(newContent);

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
    }, [onCodeChange, updateContentHeight, highlightCode]);

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
        if (editorRef.current) {
            const oldContent = editorRef.current.innerText;
            const contentLines = oldContent.split('\n');
            const newCodeLines = Array.isArray(newCode) ? newCode : [newCode];
            contentLines.splice(lineNumber - 1, 0, ...newCodeLines);
            const updatedContent = contentLines.join('\n');
            setContent(updatedContent);
            updateContentHeight(updatedContent);
            highlightCode(updatedContent);
            editorRef.current.innerHTML = highlightedContent;
        }
    }, [updateContentHeight, highlightCode]);

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
                    dangerouslySetInnerHTML={{ __html: highlightedContent }}
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