import { NextResponse } from 'next/server';
import { getUsers, saveUsers, getLeaderboard, saveLeaderboard } from '@/lib/kv';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { action, username, password, newUsername, newPassword } = body;

        let users: Record<string, string> = await getUsers();
        if (Array.isArray(users)) {
            users = {};
        }

        if (!users[username] || users[username] !== password) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (action === 'get_stats') {
            let highScore = 0;
            let rank = 0;
            let grid = 0;
            let phase = 0;
            
            const leaderboard: any[] = await getLeaderboard();
            leaderboard.sort((a: any, b: any) => b.score - a.score);
            
            for (let i = 0; i < leaderboard.length; i++) {
                if (leaderboard[i].username === username) {
                    if (highScore === 0) {
                        highScore = leaderboard[i].score;
                        rank = i + 1;
                        grid = leaderboard[i].grid;
                        phase = leaderboard[i].phase;
                    }
                }
            }
            return NextResponse.json({ highScore, rank, grid, phase });
        }

        if (action === 'update_account') {
            const finalUsername = newUsername || username;
            const finalPassword = newPassword || password;

            if (newUsername && newUsername !== username) {
                if (users[newUsername]) {
                    return NextResponse.json({ error: 'Username taken' }, { status: 400 });
                }
                
                const leaderboard: any[] = await getLeaderboard();
                let modified = false;
                leaderboard.forEach((entry: any) => {
                    if (entry.username === username) {
                        entry.username = newUsername;
                        modified = true;
                    }
                });
                if (modified) await saveLeaderboard(leaderboard);
                
                delete users[username];
            }

            users[finalUsername] = finalPassword;
            await saveUsers(users as any);

            return NextResponse.json({ success: true, message: 'Account updated' });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (e) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
