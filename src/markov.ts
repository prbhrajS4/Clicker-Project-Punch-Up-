type MarkovModel = {
  labels: string[];   // all possible states
  counts: number[][]; //adjacency matrix which stores the counts
  totals: number[];   // total nunber of outgoing transitions from a state
};
/**
 * MarkovChain class : this class is for representing a trained first order marklov chain
 * it uses the adjacency matrix and the transition counts
 * it will use probability to determine what the next state( item to purchase)should be
 */
export default class MarkovChain {
  private labels: string[];  
  private counts: number[][]; //from | to
  private totals: number[];
  private indexMap: Map<string, number>;   //mapping label -> index

  constructor(model: MarkovModel) {
    this.labels = model.labels;
    this.counts = model.counts;
    this.totals = model.totals;

    this.indexMap = new Map(); //creta a map
    this.labels.forEach((label, i) => this.indexMap.set(label, i));
  }

  /**
   * returns the next state using probability
   * @param currentState the current state of the chain
   * @returns next states
   * 
   * finds the row index for the current state, gets its total transitions and generates a random number withen the range
   */
  nextState(currentState: string): string | null {
    // finds curr index
    const rowIndex = this.indexMap.get(currentState);
    if (rowIndex === undefined) return null;

    const total = this.totals[rowIndex]; // total transitions
    if (total <= 0) return null;

    const r = Math.floor(Math.random() * total) + 1; //generate a random number using math.random

    //cumulatively passing through transitions.
    // loop walks through and finds which state range the random number falls into
    let cumulative = 0;
    for (let col = 0; col < this.counts[rowIndex].length; col++) {
      cumulative += this.counts[rowIndex][col];

      if (r <= cumulative) {
        return this.labels[col];
      }
    }

    return null;
  }
}