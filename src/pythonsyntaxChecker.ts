export interface SyntaxError {
  line: number;
  message: string;
}

export function checkPythonSyntax(code: string): SyntaxError[] {
  const errors: SyntaxError[] = [];
  const lines = code.split('\n');

  let inMultilineString = false;
  let indentationStack: number[] = [0];

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const trimmedLine = line.trimRight();

    // Check for empty lines or comments
    if (trimmedLine === '' || trimmedLine.startsWith('#')) {
      return;
    }

    // Check for multiline strings
    if (trimmedLine.includes('"""') || trimmedLine.includes("'''")) {
      inMultilineString = !inMultilineString;
      return;
    }

    if (inMultilineString) {
      return;
    }

    // Check indentation
    const indentation = line.length - line.trimLeft().length;
    if (indentation > indentationStack[indentationStack.length - 1]) {
      indentationStack.push(indentation);
    } else if (indentation < indentationStack[indentationStack.length - 1]) {
      while (indentationStack[indentationStack.length - 1] > indentation) {
        indentationStack.pop();
      }
      if (indentationStack[indentationStack.length - 1] !== indentation) {
        errors.push({
          line: lineNumber,
          message: 'Indentation error'
        });
      }
    }

    // Check for colon at the end of control structures
    if (trimmedLine.match(/^(if|elif|else|for|while|def|class|try|except|finally)\b.*:$/) === null &&
        trimmedLine.match(/^(if|elif|else|for|while|def|class|try|except|finally)\b/) !== null) {
      errors.push({
        line: lineNumber,
        message: 'Missing colon at the end of the statement'
      });
    }

    // Check for valid variable names
    const variableDeclaration = trimmedLine.match(/^(\w+)\s*=/);
    if (variableDeclaration) {
      const variableName = variableDeclaration[1];
      if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(variableName)) {
        errors.push({
          line: lineNumber,
          message: `Invalid variable name: ${variableName}`
        });
      }
    }

    // Check for unmatched parentheses, brackets, and braces
    const openBrackets = (trimmedLine.match(/[\(\[\{]/g) || []).length;
    const closeBrackets = (trimmedLine.match(/[\)\]\}]/g) || []).length;
    if (openBrackets !== closeBrackets) {
      errors.push({
        line: lineNumber,
        message: 'Unmatched parentheses, brackets, or braces'
      });
    }
  });

  return errors;
}