"use client";
import { UserRole } from "@prisma/client";
import { FC } from "react";
import useCurrentRole from "@/hooks/useCurrentRole";
import { FormError } from "@/components/form-error";
type RoleGateProps = {
	children: React.ReactNode;
	allowedRole: UserRole;
};

export const RoleGate: FC<RoleGateProps> = ({ children, allowedRole }) => {
	const role = useCurrentRole();
	if (role !== allowedRole) {
		return (
			<FormError message="You do not have permission to see this content" />
		);
	}

	return <>{children}</>;
};
