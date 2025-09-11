import Parser from "./frontend/parser.ts";
import Environment from "./runtime/environment.ts";
import { evaluate } from "./runtime/interpreter.ts";

const parser = new Parser();
const env = new Environment();

console.log("\nWelcome to jp-- V0.2\n");

const fileInput = prompt("Input a file name to run, or hit enter to start REPL > ");

if (fileInput) {
    try {
        const source = Deno.readTextFileSync(fileInput);
        const program = parser.produceAST(source);
        const result = evaluate(program, env);
        console.log(result);
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error("Error reading file:", err.message);
        } else {
            console.error("Unknown error:", err);
        }
    }
}

repl();

function repl() {
    console.log("\nStarting REPL...");
    while (true) {
        const input = prompt("> ");
        if (!input || input.toLowerCase().includes("exit")) {
            Deno.exit(0);
        }
        try {
            const program = parser.produceAST(input);
            const result = evaluate(program, env);
            console.log(result);
        } catch (err) {
            console.error("An error has occured:", err);
        }
    }
}
