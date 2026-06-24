import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const usersFile = path.join(process.cwd(), 'data', 'users.json');

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json();

        if (!username || !password) {
            return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
        }

        if (!fs.existsSync(path.dirname(usersFile))) {
            fs.mkdirSync(path.dirname(usersFile), { recursive: true });
        }

        let users: Record<string, string> = {};
        if (fs.existsSync(usersFile)) {
            users = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
        }

        if (users[username]) {
            if (users[username] === password) {
                return NextResponse.json({ success: true, message: 'Logged in', action: 'login' });
            } else {
                return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
            }
        } else {
            users[username] = password;
            fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
            return NextResponse.json({ success: true, message: 'User created', action: 'signup' });
        }
    } catch (e) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
