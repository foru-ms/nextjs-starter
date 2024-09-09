import { useState, useEffect } from 'react';
import Meta from '@/components/Meta/index';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar/index';
import Search from './search';
import Threads from './threads';
import Posts from './posts';
import useForumsApi from '@/hooks/data/useForumsApi';

const Support = ({ forumUser, threads, posts, currentPage, nextThreadCursor }) => {
    const [title, setTitle] = useState('');
    const [threadsData, setThreadsData] = useState(threads || []);

    useEffect(() => {
        setThreadsData(threads);
    }, [threads]);
    
    return (
        <>
            <Meta title="Demo Foru.ms" />
            <div className="flex flex-no-wrap">
                <Sidebar data={forumUser} />
                <div className="w-full">
                    <div className="w-full px-6">
                        <div className="lg:flex flex-wrap">
                            <div className="py-10 lg:w-2/3 w-full md:pr-6 md:border-r border-gray-300">
                                <div>
                                    <Link href="/"><h1 className="text-3xl text-gray-900 font-bold mb-3">Forum</h1></Link>
                                    {forumUser && (<p className="text-gray-600 text-sm">Welcome, {forumUser.username}</p>)}
                                    <div className="flex flex-col mt-10 md:flex-row md:items-center">
                                        <Search onSearchResults={setThreadsData} />
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
                                        <Threads data={threadsData} />
                                    </div>
                                    <div className="flex justify-between mt-6">
                                        {currentPage > 1 && (
                                            <Link href={`/?page=${currentPage - 1}`} className="text-blue-500">
                                                Previous
                                            </Link>
                                        )}
                                        {nextThreadCursor && (
                                            <Link href={`/?page=${currentPage + 1}`} className="text-blue-500">
                                                Next
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="py-10 lg:w-1/3 w-full md:pl-6">
                                <h3 className="mb-5 text-gray-900 font-medium text-xl">
                                    Recent posts
                                </h3>
                                <Posts data={posts} limit={7} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export async function getServerSideProps(context) {
    const api = useForumsApi();
    const { forumUserToken } = context.req.cookies;

    let forumUser = null;

    if (forumUserToken) {
        forumUser = await api.fetchUser(forumUserToken);
    }
    
    const page = context.query.page || 1; // Default to page 1 if no query param

    const fetchThreads = async (page = 1) => {
        const threadsResponse = await api.fetchThreads(page);
        return {
            threads: threadsResponse?.threads || [],
            nextThreadCursor: threadsResponse?.nextThreadCursor || null,
        };
    };
    const { threads, nextThreadCursor } = await fetchThreads(page);
    
    const fetchPosts = async () => {
        const postsResponse = await api.fetchPosts();
        return postsResponse?.posts || [];
    };
    const posts = await fetchPosts();

    return {
        props: {
            forumUser,
            threads,
            posts,
            currentPage: parseInt(page, 10), // Pass current page to props
            nextThreadCursor, // Pass nextThreadCursor for pagination control
        }
    };
}

export default Support;
