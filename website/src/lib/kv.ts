import fs from 'fs';
import path from 'path';
import { Redis } from '@upstash/redis';

const hasRedis = !!process.env.UPSTASH_REDIS_REST_URL;
let redis: Redis | null = null;
if (hasRedis) {
    redis = Redis.fromEnv();
}

const leaderboardFile = path.join(process.cwd(), 'data', 'leaderboard.json');
const usersFile = path.join(process.cwd(), 'data', 'users.json');

export async function getLeaderboard() {
    if (hasRedis) {
        const data = await redis!.get('leaderboard');
        return data || [];
    }
    if (fs.existsSync(leaderboardFile)) {
        return JSON.parse(fs.readFileSync(leaderboardFile, 'utf-8'));
    }
    return [];
}

export async function saveLeaderboard(leaderboard: any[]) {
    if (hasRedis) {
        await redis!.set('leaderboard', leaderboard);
        return;
    }
    if (!fs.existsSync(path.dirname(leaderboardFile))) {
        fs.mkdirSync(path.dirname(leaderboardFile), { recursive: true });
    }
    fs.writeFileSync(leaderboardFile, JSON.stringify(leaderboard, null, 2));
}

export async function getUsers() {
    if (hasRedis) {
        const data = await redis!.get('users');
        return data || [];
    }
    if (fs.existsSync(usersFile)) {
        return JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
    }
    return [];
}

export async function saveUsers(users: any[]) {
    if (hasRedis) {
        await redis!.set('users', users);
        return;
    }
    if (!fs.existsSync(path.dirname(usersFile))) {
        fs.mkdirSync(path.dirname(usersFile), { recursive: true });
    }
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}
