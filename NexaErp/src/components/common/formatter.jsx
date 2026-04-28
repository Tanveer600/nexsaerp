
// export const toNumber = (value: number | null | undefined, minimumFractionDigits = 2): string => {
//   if (value === null || value === undefined) return '-';
//   if (value % 1 === 0) minimumFractionDigits = 0;

//   const locale = navigator.language || 'en-US'; 
//   const formatter = new Intl.NumberFormat(locale, {
//     minimumFractionDigits,
//     maximumFractionDigits: minimumFractionDigits,
//   });

//   return formatter.format(value);
// };

// export const toNumberOrWhole = (value: number | null | undefined, minimumFractionDigits = 2): string => {
//   if (value === null || value === undefined) return '-';
//   if (value % 1 !== 0) return toNumber(value, minimumFractionDigits);
//   return toNumber(value, 0);
// };

// export const toBracketNumber = (value: number | null | undefined, minimumFractionDigits = 2): string => {
//   if (value === null || value === undefined) return '-';
//   if (value % 1 === 0) minimumFractionDigits = 0;

//   const locale = navigator.language || 'en-US';
//   const formatter = new Intl.NumberFormat(locale, {
//     minimumFractionDigits,
//     maximumFractionDigits: minimumFractionDigits,
//   });

//   if (value === 0) return '-';
//   if (value < 0) return `(${formatter.format(value * -1)})`;

//   return formatter.format(value);
// };

// export const toEmptyNumber = (value: number | null | undefined, minimumFractionDigits = 2): string => {
//   if (value === null || value === undefined) return '-';
//   if (value % 1 === 0) minimumFractionDigits = 0;

//   const locale = navigator.language || 'en-US';
//   const formatter = new Intl.NumberFormat(locale, {
//     minimumFractionDigits,
//     maximumFractionDigits: minimumFractionDigits,
//   });

//   if (value === 0) return '-';
//   return formatter.format(value);
// };

// export const toPositiveNumber = (value: number | null | undefined, minimumFractionDigits = 2): string => {
//   if (value === null || value === undefined) return '-';
//   let number = value;
//   if (number < 0) number *= -1;
//   if (number % 1 === 0) minimumFractionDigits = 0;

//   const locale = navigator.language || 'en-US';
//   const formatter = new Intl.NumberFormat(locale, {
//     minimumFractionDigits,
//     maximumFractionDigits: minimumFractionDigits,
//   });

//   if (number === 0) return '-';
//   return formatter.format(number);
// };