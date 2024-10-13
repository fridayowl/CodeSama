import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

const SubBlock = ({ data }: NodeProps) => {
    return (
        <div className="px-2 py-1 shadow-md rounded-md bg-white border border-stone-300">
            <div className="flex items-center">
                <div className="rounded-full w-8 h-8 flex justify-center items-center bg-gray-100">
                    {data.emoji}
                </div>
                <div className="ml-2">
                    <div className="text-sm font-semibold">{data.label}</div>
                </div>
            </div>

            <Handle type="target" position={Position.Top} className="w-10 !bg-teal-500" />
            <Handle type="source" position={Position.Bottom} className="w-10 !bg-teal-500" />
        </div>
    );
};

export default memo(SubBlock);