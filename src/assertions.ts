export function assert(val: any, message: string): asserts val{
  if (!val){
    throw new AssertionError(message);
  } 

}

class AssertionError extends Error {
    constructor( message : string){
        super(message)
    }
}