/*
*
* SUMMARY
* This is tokenizer. It creates tokens from rules. Tokens then parsed
*
* */

'use strict';

const digits = '0123456789';
const operations = '+-*/';

const isOperator = char => operations.indexOf(char) !== -1;
const isDigit = char => digits.indexOf(char) !== -1;

class Token {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }

    inspect() {
        return `[${this.type} : ${this.value}]`;
    }
}

module.exports = class Lexer {
    constructor(text) {
        this.text = text;
        this.textPointer = -1;
        this.advancePointer();
    }

    advancePointer() {
        this.textPointer += 1;
        if (this.textPointer >= this.text.length) {
            this.token = 'EOF';
        } else {
            this.token = this.text[this.textPointer];
        }
    }

    getNextToken() {
        if (this.token === 'EOF') {
            return new Token('EOF', '');
        } else if (isDigit(this.token)) {
            return this.parseNumber();
        } else if (isOperator(this.token)) {
            return this.parseOperator();
        } else if(this.token === ' ') {
            return this.skipWhitespaceGetNextToken();
        } else {
            throw 'Invalid syntax';
        }
    }

    parseNumber() {
        const parseDigits = () => {
            let value = '';
            while (isDigit(this.token)) {
                value += this.text[this.textPointer];
                this.advancePointer()
            }
            return value;
        };

        let number = parseDigits();

        if (this.text[this.textPointer] === '.') {
            this.advancePointer();
            number += '.' + parseDigits();

            return new Token('NUM', parseFloat(number));
        }

        return new Token('NUM', parseInt(number));
    }

    parseOperator() {
        let val = null;
        switch (this.token) {
            case '+':
                val = new Token('ADD', '+');
                break;
            case '-':
                val = new Token('SUB', '-');
                break;
            case '*':
                val = new Token('MUL', '*');
                break;
            case '/':
                val = new Token('DIV', '/');
                break;
            default:
                throw `Incorrect syntax on position:${this.textPointer + 1}`
        }
        this.advancePointer();
        return val;
    }

    skipWhitespaceGetNextToken()
    {
        while(this.token === ' ')
        {
            this.advancePointer();
        }
        return this.getNextToken();
    }
}