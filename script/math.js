
const math = new Object();
math.RandomRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
/**
 * 
 * @param {number} value 
 * @param {number} oldMin 
 * @param {number} oldMax 
 * @param {number} newMin 
 * @param {number} newMax 
 * @returns
 */
math.Map = (value, oldMin, oldMax, newMin, newMax) => newMin + (newMax - newMin) * (value - oldMin) / (oldMax - oldMin);
math.Lerp = (start, end, amt) => (1 - amt) * start + amt * end;
math.Range = (value, min, max) => Math.max(min, Math.min(max, value));
math.RandomHSL = (S = 100, L = 50, A = 1) => `hsla(${Math.random() * 360}, ${S}%, ${L}%, ${A})`;
math.RandomRGB = (R = Math.random() * 255, G = Math.random() * 255, B = Math.random() * 255, A = 1) => `rgba(${R},${G},${B},${A})`;
export { math };