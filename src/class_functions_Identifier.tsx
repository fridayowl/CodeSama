import { BlockData, ConnectionData } from './fileProcessor';

export function identifyFunctionsAndConnections(fileContent: string, classes: BlockData[], fileName: string): BlockData[] {
    const lines = fileContent.split('\n');
    const functions: BlockData[] = [];
    let currentFunction: BlockData | null = null;
    let currentClass: BlockData | null = null;
    let classIndentationLevel = 0;
    let indentationLevel = 0;

    const processLine = (line: string, index: number) => {
        const trimmedLine = line.trimLeft();
        const currentIndentation = line.length - trimmedLine.length;

        if (trimmedLine.startsWith('class ')) {
            if (currentClass) {
                if (currentFunction) {
                    functions.push(currentFunction);
                    currentFunction = null;
                }
                currentClass = null;
                classIndentationLevel = 0;
            }

            const classNameMatch = trimmedLine.match(/class\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*:/);
            const className = classNameMatch ? classNameMatch[1] : 'UnknownClass';

            
            currentClass = {
                id: `${fileName}.${className}`,
                type: 'class',
                name: className,
                location: 'Uploaded file',
                author: 'File author',
                fileType: 'Python',
                code: line,
                x: 1200,
                y: 100 + functions.length * 100,
                connections: [],
                lineNumber: index + 1
            };

            classIndentationLevel = currentIndentation;
        }

        if (currentClass && trimmedLine.startsWith('def ') && currentIndentation > classIndentationLevel) {
            if (currentFunction) {
                functions.push(currentFunction);
            }

            const functionNameMatch = trimmedLine.match(/def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/);
            const functionName = functionNameMatch ? functionNameMatch[1] : 'Unknown';
            //console.log("naming", `${fileName}.${currentClass.name}.${functionName}`)
            currentFunction = {
                id: `${fileName}.${currentClass.name}.${functionName}`,
                type: 'class_function', 
                name: functionName,
                location: 'Uploaded file',
                author: 'File author',
                fileType: 'Python',
                code: line,
                x: 1200,
                y: 100 + functions.length * 100,
                connections: [],
                lineNumber: index + 1,
                parentClass: `${fileName}.${currentClass.name}` // Add this line
            };

            indentationLevel = currentIndentation;
        } else if (currentFunction) {
            if (currentIndentation > indentationLevel || trimmedLine === '') {
                currentFunction.code += '\n' + line;
            } else {
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

    classes.forEach(classBlock => {
        const classFunctions = functions.filter(fn => fn.parentClass === classBlock.id);

        classBlock.connections = classFunctions.map(fn => {
            const connectionId = `${classBlock.id}.${fn.name}`;

            // Log the formatted connection ID
           console.log("naming",connectionId);

            return {
                id: connectionId,
                to: fn.id,
                type: 'class_contains_functions',
                fromConnector: 'method',
                toConnector: 'input'
            };
        });
    });


    return functions;
}