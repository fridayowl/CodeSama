import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

type Block1Data = {
    title: string;
    subline: string;
    emoji: string;
    subBlocks: { id: string; label: string; }[];
    onHandleClick: (nodeId: string, handleType: 'source' | 'target') => void;
};

const Block1 = ({ data, id }: NodeProps<Block1Data>) => {
    return (
        <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-stone-400">
            <div className="flex mb-2">
                <div className="rounded-full w-12 h-12 flex justify-center items-center bg-gray-100">
                    {data.emoji}
                </div>
                <div className="ml-2">
                    <div className="text-lg font-bold">{data.title}</div>
                    <div className="text-gray-500">{data.subline}</div>
                </div>
            </div>

            <div className="flex justify-between mt-2">
                {data.subBlocks.map((subBlock, index) => (
                    <div key={index} className="text-xs bg-gray-100 rounded p-1">
                        {subBlock.label}
                    </div>
                ))}
            </div>

            <Handle
                type="target"
                position={Position.Top}
                className="w-16 !bg-teal-500 cursor-pointer"
                onClick={() => data.onHandleClick(id, 'target')}
            />
            <Handle
                type="source"
                position={Position.Bottom}
                className="w-16 !bg-teal-500 cursor-pointer"
                onClick={() => data.onHandleClick(id, 'source')}
            />
        </div>
    );
};

export default memo(Block1);