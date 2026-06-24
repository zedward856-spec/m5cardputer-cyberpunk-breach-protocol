import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const usersFile = path.join(process.cwd(), 'data', 'users.json');
const leaderboardFile = path.join(process.cwd(), 'data', 'leaderboard.json');

export async function POST(req: Request) {
    try {
        const { password } = await req.json();
        
        // Master admin override code
        if (password !== 'admin2077') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        let users = {};
        if (fs.existsSync(usersFile)) {
            users = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
        }

        let leaderboard = [];
        if (fs.existsSync(leaderboardFile)) {
            leaderboard = JSON.parse(fs.readFileSync(leaderboardFile, 'utf-8'));
        }

        return NextResponse.json({ success: true, users, leaderboard });
    } catch (e) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
