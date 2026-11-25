// Supported operations: addition (+), subtraction (-), multiplication (*), and division (/).
function calculate(left, operator, right) {
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
    default:
      throw new Error('supported operations are +, -, *, and /.');
  }

  if (!Number.isFinite(result)) {
    throw new Error('result is not a finite number.');
  }
  return result;
}

if (require.main === module) {
  const [leftInput, operator, rightInput] = process.argv.slice(2);
  const fail = (message) => {
    console.error(message);
    process.exitCode = 1;
  };

  if (process.argv.length !== 5) {
    fail('Usage: node src/calculator.js <number> <+|-|*|/> <number> (quote * in your shell)');
  } else if (leftInput.trim() === '' || rightInput.trim() === '') {
    fail('Error: both operands must be finite numbers.');
  } else {
    try {
      console.log(calculate(Number(leftInput), operator, Number(rightInput)));
    } catch (error) {
      fail(`Error: ${error.message}`);
    }
  }
}

module.exports = { calculate };
