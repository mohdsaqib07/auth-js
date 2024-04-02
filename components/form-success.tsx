import { CheckCircledIcon } from "@radix-ui/react-icons";

type FormSuccessProps = {
	message?: string;
};

export const FormSuccess = ({ message }: FormSuccessProps) => {
	if (!message) return null;
	// this / after the color specify the opacity and it is known as opacity modifier
	return (
		<div className="bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-500">
			<CheckCircledIcon className="h-4 w-4" />
			<p>{message}</p>
		</div>
	);
};