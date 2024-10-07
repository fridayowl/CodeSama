import { BlockData } from './fileProcessor';

export function identifyStandaloneFunctions(fileContent: string): BlockData[] {
    const lines = fileContent.split('\n');
    const functionBlocks: BlockData[] = [];
    let currentFunction: string[] = [];
    let insideClass = false;
    let insideFunction = false;
    let classIndentation: number | null = null;
    let functionIndentation: number | null = null;
    let functionName: string = '';

    const getIndentationLevel = (line: string): number => line.match(/^\s*/)?.[0]?.length || 0;

    const createFunctionBlock = (code: string[], name: string): BlockData => ({
        id: `StandaloneFunction_${functionBlocks.length + 1}`,
        type: 'standalone_function',
        name: name,
        location: 'Uploaded file',
        author: 'File author',
        fileType: 'Python',
        code: code.join('\n'),
        x: 600,
        y: 100 + functionBlocks.length * 150,
        connections: []
    });

    lines.forEach((line, index) => {
        const trimmedLine = line.trim();
        const currentIndentation = getIndentationLevel(line);

        if (!trimmedLine || trimmedLine.startsWith('#')) {
            if (insideFunction && !insideClass) {
                currentFunction.push(line);
            }
            return;
        }

        if (trimmedLine.startsWith('class ')) {
            insideClass = true;
            classIndentation = currentIndentation;
            return;
        }

        if (insideClass && currentIndentation <= classIndentation!) {
            insideClass = false;
            classIndentation = null;
        }

        if (trimmedLine.startsWith('def ') && !insideClass) {
            if (insideFunction) {
                functionBlocks.push(createFunctionBlock(currentFunction, functionName));
                currentFunction = [];
            }
            insideFunction = true;
            functionIndentation = currentIndentation;
            functionName = trimmedLine.split('def ')[1].split('(')[0].trim();
            currentFunction.push(line);
            return;
        }

        if (insideFunction && !insideClass) {
            if (currentIndentation > functionIndentation!) {
                currentFunction.push(line);
            } else {
                functionBlocks.push(createFunctionBlock(currentFunction, functionName));
                currentFunction = [];
                insideFunction = false;
                functionIndentation = null;
            }
        }
    });

    if (currentFunction.length > 0) {
        functionBlocks.push(createFunctionBlock(currentFunction, functionName));
    }

    return functionBlocks;
}