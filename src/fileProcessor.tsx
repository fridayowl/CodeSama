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

export async function generateJsonFromPythonFile(fileContent: string): Promise<BlockData[]> {
    const lines = fileContent.split('\n');
    const blocks: BlockData[] = [];
    let currentBlock: BlockData | null = null;
    let indentationLevel = 0;

    const processLine = (line: string, index: number) => {
        const trimmedLine = line.trimLeft();
        const currentIndentation = line.length - trimmedLine.length;

        if (trimmedLine.startsWith('class ') || trimmedLine.startsWith('def ')) {
            if (currentBlock) {
                blocks.push(currentBlock);
            }

            const isClass = trimmedLine.startsWith('class ');
            const name = trimmedLine.split(' ')[1].split('(')[0];

            currentBlock = {
                id: `${name}${isClass ? 'Class' : 'Function'}`,
                type: isClass ? 'class' : 'function',
                name,
                location: 'Uploaded file',
                author: 'File author',
                fileType: 'Python',
                code: line,
                x: isClass ? 100 : 300,
                y: 100 + blocks.length * 100,
                connections: []
            };

            indentationLevel = currentIndentation;
        } else if (currentBlock) {
            if (currentIndentation > indentationLevel || trimmedLine.startsWith(' ') || trimmedLine === '') {
                currentBlock.code += '\n' + line;
            } else {
                blocks.push(currentBlock);
                currentBlock = null;
                indentationLevel = 0;
                processLine(line, index);
            }
        }
    };

    lines.forEach(processLine);

    if (currentBlock) {
        blocks.push(currentBlock);
    }

    // Connect classes to their functions
    const classes = blocks.filter(block => block.type === 'class');
    const functions = blocks.filter(block => block.type === 'function');

    classes.forEach(classBlock => {
        const classFunctions = functions.filter(fn => fn.code.includes(`def ${fn.name}(self`));
        classBlock.connections = classFunctions.map(fn => ({
            to: fn.id,
            type: 'contains',
            fromConnector: 'method',
            toConnector: 'input'
        }));
    });

    return blocks;
}