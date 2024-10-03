import { BlockData, ConnectionData } from './fileProcessor';

export function identifyFunctionsAndConnections(fileContent: string, classes: BlockData[]): BlockData[] {
    const lines = fileContent.split('\n');
    const functions: BlockData[] = [];
    let currentFunction: BlockData | null = null;
    let currentClass: BlockData | null = null;
    let classIndentationLevel = 0;
    let indentationLevel = 0;

    const processLine = (line: string, index: number) => {
        const trimmedLine = line.trimLeft();
        const currentIndentation = line.length - trimmedLine.length;

        // Detect if we're inside a class
        if (trimmedLine.startsWith('class ')) {
            // If there's a class already, save its methods before starting a new class
            if (currentClass) {
                if (currentFunction) {
                    functions.push(currentFunction);
                    currentFunction = null;
                }
                currentClass = null;
                classIndentationLevel = 0;
            }

            // Match class name
            const classNameMatch = trimmedLine.match(/class\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*:/);
            const className = classNameMatch ? classNameMatch[1] : 'UnknownClass';

            currentClass = {
                id: `${className}Class`,
                type: 'class',
                name: className,
                location: 'Uploaded file',
                author: 'File author',
                fileType: 'Python',
                code: line,
                x: 1200,
                y: 100 + functions.length * 100,
                connections: []
            };

            classIndentationLevel = currentIndentation;
        }

        // Detect method definition inside the current class
        if (currentClass && trimmedLine.startsWith('def ') && currentIndentation > classIndentationLevel) {
            if (currentFunction) {
                functions.push(currentFunction);
            }

            const functionNameMatch = trimmedLine.match(/def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/);
            const functionName = functionNameMatch ? functionNameMatch[1] : 'Unknown';

            currentFunction = {
                id: `${functionName}Function`,
                type: 'class_function',
                name: functionName,
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
            // Continuation of the function definition
            if (currentIndentation > indentationLevel || trimmedLine === '') {
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

    // If a function is still open, close it
    if (currentFunction) {
        functions.push(currentFunction);
    }

    // Connect classes to their methods
    classes.forEach(classBlock => {
        const classFunctions = functions.filter(fn => fn.code.includes(`def ${fn.name}(self`));
        classBlock.connections = classFunctions.map(fn => ({
            to: fn.id,
            type: 'class_contains_functions',
            fromConnector: 'method',
            toConnector: 'input'
        }));
    });

    return functions;
}
