import { poppins } from "@/ui/fonts";
import { cn } from "@/lib/utils";
type HeaderProps = {
	label: string;
};
export const Header = ({ label }: HeaderProps) => {
	return (
		<div className="w-full flex flex-col gap-y-4 items-center justify-center">
			{/* Your JSX code here */}
			<h1 className={cn("text-3xl font-semibold", poppins.className)}>
				🔐 Auth
			</h1>
			<p className="text-muted-foreground text-sm">{label}</p>
		</div>
	);
};
