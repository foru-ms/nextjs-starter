import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Meta from '@/components/Meta/index';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar/index';

import Search from './search';
import Threads from './threads';
import Posts from './posts';

import useForumsApi from '@/hooks/data/useForumsApi';

export default function Support() {
    const [forumUser, setForumUser] = useState(null);
    const [title, setTitle] = useState('');
    const [threads, setThreads] = useState([]);

    const api = useForumsApi();

    useEffect(() => {
        
        const getUser = async (token) => {
            const userResponse = await api.fetchUser(token);
            if (userResponse?.id){
                setForumUser(userResponse);
            }
        };
  
        const forumUserToken = Cookies.get('forumUserToken');
  
        forumUserToken && getUser(forumUserToken);
    }, []);

    return (
        <>
            <Meta title="Demo Foru.ms" />
                    <div className="flex flex-no-wrap">
                        <Sidebar />
                        <div className="w-full">
                            <div className="w-full px-6">
                                <div className="lg:flex flex-wrap">
                                    <div className="py-10 lg:w-2/3 w-full md:pr-6 md:border-r border-gray-300">
                                        <div>
              <Link href="/"><h1 className="text-3xl text-gray-900 font-bold mb-3">Forum</h1></Link>
              {forumUser && (<p className="text-gray-600 text-sm">Welcome, {forumUser.username}</p>)}
                                            <div className="flex flex-col mt-10 md:flex-row md:items-center">
                                                <Search onSearchResults={setThreads} />
                                                <div className="w-full md:w-1/2 pt-3 md:pt-0 md:pl-3">
                                                    <h3 className="text-xl text-gray-900 mb-2">Post a thread</h3>
                                                    <div className="flex flex-col">
                                                        <label
                                                            htmlFor="post_thread"
                                                            className="hidden text-gray-800 text-sm font-bold leading-tight tracking-normal mb-2"
                                                        />
                                                        <div className="relative w-full mb-2">
                                                            <input
                                                                id="post_thread"
                                                                className="text-gray-600 focus:outline-none focus:border focus:border-blue-700 bg-gray-100 font-normal w-full h-10 flex items-center pl-4 text-sm border-gray-300 rounded border"
                                                                placeholder="Type a title"
                                                                onChange={(e) => setTitle(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col md:flex-row md:items-center">
                                                        <div className="w-full md:w-1/2" />
                                                        <div className="w-full md:w-1/2 md:flex md:mb-0 mb-4 justify-end">
                                                            <Link
                                                                className="bg-blue-700 text-sm text-white rounded hover:bg-blue-600 transition duration-150 ease-in-out py-2 px-6 sm:mt-0 mt-4"
                                                                href={{
                                                                    pathname: forumUser ? '/new-thread' : '/login',
                                                                    query: title && { title },
                                                                }}
                                                            >
                                                                Continue
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-6">
                                                <Threads threadsProps={threads} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="py-10 lg:w-1/3 w-full md:pl-6">
                                        <h3 className="mb-5 text-gray-900 font-medium text-xl">
                                            Recent posts
                                        </h3>
                                        <Posts />
                                    </div>
                                </div>
                            </div>
                        </div>
                </div>
        </>
    );
}
