
export function parseExpression(expression: string): number {
  
  const expr = expression.replace(/\s+/g, "");

  
  if (!expr || expr === "") {
    return 0;
  }

  try {
    
    const tokens: (string | number)[] = [];
    let currentNumber = "";

    for (let i = 0; i < expr.length; i++) {
      const char = expr[i];

      if (/[\d.]/.test(char)) {
        
        currentNumber += char;
      } else if (["+", "-", "×", "÷"].includes(char)) {
        
        if (currentNumber) {
          tokens.push(parseFloat(currentNumber));
          currentNumber = "";
        }
        tokens.push(char);
      }
    }

    
    if (currentNumber) {
      tokens.push(parseFloat(currentNumber));
    }

    
    if (typeof tokens[tokens.length - 1] === "string") {
      tokens.pop();
    }

    
    if (tokens.length === 0) {
      return 0;
    }

    
    for (let i = 1; i < tokens.length; i += 2) {
      const operator = tokens[i] as string;

      if (operator === "×" || operator === "÷") {
        const left = tokens[i - 1] as number;
        const right = tokens[i + 1] as number;

        let result: number;
        if (operator === "×") {
          result = left * right;
        } else {
          
          if (right === 0) {
            throw new Error("Divisão por zero");
          }
          result = left / right;
        }

        
        tokens.splice(i - 1, 3, result);
        i -= 2; 
      }
    }

    
    let result = tokens[0] as number;

    for (let i = 1; i < tokens.length; i += 2) {
      const operator = tokens[i] as string;
      const right = tokens[i + 1] as number;

      if (operator === "+") {
        result += right;
      } else if (operator === "-") {
        result -= right;
      }
    }

    return result;
  } catch (error) {
    throw error;
  }
}


export function formatNumber(num: number): string {
  
  if (num > 9999999999 || num < -9999999999) {
    return num.toExponential(5);
  }

  
  let str = num.toString();

  
  if (str.includes(".")) {
    str = str.replace(/\.?0+$/, "");
  }

  
  if (str.length > 10) {
    return num.toFixed(4);
  }

  return str;
}


export function shouldStartNewNumber(
  lastCharIsOperator: boolean,
  lastCharIsEquals: boolean
): boolean {
  return lastCharIsOperator || lastCharIsEquals;
}
