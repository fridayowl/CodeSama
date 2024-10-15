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

    const TemplateCard: React.FC<{ template: any }> = ({ template }) => (
        <div
            className="w-32 h-48 bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-105"
            onClick={() => onCustomizationChange(template)}
        >
            <div className="h-1/2 p-2 flex flex-col justify-between" style={{ backgroundColor: template.canvas?.backgroundColor || '#ffffff' }}>
                <div className="flex justify-between">
                    <div className="w-6 h-6 rounded" style={{ backgroundColor: template.blocks?.class?.backgroundColor || '#cccccc' }} />
                    <div className="w-6 h-6 rounded" style={{ backgroundColor: template.blocks?.class_function?.backgroundColor || '#cccccc' }} />
                </div>
                <div className="w-full h-1 rounded" style={{ backgroundColor: template.connections?.inherits?.lineColor || '#000000' }} />
            </div>
            <div className="h-1/2 p-2 flex flex-col justify-between">
                <h3 className="font-bold text-sm leading-tight">{template.name || 'Unnamed Template'}</h3>
                <p className="text-xs text-gray-600">Click to apply</p>
            </div>
        </div>
    );

    const renderTemplates = () => (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {customTemplates.map((template, index) => (
                <TemplateCard key={index} template={template} />
            ))}
        </div>
    );

    const tabs = [
        { id: 'blocks', label: 'Blocks', icon: <Palette size={20} /> },
        { id: 'connections', label: 'Connections', icon: <GitBranch size={20} /> },
        { id: 'canvas', label: 'Canvas', icon: <Grid size={20} /> },
        { id: 'ide', label: 'IDE', icon: <Terminal size={20} /> },
        { id: 'templates', label: 'Templates', icon: <RefreshCw size={20} /> },
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-11/12 max-w-6xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Settings</h2>
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