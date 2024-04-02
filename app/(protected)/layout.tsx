import { Navbar } from "./_components/Navbar";
const ProtectedAuthLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="w-full h-full flex flex-col gap-y-10 items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-800 to-slate-950">
			<Navbar />
			{children}
		</div>
	);
};

export default ProtectedAuthLayout;
