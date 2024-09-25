import React from 'react';
import { X } from 'lucide-react';

interface SettingsPanelProps {
    isOpen: boolean;
    onClose: () => void;
    customization: any;
    onCustomizationChange: (newCustomization: any) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose, customization, onCustomizationChange }) => {
    if (!isOpen) return null;

    const handleColorChange = (category: string, type: string, property: string, value: string) => {
        const newCustomization = {
            ...customization,
            [category]: {
                ...customization[category],
                [type]: {
                    ...customization[category][type],
                    [property]: value
                }
            }
        };
        onCustomizationChange(newCustomization);
    };

    const renderColorPicker = (category: string, type: string, property: string, label: string) => (
        <div className="flex items-center justify-between mb-2">
            <span>{label}</span>
            <input
                type="color"
                value={customization?.[category]?.[type]?.[property] || '#ffffff'}  // Provide a default value if undefined
                onChange={(e) => handleColorChange(category, type, property, e.target.value)}
                className="w-8 h-8 rounded cursor-pointer"
            />
        </div>
    );

    return (
        <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg z-50 overflow-y-auto">
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Settings</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
                        <X size={24} />
                    </button>
                </div>

                <h3 className="font-semibold mb-2">Blocks</h3>
                {['class', 'function', 'code'].map(type => (
                    <div key={type} className="mb-4">
                        <h4 className="font-medium capitalize mb-2">{type}</h4>
                        {renderColorPicker('blocks', type, 'backgroundColor', 'Background')}
                        {renderColorPicker('blocks', type, 'borderColor', 'Border')}
                        {renderColorPicker('blocks', type, 'textColor', 'Text')}
                    </div>
                ))}

                <h3 className="font-semibold mb-2 mt-4">Connections</h3>
                {['inherits', 'composes', 'uses', 'contains', 'codeLink'].map(type => (
                    <div key={type} className="mb-4">
                        <h4 className="font-medium capitalize mb-2">{type}</h4>
                        {renderColorPicker('connections', type, 'lineColor', 'Line Color')}
                    </div>
                ))}

                <h3 className="font-semibold mb-2 mt-4">Canvas</h3>
                {renderColorPicker('canvas', 'canvas', 'backgroundColor', 'Background')}
                {renderColorPicker('canvas', 'canvas', 'gridColor', 'Grid Color')}
                {/* Skip non-color properties like gridSpacing */}

                <h3 className="font-semibold mb-2 mt-4">IDE</h3>
                {renderColorPicker('ide', 'ide', 'backgroundColor', 'Background')}
                {renderColorPicker('ide', 'ide', 'textColor', 'Text')}
                {renderColorPicker('ide', 'ide', 'lineNumbersColor', 'Line Numbers')}
                {renderColorPicker('ide', 'ide', 'highlightColor', 'Highlight')}
            </div>
        </div>
    );
};

export default SettingsPanel;
