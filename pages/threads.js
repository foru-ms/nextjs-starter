import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Threads({ data }) {

    const [isLoading, setIsLoading] = useState(false);
    const [threads, setThreads] = useState(data || []);
    
    useEffect(() => {
        setIsLoading(false);
        setThreads(data);
    }, [data]);

    return (
        <>
            {isLoading ? (
                <div role="status">
                    <svg className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-700" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                    <span className="sr-only">Loading...</span>
                </div>

            ) : (
                threads && threads?.map((thread) => (
                    <Link href={`/thread/${thread.id}`} key={thread.id}>
                        <div className="p-5 hover:bg-gray-100">
                            <div className="md:flex items-center">
                                <div className="w-full">
                                    <div className="md:flex items-center justify-between mt-4 md:mt-0 w-full">
                                        <h5 className="text-gray-800 text-base">{thread.title}</h5>
                                        <div className=" text-gray-600">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="icon icon-tabler icon-tabler-bookmark"
                                                width={20}
                                                height={20}
                                                viewBox="0 0 24 24"
                                                strokeWidth="1.5"
                                                stroke="currentColor"
                                                fill="none"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path stroke="none" d="M0 0h24v24H0z" />
                                                <path d="M9 4h6a2 2 0 0 1 2 2v14l-5-3l-5 3v-14a2 2 0 0 1 2 -2" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="md:mt-1 mt-3 flex  items-center text-gray-600">
                                        <p className="text-gray-600 text-xs">
                                            by <span className="text-blue-500">{thread.user?.username}</span>
                                        </p>
                                        <div className="w-1 h-1 bg-gray-500 rounded-full mx-2" />
                                        <p className="text-gray-600 text-xs">{thread.createdAt}</p>
                                    </div>
                                </div>
                            </div>
                            <p className="mt-3 text-gray-600 text-sm">
                                {thread.body.length > 100 ? thread.body.substring(0, 100) + '...' : thread.body}
                            </p>
                            <div className="mt-3 md:flex items-center text-gray-600">
                                <div className="flex items-center md:my-0 my-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="icon icon-tabler icon-tabler-message"
                                        width={24}
                                        height={24}
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path stroke="none" d="M0 0h24v24H0z" />
                                        <path d="M4 21v-13a3 3 0 0 1 3 -3h10a3 3 0 0 1 3 3v6a3 3 0 0 1 -3 3h-9l-4 4" />
                                        <line x1={8} y1={9} x2={16} y2={9} />
                                        <line x1={8} y1={13} x2={14} y2={13} />
                                    </svg>
                                    <p className="ml-2 text-gray-600 text-xs ">{thread._count?.Post} posts</p>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))
            )}
        </>
    );
};