import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Thread = () => {
    const router = useRouter();

    useEffect(() => {
        router.push('/');
    }, [router]);

    return null;
};

export default Thread;
