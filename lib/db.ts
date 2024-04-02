import {PrismaClient} from '@prisma/client';

declare global {
	var prisma: PrismaClient | undefined;
}

// we are doing this because of next.js hot reload so it don't make new PrismaClient on every reload globalThis does note effected by hot reload
export const db = globalThis.prisma || new PrismaClient();


if(process.env.NODE_ENV !== 'production') globalThis.prisma = db;