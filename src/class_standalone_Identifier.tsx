import { BlockData, ConnectionData } from './fileProcessor';

export function identifyClassStandaloneCode(fileContent: string, classes: BlockData[]): BlockData[] {
    const standaloneBlocks: BlockData[] = [];
    const fileLines = fileContent.split('\n');

    classes.forEach(classBlock => {
        let blockCount = 0;
        const classLines = classBlock.code.split('\n');
        let currentBlock: string[] = [];
        let isInsideFunction = false;
        let classIndentation = -1;
        let functionIndentation = -1;
        let blockStartLineNumber = 0;

        const classStartLineNumber = fileLines.findIndex(line => line.trim().startsWith(`class ${classBlock.name}`)) + 1;

        const createBlock = (code: string[], startLineNumber: number): BlockData | null => {
            if (code.length > 0) {
                blockCount++;
                const connection: ConnectionData = {
                    id: `${classBlock.id}.standalone_${blockCount}`,
                    to: classBlock.id,
                    type: 'class_contains_standalone',
                    fromConnector: 'method',
                    toConnector: 'input'
                };
                return {
                    id: `${classBlock.id}.standalone_${blockCount}`,
                    type: 'class_standalone',
                    name: `${classBlock.name} Standalone Block ${blockCount}`,
                    location: classBlock.location,
                    author: classBlock.author,
                    fileType: classBlock.fileType,
                    code: code.join('\n'),
                    x: classBlock.x + 50,
                    y: classBlock.y + blockCount * 50,
                    connections: [connection],
                    lineNumber: startLineNumber,
                    parentClass: classBlock.id
                };
            }
            return null;
        };

        const processLine = (line: string, index: number) => {
            const trimmedLine = line.trim();
            const indentation = line.length - trimmedLine.length;
            const actualLineNumber = classStartLineNumber + index;

            if (index === 0) {
                classIndentation = indentation;
                return;
            }

            if (trimmedLine.startsWith('def ') && indentation > classIndentation) {
                if (currentBlock.length > 0) {
                    const block = createBlock(currentBlock, blockStartLineNumber);
                    if (block) standaloneBlocks.push(block);
                    currentBlock = [];
                }
                isInsideFunction = true;
                functionIndentation = indentation;
                blockStartLineNumber = actualLineNumber;
            } else if (isInsideFunction && indentation <= functionIndentation) {
                isInsideFunction = false;
                functionIndentation = -1;
            }

            if (!isInsideFunction && indentation > classIndentation) {
                if (currentBlock.length === 0) {
                    blockStartLineNumber = actualLineNumber;
                }
                currentBlock.push(line);
            } else if (currentBlock.length > 0) {
                const block = createBlock(currentBlock, blockStartLineNumber);
                if (block) standaloneBlocks.push(block);
                currentBlock = [];
            }
        };

        classLines.forEach(processLine);

        if (currentBlock.length > 0) {
            const finalBlock = createBlock(currentBlock, blockStartLineNumber);
            if (finalBlock) standaloneBlocks.push(finalBlock);
        }
    });

    return standaloneBlocks;
}