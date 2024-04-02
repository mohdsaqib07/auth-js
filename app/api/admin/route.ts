import { type NextRequest, NextResponse } from "next/server";
import { currentRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";
export async function GET(_request: NextRequest) {
	const role = await currentRole();
	return role === UserRole.ADMIN
		? new NextResponse(null, { status: 200 })
		: new NextResponse(null, { status: 403 });
}
