"use client";
import { Card, CardContent, CardHeader, CardFooter } from "../ui/card";
import { Header } from "./header";
import { Social } from "./social";
import { BackButton } from "./back-button";
type CardWrapperProps = {
	children: React.ReactNode;
	headerLable: string;
	backButtonLabel: string;
	backButtonHref: string;
	showSocial?: boolean;
};
export const CardWrapper = ({
	children,
	headerLable,
	backButtonLabel,
	backButtonHref,
	showSocial,
}: CardWrapperProps) => {
	return (
		<Card className="w-[340px] sm:w-[400px] shadow-md">
			<CardHeader>
				<Header label={headerLable} />
			</CardHeader>
			<CardContent>{children}</CardContent>
			{showSocial && (
				<CardFooter>
					<Social />
				</CardFooter>
			)}
			<CardFooter>
				<BackButton label={backButtonLabel} href={backButtonHref} />
			</CardFooter>
		</Card>
	);
};
