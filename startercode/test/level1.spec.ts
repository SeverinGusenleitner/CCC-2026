import { describe, expect, test } from "vitest";
import { solveLevel1 } from "../src/level1.js";

describe("solveLevel1", () => {
    test("solves the example from the Level 1 instructions", () => {
        const input = `3
3 H2, 4 O2, 7 H2O
2 H2, 1 O2 -> 2 H2O

6 CO2, 7 H2O
6 CO2, 6 H2O -> 1 C6H12O6, 6 O2

3 C6H12O6
1 C6H12O6 -> 2 C2H5OH, 2 CO2`;

        expect(solveLevel1(input)).toBe(`1 H2, 3 O2, 9 H2O
1 H2O, 1 C6H12O6, 6 O2
2 C6H12O6, 2 C2H5OH, 2 CO2`);
    });

    test("consumes reactants and adds products", () => {
        const input = `1
5 A, 2 B
2 A, 1 B -> 3 C`;

        expect(solveLevel1(input)).toBe("3 A, 1 B, 3 C");
    });

    test("supports Windows line endings and trims blank lines", () => {
        const input = "1\r\n  1 H2, 1 O2  \r\n1 H2, 1 O2 -> 1 H2O\r\n";

        expect(solveLevel1(input)).toBe("1 H2O");
    });

    test("rejects a reaction when the inventory is insufficient", () => {
        const input = `1
1 A
2 A -> 1 B`;

        expect(() => solveLevel1(input)).toThrow(
            "Reaction requires 2 A, but only 1 are available",
        );
    });

    test("rejects an input with a mismatched case count", () => {
        expect(() => solveLevel1("2\n1 A\n1 A -> 1 B")).toThrow(
            "Expected 2 cases",
        );
    });

    test("returns an empty result for zero cases", () => {
        expect(solveLevel1("0")).toBe("");
    });
});
