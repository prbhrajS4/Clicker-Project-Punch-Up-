import type { PassHasher } from "./pass-hasher";

/**
 * this one is for testing purposes works with node
 * does not use pKBDf2 or salt just sha 256
 * same password always produces same hash
 */
export default class TestHash implements PassHasher {
    async hashPassword(password: string): Promise<string> {
        const data = new TextEncoder().encode(password);
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);

        return Array.from(new Uint8Array(hashBuffer))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
    }

    async verifyPassword(password: string, hashedValue: string): Promise<boolean> {
        const hashed = await this.hashPassword(password);
        return hashed === hashedValue;
    }
}