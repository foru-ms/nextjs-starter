import Cookies from 'js-cookie';
import { useRouter } from "next/router";
import { useEffect } from 'react';

const logout = () => {
    const router = useRouter();

    useEffect(() => {
        Cookies.remove('forumUserToken');
        router.push(`/`);
    }, []);

}

export default logout;