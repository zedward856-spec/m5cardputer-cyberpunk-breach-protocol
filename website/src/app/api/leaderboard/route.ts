import { NextResponse } from 'next/server';
import { getLeaderboard, saveLeaderboard } from '@/lib/kv';

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const { username, score, grid, phase } = data;

        if (!username || typeof score !== 'number') {
            return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
        }

        let leaderboard: any[] = await getLeaderboard();

        const offset = 8 * 60 * 60 * 1000;
        const taipeiDate = new Date(Date.now() + offset);
        const yyyy = taipeiDate.getUTCFullYear();
        const mm = String(taipeiDate.getUTCMonth() + 1).padStart(2, '0');
        const dd = String(taipeiDate.getUTCDate()).padStart(2, '0');
        const hh = String(taipeiDate.getUTCHours()).padStart(2, '0');
        const min = String(taipeiDate.getUTCMinutes()).padStart(2, '0');
        const taipeiTime = `${yyyy}-${mm}-${dd}/${hh}:${min}`;

        leaderboard.push({ username, score, grid: grid || 0, phase: phase || 0, date: taipeiTime });
        leaderboard.sort((a: any, b: any) => b.score - a.score);
        
        await saveLeaderboard(leaderboard);

        return NextResponse.json({ success: true, message: 'Score saved!' });
    } catch (e) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const username = searchParams.get('username');

    let leaderboard: any[] = await getLeaderboard();
    
    leaderboard.sort((a: any, b: any) => b.score - a.score);
    
    if (username) {
        let rank = -1;
        let userData = null;
        for (let i = 0; i < leaderboard.length; i++) {
            if (leaderboard[i].username === username) {
                if (!userData) {
                    userData = leaderboard[i];
                    rank = i + 1;
                }
            }
        }
        if (userData) {
            return NextResponse.json({ ...userData, rank });
        } else {
            return NextResponse.json({ rank: 0, score: 0 });
        }
    }
    
    const paginated = leaderboard.slice(offset, offset + limit);
    
    return NextResponse.json({
        total: leaderboard.length,
        data: paginated
    });
}
