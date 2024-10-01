import { identifyClasses } from './class_Identifier';
import { identifyFunctionsAndConnections } from './class_functions_Identifier';
import { identifyCodeBlocks } from './standalone_codeBlockIdentifier';

export interface BlockData {
    id: string;
    type: 'class' | 'class_function' | 'code' | 'class_standalone';
    name: string;
    location: string;
    author: string;
    fileType: string;
    code: string;
    x: number;
    y: number;
    connections: ConnectionData[];
}

export interface ConnectionData {
    to: string;
    type: 'inherits' | 'composes' | 'uses' | 'contains';
    fromConnector: string;
    toConnector: string;
}

export async function generateJsonFromPythonFile(fileContent: string): Promise<BlockData[]> {
    const classes = identifyClasses(fileContent);
    const functions = identifyFunctionsAndConnections(fileContent, classes);
    const codeBlocks = identifyCodeBlocks(fileContent);

    return [...classes, ...functions, ...codeBlocks];
}