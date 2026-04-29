/**
 * interface to implemnt the two distinct hash techniques: one for db and one for testing
 */


export interface PassHasher{
    hashPassword(password:string) : Promise<string>;
    verifyPassword(password: string, hashedValue: string): Promise<boolean>;
}