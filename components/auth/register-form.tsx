"use client";
import { useEffect, useState, useTransition } from "react";
import { CardWrapper } from "./card-wrapper";
import { registerSchema } from "@/schemas/index";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { register } from "@/actions/register";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";

import {
	Form,
	FormControl,
	FormItem,
	FormLabel,
	FormMessage,
	FormField,
} from "../ui/form";
import { Input } from "../ui/input";
export const RegisterForm = () => {
	const [pass, setPass] = useState(false);
	const [error, setError] = useState<undefined | string>(undefined);
	const [succes, setSucces] = useState<undefined | string>(undefined);
	const [isPending, startTransition] = useTransition();
	const form = useForm<z.infer<typeof registerSchema>>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			email: "",
			password: "",
			name: "",
		},
		mode: "onBlur",
	});
	const { handleSubmit, formState, reset } = form;
	const { isSubmitSuccessful, isSubmitting } = formState;

	const onSubmit = (data: z.infer<typeof registerSchema>) => {
		setError("");
		setSucces("");
		startTransition(() => {
			register(data).then((data) => {
				setSucces(data.success);
				setError(data.error);
			});
		});
	};
	useEffect(() => {
		if (isSubmitSuccessful) reset();
	}, [isSubmitSuccessful, reset]);
	return (
		<CardWrapper
			headerLable="Create an Account"
			backButtonLabel="Already Have an account?"
			backButtonHref="/auth/login"
			showSocial
		>
			<Form {...form}>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					<div className="space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input
											type="text"
											placeholder="name"
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
											type={pass ? "text" : "password"}
											placeholder="******"
											{...field}
											disabled={isPending}
										/>
									</FormControl>
									<FormMessage />
									{!pass ? (
										<FaEye
											className="absolute top-[35px] right-2 cursor-pointer"
											onClick={() => setPass(true)}
										/>
									) : (
										<FaEyeSlash
											className="absolute top-[35px] right-2 cursor-pointer"
											onClick={() => setPass(false)}
										/>
									)}
								</FormItem>
							)}
						/>
					</div>
					<FormError message={error} />
					<FormSuccess message={succes} />
					<Button
						type="submit"
						className="w-full"
						disabled={isSubmitting || isPending}
					>
						{isPending || isSubmitting ? (
							<div className="w-6 h-6 border-[white] border-t border-b rounded-full animate-spin" />
						) : (
							<>Create an Account</>
						)}
					</Button>
				</form>
			</Form>
		</CardWrapper>
	);
};
