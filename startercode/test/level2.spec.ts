import { describe, expect, test } from "vitest";
import { solveLevel2 } from "../src/level2.js";

describe("solveLevel2", () => {
    test("solves the provided example", () => {
        const input = `4
5 -> H2
1 -> O2
3 -> CO2
15 -> H2O

3
1
2 H2, 1 O2 -> 2 H2O

4
2 H2, 1 O2 -> 2 H2O
2 H2, 1 O2 -> 2 H2O
6 CO2, 6 H2O -> 1 C6H12O6, 6 O2
2 H2, 1 O2 -> 2 H2O

4
2 H2, 1 O2 -> 2 H2O
2 H2, 1 O2 -> 2 H2O
2 H2, 1 O2 -> 2 H2O
6 CO2, 6 H2O -> 1 C6H12O6, 6 O2`;

        expect(solveLevel2(input)).toBe(`11 -> 2 H2O
80 -> 5 O2, 2 H2O, 1 C6H12O6
51 -> 6 O2, 1 C6H12O6`);
    });

    test("buys only missing reactants", () => {
        const input = `2
4 -> A
10 -> B
2
1
3 A -> 2 B
2
3 A -> 2 B
3 A -> 2 B`;

        expect(solveLevel2(input)).toBe(`12 -> 2 B
24 -> 4 B`);
    });

    test("rejects a missing non-buyable reactant", () => {
        const input = `1
5 -> A
1
1
1 B -> 1 A`;

        expect(() => solveLevel2(input)).toThrow('Molecule "B" cannot be bought');
    });

    test("supports zero reaction sequences", () => {
        expect(solveLevel2("0\n0")).toBe("");
    });
});
