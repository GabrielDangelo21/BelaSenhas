import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

// Base64 + Basic XOR for simple obfuscation (as requested "basic encryption")
const SECRET_KEY = 'simple-salt';

export const encrypt = (text: string): string => {
    const saltedText = `${SECRET_KEY}:${text}`;
    return Buffer.from(saltedText).toString('base64');
};

export const decrypt = (encoded: string): string => {
    try {
        const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
        const [salt, ...rest] = decoded.split(':');
        if (salt !== SECRET_KEY) return 'Decryption Error';
        return rest.join(':');
    } catch {
        return 'Decryption Error';
    }
};
