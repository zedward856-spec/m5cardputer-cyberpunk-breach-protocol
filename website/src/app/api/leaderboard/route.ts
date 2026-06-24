import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFile = path.join(process.cwd(), 'data', 'leaderboard.json');

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const { username, score } = data;

        if (!username || typeof score !== 'number') {
            return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
        }

        if (!fs.existsSync(path.dirname(dataFile))) {
            fs.mkdirSync(path.dirname(dataFile), { recursive: true });
        }

        let leaderboard = [];
        if (fs.existsSync(dataFile)) {
            leaderboard = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
        }

        leaderboard.push({ username, score, date: new Date().toISOString() });
        leaderboard.sort((a: any, b: any) => b.score - a.score);
        
        fs.writeFileSync(dataFile, JSON.stringify(leaderboard, null, 2));

        return NextResponse.json({ success: true, message: 'Score saved!' });
    } catch (e) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function GET() {
    let leaderboard = [];
    if (fs.existsSync(dataFile)) {
        leaderboard = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
    }
    return NextResponse.json(leaderboard);
}
