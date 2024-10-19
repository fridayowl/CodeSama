export interface SyntaxError {
  line: number;
  message: string;
}

export function checkPythonSyntax(code: string): SyntaxError[] {
  const errors: SyntaxError[] = [];
  const lines = code.split('\n');
  let openBrackets = 0;
  let expectedIndentation = 0;
  let multilineString = false;
  let statementStartLine = 1;

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const trimmedLine = line.trim();
    const indentation = line.length - line.trimLeft().length;

    // Skip empty lines and comments
    if (trimmedLine === '' || trimmedLine.startsWith('#')) {
      return;
    }

    // Check for multi-line strings
    if (trimmedLine.includes('"""') || trimmedLine.includes("'''")) {
      multilineString = !multilineString;
      return;
    }

    if (multilineString) {
      return;
    }

    // Check indentation
    if (indentation !== expectedIndentation && openBrackets === 0) {
      errors.push({
        line: lineNumber,
        message: `Indentation error. Expected ${expectedIndentation} spaces, got ${indentation}.`
      });
    }

    // Update bracket count
    const openBracketsInLine = (trimmedLine.match(/[\(\[\{]/g) || []).length;
    const closeBracketsInLine = (trimmedLine.match(/[\)\]\}]/g) || []).length;
    openBrackets += openBracketsInLine - closeBracketsInLine;

    // Check for unmatched brackets at the end of each statement
    if (openBrackets < 0) {
      errors.push({
        line: statementStartLine,
        message: 'Unmatched closing bracket, parenthesis, or brace'
      });
      openBrackets = 0;
    }

    // Update expected indentation for the next line
    if (trimmedLine.endsWith(':') && openBrackets === 0) {
      expectedIndentation += 4;
    } else if (indentation < expectedIndentation && openBrackets === 0) {
      expectedIndentation = indentation;
    }

    // Check for basic syntax errors
    if (trimmedLine.match(/^(def|class|if|elif|else|for|while|try|except|finally)\b/) && !trimmedLine.endsWith(':')) {
      errors.push({
        line: lineNumber,
        message: 'Missing colon at the end of the statement'
      });
    }

    // Update statement start line if this is the beginning of a new statement
    if (openBrackets === 0 && !trimmedLine.endsWith('\\')) {
      statementStartLine = lineNumber + 1;
    }
  });

  // Check if there are any unclosed brackets at the end
  if (openBrackets > 0) {
    errors.push({
      line: statementStartLine,
      message: 'Unclosed bracket, parenthesis, or brace at the end of the file'
    });
  }

  return errors;
}