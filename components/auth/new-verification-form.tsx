"use client";
import { CardWrapper } from "./card-wrapper";
import { BeatLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { newVerification } from "@/actions/new-verification";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
export const NewVerificationForm = () => {
	const [error, setError] = useState<string | undefined>("");
	const [success, setSuccess] = useState<string | undefined>("");
	const searchParams = useSearchParams();
	const token = searchParams.get("token");
	const onSubmit = useCallback(() => {
		if (!token) {
			setError("Missing Token");
			return;
		}
		newVerification(token)
			.then((data) => {
				if (data?.success) {
					setSuccess(data.success);
				}
				if (data?.error) {
					setError(data.error);
				}
			})
			.catch(() => {
				setError("Something Went Wrong");
			});
	}, [token]);
	useEffect(() => {
		onSubmit();
	}, [onSubmit]);
	return (
		<CardWrapper
			headerLable="Confirming your verification"
			backButtonLabel="Back to"
			backButtonHref="/auth/login"
		>
			<div className="items-center w-full flex justify-center">
				{!success && !error && <BeatLoader />}

				<FormSuccess message={success} />
				{!success && <FormError message={error} />}
			</div>
		</CardWrapper>
	);
};
