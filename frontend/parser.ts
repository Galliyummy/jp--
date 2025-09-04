import {
    Stmt, 
    Program, 
    BinaryExpr, 
    NumericLiteral, 
    Identifier,
    Expr,
} from "./ast.ts";
import { tokenize, Token, TokenType } from "./lexer.ts";

export default class Parser {
    private tokens: Token[] = [];

    private not_eof (): boolean {
        return this.tokens[0].type != TokenType.EOF;
    }

    private at () {
        return this.tokens[0] as Token;
    }

    private eat () {
        const prev = this.tokens.shift() as Token;
        return prev;
    }

    // deno-lint-ignore no-explicit-any
    private expect (type: TokenType, err: any) {
        const prev = this.tokens.shift() as Token;
        if (!prev || prev.type != type) {
            console.error("Parser Error:\n", err, prev, "- Expecting:", type);
            Deno.exit(1);
        }
        return prev;
    }

    public produceAST (sourceCode: string): Program {
        this.tokens = tokenize(sourceCode);
        const program: Program = {
            kind: "Program",
            body: [],
        };
        while (this.not_eof()) {
            program.body.push(this.parse_stmt());
        }
        return program;
    }

    private parse_stmt (): Stmt {
        //skip to parse_expr
        return this.parse_expr();
    }

    private parse_expr (): Expr {
        return this.parse_additive_expr();
    }
    
    private parse_additive_expr (): Expr {
        let left = this.parse_multiplicitave_expr();
        while (this.at().value == "+" || this.at().value == "-") {
            const operator = this.eat().value;
            const right = this.parse_multiplicitave_expr();
            left = {
                kind: "BinaryExpr",
                left,
                right,
                operator
            } as BinaryExpr;
        }
        return left;
    }

    private parse_multiplicitave_expr (): Expr {
        let left = this.parse_primary_expr();
        while (this.at().value == "*" || this.at().value == "/" || this.at().value == "%") {
            const operator = this.eat().value;
            const right = this.parse_primary_expr();
            left = {
                kind: "BinaryExpr",
                left,
                right,
                operator
            } as BinaryExpr;
        }
        return left;
    }

    private parse_primary_expr (): Expr {
        const tk = this.at().type;
        switch(tk) {
            case TokenType.Identifier:
                return{
                    kind: "Identifier", 
                    symbol: this.eat().value,
                } as Identifier;

            case TokenType.Number:
                return{
                    kind: "NumericLiteral", 
                    value: parseFloat(this.eat().value),
                } as NumericLiteral;

            case TokenType.LParen: {
                this.eat(); //gotta kill the paren
                const value = this.parse_expr();
                this.expect(
                    TokenType.RParen,
                    "Unexpected token found in parentheses, expected closing parenthesis."
                ); //kill the closing paren, but also throw an error if there is not one
                return value;
                }
            default:
                console.error("Unexpected token has been found whilst parsing:", this.at());
                Deno.exit(1);
        }
    }
}