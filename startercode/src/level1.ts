type MoleculeAmounts = Map<string, number>;

function parseMoleculeList(value: string): MoleculeAmounts {
    const molecules: MoleculeAmounts = new Map();

    for (const part of value.split(",")) {
        const match = part.trim().match(/^(\d+)\s+(\S+)$/);
        if (!match) {
            throw new Error(`Invalid molecule list entry: "${part.trim()}"`);
        }

        const amount = Number(match[1]);
        const molecule = match[2];
        molecules.set(molecule, (molecules.get(molecule) ?? 0) + amount);
    }

    return molecules;
}

function applyReaction(inventoryText: string, reactionText: string): string {
    const inventory = parseMoleculeList(inventoryText);
    const reactionParts = reactionText.split("->");
    if (reactionParts.length !== 2) {
        throw new Error(`Invalid reaction: "${reactionText}"`);
    }

    const reactants = parseMoleculeList(reactionParts[0]);
    const products = parseMoleculeList(reactionParts[1]);

    for (const [molecule, amount] of reactants) {
        const available = inventory.get(molecule) ?? 0;
        if (available < amount) {
            throw new Error(
                `Reaction requires ${amount} ${molecule}, but only ${available} are available`,
            );
        }
        inventory.set(molecule, available - amount);
    }

    for (const [molecule, amount] of products) {
        inventory.set(molecule, (inventory.get(molecule) ?? 0) + amount);
    }

    return [...inventory]
        .filter(([, amount]) => amount > 0)
        .map(([molecule, amount]) => `${amount} ${molecule}`)
        .join(", ");
}

export function solveLevel1(input: string): string {
    const lines = input
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

    if (lines.length === 0) {
        throw new Error("Level 1 input is empty");
    }

    const caseCount = Number(lines[0]);
    if (!Number.isInteger(caseCount) || caseCount < 0) {
        throw new Error(`Invalid case count: "${lines[0]}"`);
    }

    if (lines.length !== 1 + caseCount * 2) {
        throw new Error(
            `Expected ${caseCount} cases, but found ${(lines.length - 1) / 2}`,
        );
    }

    const results: string[] = [];
    for (let caseIndex = 0; caseIndex < caseCount; caseIndex++) {
        const inventory = lines[1 + caseIndex * 2];
        const reaction = lines[2 + caseIndex * 2];
        results.push(applyReaction(inventory, reaction));
    }

    return results.join("\n");
}
