import React, { useState, useCallback, useMemo } from 'react';
import { Folder, File, ChevronRight, ChevronDown, ChevronLeft, ChevronRight as ChevronRightExpand, Settings } from 'lucide-react';

export interface FileSystemItem {
    name: string;
    type: 'file' | 'folder';
    children?: FileSystemItem[];
}

interface DirectoryProps {
    items: FileSystemItem[];
    onFolderSelect: (folder: FileSystemItem[]) => void;
}

const commonFileTypes = [
    '.py', '.js', '.ts', '.tsx', '.jsx',
    '.html', '.css', '.scss', '.less',
    '.java', '.c', '.cpp', '.cs', '.go',
    '.rb', '.php', '.swift', '.kt', '.rs',
    '.sql', '.json', '.xml', '.yaml', '.md'
];

const DirectoryItem: React.FC<{ item: FileSystemItem; depth: number; visibleTypes: string[] }> = ({ item, depth, visibleTypes }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => {
        if (item.type === 'folder') {
            setIsOpen(!isOpen);
        }
    };

    if (item.type === 'file') {
        const extension = '.' + item.name.split('.').pop()?.toLowerCase();
        if (!visibleTypes.includes(extension)) {
            return null;
        }
    }

    return (
        <div>
            <div
                className="flex items-center cursor-pointer hover:bg-gray-100 py-1"
                style={{ paddingLeft: `${depth * 16}px` }}
                onClick={toggleOpen}
            >
                {item.type === 'folder' && (
                    isOpen ? <ChevronDown size={16} className="mr-1" /> : <ChevronRight size={16} className="mr-1" />
                )}
                {item.type === 'folder' ? (
                    <Folder size={16} className="mr-2 text-blue-500" />
                ) : (
                    <File size={16} className="mr-2 text-gray-500" />
                )}
                <span className="text-sm">{item.name}</span>
            </div>
            {item.type === 'folder' && isOpen && item.children && (
                <div>
                    {item.children.map((child, index) => (
                        <DirectoryItem key={index} item={child} depth={depth + 1} visibleTypes={visibleTypes} />
                    ))}
                </div>
            )}
        </div>
    );
};

const Directory: React.FC<DirectoryProps> = ({ items, onFolderSelect }) => {
    const [isMinimized, setIsMinimized] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [visibleTypes, setVisibleTypes] = useState<string[]>(commonFileTypes);

    const handleFolderSelect = useCallback(() => {
        const input = document.createElement('input');
        input.type = 'file';
        input.webkitdirectory = true;

        input.onchange = (e: Event) => {
            const target = e.target as HTMLInputElement;
            const files = target.files;
            if (files) {
                const fileSystem: FileSystemItem[] = [];
                for (let i = 0; i < files.length; i++) {
                    const file = files[i] as any;
                    const path = file.webkitRelativePath.split('/');
                    let currentLevel = fileSystem;

                    path.forEach((name: string, index: number) => {
                        if (index === path.length - 1) {
                            currentLevel.push({ name, type: 'file' });
                        } else {
                            let folder = currentLevel.find(item => item.name === name && item.type === 'folder');
                            if (!folder) {
                                folder = { name, type: 'folder', children: [] };
                                currentLevel.push(folder);
                            }
                            currentLevel = folder.children!;
                        }
                    });
                }
                onFolderSelect(fileSystem);
            }
        };

        input.click();
    }, [onFolderSelect]);

    const toggleFileType = (fileType: string) => {
        setVisibleTypes(prev =>
            prev.includes(fileType)
                ? prev.filter(type => type !== fileType)
                : [...prev, fileType]
        );
    };

    const selectAllFileTypes = () => {
        setVisibleTypes([...commonFileTypes]);
    };

    const clearAllFileTypes = () => {
        setVisibleTypes([]);
    };

    const filteredItems = useMemo(() => {
        const filterItems = (items: FileSystemItem[]): FileSystemItem[] => {
            return items.filter(item => {
                if (item.type === 'folder') {
                    const filteredChildren = item.children ? filterItems(item.children) : [];
                    return filteredChildren.length > 0;
                } else {
                    const extension = '.' + item.name.split('.').pop()?.toLowerCase();
                    return visibleTypes.includes(extension);
                }
            }).map(item => {
                if (item.type === 'folder' && item.children) {
                    return { ...item, children: filterItems(item.children) };
                }
                return item;
            });
        };
        return filterItems(items);
    }, [items, visibleTypes]);

    return (
        <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${isMinimized ? 'w-12' : 'w-64'}`}>
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
                {!isMinimized && <h2 className="text-lg font-semibold">Directory</h2>}
                <div className="flex">
                    {!isMinimized && (
                        <button
                            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                            className="p-1 rounded hover:bg-gray-100 mr-2"
                        >
                            <Settings size={20} />
                        </button>
                    )}
                    <button
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="p-1 rounded hover:bg-gray-100"
                    >
                        {isMinimized ? <ChevronRightExpand size={20} /> : <ChevronLeft size={20} />}
                    </button>
                </div>
            </div>
            {!isMinimized && (
                <div className="p-4">
                    <button
                        onClick={handleFolderSelect}
                        className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
                    >
                        Select Folder
                    </button>
                    {isSettingsOpen && (
                        <div className="mt-4 border-t pt-4">
                            <h3 className="font-semibold mb-2">File Types</h3>
                            <div className="flex justify-between mb-2">
                                <button
                                    onClick={selectAllFileTypes}
                                    className="text-sm text-blue-500 hover:text-blue-700"
                                >
                                    Select All
                                </button>
                                <button
                                    onClick={clearAllFileTypes}
                                    className="text-sm text-red-500 hover:text-red-700"
                                >
                                    Clear All
                                </button>
                            </div>
                            <div className="max-h-40 overflow-y-auto">
                                {commonFileTypes.map(fileType => (
                                    <label key={fileType} className="flex items-center mb-1">
                                        <input
                                            type="checkbox"
                                            checked={visibleTypes.includes(fileType)}
                                            onChange={() => toggleFileType(fileType)}
                                            className="mr-2"
                                        />
                                        <span className="text-sm">{fileType}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="mt-4 max-h-[calc(100vh-300px)] overflow-y-auto">
                        {filteredItems.map((item, index) => (
                            <DirectoryItem key={index} item={item} depth={0} visibleTypes={visibleTypes} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Directory;