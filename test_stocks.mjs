import * as yf from 'yahoo-finance2';
import defaultExport from 'yahoo-finance2';

console.log("Namespace Exports:", Object.keys(yf));
console.log("Default Export Type:", typeof defaultExport);
console.log("Default Export Keys:", Object.keys(defaultExport || {}));

if (typeof defaultExport === 'object') {
    console.log("Default Proto:", Object.getPrototypeOf(defaultExport));
}
