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
                    ...customization[category]?.[type],
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
                value={customization?.[category]?.[type]?.[property] || '#ffffff'}
                onChange={(e) => handleColorChange(category, type, property, e.target.value)}
                className="w-8 h-8 rounded cursor-pointer"
            />
        </div>
    );

    const renderConnectionSettings = (type: string, label: string) => {
        const connectionSettings = customization?.connections?.[type] || {};
        return (
            <div key={type} className="mb-4">
                <h4 className="font-medium capitalize mb-2">{label}</h4>
                {renderColorPicker('connections', type, 'lineColor', 'Line Color')}
                <div className="flex items-center justify-between mb-2">
                    <span>Arrow Head</span>
                    <select
                        value={connectionSettings.arrowHead || 'arrow'}
                        onChange={(e) => handleColorChange('connections', type, 'arrowHead', e.target.value)}
                        className="p-1 border rounded"
                    >
                        <option value="arrow">Arrow</option>
                        <option value="triangle">Triangle</option>
                        <option value="diamond">Diamond</option>
                        <option value="circle">Circle</option>
                    </select>
                </div>
                <div className="flex items-center justify-between mb-2">
                    <span>Line Style</span>
                    <select
                        value={connectionSettings.lineStyle || 'solid'}
                        onChange={(e) => handleColorChange('connections', type, 'lineStyle', e.target.value)}
                        className="p-1 border rounded"
                    >
                        <option value="solid">Solid</option>
                        <option value="dashed">Dashed</option>
                        <option value="dotted">Dotted</option>
                    </select>
                </div>
            </div>
        );
    };

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
                {['class', 'class_function', 'code', 'class_standalone'].map(type => (
                    <div key={type} className="mb-4">
                        <h4 className="font-medium capitalize mb-2">
                            {type === 'class_function' ? 'Function' :
                                type === 'class_standalone' ? 'Standalone Class' : type}
                        </h4>
                        {renderColorPicker('blocks', type, 'backgroundColor', 'Background')}
                        {renderColorPicker('blocks', type, 'borderColor', 'Border')}
                        {renderColorPicker('blocks', type, 'textColor', 'Text')}
                    </div>
                ))}

                <h3 className="font-semibold mb-2 mt-4">Connections</h3>
                {renderConnectionSettings('inherits', 'Inherits')}
                {renderConnectionSettings('composes', 'Composes')}
                {renderConnectionSettings('uses', 'Uses')}
                {renderConnectionSettings('class_contains_functions', 'Class Contains Functions')}
                {renderConnectionSettings('codeLink', 'Code Link')}
                {renderConnectionSettings('class_to_standalone', 'Class to Standalone')}

                <h3 className="font-semibold mb-2 mt-4">Canvas</h3>
                {renderColorPicker('canvas', 'canvas', 'backgroundColor', 'Background')}
                {renderColorPicker('canvas', 'canvas', 'gridColor', 'Grid Color')}

                <div className="flex items-center justify-between mb-2">
                    <span>Grid Spacing</span>
                    <input
                        type="number"
                        value={customization.canvas?.gridSpacing || 20}
                        onChange={(e) => {
                            const newCustomization = {
                                ...customization,
                                canvas: {
                                    ...customization.canvas,
                                    gridSpacing: parseInt(e.target.value, 10)
                                }
                            };
                            onCustomizationChange(newCustomization);
                        }}
                        className="w-16 p-1 border rounded"
                    />
                </div>

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