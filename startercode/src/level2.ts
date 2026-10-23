type MoleculeAmounts = Map<string, number>;
type Prices = Map<string, number>;

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

function performReaction(
    inventory: MoleculeAmounts,
    prices: Prices,
    reactionText: string,
): number {
    const parts = reactionText.split("->");
    if (parts.length !== 2) {
        throw new Error(`Invalid reaction: "${reactionText}"`);
    }

    const reactants = parseMoleculeList(parts[0]);
    const products = parseMoleculeList(parts[1]);
    let cost = 0;

    for (const [molecule, amount] of reactants) {
        const available = inventory.get(molecule) ?? 0;
        const missing = Math.max(0, amount - available);
        if (missing > 0) {
            const price = prices.get(molecule);
            if (price === undefined) {
                throw new Error(`Molecule "${molecule}" cannot be bought`);
            }
            cost += missing * price;
        }
        inventory.set(molecule, available + missing - amount);
    }

    for (const [molecule, amount] of products) {
        inventory.set(molecule, (inventory.get(molecule) ?? 0) + amount);
    }
    return cost;
}

function formatResult(cost: number, inventory: MoleculeAmounts): string {
    const molecules = [...inventory]
        .filter(([, amount]) => amount > 0)
        .map(([molecule, amount]) => `${amount} ${molecule}`)
        .join(", ");
    return `${cost} -> ${molecules}`;
}

export function solveLevel2(input: string): string {
    const lines = input
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
    if (lines.length === 0) {
        throw new Error("Level 2 input is empty");
    }

    const priceCount = Number(lines[0]);
    if (!Number.isInteger(priceCount) || priceCount < 0) {
        throw new Error(`Invalid molecule price count: "${lines[0]}"`);
    }

    let lineIndex = 1;
    const prices: Prices = new Map();
    for (let index = 0; index < priceCount; index++) {
        const line = lines[lineIndex++];
        if (line === undefined) {
            throw new Error("Missing molecule price");
        }
        const match = line.match(/^(\d+)\s+->\s+(\S+)$/);
        if (!match) {
            throw new Error(`Invalid molecule price: "${line}"`);
        }
        prices.set(match[2], Number(match[1]));
    }

    const sequenceCount = Number(lines[lineIndex++]);
    if (!Number.isInteger(sequenceCount) || sequenceCount < 0) {
        throw new Error("Invalid reaction sequence count");
    }

    const results: string[] = [];
    for (let sequenceIndex = 0; sequenceIndex < sequenceCount; sequenceIndex++) {
        const reactionCount = Number(lines[lineIndex++]);
        if (!Number.isInteger(reactionCount) || reactionCount < 0) {
            throw new Error("Invalid reaction count");
        }
        const inventory: MoleculeAmounts = new Map();
        let cost = 0;
        for (let reactionIndex = 0; reactionIndex < reactionCount; reactionIndex++) {
            const reaction = lines[lineIndex++];
            if (reaction === undefined) {
                throw new Error("Missing reaction");
            }
            cost += performReaction(inventory, prices, reaction);
        }
        results.push(formatResult(cost, inventory));
    }

    if (lineIndex !== lines.length) {
        throw new Error("Unexpected data after the reaction sequences");
    }
    return results.join("\n");
}
