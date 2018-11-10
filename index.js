'use strict';

const Interpreter = require('./interpreter');

const int = new Interpreter('5 - 2 * 3');

console.log(int.run());