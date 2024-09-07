import { BlockData } from './fileProcessor';

export function identifyClasses(fileContent: string): BlockData[] {
    const lines = fileContent.split('\n');
    const classes: BlockData[] = [];
    let currentClass: BlockData | null = null;
    let classIndentationLevel = 0;

    const processLine = (line: string, index: number) => {
        const trimmedLine = line.trimLeft();
        const currentIndentation = line.length - trimmedLine.length;

        if (trimmedLine.startsWith('class ')) {
            if (currentClass) {
                classes.push(currentClass);
            }

            const name = trimmedLine.split(' ')[1].split('(')[0];

            currentClass = {
                id: `${name}Class`,
                type: 'class',
                name,
                location: 'Uploaded file',
                author: 'File author',
                fileType: 'Python',
                code: line,
                x: 100,
                y: 100 + classes.length * 100,
                connections: []
            };

            classIndentationLevel = currentIndentation;
        } else if (currentClass) {
            if (currentIndentation > classIndentationLevel || trimmedLine === '') {
                // This line is part of the current class
                currentClass.code += '\n' + line;
            } else {
                // Class definition has ended
                classes.push(currentClass);
                currentClass = null;
                classIndentationLevel = 0;
            }
        }
    };

    lines.forEach(processLine);

    if (currentClass) {
        classes.push(currentClass);
    }

    return classes;
}