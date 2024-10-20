import React from 'react';
import { X } from 'lucide-react';
import KeyboardShortcuts from './KeyboardShortcuts';

interface KeyboardShortcutsPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

const KeyboardShortcutsPanel: React.FC<KeyboardShortcutsPanelProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const shortcutCategories = {
        Navigation: [
            { name: 'All Blocks', shortcut: KeyboardShortcuts.TRAVEL_ALL_BLOCKS },
            { name: 'Classes', shortcut: KeyboardShortcuts.TRAVEL_CLASSES },
            { name: 'Functions', shortcut: KeyboardShortcuts.TRAVEL_FUNCTIONS },
            { name: 'Code Blocks', shortcut: KeyboardShortcuts.TRAVEL_CODE_BLOCKS },
            { name: 'Next Block', shortcut: KeyboardShortcuts.NEXT },
            { name: 'Previous Block', shortcut: KeyboardShortcuts.PREVIOUS },
        ],
        Actions: [
            { name: 'Select Block', shortcut: KeyboardShortcuts.SELECT_BLOCK },
            { name: 'Toggle Block Visibility', shortcut: KeyboardShortcuts.TOGGLE_BLOCK_VISIBILITY },
        ],
        Zoom: [
            { name: 'Zoom In', shortcut: KeyboardShortcuts.ZOOM_IN },
            { name: 'Zoom Out', shortcut: KeyboardShortcuts.ZOOM_OUT },
            { name: 'Reset Zoom', shortcut: KeyboardShortcuts.RESET_ZOOM },
        ],
        'Canvas Navigation': [
            { name: 'Pan Up', shortcut: KeyboardShortcuts.PAN_UP },
            { name: 'Pan Down', shortcut: KeyboardShortcuts.PAN_DOWN },
            { name: 'Pan Left', shortcut: KeyboardShortcuts.PAN_LEFT },
            { name: 'Pan Right', shortcut: KeyboardShortcuts.PAN_RIGHT },
        ],
        Miscellaneous: [
            { name: 'Toggle Settings Panel', shortcut: KeyboardShortcuts.TOGGLE_SETTINGS_PANEL },
        ],
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-11/12 max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Keyboard Shortcuts</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 transition duration-200">
                        <X size={24} />
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(shortcutCategories).map(([category, shortcuts]) => (
                        <div key={category}>
                            <h3 className="font-semibold text-lg mb-2">{category}</h3>
                            <ul className="space-y-2">
                                {shortcuts.map((shortcut, index) => (
                                    <li key={index} className="flex justify-between">
                                        <span>{shortcut.name}</span>
                                        <kbd className="px-2 py-1 bg-gray-100 rounded">{shortcut.shortcut}</kbd>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default KeyboardShortcutsPanel;