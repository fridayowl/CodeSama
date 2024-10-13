import { BlockData } from './fileProcessor';

export function identifyCodeBlocks(fileContent: string, fileName: string): BlockData[] {
    const lines = fileContent.split('\n');
    const codeBlocks: BlockData[] = [];
    let currentBlock: string[] = [];
    let insideClass = false;
    let insideFunction = false;
    let classIndentation: number | null = null;
    let functionIndentation: number | null = null;
    let blockStartLine = 1;

    const getIndentationLevel = (line: string): number => line.match(/^\s*/)?.[0]?.length || 0;

    const createBlock = (code: string[], blockIndex: number, startLine: number): BlockData => {
        const blockName = `Block_${blockIndex}`;
        return {
            id: `${fileName}.${blockName}`,
            type: 'code',
            name: blockName,
            location: 'Uploaded file',
            author: 'File author',
            fileType: 'Python',
            code: code.join('\n'),
            x: 900,
            y: 100 + codeBlocks.length * 100,
            connections: [],
            lineNumber: startLine
        };
    };

    lines.forEach((line, index) => {
        const trimmedLine = line.trim();
        const currentIndentation = getIndentationLevel(line);

        if (!trimmedLine || trimmedLine.startsWith('#')) {
            return;
        }

        if (trimmedLine.startsWith('class ')) {
            if (currentBlock.length > 0) {
                codeBlocks.push(createBlock(currentBlock, codeBlocks.length + 1, blockStartLine));
                currentBlock = [];
            }
            insideClass = true;
            classIndentation = currentIndentation;
            return;
        }

        if (insideClass && currentIndentation <= classIndentation!) {
            insideClass = false;
            classIndentation = null;
        }

        if (trimmedLine.startsWith('def ') && !insideClass) {
            if (currentBlock.length > 0) {
                codeBlocks.push(createBlock(currentBlock, codeBlocks.length + 1, blockStartLine));
                currentBlock = [];
            }
            insideFunction = true;
            functionIndentation = currentIndentation;
            blockStartLine = index + 1;
            return;
        }

        if (insideFunction && currentIndentation <= functionIndentation!) {
            insideFunction = false;
            functionIndentation = null;
        }

        if (!insideClass && !insideFunction) {
            if (currentBlock.length === 0) {
                blockStartLine = index + 1;
            }
            currentBlock.push(line);
        }
    });

    if (currentBlock.length > 0) {
        codeBlocks.push(createBlock(currentBlock, codeBlocks.length + 1, blockStartLine));
    }

    return codeBlocks;
}