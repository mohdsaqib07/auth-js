"use server";
import { currentUser } from "@/lib/auth";
import { UserRole } from "@prisma/client";
export const admin = async () => {
	const role = await currentUser();
	if (role === UserRole.ADMIN) {
		return { success: "Allowed!" };
	}

	return { error: "Forbidden!" };
};
