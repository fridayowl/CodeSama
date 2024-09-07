import React, { useState, useEffect } from 'react';

interface PythonIDEProps {
    fileContent: string | null;
}

const PythonIDE: React.FC<PythonIDEProps> = ({ fileContent }) => {
    const [lines, setLines] = useState<string[]>([]);

    useEffect(() => {
        if (fileContent) {
            setLines(fileContent.split('\n'));
        }
    }, [fileContent]);

    return (
        <div className="w-full max-w-4xl mx-auto mt-6 bg-white shadow-md rounded-lg overflow-hidden">
            <div className="bg-gray-800 text-white py-4 px-6">
                <h2 className="text-xl font-semibold">Python IDE</h2>
            </div>
            <div className="p-6">
                <div className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                    <pre className="font-mono text-sm">
                        {lines.map((line, index) => (
                            <div key={index} className="flex">
                                <span className="w-12 text-gray-500 select-none">{index + 1}</span>
                                <span>{line}</span>
                            </div>
                        ))}
                    </pre>
                </div>
            </div>
        </div>
    );
};

export default PythonIDE;