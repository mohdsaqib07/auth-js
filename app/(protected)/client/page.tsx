'use client';
import useCurrentUser from "@/hooks/useCurrentUser";
import { UserInfo } from "@/components/user-info";
const ClientPage = () => {
	const user = useCurrentUser();
	return <UserInfo user={user} label={"📱 Client Component"} />;
};

export default ClientPage;
