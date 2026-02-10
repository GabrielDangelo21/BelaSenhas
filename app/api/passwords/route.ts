import { NextRequest, NextResponse } from 'next/server';
import { loadPasswords, savePasswords, PasswordEntry } from '@/lib/storageService';
import { encrypt, decrypt } from '@/lib/crypto';
import { v4 as uuidv4 } from 'uuid';

// Mocked user session for now
const getUserId = () => 'temp-user';

export async function GET() {
    const userId = getUserId();
    const passwords = loadPasswords(userId);

    // Decrypt passwords for the frontend
    const decryptedPasswords = passwords.map(p => ({
        ...p,
        password: decrypt(p.password)
    }));

    return NextResponse.json(decryptedPasswords);
}

export async function POST(req: NextRequest) {
    const userId = getUserId();
    const { name, password } = await req.json();

    if (!name || !password) {
        return NextResponse.json({ error: 'Name and Password are required' }, { status: 400 });
    }

    const passwords = loadPasswords(userId);

    // Duplication check (case-insensitive)
    const exists = passwords.find(p => p.name.toLowerCase() === name.toLowerCase());
    if (exists) {
        return NextResponse.json({ error: 'Um serviço com este nome já existe.' }, { status: 409 });
    }

    const newEntry: PasswordEntry = {
        id: uuidv4(),
        name,
        password: encrypt(password)
    };

    passwords.push(newEntry);
    savePasswords(userId, passwords);

    return NextResponse.json({ ...newEntry, password }); // Return decrypted for UI update
}

export async function DELETE(req: NextRequest) {
    const userId = getUserId();
    const { id } = await req.json();

    let passwords = loadPasswords(userId);
    passwords = passwords.filter(p => p.id !== id);
    savePasswords(userId, passwords);

    return NextResponse.json({ success: true });
}
