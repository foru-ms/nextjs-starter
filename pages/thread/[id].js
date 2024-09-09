import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

import Meta from '@/components/Meta/index';
import Sidebar from '@/components/Sidebar/index';

import useForumsApi from '@/hooks/data/useForumsApi';

import Threads from '../threads';
import Posts from '../posts';

export default function Thread({ forumUser, threadData, threadPosts, recentThreads, recentPosts }) {
    const router = useRouter();
    const [isSubmitting, setSubmittingState] = useState(false);
    const [formData, setFormData] = useState({ body: '' });
    const [thread, setThread] = useState(threadData || null);
    const [recentThreadsData, setRecentThreads] = useState(recentThreads || []);
    const [recentPostsData, setrecentPosts] = useState(recentPosts || []);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        setIsLoading(false);
        setThread(threadData);
        setRecentThreads(recentThreads);
        setrecentPosts(recentPosts);
    }, [threadData, recentThreads, recentPosts]);

    const onChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setSubmittingState(true);

        if (forumUser?.id) {
            try {
                const response = await fetch('/api/createPost', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        body: formData.body,
                        threadId: router.query.id,
                        userId: forumUser.id,
                    })
                });
                if (response.errors) {
                    Object.keys(response.errors).forEach((error) => toast.error(response.errors[error].msg));
                } else {
                    toast.success('Post successfully created!');
                    router.push(`/thread/${router.query.id}`);
                }
                setSubmittingState(false);
            } catch (error) {
                console.error('Error creating post:', error);
                setSubmittingState(false);
                toast.error('An error occurred while creating the post.');
            }
        } else {
            toast.error('You must be logged in to post a reply.');
            setSubmittingState(false);
        }
    };

    return (
        <>
            <Meta title={`${thread?.title} - Demo Foru.ms`} />
  <div className="flex flex-no-wrap">
            <Sidebar data={forumUser} />
    <div className="w-full">
      <div className="w-full px-6">
                    <div className="lg:flex flex-wrap">
                        <div className="py-10 lg:w-2/3 w-full md:pr-6 sm:border-r border-gray-300">
                            <Link href="/">
                                <div className="flex items-center">
                                    <div className="mr-3 w-6 h-6 rounded-full text-gray-500 border border-gray-500 flex items-center justify-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="icon icon-tabler icon-tabler-chevron-left"
                                            width={18}
                                            height={18}
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path stroke="none" d="M0 0h24v24H0z" />
                                            <polyline points="15 6 9 12 15 18" />
                                        </svg>
                                    </div>
                                    <h4 className="text-xl text-gray-900">Support Forums</h4>
                                </div>
                            </Link>
                            <h1 className="my-6 text-4xl font-medium text-gray-900">{thread?.title}</h1>
                            <div className="md:flex items-center">
                                <div className="md:mt-0 mt-4 flex items-center text-gray-600">
                                    <p className="text-gray-600 text-xs">
                                        by <span className="text-blue-500">{thread?.user?.username}</span>
                                    </p>
                                    <div className="w-1 h-1 bg-gray-500 rounded-full mx-2" />
                                    <p className="text-gray-600 text-xs">{thread?.createdAt}</p>
                                </div>
                            </div>
                            <p className="mt-4 text-gray-600 text-sm">{thread?.body}</p>
                            {isLoading ? (
                                <div role="status">
                                    <svg className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-700" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                    </svg>
                                    <span className="sr-only">Loading...</span>
                                </div>
                            ) : (
                                <form method="POST" onSubmit={onSubmit} className="mt-8 flex flex-col">
                                    <textarea
                                        name="body"
                                        onChange={onChange}
                                        placeholder="Post a reply to the thread"
                                        className="pl-6 pt-2 bg-gray-100 w-full h-24 resize-none focus:outline-none focus:border-blue-400 border border-transparent text-gray-800"
                                    />
                                    <div className="w-full pt-3">
                                        <button type="submit" disabled={isSubmitting} className="bg-blue-700 text-sm text-white rounded hover:bg-blue-600 transition duration-150 ease-in-out py-2 px-6 sm:mt-0 mt-4 float-right"
                                                                >
                                            Post
                                        </button>
                                    </div>
                                </form>
                            )}
                            {thread?._count.Post > 0 && (
                                <>
                                    <div className="my-8 text-gray-900 text-xl">Posts</div>
                                    <Posts data={threadPosts} />
                                </>
                            )}
                        </div>
                        <div className="py-10 lg:w-1/3 w-full md:pl-6">
                            <h3 className="mb-5 text-gray-900 font-medium text-xl">Recent threads</h3>
                            <Threads data={recentThreadsData} limit={5} />
                            <hr className="border-t border-gray-300 my-8" />
                            <h3 className="mb-5 text-gray-900 font-medium text-xl">Recent posts</h3>
                            <Posts data={recentPostsData} limit={5} />
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
    const { id } = context.query;

    const { forumUserToken } = context.req.cookies;
    let forumUser = null;

    if (forumUserToken) {
        const userResponse = await api.fetchUser(forumUserToken);
        if (userResponse?.id) {
            forumUser = userResponse;
        }
    }
    
    const fetchThread = async () => {
        const threadResponse = await api.fetchThread(id);
        return threadResponse;
    };
    const threadData = await fetchThread();
    
    const fetchPosts = async () => {
        const postsResponse = await api.fetchThreadPosts(id);
        return postsResponse?.posts;
    };
    const threadPosts = await fetchPosts();

    
    const fetchRecentThreads = async () => {
        const recentThreadsResponse = await api.fetchThreads();
        return recentThreadsResponse?.threads;
    };
    const recentThreads = await fetchRecentThreads();
    
    const fetchRecentPosts = async () => {
        const recentPostsResponse = await api.fetchPosts();
        return recentPostsResponse?.posts;
    };
    const recentPosts = await fetchRecentPosts();

    return {
        props: {
            forumUser,
            threadData,
            threadPosts,
            recentThreads,
            recentPosts,
        }
    };
}