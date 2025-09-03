import { ValueType, NumberVal, RuntimeVal, NullVal } from  "./values.ts";
import { BinaryExpr, NumericLiteral, Program, Stmt } from "../frontend/ast.ts";

function eval_program (program: Program): RuntimeVal { }

function eval_binary_expr (binop: BinaryExpr): RuntimeVal { }

export function evaluate (astNode: Stmt): RuntimeVal {
    switch (astNode.kind) {
        case "NumericLiteral":
            return { 
                value: (astNode as NumericLiteral).value,
                type: "number"
            } as NumberVal;

        case "NullLiteral":
            return { value: "null", type: "null" } as NullVal;
            
        case "Program":
            return eval_program(astNode as Program);

        case "BinaryExpr":
            return eval_binary_expr(astNode as BinaryExpr);

        default:
            console.error("This AST Node has not been set up for interpretation yet:", astNode);
            Deno.exit(0);
    }
}