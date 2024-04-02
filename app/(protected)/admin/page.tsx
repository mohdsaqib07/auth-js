"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RoleGate } from "@/components/auth/role-gate";
import { UserRole } from "@prisma/client";
import { FormSuccess } from "@/components/form-success";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { admin } from "@/actions/admin";
const AdminPage = () => {
	const onApiRouteClick = () => {
		fetch("/api/admin")
			.then((response) => {
				if (response.ok) {
					toast.success("Allowed API Route");
				} else {
					toast.error("Forbidden API Route");
				}
			})
			.catch((error) => {
				console.error("Error:", error.message);
			});
	};

	const onServerActionClick = () => {
		admin().then((data) => {
			if (data?.success) {
				toast.success("Allowed Server Action");
			} else {
				toast.error("Forbidden Server Action");
			}
		});
	};
	return (
		<Card className="w-[600px]">
			<CardHeader>
				<p className="text-2xl font-semibold text-center">🔑Admin</p>
			</CardHeader>
			<CardContent className="space-y-4">
				<RoleGate allowedRole={UserRole.ADMIN}>
					<FormSuccess message="You are allowed to see this content!" />
				</RoleGate>
				<div className="flex flex-row items-center justify-between border rounded-lg p-3 shadow-md">
					<p className="text-sm font-medium">Admin Only API Route</p>
					<Button onClick={onApiRouteClick}>Click to Test</Button>
				</div>
				<div className="flex flex-row items-center justify-between border rounded-lg p-3 shadow-md">
					<p className="text-sm font-medium">
						Admin Only Server Action
					</p>
					<Button onClick={onServerActionClick}>Click to Test</Button>
				</div>
			</CardContent>
		</Card>
	);
};

export default AdminPage;
