import { identifyClasses } from './classIdentifier';
import { identifyFunctionsAndConnections } from './functionIdentifier';

export async function generateJsonFromPythonFile(fileContent: string): Promise<BlockData[]> {
    const classes = identifyClasses(fileContent);
    const functions = identifyFunctionsAndConnections(fileContent, classes);

    return [...classes, ...functions];
}

export interface BlockData {
    id: string;
    type: 'class' | 'function';
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