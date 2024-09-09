import { BlockData, ConnectionData } from './fileProcessor';

export function identifyFunctionsAndConnections(fileContent: string, classes: BlockData[]): BlockData[] {
    const lines = fileContent.split('\n');
    const functions: BlockData[] = [];
    let currentFunction: BlockData | null = null;
    let indentationLevel = 0;

    const processLine = (line: string, index: number) => {
        const trimmedLine = line.trimLeft();
        const currentIndentation = line.length - trimmedLine.length;

        if (trimmedLine.startsWith('def ')) {
            if (currentFunction) {
                functions.push(currentFunction);
            }

            // Fix: Use a regular expression to capture the full function name
            const functionNameMatch = trimmedLine.match(/def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/);
            const name = functionNameMatch ? functionNameMatch[1] : 'Unknown';
            currentFunction = {
                id: `${name}Function`,
                type: 'function',
                name,
                location: 'Uploaded file',
                author: 'File author',
                fileType: 'Python',
                code: line,
                x: 1200,
                y: 100 + functions.length * 100,
                connections: []
            };

            indentationLevel = currentIndentation;
        } else if (currentFunction) {
            if (currentIndentation > indentationLevel || trimmedLine === '') {
                // This line is part of the current function
                currentFunction.code += '\n' + line;
            } else {
                // Function has ended
                functions.push(currentFunction);
                currentFunction = null;
                indentationLevel = 0;
            }
        }
    };

    lines.forEach(processLine);

    if (currentFunction) {
        functions.push(currentFunction);
    }

    // Connect classes to their methods
    classes.forEach(classBlock => {
        const classFunctions = functions.filter(fn => fn.code.includes(`def ${fn.name}(self`));
        classBlock.connections = classFunctions.map(fn => ({
            to: fn.id,
            type: 'contains',
            fromConnector: 'method',
            toConnector: 'input'
        }));
    });

    return functions;
}