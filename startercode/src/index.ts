import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { readFile, writeFile  } from "fs/promises";


async function readInputFile(fileName:string){
    const dirName = dirname(fileURLToPath(import.meta.url));
    const dataPath = join(dirName, "..", "data", fileName);
    
    const text = await readFile(dataPath,"utf-8");
    return text;
}
async function writeOutputFile(fileName:string,content:string){
    const dirName = dirname(fileURLToPath(import.meta.url));
    const dataPath = join(dirName, "..", "data", fileName);

    await writeFile(dataPath, content, "utf-8");
}

const fileInput = await readInputFile("input.txt");


writeOutputFile("output.txt", " " + fileInput + " change");

