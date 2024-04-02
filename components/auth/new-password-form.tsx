"use client";
import { useEffect, useTransition, useState } from "react";
import { CardWrapper } from "./card-wrapper";
import { newPasswordSchema } from "@/schemas/index";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { newPassword } from "@/actions/new-password";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import { useSearchParams } from "next/navigation";
import {
	Form,
	FormControl,
	FormItem,
	FormLabel,
	FormMessage,
	FormField,
} from "../ui/form";
import { Input } from "../ui/input";
export const NewPasswordForm = () => {
	const [pass, setPass] = useState(false);
	const [error, setError] = useState<undefined | string>(undefined);
	const [succes, setSucces] = useState<undefined | string>(undefined);
	const [isPending, startTransition] = useTransition();
	const searchParams = useSearchParams();
	const token = searchParams.get("token");
	const form = useForm<z.infer<typeof newPasswordSchema>>({
		resolver: zodResolver(newPasswordSchema),
		defaultValues: {
			password: "",
		},
		mode: "onBlur",
	});
	const { handleSubmit, formState, reset } = form;
	const { isSubmitSuccessful, isSubmitting } = formState;

	const onSubmit = (data: z.infer<typeof newPasswordSchema>) => {
		setError("");
		setSucces("");
		console.log(data);
		startTransition(() => {
			newPassword(data, token).then((data) => {
				if (data?.error) {
					setError(data.error);
				}

				// TODO: Add when we add 2FA
				if (data?.success) {
					setSucces(data.success);
				}
			});
		});
	};
	useEffect(() => {
		if (isSubmitSuccessful) reset();
	}, [isSubmitSuccessful, reset]);
	return (
		<CardWrapper
			headerLable="Enter a New Password?"
			backButtonLabel="Back to Login"
			backButtonHref="/auth/login"
		>
			<Form {...form}>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					<div className="space-y-4">
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem className="relative">
									<FormLabel>New Password</FormLabel>
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
							<div className="w-6  h-6 border-white border-t border-b animate-spin rounded-full" />
						) : (
							<>Reset Password</>
						)}
					</Button>
				</form>
			</Form>
		</CardWrapper>
	);
};
