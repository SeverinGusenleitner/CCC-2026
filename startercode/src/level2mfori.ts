
  const inventoryText = remaining.length === 0
    ? '-'
    : remaining.map(([molecule, amount]) => `${amount} ${molecule}`).join(', ');

  return `${totalCost} -> ${inventoryText}`;
}

function main(): void {
  const firstLine = nextNonEmptyLine();
  if (firstLine === undefined) return;
  const moleculeCount = Number(firstLine);
  const prices = new Map<string, number>();

  for (let i = 0; i < moleculeCount; i++) {
    const line = nextNonEmptyLine();
    if (line === undefined) throw new Error('Unerwartetes Dateiende bei den Preisen.');
    const match = line.match(/^(\d+)\s*->\s*(.+?)\s*$/);
    if (!match) throw new Error(`Ungültige Preisangabe: ${line}`);
    prices.set(match[2], Number(match[1]));
  }

  const caseCountLine = nextNonEmptyLine();
  if (caseCountLine === undefined) throw new Error('Anzahl der Fälle fehlt.');
  const caseCount = Number(caseCountLine);
  const results: string[] = [];

  for (let c = 0; c < caseCount; c++) {
    const reactionCountLine = nextNonEmptyLine();
    if (reactionCountLine === undefined) throw new Error('Anzahl der Reaktionen fehlt.');
    const reactionCount = Number(reactionCountLine);
    const reactions: Reaction[] = [];

    for (let r = 0; r < reactionCount; r++) {
      const reactionLine = nextNonEmptyLine();
      if (reactionLine === undefined) throw new Error('Reaktion fehlt.');
      reactions.push(parseReaction(reactionLine));
    }

    results.push(runCase(prices, reactions));
  }

  console.log(results.join('\n'));
}

main();
