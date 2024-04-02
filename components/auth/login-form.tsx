"use client";
import { useEffect, useTransition, useState } from "react";
import { CardWrapper } from "./card-wrapper";
import { loginSchema } from "@/schemas/index";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { login } from "@/actions/login";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
	Form,
	FormControl,
	FormItem,
	FormLabel,
	FormMessage,
	FormField,
} from "../ui/form";
import { Input } from "../ui/input";
export const LoginForm = () => {
	const [showTwoFactor, setShowTwoFactor] = useState(false);
	const [pass, setPass] = useState(false);
	const [error, setError] = useState<undefined | string>(undefined);
	const [succes, setSucces] = useState<undefined | string>(undefined);
	const [isPending, startTransition] = useTransition();
	const searchParams = useSearchParams();
	const urlError =
		searchParams.get("error") === "OAuthAccountNotLinked"
			? "Email Already in use with different Provider"
			: "";
	const callbackUrl = searchParams.get("callbackUrl");
	const form = useForm<z.infer<typeof loginSchema>>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
		mode: "onBlur",
	});
	const { handleSubmit, formState, reset } = form;
	const { isSubmitSuccessful, isSubmitting } = formState;

	const onSubmit = (data: z.infer<typeof loginSchema>) => {
		setError("");
		setSucces("");
		startTransition(() => {
			login(data, callbackUrl)
				.then((data) => {
					if (data?.error) {
						reset();
						setError(data.error);
					}

					// TODO: Add when we add 2FA
					if (data?.success) {
						reset();
						setSucces(data.success);
					}

					if (data?.twoFactor) {
						setShowTwoFactor(true);
					}
				})
				.catch((_error) => {
					setError("Something Went Wrong");
				});
		});
	};

	return (
		<CardWrapper
			headerLable="Welcome Back"
			backButtonLabel="Don't have an account?"
			backButtonHref="/auth/register"
			showSocial
		>
			<Form {...form}>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					<div className="space-y-4">
						{showTwoFactor && (
							<FormField
								control={form.control}
								name="code"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Two Factor Code</FormLabel>
										<FormControl>
											<Input
												type="text"
												placeholder="123456"
												{...field}
												disabled={isPending}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}
						{!showTwoFactor && (
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
													placeholder="name@example.com"
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
														pass
															? "text"
															: "password"
													}
													placeholder="******"
													{...field}
													disabled={isPending}
												/>
											</FormControl>
											<Button
												className="px-0 font-normal"
												size="sm"
												variant="link"
												asChild
											>
												<Link href="/auth/reset">
													Forgot Password ?
												</Link>
											</Button>
											<FormMessage />
											{!pass ? (
												<FaEye
													className="absolute top-[35px] right-2 cursor-pointer"
													onClick={() =>
														setPass(true)
													}
												/>
											) : (
												<FaEyeSlash
													className="absolute top-[35px] right-2 cursor-pointer"
													onClick={() =>
														setPass(false)
													}
												/>
											)}
										</FormItem>
									)}
								/>
							</>
						)}
					</div>
					<FormError message={error || urlError} />
					<FormSuccess message={succes} />
					<Button
						type="submit"
						className="w-full"
						disabled={isSubmitting || isPending}
					>
						{isPending || isSubmitting ? (
							<div className="w-6  h-6 border-white border-t border-b animate-spin rounded-full" />
						) : (
							<>{showTwoFactor ? "Confirm" : "Login"}</>
						)}
					</Button>
				</form>
			</Form>
		</CardWrapper>
	);
};
