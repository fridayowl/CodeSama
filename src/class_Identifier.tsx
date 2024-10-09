import { BlockData } from './fileProcessor';

export function identifyClasses(fileContent: string, fileName: string): BlockData[] {
    const lines = fileContent.split('\n');
    const classes: BlockData[] = [];
    let currentClass: BlockData | null = null;
    let classIndentationLevel = 0;

    const processLine = (line: string, index: number) => {
        // Capture the line number before trimming any whitespace
        const originalLine = line;  // Keep the original line with its indentation
        const trimmedLine = line.trimLeft();  // Trim the left side only for detecting class

        const currentIndentation = line.length - trimmedLine.length;

        // Detect if the line is a class definition
        if (trimmedLine.startsWith('class ')) {
            // If there's an existing class, push it to the array before starting a new one
            if (currentClass) {
                classes.push(currentClass);
            }

            const name = trimmedLine.split(' ')[1].split('(')[0];  // Extract class name

            currentClass = {
                id: `${fileName}.${name}`,
                type: 'class',
                name,
                location: 'Uploaded file',
                author: 'File author',
                fileType: 'Python',
                code: originalLine,  // Use the original line here to keep indentation
                x: 800,
                y: 200 + classes.length * 100,
                connections: [],
                lineNumber: index + 1  // Capture the line number before any trimming
            };

            classIndentationLevel = currentIndentation;
        } else if (currentClass) {
            // Append additional lines to the current class code, if they are part of the class
            if (currentIndentation > classIndentationLevel || trimmedLine === '') {
                currentClass.code += '\n' + originalLine;  // Use the original line here
            } else {
                // Class definition has ended, push the class and reset currentClass
                classes.push(currentClass);
                currentClass = null;
                classIndentationLevel = 0;
            }
        }
    };

    // Process each line of the file
    lines.forEach(processLine);

    // If there's still an open class, push it to the classes array
    if (currentClass) {
        classes.push(currentClass);
    }

    return classes;
}
