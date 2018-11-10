'use strict';

const Lexer = require('./lexer');

module.exports = class Interpreter
{
    constructor(text)
    {
        this.lexer = new Lexer(text);
        this.token = this.lexer.getNextToken();
    }

    /*
    * check if current token type is equal to expected and get next token
    * */
    consumeToken(expectedType)
    {
        if(this.token.type !== expectedType)
        {
            throw `Incorrect token, expected ${expectedType}, got ${this.token.type}`;
        }
        this.token = this.lexer.getNextToken();
    }

    run()
    {
        return this.secondPrecedence();
    }

    // firstPrecedence ((MUL|DIV) factor)*
    secondPrecedence()
    {
        let value = this.firstPrecedence();

        while(['ADD','SUB'].indexOf(this.token.type) !== -1)
        {
            if(this.token.type === 'ADD')
            {
                this.consumeToken('ADD');
                value += this.firstPrecedence();
            } else if(this.token.type === 'SUB') {
                this.consumeToken('SUB');
                value -= this.firstPrecedence();
            }
        }

        return value;
    }
    // factor ((MUL|DIV) factor)*
    firstPrecedence()
    {
        let value = this.factor();

        while(['DIV', 'MUL'].indexOf(this.token.type) !== -1)
        {
            if(this.token.type === 'MUL')
            {
                this.consumeToken('MUL');
                value *= this.factor();
            } else if(this.token.type === 'DIV') {
                this.consumeToken('DIV');
                value /= this.factor();
            }
        }

        return value;
    }

    factor()
    {
        let value = this.token.value;
        this.consumeToken('NUM');
        return value;
    }
}