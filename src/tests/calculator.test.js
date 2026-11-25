const { spawnSync } = require('node:child_process');
const path = require('node:path');
const { calculate } = require('../calculator');

describe('calculate', () => {
  test.each([
    [2, '+', 3, 5],
    [10, '-', 4, 6],
    [45, '*', 2, 90],
    [20, '/', 5, 4],
  ])('%s %s %s = %s', (left, operator, right, expected) => {
    expect(calculate(left, operator, right)).toBe(expected);
  });

  test.each([
    [-3, '+', 2, -1],
    [2.5, '+', 0.5, 3],
    [0, '-', 4, -4],
    [-3, '-', -5, 2],
    [-4, '*', 2.5, -10],
    [0, '*', 42, 0],
    [-9, '/', 2, -4.5],
    [0, '/', 5, 0],
  ])('handles %s %s %s', (left, operator, right, expected) => {
    expect(calculate(left, operator, right)).toBe(expected);
  });

  test.each([0, -0])('rejects division by %s', (divisor) => {
    expect(() => calculate(1, '/', divisor)).toThrow('division by zero');
  });

  test.each([NaN, Infinity, -Infinity, '2'])('rejects invalid operand %s', (operand) => {
    expect(() => calculate(operand, '+', 1)).toThrow('both operands must be finite numbers');
    expect(() => calculate(1, '+', operand)).toThrow('both operands must be finite numbers');
  });

  test('rejects unsupported operations', () => {
    expect(() => calculate(2, '%', 3)).toThrow('supported operations');
  });

  test('rejects a non-finite result', () => {
    expect(() => calculate(1e308, '*', 10)).toThrow('result is not a finite number');
  });
});

describe('calculator CLI', () => {
  const script = path.join(__dirname, '..', 'calculator.js');
  const run = (...args) => spawnSync(process.execPath, [script, ...args], { encoding: 'utf8' });

  test.each([
    [['2', '+', '3'], '5'],
    [['10', '-', '4'], '6'],
    [['45', '*', '2'], '90'],
    [['20', '/', '5'], '4'],
  ])('prints the result for %j', (args, expected) => {
    const result = run(...args);
    expect(result.status).toBe(0);
    expect(result.stdout.trim()).toBe(expected);
    expect(result.stderr).toBe('');
  });

  test.each([
    [[], /Usage:/],
    [['1', '+', '2', '3'], /Usage:/],
    [['1', '/', '0'], /division by zero/],
    [['1', '/', '-0'], /division by zero/],
    [['1', '%', '2'], /supported operations/],
    [[' ', '+', '2'], /finite numbers/],
    [['1', '+', 'abc'], /finite numbers/],
    [['Infinity', '+', '2'], /finite numbers/],
    [['1e308', '*', '10'], /result is not a finite number/],
  ])('reports an error for %j', (args, message) => {
    const result = run(...args);
    expect(result.status).toBe(1);
    expect(result.stdout).toBe('');
    expect(result.stderr).toMatch(message);
  });
});
