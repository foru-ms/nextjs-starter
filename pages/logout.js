import Cookies from 'js-cookie';
import { useRouter } from "next/router";

const logout = () => {
    const router = useRouter();
    Cookies.remove('forumUserToken');
    router.push(`/`);
    }

export default logout;