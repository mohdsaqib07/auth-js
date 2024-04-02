"use client";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { CiSettings } from "react-icons/ci";
import { Button } from "@/components/ui/button";
import { settings } from "@/actions/settings";
import { useTransition, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SettingsSchema } from "@/schemas";
import useCurrentUser from "@/hooks/useCurrentUser";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { UserRole } from "@prisma/client";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormDescription,
	FormMessage,
	FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { FaEye, FaEyeSlash } from "react-icons/fa";
const SettingsPage = () => {
	const user = useCurrentUser();
	const [showPassword, setShowPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [error, setError] = useState<string | undefined>("");
	const [success, setSuccess] = useState<string | undefined>("");
	const { update } = useSession();
	const [isPending, startTransition] = useTransition();
	const form = useForm<z.infer<typeof SettingsSchema>>({
		defaultValues: {
			name: user?.name || undefined,
			email: user?.email || undefined,
			password: undefined,
			newPassword: undefined,
		},
		resolver: zodResolver(SettingsSchema),
		mode: "onBlur",
		role: user?.role || undefined,
		isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
	});

	const {
		handleSubmit,
		formState: { isSubmitSuccessful },
		reset,
	} = form;

	const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
		startTransition(() => {
			settings(values)
				.then((data) => {
					if (data?.error) {
						setError(data.error);
					}
					if (data?.success) {
						update();
						setSuccess(data.success);
					}
				})
				.catch((error) => {
					setError("Something Went Wrong!");
				});
		});
	};
	return (
		// add a middle color for tailwind gradients with via-{color} utilitie
		<Card className="w-[600px]">
			<CardHeader>
				<p className="text-2xl font-sembold text-center flex items-center justify-center gap-x-1">
					<CiSettings className="inline-flex text-3xl items-center justify-center font-black" />{" "}
					Settings
				</p>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						className="space-y-6"
						onSubmit={handleSubmit(onSubmit)}
					>
						<div className="space-y-4">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input
												placeholder={"Jane Doe"}
												{...field}
												disabled={isPending}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{!user?.isOAuth && (
								<>
									<FormField
										control={form.control}
										name="email"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Email</FormLabel>
												<FormControl>
													<Input
														type="email"
														placeholder={
															"name@example.com"
														}
														{...field}
														disabled={isPending}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="password"
										render={({ field }) => (
											<FormItem className="relative">
												<FormLabel>Password</FormLabel>
												<FormControl>
													<Input
														type={
															showPassword
																? "text"
																: "password"
														}
														placeholder={"******"}
														{...field}
														disabled={isPending}
													/>
												</FormControl>
												<FormMessage />
												{showPassword ? (
													<FaEye
														className="absolute top-[35px] right-2"
														onClick={() =>
															setShowPassword(
																false,
															)
														}
													/>
												) : (
													<FaEyeSlash
														className="absolute top-[35px] right-2"
														onClick={() =>
															setShowPassword(
																true,
															)
														}
													/>
												)}
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="newPassword"
										render={({ field }) => (
											<FormItem className="relative">
												<FormLabel>
													New Password
												</FormLabel>
												<FormControl>
													<Input
														type={
															showNewPassword
																? "text"
																: "password"
														}
														placeholder={"******"}
														{...field}
														disabled={isPending}
													/>
												</FormControl>
												<FormMessage />
												{showNewPassword ? (
													<FaEye
														className="absolute top-[35px] right-2"
														onClick={() =>
															setShowNewPassword(
																false,
															)
														}
													/>
												) : (
													<FaEyeSlash
														className="absolute top-[35px] right-2"
														onClick={() =>
															setShowNewPassword(
																true,
															)
														}
													/>
												)}
											</FormItem>
										)}
									/>
								</>
							)}
							<FormField
								control={form.control}
								name="role"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Role</FormLabel>
										<Select
											disabled={isPending}
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select a Role" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem
													value={UserRole.ADMIN}
												>
													Admin
												</SelectItem>
												<SelectItem
													value={UserRole.USER}
												>
													User
												</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							{!user?.isOAuth && (
								<FormField
									control={form.control}
									name="isTwoFactorEnabled"
									render={({ field }) => (
										<FormItem className="flex flex-row- items-center justify-between rounded-lg border p-3 shadow-sm">
											<div className="space-y-0.5">
												<FormLabel>
													Two Factor Authentication
												</FormLabel>

												<FormDescription>
													Enable Two Factor
													Authentication
												</FormDescription>
											</div>
											<FormControl>
												<Switch
													disabled={isPending}
													checked={field.value}
													onCheckedChange={
														field.onChange
													}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
							)}
						</div>
						<FormError message={error} />
						<FormSuccess message={success} />
						<Button
							type="submit"
							disabled={isPending}
							className="w-16 flex items-center justify-center"
						>
							{isPending ? (
								<div className="w-5 h-5 animate-spin rounded-full border-b border-t" />
							) : (
								"Save"
							)}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};

export default SettingsPage;
