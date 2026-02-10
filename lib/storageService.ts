import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

export interface PasswordEntry {
    id: string;
    name: string;
    password: string; // Encrypted
}

export const ensureDataDir = () => {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
};

export const getFilePath = (userId: string) => {
    return path.join(DATA_DIR, `${userId}.json`);
};

export const savePasswords = (userId: string, passwords: PasswordEntry[]) => {
    ensureDataDir();
    const filePath = getFilePath(userId);
    fs.writeFileSync(filePath, JSON.stringify(passwords, null, 2));
};

export const loadPasswords = (userId: string): PasswordEntry[] => {
    ensureDataDir();
    const filePath = getFilePath(userId);
    if (!fs.existsSync(filePath)) {
        return [];
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
};
