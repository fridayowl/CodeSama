import { BlockData, ConnectionData } from './fileProcessor';

export function identifyClassStandaloneCode(fileContent: string, classes: BlockData[]): BlockData[] {
    const standaloneBlocks: BlockData[] = [];
    let blockCount = 0;

    classes.forEach(classBlock => {
        const classLines = classBlock.code.split('\n');
        let currentBlock: string[] = [];
        let isInsideFunction = false;
        let classIndentation = -1;
        let functionIndentation = -1;

        const createBlock = (code: string[]): BlockData | null => {
            if (code.length > 0) {
                blockCount++;
                const connection: ConnectionData = {
                    to: classBlock.id,
                    type: 'class_to_standalone',
                    fromConnector: 'output',
                    toConnector: 'input'
                };
                return {
                    id: `class_standalone_${blockCount}`,
                    type: 'class_standalone',
                    name: `${classBlock.name} Standalone Block ${blockCount}`,
                    location: classBlock.location,
                    author: classBlock.author,
                    fileType: classBlock.fileType,
                    code: code.join('\n'),
                    x: classBlock.x + 300,
                    y: classBlock.y + (standaloneBlocks.length % 3) * 150,
                    connections: [connection]
                };
            }
            return null;
        };

        const processLine = (line: string, index: number) => {
            const trimmedLine = line.trim();
            const indentation = line.length - trimmedLine.length;

            if (index === 0) {
                classIndentation = indentation;
                return;
            }

            if (trimmedLine.startsWith('def ') && indentation > classIndentation) {
                if (currentBlock.length > 0) {
                    const block = createBlock(currentBlock);
                    if (block) standaloneBlocks.push(block);
                    currentBlock = [];
                }
                isInsideFunction = true;
                functionIndentation = indentation;
            } else if (isInsideFunction && indentation <= functionIndentation) {
                isInsideFunction = false;
                functionIndentation = -1;
                if (trimmedLine !== '' && indentation > classIndentation) {
                    currentBlock.push(line);
                }
            } else if (!isInsideFunction && indentation > classIndentation) {
                if (trimmedLine !== '') {
                    currentBlock.push(line);
                } else if (currentBlock.length > 0) {
                    const block = createBlock(currentBlock);
                    if (block) standaloneBlocks.push(block);
                    currentBlock = [];
                }
            }
        };

        classLines.forEach(processLine);

        if (currentBlock.length > 0) {
            const finalBlock = createBlock(currentBlock);
            if (finalBlock) standaloneBlocks.push(finalBlock);
        }
    });

    return standaloneBlocks;
}