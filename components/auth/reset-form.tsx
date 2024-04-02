"use client";
import { useEffect, useTransition, useState } from "react";
import { CardWrapper } from "./card-wrapper";
import { resetSchema } from "@/schemas/index";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { resetPassword } from "@/actions/reset";
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
export const ResetForm = () => {
	const [pass, setPass] = useState(false);
	const [error, setError] = useState<undefined | string>(undefined);
	const [succes, setSucces] = useState<undefined | string>(undefined);
	const [isPending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof resetSchema>>({
		resolver: zodResolver(resetSchema),
		defaultValues: {
			email: "",
		},
		mode: "onBlur",
	});
	const { handleSubmit, formState, reset } = form;
	const { isSubmitSuccessful, isSubmitting } = formState;

	const onSubmit = (data: z.infer<typeof resetSchema>) => {
		setError("");
		setSucces("");
		console.log(data);
		startTransition(() => {
			resetPassword(data).then((data) => {
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
			headerLable="Forgot Your Password?"
			backButtonLabel="Back to Login"
			backButtonHref="/auth/login"
		>
			<Form {...form}>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					<div className="space-y-4">
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
							<>Send Reset Email</>
						)}
					</Button>
				</form>
			</Form>
		</CardWrapper>
	);
};
