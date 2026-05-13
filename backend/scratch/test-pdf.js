const pdf = require('pdf-parse');
console.log('Type of pdf:', typeof pdf);
console.log('pdf properties:', Object.keys(pdf));
if (pdf.default) console.log('Type of pdf.default:', typeof pdf.default);
