import { BlockData } from './fileProcessor';

export function identifyCodeBlocks(fileContent: string, classes: BlockData[], functions: BlockData[]): BlockData[] {
    const lines = fileContent.split('\n');
    const codeBlocks: BlockData[] = [];
    let currentBlock: BlockData | null = null;
    let insideClassOrFunction = false;
    let classOrFunctionIndentation: number | null = null;

    // Helper function to determine the indentation level of a line
    const getIndentationLevel = (line: string): number => line.match(/^\s*/)?.[0]?.length || 0;

    lines.forEach((line, index) => {
        const trimmedLine = line.trim();
        const currentIndentation = getIndentationLevel(line);

        // Skip empty lines and comments
        if (!trimmedLine || trimmedLine.startsWith('#')) {
            // If we're in the middle of collecting a code block, finish it when we hit a comment or blank line
            if (currentBlock) {
                codeBlocks.push(currentBlock);
                currentBlock = null;
            }
            return;
        }

        // Check if the current line is starting a class or function
        if (trimmedLine.startsWith('class ') || trimmedLine.startsWith('def ')) {
            insideClassOrFunction = true;
            classOrFunctionIndentation = currentIndentation;

            // Close any existing standalone code block
            if (currentBlock) {
                codeBlocks.push(currentBlock);
                currentBlock = null;
            }

            return;
        }

        // Detect leaving the current class or function block based on indentation
        if (insideClassOrFunction && currentIndentation <= classOrFunctionIndentation!) {
            insideClassOrFunction = false;
            classOrFunctionIndentation = null;
        }

        // If we're not inside a class or function, this is standalone code
        if (!insideClassOrFunction) {
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
                    x: 400,
                    y: 100 + codeBlocks.length * 100,
                    connections: []
                };
            } else {
                // Continue adding to the current code block
                currentBlock.code += '\n' + line;
            }
        }
    });

    // After the loop, if we still have a current block, push it as the final block
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
