import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { readFile, writeFile } from "fs/promises";
import { solveLevel2 } from "./level2";


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

const inputFile = "levels/level2/in_level-2_2-large.txt";
const outputFile = "levels/level2/out_level-2_2-large.txt";
const fileInput = await readInputFile(inputFile);
const fileOutput = solveLevel2(fileInput);
await writeOutputFile(outputFile, fileOutput);
