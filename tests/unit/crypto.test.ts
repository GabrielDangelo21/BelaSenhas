import { describe, it, expect } from 'vitest';
import { encrypt, decrypt } from '@/lib/crypto';

describe('Crypto Library', () => {
    it('should encrypt text correctly', () => {
        const text = 'my-secret-password';
        const encrypted = encrypt(text);
        expect(encrypted).toBeDefined();
        expect(encrypted).not.toEqual(text);
    });

    it('should decrypt text back to original', () => {
        const text = 'my-secret-password';
        const encrypted = encrypt(text);
        const decrypted = decrypt(encrypted);
        expect(decrypted).toEqual(text);
    });

    it('should return "Decryption Error" for invalid base64', () => {
        const result = decrypt('invalid-base64-string!!!');
        expect(result).toEqual('Decryption Error');
    });

    it('should return "Decryption Error" for wrong salt', () => {
        // Encrypting manually with wrong salt
        const wrongSalted = Buffer.from('wrong-salt:password').toString('base64');
        const result = decrypt(wrongSalted);
        expect(result).toEqual('Decryption Error');
    });
});
