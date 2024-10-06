import { identifyClasses } from './class_Identifier';
import { identifyFunctionsAndConnections } from './class_functions_Identifier';
import { identifyCodeBlocks } from './standalone_codeBlockIdentifier';
import { identifyClassStandaloneCode } from './class_standalone_Identifier';

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
    type: 'inherits' | 'composes' | 'uses' | 'class_contains_functions' | 'codeLink' | 'class_to_standalone';
    fromConnector: string;
    toConnector: string;
}

export async function generateJsonFromPythonFile(fileContent: string): Promise<BlockData[]> {
    const classes = identifyClasses(fileContent);
    const functions = identifyFunctionsAndConnections(fileContent, classes);
    const standaloneCodeBlocks = identifyCodeBlocks(fileContent);
    const ClassStandaloneCode = identifyClassStandaloneCode(fileContent,classes);
    console.log(ClassStandaloneCode)

    // Only include standalone classes if there are regular classes
    const finalBlocks = classes.length > 0
        ? [...classes, ...functions, ...standaloneCodeBlocks, ...ClassStandaloneCode]
        : [...classes, ...functions, ...standaloneCodeBlocks];

    return finalBlocks;
}