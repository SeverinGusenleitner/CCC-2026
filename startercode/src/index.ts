import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { readFile, writeFile } from "fs/promises";
import { solveLevel3 } from "./level3";


async function readInputFile(fileName: string) {
    const dirName = dirname(fileURLToPath(import.meta.url));
    const dataPath = join(dirName, "..", "..", fileName);
    
    const text = await readFile(dataPath, "utf-8");
    return text;
}

async function writeOutputFile(fileName: string, content: string) {
    const dirName = dirname(fileURLToPath(import.meta.url));
    const dataPath = join(dirName, "..", "..", fileName);

    await writeFile(dataPath, content, "utf-8");
}

const inputFile = "levels/level3/in_level-3_4-enormous.txt";
const outputFile = "levels/level3/out_level-3_4-enormous.txt";
const fileInput = await readInputFile(inputFile);
const fileOutput = solveLevel3(fileInput);
await writeOutputFile(outputFile, fileOutput);