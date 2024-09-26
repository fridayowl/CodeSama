import { BlockData } from './fileProcessor';

export function identifyCodeBlocks(fileContent: string): BlockData[] {
    const lines = fileContent.split('\n');
    const codeBlocks: BlockData[] = [];
    let currentBlock: BlockData | null = null;
    let insideClass = false;
    let classIndentation: number | null = null;

    // Helper function to determine the indentation level of a line
    const getIndentationLevel = (line: string): number => line.match(/^\s*/)?.[0]?.length || 0;

    lines.forEach((line, index) => {
        const trimmedLine = line.trim();
        const currentIndentation = getIndentationLevel(line);

        // Skip empty lines and comments
        if (!trimmedLine || trimmedLine.startsWith('#')) {
            return;
        }

        // Check if the current line starts a class
        if (trimmedLine.startsWith('class ')) {
            insideClass = true;
            classIndentation = currentIndentation;
            // Close any existing standalone code block before entering a class
            if (currentBlock) {
                codeBlocks.push(currentBlock);
                currentBlock = null;
            }
            return;
        }

        // Detect leaving a class block based on indentation
        if (insideClass && currentIndentation <= classIndentation!) {
            insideClass = false;
            classIndentation = null;
        }

        // Only process standalone code (outside class)
        if (!insideClass) {
            if (!currentBlock) {
                // Start a new standalone code block
                currentBlock = {
                    id: `CodeBlock_${codeBlocks.length + 1}`,
                    type: 'code',
                    name: `Standalone Code ${codeBlocks.length + 1}`,
                    location: 'Uploaded file',
                    author: 'File author',
                    fileType: 'Python',
                    code: line,
                    x: 900,
                    y: 100 + codeBlocks.length * 100,
                    connections: []
                };
            } else {
                // Continue adding to the current code block
                currentBlock.code += '\n' + line;
            }
        }
    });

    // After the loop, push the last block if it exists
    if (currentBlock) {
        codeBlocks.push(currentBlock);
    }

    // Log the results
    if (codeBlocks.length > 0) {
        console.log("Standalone code blocks found:", codeBlocks);
    } else {
        console.log("No standalone code blocks found");
    }

    return codeBlocks;
}