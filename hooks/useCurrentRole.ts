import { useSession } from "next-auth/react";
function useCurrentRole() {
	const session = useSession();

	return session?.data?.user?.role;
}

export default useCurrentRole;
