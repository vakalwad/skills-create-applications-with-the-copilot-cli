// Supported operations: +, -, *, /, modulo (%), power (^), and square root (sqrt).
function modulo(a, b) {
  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    throw new Error('both operands must be finite numbers.');
  }
  if (b === 0) {
    throw new Error('modulo by zero is not allowed.');
  }
  return a % b;
}

function power(base, exponent) {
  if (!Number.isFinite(base) || !Number.isFinite(exponent)) {
    throw new Error('both operands must be finite numbers.');
  }
  const result = base ** exponent;
  if (!Number.isFinite(result)) {
    throw new Error('result is not a finite number.');
  }
  return result;
}

function squareRoot(n) {
  if (!Number.isFinite(n)) {
    throw new Error('operand must be a finite number.');
  }
  if (n < 0) {
    throw new Error('square root of a negative number is not allowed.');
  }
  return Math.sqrt(n);
}

function calculate(left, operator, right) {
  if (operator === 'sqrt') {
    return squareRoot(left);
  }
  if (!Number.isFinite(left) || !Number.isFinite(right)) {
    throw new Error('both operands must be finite numbers.');
  }

  let result;
  switch (operator) {
    case '+':
      result = left + right;
      break;
    case '-':
      result = left - right;
      break;
    case '*':
      result = left * right;
      break;
    case '/':
      if (right === 0) {
        throw new Error('division by zero is not allowed.');
      }
      result = left / right;
      break;
    case '%':
      result = modulo(left, right);
      break;
    case '^':
      result = power(left, right);
      break;
    default:
      throw new Error('supported operations are +, -, *, /, %, ^, and sqrt.');
  }

  if (!Number.isFinite(result)) {
    throw new Error('result is not a finite number.');
  }
  return result;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const fail = (message) => {
    console.error(message);
    process.exitCode = 1;
  };

  if (args.length === 2 && args[0] === 'sqrt') {
    if (args[1].trim() === '') {
      fail('Error: operand must be a finite number.');
    } else {
      try {
        console.log(calculate(Number(args[1]), 'sqrt'));
      } catch (error) {
        fail(`Error: ${error.message}`);
      }
    }
  } else if (args.length !== 3 || args[1] === 'sqrt') {
    fail('Usage: node src/calculator.js <number> <+|-|*|/|%|^> <number> or node src/calculator.js sqrt <number> (quote * in your shell)');
  } else if (args[0].trim() === '' || args[2].trim() === '') {
    fail('Error: both operands must be finite numbers.');
  } else {
    try {
      console.log(calculate(Number(args[0]), args[1], Number(args[2])));
    } catch (error) {
      fail(`Error: ${error.message}`);
    }
  }
}

module.exports = { calculate, modulo, power, squareRoot };
