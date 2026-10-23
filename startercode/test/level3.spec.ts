import { describe, expect, test } from "vitest";
import { solveLevel3 } from "../src/level3.js";

describe("solveLevel3", () => {
    test("produces the requested example targets", () => {
        const input = `3
2 -> H2
1 -> O2
3 -> C

4
2 H2, 1 O2 -> 2 H2O
1 C, 1 O2 -> 1 CO2
6 CO2, 6 H2O -> 1 C6H12O6, 6 O2
1 C6H12O6 -> 2 C2H5OH, 2 CO2

2
2 C6H12O6
4 C2H5OH`;

        const result = solveLevel3(input).split("\n");
        expect(result).toHaveLength(43);
        expect(result[20]).toBe("");
        expect(result.filter((line) => line.includes("C6H12O6")).length).toBe(6);
        expect(result.filter((line) => line.includes("C2H5OH")).length).toBe(2);
    });

    test("can buy a target directly without a reaction", () => {
        expect(solveLevel3(`1
5 -> A
0
1
3 A`)).toBe("");
    });

    test("rejects an unreachable target", () => {
        expect(() => solveLevel3(`1
5 -> A
0
1
1 B`)).toThrow('Target molecule "B" cannot be produced');
    });
});
