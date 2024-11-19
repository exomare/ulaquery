
"use strict"

const array1 = [1, 2, 3];
const array2 = [4, 5, 6];

let newArray = [...array1, ...array2];
console.log(newArray);

newArray = [33, ...array2];
console.log(newArray);
