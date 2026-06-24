import { NextResponse } from 'next/server';
import { getUsers, saveUsers } from '@/lib/kv';

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json();

        if (!username || !password) {
            return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
        }

        let users: Record<string, string> = await getUsers();
        if (Array.isArray(users)) {
            // Migration handling just in case
            users = {};
        }

        if (users[username]) {
            if (users[username] === password) {
                return NextResponse.json({ success: true, message: 'Logged in', action: 'login' });
            } else {
                return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
            }
        } else {
            users[username] = password;
            await saveUsers(users as any);
            return NextResponse.json({ success: true, message: 'User created', action: 'signup' });
        }
    } catch (e) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
