import React from 'react';
import { X, Palette, GitBranch, Grid, Terminal, RefreshCw, Check } from 'lucide-react';
import customTemplates from './customTemplates';

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
            <span className="text-sm text-gray-600">{label}</span>
            <div className="flex items-center">
                <span className="text-xs text-gray-500 mr-2">
                    {customization?.[category]?.[type]?.[property] || '#ffffff'}
                </span>
                <input
                    type="color"
                    value={customization?.[category]?.[type]?.[property] || '#ffffff'}
                    onChange={(e) => handleColorChange(category, type, property, e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer"
                />
            </div>
        </div>
    );

    const renderConnectionSettings = (type: string, label: string) => {
        const connectionSettings = customization?.connections?.[type] || {};
        return (
            <div key={type} className="mb-4">
                <h4 className="font-medium mb-2 text-gray-700">{label}</h4>
                {renderColorPicker('connections', type, 'lineColor', 'Line Color')}
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Arrow Head</span>
                    <select
                        value={connectionSettings.arrowHead || 'arrow'}
                        onChange={(e) => handleColorChange('connections', type, 'arrowHead', e.target.value)}
                        className="p-1 border rounded text-sm"
                    >
                        <option value="arrow">Arrow</option>
                        <option value="triangle">Triangle</option>
                        <option value="diamond">Diamond</option>
                        <option value="circle">Circle</option>
                    </select>
                </div>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Line Style</span>
                    <select
                        value={connectionSettings.lineStyle || 'solid'}
                        onChange={(e) => handleColorChange('connections', type, 'lineStyle', e.target.value)}
                        className="p-1 border rounded text-sm"
                    >
                        <option value="solid">Solid</option>
                        <option value="dashed">Dashed</option>
                        <option value="dotted">Dotted</option>
                    </select>
                </div>
            </div>
        );
    };

    const renderSection = (title: string, icon: React.ReactNode, content: React.ReactNode) => (
        <div className="mb-6">
            <div className="flex items-center mb-3">
                {icon}
                <h3 className="font-semibold ml-2 text-gray-800">{title}</h3>
            </div>
            <div className="bg-gray-50 p-4 rounded">
                {content}
            </div>
        </div>
    );

    const renderTemplateCard = (template: any) => (
        <div
            key={template.name}
            className="border rounded-lg p-4 mb-4 cursor-pointer hover:shadow-md transition-shadow duration-200"
            onClick={() => onCustomizationChange(template)}
        >
            <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-gray-800">{template.name}</h4>
                {customization.name === template.name && (
                    <Check size={20} className="text-green-500" />
                )}
            </div>
            <div className="flex space-x-2 mb-2">
                <div className="w-8 h-8 rounded" style={{ backgroundColor: template.blocks.class.backgroundColor }} />
                <div className="w-8 h-8 rounded" style={{ backgroundColor: template.blocks.class_function.backgroundColor }} />
                <div className="w-8 h-8 rounded" style={{ backgroundColor: template.blocks.code.backgroundColor }} />
            </div>
            <div className="flex space-x-2">
                <div className="w-8 h-8 rounded" style={{ backgroundColor: template.canvas.backgroundColor }} />
                <div className="w-8 h-8 rounded" style={{ backgroundColor: template.ide.backgroundColor }} />
                <div className="w-8 h-1 self-center rounded" style={{ backgroundColor: template.connections.uses.lineColor }} />
            </div>
        </div>
    );

    return (
        <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg z-50 overflow-y-auto">
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 transition duration-200">
                        <X size={24} />
                    </button>
                </div>

                {renderSection("Templates", <Palette size={20} />, (
                    <div>
                        <p className="text-sm text-gray-600 mb-2">Choose a preset template:</p>
                        <div className="max-h-80 overflow-y-auto">
                            {customTemplates.map(renderTemplateCard)}
                        </div>
                        <button
                            className="mt-4 w-full p-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition duration-200 flex items-center justify-center"
                            onClick={() => onCustomizationChange(customTemplates[0])}
                        >
                            <RefreshCw size={16} className="mr-2" />
                            Reset to Default
                        </button>
                    </div>
                ))}

                {renderSection("Blocks", <Palette size={20} />, (
                    <>
                        <div className="mb-4">
                            <h4 className="font-medium mb-2 text-gray-700">Class Blocks</h4>
                            {renderColorPicker('blocks', 'class', 'backgroundColor', 'Background')}
                            {renderColorPicker('blocks', 'class', 'borderColor', 'Border')}
                            {renderColorPicker('blocks', 'class', 'textColor', 'Text')}
                        </div>
                        <div className="mb-4">
                            <h4 className="font-medium mb-2 text-gray-700">Class Function Blocks</h4>
                            {renderColorPicker('blocks', 'class_function', 'backgroundColor', 'Background')}
                            {renderColorPicker('blocks', 'class_function', 'borderColor', 'Border')}
                            {renderColorPicker('blocks', 'class_function', 'textColor', 'Text')}
                        </div>
                        <div className="mb-4">
                            <h4 className="font-medium mb-2 text-gray-700">Standalone Code Blocks</h4>
                            {renderColorPicker('blocks', 'code', 'backgroundColor', 'Background')}
                            {renderColorPicker('blocks', 'code', 'borderColor', 'Border')}
                            {renderColorPicker('blocks', 'code', 'textColor', 'Text')}
                        </div>
                    </>
                ))}

                {renderSection("Connections", <GitBranch size={20} />, (
                    <>
                        {renderConnectionSettings('uses', 'IDE To Blocks')}
                        {renderConnectionSettings('class_contains_functions', 'Class To Functions')}
                        {renderConnectionSettings('class_to_standalone', 'Class To Standalone')}
                    </>
                ))}

                {renderSection("Canvas", <Grid size={20} />, (
                    <>
                        {renderColorPicker('canvas', 'canvas', 'backgroundColor', 'Background')}
                        {renderColorPicker('canvas', 'canvas', 'gridColor', 'Grid Color')}
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Grid Spacing</span>
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
                                className="w-16 p-1 border rounded text-sm"
                            />
                        </div>
                    </>
                ))}

                {renderSection("IDE", <Terminal size={20} />, (
                    <>
                        {renderColorPicker('ide', 'ide', 'backgroundColor', 'Background')}
                        {renderColorPicker('ide', 'ide', 'textColor', 'Text')}
                        {renderColorPicker('ide', 'ide', 'lineNumbersColor', 'Line Numbers')}
                        {renderColorPicker('ide', 'ide', 'highlightColor', 'Highlight')}
                    </>
                ))}
            </div>
        </div>
    );
};

export default SettingsPanel;