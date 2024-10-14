import { identifyClasses } from './class_Identifier';
import { identifyFunctionsAndConnections } from './class_functions_Identifier';
import { identifyCodeBlocks } from './standalone_codeBlockIdentifier';
import { identifyClassStandaloneCode } from './class_standalone_Identifier';
import { identifyStandaloneFunctions } from './standalone_codeFunctionIdentifier';

export interface BlockData {
    id: string;
    type: 'class' | 'class_function' | 'code' | 'class_standalone' | 'standalone_function';
    name: string;
    location: string;
    author: string;
    fileType: string;
    code: string;
    x: number;
    y: number;
    connections: ConnectionData[];
    lineNumber: number;
    parentClass?: string; // Add this line
}

export interface ConnectionData {
    id: string;
    to: string;
    type: 'inherits' | 'composes' | 'class_contains_functions' | 'class_contains_standalone' | 'idecontainsclass' | 'idecontainsstandalonecode';
    fromConnector: string;
    toConnector: string;
}

export async function generateJsonFromPythonFile(fileContent: string, name: string): Promise<BlockData[]> {
    const classes = identifyClasses(fileContent, name);
    const functions = identifyFunctionsAndConnections(fileContent, classes, name);
    const standaloneCodeBlocks = identifyCodeBlocks(fileContent, name);
    const classStandaloneCode = identifyClassStandaloneCode(fileContent, classes);
    const standaloneFunctions = identifyStandaloneFunctions(fileContent, name);

    // Combine all blocks
    const allBlocks = [...classes, ...functions, ...standaloneCodeBlocks, ...classStandaloneCode, ...standaloneFunctions];

    // Sort blocks by line number
    allBlocks.sort((a, b) => a.lineNumber - b.lineNumber);

    // Assign x and y positions based on sorted order
    const VERTICAL_SPACING = 150;
    const HORIZONTAL_OFFSET = 650; // Increased to leave space for the IDE
    allBlocks.forEach((block, index) => {
        block.x = HORIZONTAL_OFFSET;
        block.y = 50 + index * VERTICAL_SPACING;
    });

    return allBlocks;
}