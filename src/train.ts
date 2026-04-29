import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";

type MarkovModel = {
  labels: string[];   // all possible states
  counts: number[][]; //adjacency matrix which stores the counts
  totals: number[];   // total nunber of outgoing transitions from a state
};

// all possible states plus the start state
const labels = ["S", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
const indexMap = new Map<string, number>(); //maps each albel to the index
labels.forEach((label, i) => indexMap.set(label, i));

const size = labels.length;

// number of times state i transitons into j
const counts: number[][] = Array.from({ length: size }, () =>
  Array(size).fill(0)
);
const totals: number[] = Array(size).fill(0); // total number of transitions leaving state 

/**
 * File paths:
 * training.csv -> input data
 * model.json   -> output trained model
 */
const inputPath = path.resolve("training.csv");
const outputPath = path.resolve("model.json");


/**
 * addTransition: Records a transition from one state to another.
 * 
 * Convert labels → indices
 * Increment count in matrix
 * Increment total transitions for that state
 */
function addTransition(from: string, to: string) {
  const fromIndex = indexMap.get(from);
  const toIndex = indexMap.get(to);

  if (fromIndex === undefined || toIndex === undefined) {
    return;
  }

  counts[fromIndex][toIndex] += 1;
  totals[fromIndex] += 1;
}


/**
 *  train function : "trains the model", reads the training.csv and builds the markov model
 * 
 * each line is trated as symbols seprated by " , "
 *  record state and transition
 */
async function train() {
  if (!fs.existsSync(inputPath)) {
    throw new Error(`Missing file: ${inputPath}`);
  }

  const fileStream = fs.createReadStream(inputPath, { encoding: "utf-8" });
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let lineCount = 0;

  for await (const line of rl) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const symbols = trimmed
      .split(",")
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (symbols.length === 0) continue;

    // Start = first symbol
    addTransition("S", symbols[0]);

    // Adjacent transitions
    for (let i = 0; i < symbols.length - 1; i++) {
      addTransition(symbols[i], symbols[i + 1]);
    }

    lineCount++;

    if (lineCount % 100000 === 0) {
      console.log(`Processed ${lineCount} lines...`);
    }
  }
// builds the final model
  const model: MarkovModel = {
    labels,
    counts,
    totals
  };
 //saving the trained model
  fs.writeFileSync(outputPath, JSON.stringify(model, null, 2), "utf-8");

  console.log(`Training complete.`);
  console.log(`Processed ${lineCount} lines.`);
  console.log(`Wrote model to ${outputPath}`);
}
 //run it
train().catch(err => {
  console.error(err);
  process.exit(1);
});