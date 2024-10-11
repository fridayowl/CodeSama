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
}

export interface ConnectionData {
    to: string;
    type: 'inherits' | 'composes' | 'uses' | 'class_contains_functions' | 'codeLink' | 'class_to_standalone';
    fromConnector: string;
    toConnector: string;
}

export async function generateJsonFromPythonFile(fileContent: string, name: string): Promise<BlockData[]> {
    const classes = identifyClasses(fileContent, name);
    const functions = identifyFunctionsAndConnections(fileContent, classes, name);
    const standaloneCodeBlocks = identifyCodeBlocks(fileContent, name);
    const classStandaloneCode = identifyClassStandaloneCode(fileContent, classes);
    const standaloneFunctions = identifyStandaloneFunctions(fileContent, name);

    // Combine class standalone code and standalone functions
    const combinedStandaloneBlocks = [...classStandaloneCode, ...standaloneFunctions];

    // Sort the combined blocks by line number
    combinedStandaloneBlocks.sort((a, b) => a.lineNumber - b.lineNumber);

    // Combine all blocks
    const allBlocks = [...classes, ...functions, ...standaloneCodeBlocks, ...combinedStandaloneBlocks];

    // Sort all blocks by line number
    allBlocks.sort((a, b) => a.lineNumber - b.lineNumber);

    return allBlocks;
}