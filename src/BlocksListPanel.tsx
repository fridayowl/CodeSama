import React, { useState, useMemo } from 'react';
import { X, Layers, Search, Filter, FileText } from 'lucide-react';
import { ExtendedBlockData } from './DesignCanvas';

interface BlocksListPanelProps {
    isOpen: boolean;
    onClose: () => void;
    blocks: ExtendedBlockData[];
    onBlockSelect: (blockId: string) => void;
    customization: any;
}

const BlocksListPanel: React.FC<BlocksListPanelProps> = ({ isOpen, onClose, blocks, onBlockSelect, customization }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<string>('all');

    const blockTypes = ['class', 'class_function', 'class_standalone', 'code', 'standalone_function'];

    const fileNames = useMemo(() => {
        const uniqueFiles = new Set(blocks.map(block => {
            const parts = block.id.split('.');
            return parts[0];
        }));
        return Array.from(uniqueFiles);
    }, [blocks]);

    const filteredBlocks = useMemo(() => {
        return blocks.filter(block =>
            (selectedType ? block.type === selectedType : true) &&
            (selectedFile !== 'all' ? block.id.startsWith(selectedFile) : true) &&
            (searchTerm ? block.id.toLowerCase().includes(searchTerm.toLowerCase()) : true)
        );
    }, [blocks, selectedType, selectedFile, searchTerm]);

    const blockCounts = useMemo(() => {
        return blockTypes.reduce((acc, type) => {
            acc[type] = blocks.filter(block => block.type === type).length;
            return acc;
        }, {} as Record<string, number>);
    }, [blocks]);

    const getBlockColor = (blockType: string) => {
        return customization.blocks[blockType]?.backgroundColor || '#ffffff';
    };

    if (!isOpen) return null;

    return (
        <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg z-50 overflow-y-auto">
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                        <Layers size={24} className="mr-2" />
                        Blocks
                    </h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 transition duration-200">
                        <X size={24} />
                    </button>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Block Counts</h3>
                    {blockTypes.map(type => (
                        <div key={type} className="flex justify-between items-center mb-1">
                            <span className="text-sm capitalize" style={{ color: getBlockColor(type) }}>{type.replace('_', ' ')}:</span>
                            <span className="text-sm font-semibold">{blockCounts[type]}</span>
                        </div>
                    ))}
                </div>

                <div className="mb-6">
                    <div className="flex items-center mb-2">
                        <Search size={20} className="text-gray-400 mr-2" />
                        <input
                            type="text"
                            placeholder="Search blocks..."
                            className="w-full p-2 border rounded"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center mb-2">
                        <Filter size={20} className="text-gray-400 mr-2" />
                        <select
                            className="w-full p-2 border rounded"
                            value={selectedType || ''}
                            onChange={(e) => setSelectedType(e.target.value || null)}
                        >
                            <option value="">All Types</option>
                            {blockTypes.map(type => (
                                <option key={type} value={type}>{type.replace('_', ' ')}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center">
                        <FileText size={20} className="text-gray-400 mr-2" />
                        <select
                            className="w-full p-2 border rounded"
                            value={selectedFile}
                            onChange={(e) => setSelectedFile(e.target.value)}
                        >
                            <option value="all">All Files</option>
                            {fileNames.map(file => (
                                <option key={file} value={file}>{file}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                    <h3 className="text-lg font-semibold mb-2">Blocks</h3>
                    <ul className="space-y-2">
                        {filteredBlocks.map(block => {
                            const blockName = block.id.split('.').pop() || block.id;
                            const fileName = block.id.split('.')[0];
                            return (
                                <li
                                    key={block.id}
                                    className="border p-2 rounded cursor-pointer hover:bg-gray-100 flex flex-col"
                                    onClick={() => onBlockSelect(block.id)}
                                    style={{
                                        borderLeftColor: getBlockColor(block.type),
                                        borderLeftWidth: '4px',
                                        backgroundColor: getBlockColor(block.type),
                                        color: customization.blocks[block.type]?.textColor || '#000000'
                                    }}
                                >
                                    <span className="font-medium truncate">{blockName}</span>
                                    <div className="flex justify-between items-center mt-1">
                                        <span className="text-xs">{block.type}</span>
                                        {selectedFile === 'all' && (
                                            <span className="text-xs">{fileName}</span>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default BlocksListPanel;