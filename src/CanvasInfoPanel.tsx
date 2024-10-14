import React, { useState, useMemo } from 'react';
import { X, Search, Filter } from 'lucide-react';
import { ExtendedBlockData } from './DesignCanvas';

interface CanvasInfoPanelProps {
    isOpen: boolean;
    onClose: () => void;
    blocks: ExtendedBlockData[];
    onBlockSelect: (blockId: string) => void;
}

const CanvasInfoPanel: React.FC<CanvasInfoPanelProps> = ({ isOpen, onClose, blocks, onBlockSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState<string | null>(null);

    const blockTypes = ['class', 'class_function', 'class_standalone', 'code', 'standalone_function'];

    const filteredBlocks = useMemo(() => {
        return blocks.filter(block =>
            (selectedType ? block.type === selectedType : true) &&
            (searchTerm ?
                block.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                block.name.toLowerCase().includes(searchTerm.toLowerCase())
                : true)
        );
    }, [blocks, selectedType, searchTerm]);

    const blockCounts = useMemo(() => {
        return blockTypes.reduce((acc, type) => {
            acc[type] = blocks.filter(block => block.type === type).length;
            return acc;
        }, {} as Record<string, number>);
    }, [blocks]);

    if (!isOpen) return null;

    return (
        <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg z-50 overflow-y-auto">
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Canvas Information</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 transition duration-200">
                        <X size={24} />
                    </button>
                </div>

                {/* ... (keep existing code for block counts, search, and type filter) ... */}

                <div>
                    <h3 className="text-lg font-semibold mb-2">Blocks</h3>
                    <ul className="space-y-2">
                        {filteredBlocks.map(block => (
                            <li
                                key={block.id}
                                className="border p-2 rounded cursor-pointer hover:bg-gray-100"
                                onClick={() => onBlockSelect(block.id)}
                            >
                                <h4 className="font-medium">{block.name}</h4>
                                <p className="text-sm text-gray-600">Type: {block.type}</p>
                                <p className="text-sm text-gray-600">ID: {block.id}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default CanvasInfoPanel;