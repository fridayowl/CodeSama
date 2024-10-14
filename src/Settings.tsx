import React, { useState } from 'react';
import { X, Palette, GitBranch, Grid, Terminal, RefreshCw } from 'lucide-react';
import customTemplates from './customTemplates';

interface SettingsPanelProps {
    isOpen: boolean;
    onClose: () => void;
    customization: any;
    onCustomizationChange: (newCustomization: any) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose, customization, onCustomizationChange }) => {
    const [activeTab, setActiveTab] = useState('blocks');

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

    const renderBlockSettings = () => {
        const blockTypes = ['class', 'class_function', 'code', 'class_standalone', 'standalone_function'];
        return blockTypes.map(type => (
            <div key={type} className="mb-4">
                <h4 className="font-medium mb-2 text-gray-700 capitalize">{type.replace('_', ' ')} Blocks</h4>
                {renderColorPicker('blocks', type, 'backgroundColor', 'Background')}
                {renderColorPicker('blocks', type, 'borderColor', 'Border')}
                {renderColorPicker('blocks', type, 'textColor', 'Text')}
                {renderColorPicker('blocks', type, 'headerColor', 'Header')}
            </div>
        ));
    };

    const renderConnectionSettings = () => {
        const connectionTypes = ['inherits', 'composes', 'class_contains_functions', 'class_contains_standalone', 'idecontainsclass', 'idecontainsstandalonecode'];
        return connectionTypes.map(type => (
            <div key={type} className="mb-4">
                <h4 className="font-medium mb-2 text-gray-700 capitalize">{type.replace('_', ' ')}</h4>
                {renderColorPicker('connections', type, 'lineColor', 'Line Color')}
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Arrow Head</span>
                    <select
                        value={customization.connections[type]?.arrowHead || 'arrow'}
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
                        value={customization.connections[type]?.lineStyle || 'solid'}
                        onChange={(e) => handleColorChange('connections', type, 'lineStyle', e.target.value)}
                        className="p-1 border rounded text-sm"
                    >
                        <option value="solid">Solid</option>
                        <option value="dashed">Dashed</option>
                        <option value="dotted">Dotted</option>
                    </select>
                </div>
            </div>
        ));
    };

    const renderCanvasSettings = () => (
        <>
            {renderColorPicker('canvas', 'canvas', 'backgroundColor', 'Background')}
            {renderColorPicker('canvas', 'canvas', 'gridColor', 'Grid Color')}
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Grid Spacing</span>
                <input
                    type="number"
                    value={customization.canvas?.gridSpacing || 20}
                    onChange={(e) => handleColorChange('canvas', 'canvas', 'gridSpacing', e.target.value)}
                    className="w-16 p-1 border rounded text-sm"
                />
            </div>
        </>
    );

    const renderIDESettings = () => (
        <>
            {renderColorPicker('ide', 'ide', 'backgroundColor', 'Background')}
            {renderColorPicker('ide', 'ide', 'textColor', 'Text')}
            {renderColorPicker('ide', 'ide', 'lineNumbersColor', 'Line Numbers')}
            {renderColorPicker('ide', 'ide', 'highlightColor', 'Highlight')}
        </>
    );

    const renderTemplates = () => (
        <>
            {customTemplates.map((template, index) => (
                <div
                    key={index}
                    className="border rounded-lg p-4 mb-4 cursor-pointer hover:shadow-md transition-shadow duration-200"
                    onClick={() => onCustomizationChange(template)}
                >
                    <h4 className="font-medium text-gray-800 mb-2">{template.name}</h4>
                    <div className="flex space-x-2">
                        <div className="w-8 h-8 rounded" style={{ backgroundColor: template.blocks.class.backgroundColor }} />
                        <div className="w-8 h-8 rounded" style={{ backgroundColor: template.blocks.class_function.backgroundColor }} />
                        <div className="w-8 h-8 rounded" style={{ backgroundColor: template.blocks.code.backgroundColor }} />
                    </div>
                </div>
            ))}
        </>
    );

    const tabs = [
        { id: 'blocks', label: 'Blocks', icon: <Palette size={20} /> },
        { id: 'connections', label: 'Connections', icon: <GitBranch size={20} /> },
        { id: 'canvas', label: 'Canvas', icon: <Grid size={20} /> },
        { id: 'ide', label: 'IDE', icon: <Terminal size={20} /> },
        { id: 'templates', label: 'Templates', icon: <RefreshCw size={20} /> },
    ];

    return (
        <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg z-50 overflow-y-auto">
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 transition duration-200">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex mb-6 border-b">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`flex items-center px-4 py-2 ${activeTab === tab.id ? 'border-b-2 border-blue-500' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.icon}
                            <span className="ml-2">{tab.label}</span>
                        </button>
                    ))}
                </div>

                <div className="bg-gray-50 p-4 rounded">
                    {activeTab === 'blocks' && renderBlockSettings()}
                    {activeTab === 'connections' && renderConnectionSettings()}
                    {activeTab === 'canvas' && renderCanvasSettings()}
                    {activeTab === 'ide' && renderIDESettings()}
                    {activeTab === 'templates' && renderTemplates()}
                </div>
            </div>
        </div>
    );
};

export default SettingsPanel;