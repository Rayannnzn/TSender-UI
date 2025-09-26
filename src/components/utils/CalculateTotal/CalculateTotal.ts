function CalculateTotal(amounts: string): number {
  if (!amounts.trim()) return 0;
  
  // Split by new lines or commas, and handle multiple consecutive delimiters
  const numbers = amounts.split(/[\n,]+/)
    .map(item => item.trim())
    .filter(item => item !== '')
    .map(Number)
    .filter(num => !isNaN(num)); // Filter out any non-numeric values
  
  // Sum all valid numbers
  return numbers.reduce((total, current) => total + current, 0);
}

export default CalculateTotal