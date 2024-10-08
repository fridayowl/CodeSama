import React, { useState } from 'react';
import { Eye, EyeOff, Edit, Save, Info, FileText, TestTube } from 'lucide-react';

interface BlockProps {
    id: string;
    type: 'class' | 'class_function' | 'code' | 'class_standalone' | 'standalone_function';
    name: string;
    location: string;
    author: string;
    fileType: string;
    code: string;
    onVisibilityChange: (id: string, isVisible: boolean) => void;
    onCodeChange?: (id: string, newCode: string) => void;
    customization: any;
}

const Block: React.FC<BlockProps> = ({
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
    const [isDocumentationVisible, setIsDocumentationVisible] = useState(false);
    const [isTestingVisible, setIsTestingVisible] = useState(false);
    const [currentCode, setCurrentCode] = useState(code);

    const blockStyle = customization?.blocks?.[type] || {};

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
        if (!isVisible) {
            setIsVisible(true);
            onVisibilityChange(id, true);
        }
    };

    const toggleDetails = () => {
        setIsDetailsVisible(!isDetailsVisible);
    };

    const toggleDocumentation = () => {
        setIsDocumentationVisible(!isDocumentationVisible);
    };

    const toggleTesting = () => {
        setIsTestingVisible(!isTestingVisible);
    };

    return (
        <div className="w-full max-w-3xl rounded-lg shadow-md overflow-hidden"
            style={{
                backgroundColor: blockStyle.backgroundColor || '#ffffff',
                borderColor: blockStyle.borderColor || '#000000',
                color: blockStyle.textColor || '#000000',
                borderWidth: '2px',
                borderStyle: 'solid',
                paddingLeft: '20px' // Add this line for 20px left padding
            }}>
            <div className="p-2 flex justify-between items-center" style={{ backgroundColor: blockStyle.headerColor || '#f0f0f0', paddingLeft: '20px' }}>
                <h3 className="font-bold text-lg">{name}</h3>
                <div className="flex space-x-2">
                    <button
                        onClick={toggleDetails}
                        className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                        title="Details"
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
                        onClick={toggleDocumentation}
                        className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                        title="Documentation"
                    >
                        <FileText size={16} />
                    </button>
                    <button
                        onClick={toggleTesting}
                        className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                        title="Testing"
                    >
                        <TestTube size={16} />
                    </button>
                </div>
            </div>
            {isDetailsVisible && (
                <div className="px-4 py-2 bg-gray-100" style={{ paddingLeft: '20px' }}>
                    <p className="text-sm">Type: {type}</p>
                    <p className="text-sm">File: {fileType}</p>
                    <p className="text-sm">Location: {location}</p>
                    <p className="text-sm">Author: {author}</p>
                </div>
            )}
            {isVisible && (
                <div className="p-4" style={{ paddingLeft: '20px' }}>
                    {isEditing ? (
                        <>
                            <textarea
                                value={currentCode}
                                onChange={handleCodeChange}
                                className="w-full p-2 border rounded font-mono text-sm"
                                rows={currentCode.split('\n').length}
                                style={{
                                    backgroundColor: customization.ide?.backgroundColor || '#f0f0f0',
                                    color: customization.ide?.textColor || '#000000',
                                    paddingLeft: '20px' // Add padding here
                                }}
                            />
                            <button
                                // onClick={handleSave}
                                className="mt-2 px-4 py-2 text-white rounded hover:bg-opacity-80"
                                style={{ backgroundColor: customization.ide?.highlightColor || '#3b82f6' }}
                            >
                                Save
                            </button>
                        </>
                    ) : (
                        <pre className="w-full p-2 border rounded overflow-auto font-mono text-sm"
                            style={{
                                backgroundColor: customization.ide?.backgroundColor || '#f0f0f0',
                                color: customization.ide?.textColor || '#000000',
                                paddingLeft: '20px' // Add padding here
                            }}>
                            {currentCode}
                        </pre>
                    )}
                </div>
            )}
            {isDocumentationVisible && (
                <div className="p-4 bg-gray-50 border-t" style={{ paddingLeft: '20px' }}>
                    <h4 className="font-semibold mb-2">Documentation</h4>
                    <p className="text-sm">This is a sample documentation for the {name} {type}. Replace this with actual documentation.</p>
                </div>
            )}
            {isTestingVisible && (
                <div className="p-4 bg-gray-50 border-t" style={{ paddingLeft: '20px' }}>
                    <h4 className="font-semibold mb-2">Testing</h4>
                    <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                        Run Tests
                    </button>
                    <p className="mt-2 text-sm">Click the button above to run tests for this {type}.</p>
                </div>
            )}
        </div>
    );

};

export const ClassBlock: React.FC<BlockProps> = (props) => <Block {...props} />;
export const FunctionBlock: React.FC<BlockProps> = (props) => <Block {...props} />;
export const ClassStandaloneBlock: React.FC<BlockProps> = (props) => <Block {...props} />;
export const CodeBlock: React.FC<BlockProps> = (props) => <Block {...props} />;
export const StandaloneFunctionBlock: React.FC<BlockProps> = (props) => <Block {...props} />;

export default {
    ClassBlock,
    FunctionBlock,
    ClassStandaloneBlock,
    CodeBlock,
    StandaloneFunctionBlock
};