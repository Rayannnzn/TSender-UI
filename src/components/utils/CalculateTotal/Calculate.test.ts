// calculateTotal.test.ts
import { describe, it, expect } from 'vitest';
import  CalculateTotal  from './CalculateTotal';// Adjust the import path

describe('CalculateTotal', () => {
  it('should return 0 for empty string', () => {
    expect(CalculateTotal('')).toBe(0);
  });

  it('should return 0 for string with only spaces', () => {
    expect(CalculateTotal('   ')).toBe(0);
  });

  it('should handle newline-delimited numbers', () => {
    expect(CalculateTotal('100\n100\n100')).toBe(300);
  });

  it('should handle comma-delimited numbers', () => {
    expect(CalculateTotal('100,100,100')).toBe(300);
  });

  it('should handle mixed delimiters', () => {
    expect(CalculateTotal('100\n200,300')).toBe(600);
  });

  it('should handle numbers with decimals', () => {
    expect(CalculateTotal('50.5\n25.5\n10')).toBe(86);
  });

  it('should ignore empty lines', () => {
    expect(CalculateTotal('100\n\n200\n\n300')).toBe(600);
  });

  it('should ignore non-numeric values', () => {
    expect(CalculateTotal('100\nabc\n200\nxyz\n300')).toBe(600);
  });

  it('should handle trailing and leading spaces', () => {
    expect(CalculateTotal('  100  \n  200  \n  300  ')).toBe(600);
  });

  it('should handle single number', () => {
    expect(CalculateTotal('500')).toBe(500);
  });

  it('should handle multiple consecutive delimiters', () => {
    expect(CalculateTotal('100,,,200\n\n\n300')).toBe(600);
  });

  it('should handle large numbers', () => {
    expect(CalculateTotal('1000000\n2000000')).toBe(3000000);
  });

  it('should handle negative numbers', () => {
    expect(CalculateTotal('100\n-50\n25')).toBe(75);
  });
});