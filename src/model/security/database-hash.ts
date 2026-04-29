import type { PassHasher } from "./pass-hasher";

/**
 * Database Hash class : used to hash password for database use
 * implements PassHasher interface
 */
export default class DatabaseHash implements PassHasher{

    // converts into hexadecimal string
    private static toHex(buffer: Uint8Array): string {
        return Array.from(buffer)
            .map((b) => b.toString(16).padStart(2, "0")) //each byte is a 2char hex value
            .join("");
    }

    //converts back
    private static fromHex(hex: string): Uint8Array {
        const bytes = new Uint8Array(hex.length / 2); // sice 2 chars is one

        for (let i = 0; i < bytes.length; i++) {
            bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16); 
        }

        return bytes;
    }

     /**
     * Converts the plain-text password into a CryptoKey that can be used
     * by the Web Crypto API for PBKDF2 key derivation.
     * 
     * The password string is first encoded into bytes using TextEncoder.
     * crypto.subtle.importKey imports those bytes as a raw key.
     * The key is configured for the PBKDF2 algorithm.
     * This key is later used to derive a secure hash.
     */
    private static async getKeyMaterial(password: string): Promise<CryptoKey> {
        const enc = new TextEncoder();

        return crypto.subtle.importKey(
            "raw",
            enc.encode(password),
            { name: "PBKDF2" },
            false,
            ["deriveBits"]
        );
    }

    /**
     * Hashes a password securely using PBKDF2 with SHA-256 and a random salt.
     * 
     * @param password 
     * @returns 
     */
    async hashPassword(password: string): Promise<string> {
        const keyMaterial = await DatabaseHash.getKeyMaterial(password);
        const salt = crypto.getRandomValues(new Uint8Array(16));

        const derivedBits = await crypto.subtle.deriveBits(
            {
                name: "PBKDF2",
                salt: salt.buffer as ArrayBuffer,
                iterations: 100000,
                hash: "SHA-256"
            },
            keyMaterial,
            256
        );

        const hash = new Uint8Array(derivedBits);

        return `${DatabaseHash.toHex(salt)}:${DatabaseHash.toHex(hash)}`;
    }

    /**
     * verifies the created password if it matches
     * @param password 
     * @param hashedValue 
     * @returns 
     */
    async verifyPassword(password: string, hashedValue: string): Promise<boolean> {
        const parts = hashedValue.split(":");

        if (parts.length !== 2) {
            return false;
        }

        const salt = DatabaseHash.fromHex(parts[0]);
        const storedHashHex = parts[1];
        const keyMaterial = await DatabaseHash.getKeyMaterial(password);

        const derivedBits = await crypto.subtle.deriveBits(
            {
                name: "PBKDF2",
                salt: salt.buffer as ArrayBuffer,
                iterations: 100000,
                hash: "SHA-256"
            },
            keyMaterial,
            256
        );

        const derivedHashHex = DatabaseHash.toHex(new Uint8Array(derivedBits));

        return derivedHashHex === storedHashHex;
    }
}