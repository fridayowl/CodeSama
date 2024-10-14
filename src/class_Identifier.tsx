import { BlockData } from './fileProcessor';

export function identifyClasses(fileContent: string, fileName: string): BlockData[] {
    const lines = fileContent.split('\n');
    const classes: BlockData[] = [];
    let currentClass: BlockData | null = null;
    let classIndentationLevel = 0;

    const processLine = (line: string, index: number) => {
        const originalLine = line;
        const trimmedLine = line.trimLeft();
        const currentIndentation = line.length - trimmedLine.length;

        if (trimmedLine.startsWith('class ')) {
            if (currentClass) {
                classes.push(currentClass);
            }

            const name = trimmedLine.split(' ')[1].split('(')[0];
            const cleanName = name.endsWith(':') ? name.slice(0, -1) : name;
            currentClass = {
                id: `${fileName}.${cleanName }`,
                type: 'class',
                name,
                location: 'Uploaded file',
                author: 'File author',
                fileType: 'Python',
                code: originalLine,
                x: 800,
                y: 200 + classes.length * 100,
                connections: [],
                lineNumber: index + 1
            };

            classIndentationLevel = currentIndentation;
        } else if (currentClass) {
            if (currentIndentation > classIndentationLevel || trimmedLine === '') {
                currentClass.code += '\n' + originalLine;
            } else {
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
