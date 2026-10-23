type MoleculeAmounts = Map<string, number>;

type Reaction = {
    text: string;
    reactants: MoleculeAmounts;
    products: MoleculeAmounts;
};

type Planner = {
    producers: Map<string, Reaction[]>;
    estimateCost: (molecule: string) => number;
};

function parseMoleculeList(value: string): MoleculeAmounts {
    const molecules: MoleculeAmounts = new Map();
    for (const part of value.split(",")) {
        const match = part.trim().match(/^(\d+)\s+(\S+)$/);
        if (!match) {
            throw new Error(`Invalid molecule list entry: "${part.trim()}"`);
        }
        molecules.set(
            match[2],
            (molecules.get(match[2]) ?? 0) + Number(match[1]),
        );
    }
    return molecules;
}

function parseReaction(text: string): Reaction {
    const parts = text.split("->");
    if (parts.length !== 2) {
        throw new Error(`Invalid reaction: "${text}"`);
    }
    return {
        text,
        reactants: parseMoleculeList(parts[0]),
        products: parseMoleculeList(parts[1]),
    };
}

function parseInput(input: string): {
    prices: Map<string, number>;
    reactions: Reaction[];
    targets: Array<[string, number]>;
} {
    const lines = input
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
    if (lines.length === 0) {
        throw new Error("Level 3 input is empty");
    }

    let lineIndex = 0;
    const priceCount = Number(lines[lineIndex++]);
    if (!Number.isInteger(priceCount) || priceCount < 0) {
        throw new Error("Invalid price count");
    }

    const prices = new Map<string, number>();
    for (let index = 0; index < priceCount; index++) {
        const line = lines[lineIndex++];
        const match = line?.match(/^(\d+)\s+->\s+(\S+)$/);
        if (!match) {
            throw new Error(`Invalid price: "${line ?? ""}"`);
        }
        prices.set(match[2], Number(match[1]));
    }

    const reactionCount = Number(lines[lineIndex++]);
    if (!Number.isInteger(reactionCount) || reactionCount < 0) {
        throw new Error("Invalid reaction count");
    }
    const reactions: Reaction[] = [];
    for (let index = 0; index < reactionCount; index++) {
        const line = lines[lineIndex++];
        if (line === undefined) {
            throw new Error("Missing reaction");
        }
        reactions.push(parseReaction(line));
    }

    const targetCount = Number(lines[lineIndex++]);
    if (!Number.isInteger(targetCount) || targetCount < 0) {
        throw new Error("Invalid target count");
    }
    const targets: Array<[string, number]> = [];
    for (let index = 0; index < targetCount; index++) {
        const line = lines[lineIndex++];
        if (line === undefined) {
            throw new Error("Missing target molecule");
        }
        const parsedTarget = [...parseMoleculeList(line)];
        if (parsedTarget.length !== 1) {
            throw new Error(`Invalid target: "${line}"`);
        }
        targets.push([parsedTarget[0][0], parsedTarget[0][1]]);
    }
    if (lineIndex !== lines.length) {
        throw new Error("Unexpected data after targets");
    }
    return { prices, reactions, targets };
}

function solveTarget(
    prices: Map<string, number>,
    planner: Planner,
    targetMolecule: string,
    targetAmount: number,
): string {
    if (planner.estimateCost(targetMolecule) === Number.POSITIVE_INFINITY) {
        throw new Error(`Target molecule "${targetMolecule}" cannot be produced`);
    }

    const inventory: MoleculeAmounts = new Map();
    const output: string[] = [];
    const active = new Set<string>();
    const produce = (molecule: string, amount: number): void => {
        const available = inventory.get(molecule) ?? 0;
        if (available >= amount) {
            inventory.set(molecule, available - amount);
            return;
        }

        const missing = amount - available;
        const buyCost = prices.get(molecule) ?? Number.POSITIVE_INFINITY;
        const reaction = (planner.producers.get(molecule) ?? [])
            .filter((candidate) => {
                const outputAmount = candidate.products.get(molecule) ?? 0;
                return (
                    outputAmount > 0 &&
                    candidate.reactants.keys().every(
                        (reactant) => !active.has(reactant),
                    )
                );
            })
            .sort((left, right) => {
                const leftOutput = left.products.get(molecule) ?? 0;
                const rightOutput = right.products.get(molecule) ?? 0;
                const leftCost = [...left.reactants].reduce(
                    (sum, [reactant, count]) =>
                        sum + count * planner.estimateCost(reactant),
                    0,
                ) / leftOutput;
                const rightCost = [...right.reactants].reduce(
                    (sum, [reactant, count]) =>
                        sum + count * planner.estimateCost(reactant),
                    0,
                ) / rightOutput;
                return leftCost - rightCost;
            })
            .find((candidate) => {
                const outputAmount = candidate.products.get(molecule) ?? 0;
                const cost = [...candidate.reactants].reduce(
                    (sum, [reactant, count]) =>
                        sum + count * planner.estimateCost(reactant),
                    0,
                ) / outputAmount;
                return cost < buyCost;
            });

        if (!reaction) {
            if (buyCost === Number.POSITIVE_INFINITY) {
                throw new Error(`Molecule "${molecule}" cannot be obtained`);
            }
            inventory.set(molecule, available);
            return;
        }

        const outputAmount = reaction.products.get(molecule) ?? 0;
        const repetitions = Math.ceil(missing / outputAmount);
        active.add(molecule);
        for (const [reactant, count] of reaction.reactants) {
            produce(reactant, count * repetitions);
        }
        active.delete(molecule);
        for (const [product, count] of reaction.products) {
            inventory.set(
                product,
                (inventory.get(product) ?? 0) + count * repetitions,
            );
        }
        output.push(...Array(repetitions).fill(reaction.text));
        inventory.set(molecule, (inventory.get(molecule) ?? 0) - amount);
    };

    produce(targetMolecule, targetAmount);
    return output.join("\n");
}

export function solveLevel3(input: string): string {
    const { prices, reactions, targets } = parseInput(input);
    const producers = new Map<string, Reaction[]>();
    for (const reaction of reactions) {
        for (const molecule of reaction.products.keys()) {
            const list = producers.get(molecule) ?? [];
            list.push(reaction);
            producers.set(molecule, list);
        }
    }

    const costCache = new Map<string, number>();
    const calculating = new Set<string>();
    const estimateCost = (molecule: string): number => {
        const cached = costCache.get(molecule);
        if (cached !== undefined) {
            return cached;
        }
        if (calculating.has(molecule)) {
            return Number.POSITIVE_INFINITY;
        }
        calculating.add(molecule);
        let best = prices.get(molecule) ?? Number.POSITIVE_INFINITY;
        for (const reaction of producers.get(molecule) ?? []) {
            const output = reaction.products.get(molecule) ?? 0;
            let cost = 0;
            for (const [reactant, amount] of reaction.reactants) {
                cost += amount * estimateCost(reactant);
            }
            best = Math.min(best, cost / output);
        }
        calculating.delete(molecule);
        if (best !== Number.POSITIVE_INFINITY) {
            costCache.set(molecule, best);
        }
        return best;
    };
    const planner: Planner = { producers, estimateCost };

    return targets
        .map(([molecule, amount]) =>
            solveTarget(prices, planner, molecule, amount),
        )
        .join("\n\n");
}
