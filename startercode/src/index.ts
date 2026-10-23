import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { readFile, writeFile } from "fs/promises";
import { solveLevel1 } from "./level1";


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

const inputFile = "levels/level1/in_level-1_2-large.txt";
const outputFile = "levels/level1/out_level-1_2-large.txt";
const fileInput = await readInputFile(inputFile);
const fileOutput = solveLevel1(fileInput);
await writeOutputFile(outputFile, fileOutput);
