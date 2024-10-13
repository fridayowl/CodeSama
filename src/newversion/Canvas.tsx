import React, { useCallback, useState } from 'react';
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    BackgroundVariant,
    useNodesState,
    useEdgesState,
    ReactFlowProps,
    addEdge,
    Connection,
    Edge,
    Node,
    useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';

import Block1 from './Block1';
import SubBlock from './SubBlock';

const nodeTypes = {
    block1: Block1,
    subBlock: SubBlock,
};

type NodeData = {
    title?: string;
    subline?: string;
    emoji: string;
    subBlocks?: { id: string; label: string; }[];
    label?: string;
};

const initialNodes: Node<NodeData>[] = [
    {
        id: '1',
        type: 'block1',
        position: { x: 0, y: 0 },
        data: {
            title: 'Block 1',
            subline: 'This is a custom block',
            emoji: '🔥',
            subBlocks: [
                { id: 'sub1', label: 'Sub-block 1' },
                { id: 'sub2', label: 'Sub-block 2' },
            ]
        },
    },
    {
        id: '2',
        type: 'block1',
        position: { x: 300, y: 200 },
        data: {
            title: 'Block 2',
            subline: 'Another custom block',
            emoji: '🚀',
            subBlocks: [
                { id: 'sub3', label: 'Sub-block 3' },
                { id: 'sub4', label: 'Sub-block 4' },
            ]
        },
    },
    {
        id: 'sub1',
        type: 'subBlock',
        position: { x: -150, y: 200 },
        data: { label: 'Sub-block 1', emoji: '📌' },
    },
    {
        id: 'sub2',
        type: 'subBlock',
        position: { x: 150, y: 200 },
        data: { label: 'Sub-block 2', emoji: '🔗' },
    },
];

const initialEdges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e1-sub1', source: '1', target: 'sub1' },
    { id: 'e1-sub2', source: '1', target: 'sub2' },
];

const proOptions: ReactFlowProps['proOptions'] = {
    hideAttribution: true,
};

const ReactFlowApp: React.FC = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [hiddenNodes, setHiddenNodes] = useState<Set<string>>(new Set());

    const { getNode, getEdges } = useReactFlow();

    const onConnect = useCallback(
        (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    const toggleNodeVisibility = (nodeId: string, visible: boolean) => {
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === nodeId) {
                    return { ...node, hidden: !visible };
                }
                return node;
            })
        );
    };

    const onHandleClick = useCallback((nodeId: string, handleType: 'source' | 'target') => {
        const connectedEdges = getEdges().filter(edge =>
            (handleType === 'source' && edge.source === nodeId) ||
            (handleType === 'target' && edge.target === nodeId)
        );

        const connectedNodeIds = connectedEdges.map(edge =>
            handleType === 'source' ? edge.target : edge.source
        );

        const newHiddenNodes = new Set(hiddenNodes);

        connectedNodeIds.forEach(id => {
            if (newHiddenNodes.has(id)) {
                newHiddenNodes.delete(id);
                toggleNodeVisibility(id, true);
            } else {
                newHiddenNodes.add(id);
                toggleNodeVisibility(id, false);
            }
        });

        setHiddenNodes(newHiddenNodes);
    }, [getEdges, hiddenNodes]);

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                proOptions={proOptions}
                fitView
            >
                <Controls position="bottom-right" />
                <MiniMap position="bottom-left" />
                <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            </ReactFlow>
        </div>
    );
};

export default ReactFlowApp;